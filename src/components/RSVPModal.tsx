import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Guest, WeddingConfig } from '../types/wedding';
import { submitGuestSelfRSVP } from '../services/weddingStorage';

interface RSVPModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onRSVPSaved: (updatedGuest: Guest) => void;
  onOpenPass: (guest: Guest) => void;
  allGuests?: Guest[];
  config?: WeddingConfig;
}

const COMMON_DIETARY_OPTIONS = [
  'Standard / None',
  'Vegetarian',
  'Vegan',
  'Halaal',
  'Gluten-Free',
  'No Pork',
  'Nut Allergy',
];

export const RSVPModal: React.FC<RSVPModalProps> = ({
  guest,
  isOpen,
  onClose,
  onRSVPSaved,
  onOpenPass,
  allGuests = [],
  config,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'accepted' | 'declined'>('accepted');
  const [headcount, setHeadcount] = useState<number>(1);
  const [plusOneName, setPlusOneName] = useState<string>('');
  const [dietary, setDietary] = useState<string>('');
  const [songRequest, setSongRequest] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server-side validation states
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [serverGeneralError, setServerGeneralError] = useState<string>('');
  const [serverValidationSuccess, setServerValidationSuccess] = useState<string>('');

  const initializedModalRef = React.useRef(false);

  // Check if this is an open Family link vs Single-Use Individual link
  const isFamilyInvite = useMemo(() => {
    // 1. If URL has token or pass_ or tok_, it is ALWAYS strictly individual (Max 2)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const guestParam = params.get('guest') || params.get('invite');
      if (token || guestParam?.startsWith('pass_') || guestParam?.startsWith('tok_')) {
        return false;
      }
      if (params.get('type') === 'family' || params.get('invite') === 'family' || params.get('section') === 'family') {
        return true;
      }
    }
    // 2. If guest record exists
    if (guest) {
      if (guest.inviteType === 'individual' || guest.inviteCode?.startsWith('pass_') || guest.inviteCode?.startsWith('tok_')) {
        return false;
      }
      if (guest.inviteType === 'family') {
        return true;
      }
    }
    // 3. Default to false: all single-use and standard links are capped at MAX 2
    return false;
  }, [guest]);

  // Venue Capacity Calculation: Calculate coming guests before checking in (from RSVP confirmed headcounts)
  const maxCapacity = config?.venueCapacity || 300;
  const currentGuestId = guest?.id?.startsWith('temp-') ? undefined : guest?.id;
  const otherAcceptedHeadcount = useMemo(() => {
    return allGuests
      .filter((g) => g.id !== currentGuestId && g.rsvpStatus === 'accepted')
      .reduce((sum, g) => sum + (g.confirmedHeadcount || g.partySize || 1), 0);
  }, [allGuests, currentGuestId]);

  const seatsRemaining = Math.max(0, maxCapacity - otherAcceptedHeadcount);
  const isCapacityReached = seatsRemaining <= 0;
  const isAlreadyAccepted = guest?.rsvpStatus === 'accepted';

  // Maximum allowable guests for this invite session (capped by family/single rule and remaining seats)
  const maxLimitForInvite = isFamilyInvite ? 4 : 2;
  const maxAllowedHeadcount = isAlreadyAccepted
    ? maxLimitForInvite
    : Math.max(1, Math.min(maxLimitForInvite, seatsRemaining));

  useEffect(() => {
    // When the modal closes, reset the flag so next open cleanly populates
    if (!isOpen) {
      initializedModalRef.current = false;
      return;
    }

    // Only populate fields on FIRST opening of modal. Never overwrite while user is typing!
    if (!initializedModalRef.current) {
      initializedModalRef.current = true;

      if (guest) {
        setName(guest.name || '');
        setPhone(guest.phone || '');
        setRsvpStatus(guest.rsvpStatus === 'declined' ? 'declined' : 'accepted');
        setHeadcount(
          guest.confirmedHeadcount
            ? Math.min(guest.confirmedHeadcount, maxAllowedHeadcount)
            : guest.partySize
            ? Math.min(guest.partySize, maxAllowedHeadcount)
            : 1
        );
        setPlusOneName(guest.plusOneName || '');
        setDietary(guest.dietaryRequirements === 'Pending' ? '' : guest.dietaryRequirements || '');
        setSongRequest(guest.songRequest || '');
        setNotes(guest.notes || '');
      } else {
        setName('');
        setPhone('');
        setRsvpStatus('accepted');
        setHeadcount(1);
        setPlusOneName('');
        setDietary('');
        setSongRequest('');
        setNotes('');
      }

      // Clear validation messages when modal opens
      setServerErrors({});
      setServerGeneralError('');
      setServerValidationSuccess('');
    }
  }, [isOpen, guest?.id, isFamilyInvite, maxAllowedHeadcount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});
    setServerGeneralError('');
    setServerValidationSuccess('');
    setIsSubmitting(true);

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Please provide your full name.';
    }

    if (rsvpStatus === 'accepted') {
      if (isCapacityReached && !isAlreadyAccepted) {
        errors.headcount = `Registration is closed. All ${maxCapacity} seats for Swan Creek Gardens have been filled.`;
      } else if (headcount > seatsRemaining && !isAlreadyAccepted) {
        errors.headcount = `Only ${seatsRemaining} seat(s) remain before reaching the maximum venue capacity of ${maxCapacity} guests.`;
      } else if (!isFamilyInvite && headcount > 2) {
        errors.headcount = 'Individual single-use invitations are strictly limited to a maximum of 2 guests.';
      } else if (isFamilyInvite && headcount > 4) {
        errors.headcount = 'Family group invitations are limited to a maximum of 4 guests.';
      }

      if (!dietary.trim()) {
        errors.dietaryRequirements = 'Please specify dietary requirements (or enter "None").';
      }
      if (headcount > 1 && !plusOneName.trim()) {
        errors.plusOneName = 'Please provide the name of your accompanying guest.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setServerErrors(errors);
      setServerGeneralError(Object.values(errors)[0]);
      setIsSubmitting(false);
      return;
    }

    try {
      setServerValidationSuccess('Verification complete. Saving response...');

      const effectiveHeadcount = rsvpStatus === 'accepted' ? Math.min(headcount, maxAllowedHeadcount) : 0;
      const effectiveToken = guest?.inviteCode || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') || undefined : undefined);
      const fallbackEmail = guest?.email && !guest.email.includes('@individual.rsvp') && !guest.email.includes('@guest.vows')
        ? guest.email
        : `${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'guest'}@guest.vows`;

      // Save to database & persistent storage directly
      const savedGuest = submitGuestSelfRSVP({
        existingId: guest?.id?.startsWith('temp-') ? undefined : guest?.id,
        token: effectiveToken,
        name: name.trim(),
        email: fallbackEmail,
        phone: phone.trim(),
        rsvpStatus,
        partySize: isFamilyInvite ? 4 : 2,
        confirmedHeadcount: effectiveHeadcount,
        plusOneName: effectiveHeadcount > 1 ? plusOneName.trim() : undefined,
        dietaryRequirements: dietary.trim() || 'None',
        songRequest: songRequest.trim(),
        notes: notes.trim(),
        inviteType: isFamilyInvite ? 'family' : 'individual',
      });

      if (rsvpStatus === 'accepted') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#E0CBAE', '#CFB28A', '#BE9A68', '#0B0B0C', '#FCF9F4'],
          });
        } catch {
          // ignore
        }
      }

      onRSVPSaved(savedGuest);
      setIsSubmitting(false);
      onClose();

      if (rsvpStatus === 'accepted') {
        onOpenPass(savedGuest);
      }
    } catch (err: any) {
      console.error('RSVP submission error:', err);
      setServerGeneralError(err.message || 'An unexpected error occurred while saving your RSVP. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto safe-pb safe-pt">
      <div className="bg-[#121214] border border-[#CFB28A]/40 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-8 my-auto max-h-[92dvh] overflow-y-auto space-y-5 sm:space-y-6 relative text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#1D1D24] text-stone-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header with Monogram Touch */}
        <div className="text-center space-y-1">
          <span className="font-wedding text-4xl text-[#F5E8D2] block leading-none">
            B & R
          </span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#CFB28A] font-cinzel font-semibold pt-1">
            Wedding RSVP Confirmation
          </p>
          <h2 className="font-wedding text-4xl sm:text-5xl font-normal text-white leading-tight">
            Blessing & Ruvarashe
          </h2>
          <p className="text-xs font-serif-luxury text-stone-300">
            Swan Creek Gardens · Tuesday, 22 December 2026
          </p>
        </div>

        {/* Single-Use Token Already Used / Locked Notice */}
        {guest && guest.inviteType === 'individual' && guest.rsvpStatus !== 'pending' && (
          <div className="p-4 bg-amber-950/60 border border-amber-500/50 rounded-2xl text-amber-100 text-xs space-y-2 text-center animate-in fade-in">
            <span className="text-xl">🔒</span>
            <p className="font-semibold font-cinzel text-amber-200 text-sm">
              Single-Use Invitation Already Completed
            </p>
            <p className="text-stone-300 text-xs">
              This personalized invitation token was already used to register attendance for{' '}
              <strong className="text-white font-medium">{guest.name}</strong> ({guest.confirmedHeadcount} guests). It cannot be reused or transferred.
            </p>
            {guest.rsvpStatus === 'accepted' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPass(guest);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] text-black font-cinzel text-xs font-bold uppercase rounded-full shadow-md cursor-pointer hover:opacity-95"
                >
                  View Existing Gate Pass →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Server Validation Error Banner */}
        {serverGeneralError && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <span className="text-rose-400 font-bold shrink-0 mt-0.5">⚠️</span>
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-300 font-cinzel text-[11px] tracking-wide uppercase">
                Server Validation Required
              </p>
              <p className="text-xs leading-relaxed">{serverGeneralError}</p>
            </div>
          </div>
        )}

        {/* Server Validation Success Indicator */}
        {serverValidationSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <span>✓</span>
            <span>{serverValidationSuccess}</span>
          </div>
        )}

        {/* If 300 capacity reached and guest is not already accepted, show Registration Closed */}
        {isCapacityReached && !isAlreadyAccepted ? (
          <div className="p-6 sm:p-8 bg-rose-950/40 border border-rose-500/40 rounded-2xl text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500/60 mx-auto flex items-center justify-center text-3xl shadow-xl">
              🔒
            </div>
            <div className="space-y-1.5">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                Registration Closed
              </h3>
              <p className="font-serif-luxury text-sm text-[#F5E8D2] font-semibold">
                Maximum Venue Capacity Reached (300 / 300 Guests)
              </p>
              <p className="font-serif-luxury text-xs text-stone-300 max-w-sm mx-auto leading-relaxed pt-1">
                We are deeply humbled and overwhelmed by the outpouring of love. All 300 venue seats for Blessing & Ruvarashe's wedding celebration at Swan Creek Gardens have now been confirmed.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 text-black font-cinzel text-xs font-bold uppercase rounded-full shadow-lg transition-all cursor-pointer"
              >
                Return to Invitation
              </button>
            </div>
          </div>
        ) : guest && guest.inviteType === 'individual' && guest.rsvpStatus !== 'pending' ? null : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invitation Category Badge */}
          <div className="flex items-center justify-between pb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-cinzel tracking-wider font-semibold border bg-[#1B1B22] border-[#CFB28A]/40 text-[#E8D5B5]">
              {isFamilyInvite
                ? '👨‍👩‍👧‍👦 Family Group Invitation (Up to 4 Guests)'
                : '🔒 Single-Use Invitation (Maximum 2 Guests)'}
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              {seatsRemaining} of {maxCapacity} Seats Available
            </span>
          </div>

          {/* Guest Identity Fields */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-[#E0CBAE]">
                  Your Full Name (or Family Name) *
                </label>
                {serverErrors.name && (
                  <span className="text-[10px] text-rose-400 font-medium">
                    {serverErrors.name}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (serverErrors.name) {
                    setServerErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                placeholder="e.g. Mr. & Mrs. Tinashe Moyo"
                className={`w-full bg-[#1A1A1E] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none transition-colors ${
                  serverErrors.name
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-stone-700 focus:border-[#CFB28A]'
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-[#E0CBAE]">
                  Phone / WhatsApp Number
                </label>
                {serverErrors.phone && (
                  <span className="text-[10px] text-rose-400 font-medium">
                    Invalid
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (serverErrors.phone) {
                    setServerErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                placeholder="+263 77 123 4567"
                className={`w-full bg-[#1A1A1E] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none transition-colors ${
                  serverErrors.phone
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-stone-700 focus:border-[#CFB28A]'
                }`}
              />
              {serverErrors.phone && (
                <p className="text-[10px] text-rose-400 mt-1">{serverErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Attendance Choice */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-[#E0CBAE]">
                Attendance Status *
              </label>
              {serverErrors.attendanceStatus && (
                <span className="text-[10px] text-rose-400 font-medium">
                  {serverErrors.attendanceStatus}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRsvpStatus('accepted');
                  if (serverErrors.attendanceStatus) {
                    setServerErrors((prev) => ({ ...prev, attendanceStatus: '' }));
                  }
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  rsvpStatus === 'accepted'
                    ? 'border-[#CFB28A] bg-[#CFB28A] text-black shadow-lg shadow-[#CFB28A]/10 font-bold'
                    : 'border-stone-800 bg-[#1A1A1E] text-stone-300 hover:border-stone-600'
                }`}
              >
                Joyfully Accept
              </button>

              <button
                type="button"
                onClick={() => {
                  setRsvpStatus('declined');
                  if (serverErrors.attendanceStatus) {
                    setServerErrors((prev) => ({ ...prev, attendanceStatus: '' }));
                  }
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  rsvpStatus === 'declined'
                    ? 'border-stone-500 bg-stone-800 text-white font-bold'
                    : 'border-stone-800 bg-[#1A1A1E] text-stone-300 hover:border-stone-600'
                }`}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {rsvpStatus === 'accepted' && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              {/* Headcount Selection */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-medium text-[#E0CBAE]">
                    Number of Attending Guests *
                  </label>
                  <span className="text-[11px] text-stone-400">Adults only</span>
                </div>
                <select
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                  className="w-full bg-[#1A1A1E] border border-stone-700 focus:border-[#CFB28A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Guest (Just Me)</option>
                  {maxAllowedHeadcount >= 2 && (
                    <option value={2}>2 Guests (Me & +1 Accompanying Guest)</option>
                  )}
                  {isFamilyInvite && maxAllowedHeadcount >= 3 && (
                    <option value={3}>3 Guests (Family)</option>
                  )}
                  {isFamilyInvite && maxAllowedHeadcount >= 4 && (
                    <option value={4}>4 Guests (Family - Maximum)</option>
                  )}
                </select>
                <div className="flex flex-col gap-0.5 text-[10px] text-stone-400 mt-0.5">
                  <p>
                    {isFamilyInvite
                      ? 'Family Group Invitation: Up to 4 seats allowed.'
                      : 'Single-Use Individual Invitation: Maximum 2 seats allowed.'}
                  </p>
                  {seatsRemaining < maxLimitForInvite && (
                    <p className="text-amber-400 font-medium">
                      ⚠️ Limited to {seatsRemaining} {seatsRemaining === 1 ? 'seat' : 'seats'} due to remaining capacity before reaching the 300-guest maximum.
                    </p>
                  )}
                </div>
                {serverErrors.headcount && (
                  <p className="text-[10px] text-rose-400 mt-1">{serverErrors.headcount}</p>
                )}
              </div>

              {/* Plus-one name if headcount > 1 */}
              {headcount > 1 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-medium text-[#E0CBAE]">
                      Name of Accompanying Guest (+1) *
                    </label>
                    {serverErrors.plusOneName && (
                      <span className="text-[10px] text-rose-400 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={plusOneName}
                    onChange={(e) => {
                      setPlusOneName(e.target.value);
                      if (serverErrors.plusOneName) {
                        setServerErrors((prev) => ({ ...prev, plusOneName: '' }));
                      }
                    }}
                    placeholder="e.g. Shamiso Moyo"
                    className={`w-full bg-[#1A1A1E] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none ${
                      serverErrors.plusOneName
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-stone-700 focus:border-[#CFB28A]'
                    }`}
                  />
                  {serverErrors.plusOneName && (
                    <p className="text-[10px] text-rose-400">{serverErrors.plusOneName}</p>
                  )}
                </div>
              )}

              {/* Dietary Requirements (Required by server) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-medium text-[#E0CBAE]">
                    Dietary Requirements * (Required by Server)
                  </label>
                  {serverErrors.dietaryRequirements && (
                    <span className="text-[10px] text-rose-400 font-medium">
                      Required
                    </span>
                  )}
                </div>

                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {COMMON_DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setDietary(option);
                        if (serverErrors.dietaryRequirements) {
                          setServerErrors((prev) => ({ ...prev, dietaryRequirements: '' }));
                        }
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        dietary.toLowerCase() === option.toLowerCase()
                          ? 'border-[#CFB28A] bg-[#CFB28A]/20 text-[#F5E8D2] font-semibold'
                          : 'border-stone-800 bg-[#16161C] text-stone-400 hover:text-white hover:border-stone-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => {
                    setDietary(e.target.value);
                    if (serverErrors.dietaryRequirements) {
                      setServerErrors((prev) => ({ ...prev, dietaryRequirements: '' }));
                    }
                  }}
                  placeholder="e.g. Vegetarian, Halaal, Gluten-Free, or None"
                  className={`w-full bg-[#1A1A1E] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none ${
                    serverErrors.dietaryRequirements
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-stone-700 focus:border-[#CFB28A]'
                  }`}
                />
                {serverErrors.dietaryRequirements ? (
                  <p className="text-[10px] text-rose-400">{serverErrors.dietaryRequirements}</p>
                ) : (
                  <p className="text-[10px] text-stone-400">
                    Required for reception banquet planning. If no restrictions, choose "Standard / None".
                  </p>
                )}
              </div>

              {/* Song Request */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#E0CBAE]">
                  Song Request for the Reception Dance Floor
                </label>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="e.g. Jerusalema - Master KG"
                  className="w-full bg-[#1A1A1E] border border-stone-700 focus:border-[#CFB28A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Personal Note to Couple */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#E0CBAE]">
              Congratulatory Message to Blessing & Ruvarashe (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wishing you a lifetime of love, prosperity and joy!"
              className="w-full bg-[#1A1A1E] border border-stone-700 focus:border-[#CFB28A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-[#E8D5B5] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Validating on Server...</span>
                </>
              ) : rsvpStatus === 'accepted' ? (
                'Confirm & Get 4-Digit Gate Pass →'
              ) : (
                'Save Response'
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
