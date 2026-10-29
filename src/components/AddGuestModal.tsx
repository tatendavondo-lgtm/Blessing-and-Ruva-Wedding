import React, { useState } from 'react';
import { Guest } from '../types/wedding';
import { addGuest } from '../services/weddingStorage';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestAdded: (guest: Guest) => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onGuestAdded,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteTier, setInviteTier] = useState<'single_1' | 'single_2' | 'family'>('single_2');
  const [familyPartySize, setFamilyPartySize] = useState(4);
  const [dietary, setDietary] = useState('None');
  const [isVIP, setIsVIP] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isFamily = inviteTier === 'family';
    const isSolo = inviteTier === 'single_1';
    const randomPart = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
    
    // Prefix single-use tokens with pass_1_/tok_1_ for 1-guest or pass_2_/tok_2_ for 2-guest
    const token = isSolo ? `tok_1_${randomPart}` : `tok_2_${randomPart}`;
    const inviteCode = isFamily 
      ? name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') 
      : token;

    const partySize = isSolo ? 1 : isFamily ? familyPartySize : 2;

    const created = addGuest({
      name: name.trim(),
      email: email.trim() || `${token}@individual.rsvp`,
      phone: phone.trim() || undefined,
      inviteCode,
      partySize,
      confirmedHeadcount: 0,
      rsvpStatus: 'pending',
      dietaryRequirements: dietary.trim() || 'Pending',
      isVIP,
      inviteType: isFamily ? 'family' : 'individual',
    });

    onGuestAdded(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Add New Wedding Guest
          </h2>
          <p className="text-xs text-stone-500">
            Creates a unique personalized RSVP link and 4-digit gate pass code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Link Type Selector */}
          <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Invitation Link Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInviteTier('single_1')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  inviteTier === 'single_1'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🔒</span>
                  <span className="text-xs font-bold">Solo (Strictly 1)</span>
                </div>
                <p className={`text-[10px] mt-0.5 leading-tight ${inviteTier === 'single_1' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Strictly 1 seat. No option to add +1 or extra guest.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setInviteTier('single_2')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  inviteTier === 'single_2'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">👥</span>
                  <span className="text-xs font-bold">Single-Use (+1)</span>
                </div>
                <p className={`text-[10px] mt-0.5 leading-tight ${inviteTier === 'single_2' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Allows recipient + optional accompanying guest (Max 2).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setInviteTier('family')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  inviteTier === 'family'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">👨‍👩‍👧‍👦</span>
                  <span className="text-xs font-bold">Family Group</span>
                </div>
                <p className={`text-[10px] mt-0.5 leading-tight ${inviteTier === 'family' ? 'text-stone-300' : 'text-stone-500'}`}>
                  For open family links. Up to 4 seats allowed.
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                Primary Guest Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Gallagher"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="liam@example.com (optional)"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                {inviteTier === 'single_1'
                  ? 'Allocated Capacity (Locked)'
                  : inviteTier === 'single_2'
                  ? 'Allocated Capacity (Max 2)'
                  : 'Family Capacity (Up to 4)'}
              </label>
              {inviteTier === 'single_1' ? (
                <div className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 font-semibold flex items-center justify-between">
                  <span>Strictly 1 Seat (Solo Pass)</span>
                  <span className="text-[10px] text-stone-500 font-mono">No +1</span>
                </div>
              ) : inviteTier === 'single_2' ? (
                <div className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 font-semibold flex items-center justify-between">
                  <span>Up to 2 Seats (With +1)</span>
                  <span className="text-[10px] text-stone-500 font-mono">1 or 2</span>
                </div>
              ) : (
                <select
                  value={familyPartySize}
                  onChange={(e) => setFamilyPartySize(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-600"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Seat' : 'Seats'} (Family Pass)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                VIP Status
              </label>
              <button
                type="button"
                onClick={() => setIsVIP(!isVIP)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer text-center ${
                  isVIP
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isVIP ? '★ VIP Guest' : 'Standard Guest'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Dietary Notes (Optional)
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, Gluten-Free"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Create Guest & Generate Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
