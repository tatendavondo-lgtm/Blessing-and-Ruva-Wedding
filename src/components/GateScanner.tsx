import React, { useState, useEffect } from 'react';
import { Guest, WeddingConfig } from '../types/wedding';
import { scanGuestTicket, ScanResult } from '../services/weddingStorage';
import { playSuccessChime, playErrorBuzzer } from '../utils/audio';

interface GateScannerProps {
  config: WeddingConfig;
  allGuests: Guest[];
  isUnlocked: boolean;
  onSetUnlocked: (unlocked: boolean) => void;
  onGuestUpdated: () => void;
}

export const GateScanner: React.FC<GateScannerProps> = ({
  config,
  allGuests,
  isUnlocked,
  onSetUnlocked,
  onGuestUpdated,
}) => {
  // Staff PIN lock state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // 4-Digit Input state
  const [passCodeInput, setPassCodeInput] = useState('');
  const [activeGate, setActiveGate] = useState('Gletwyn Main Gate 1');
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [shiftScansCount, setShiftScansCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Search Fallback state (if guest forgot their 4-digit code)
  const [guestSearch, setGuestSearch] = useState('');

  // Venue Capacity
  const checkedInGuests = allGuests.filter((g) => g.checkInStatus === 'checked_in');
  const totalCheckedInHeadcount = checkedInGuests.reduce(
    (sum, g) => sum + (g.confirmedHeadcount || g.partySize || 1),
    0
  );
  const capacityPercent = Math.min(
    100,
    Math.round((totalCheckedInHeadcount / config.venueCapacity) * 100)
  );

  // Process 4-digit pass code against live Supabase database
  const handleProcessCode = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed || isVerifying) return;

    setIsVerifying(true);
    setPassCodeInput('');

    try {
      const result = await scanGuestTicket(trimmed, activeGate);
      setLastScanResult(result);

      if (result.success) {
        playSuccessChime();
        setShiftScansCount((prev) => prev + 1);
      } else {
        playErrorBuzzer();
      }
      onGuestUpdated();
    } finally {
      setIsVerifying(false);
    }
  };

  // On-screen keypad button click
  const handleKeypadPress = (val: string) => {
    if (passCodeInput.length >= 4 || isVerifying) return;
    const nextCode = passCodeInput + val;
    setPassCodeInput(nextCode);

    // Auto-verify when 4th digit is tapped
    if (nextCode.length === 4) {
      void handleProcessCode(nextCode);
    }
  };

  const handleKeypadBackspace = () => {
    setPassCodeInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPassCodeInput('');
  };

  // Keyboard listener for physical keyboard typing
  useEffect(() => {
    if (!isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in a search box
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isVerifying) return;

      if (/^[0-9]$/.test(e.key)) {
        if (passCodeInput.length < 4) {
          const next = passCodeInput + e.key;
          setPassCodeInput(next);
          if (next.length === 4) {
            void handleProcessCode(next);
          }
        }
      } else if (e.key === 'Backspace') {
        setPassCodeInput((prev) => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        setPassCodeInput('');
      } else if (e.key === 'Enter') {
        if (passCodeInput.length > 0) {
          void handleProcessCode(passCodeInput);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, passCodeInput, activeGate, isVerifying]);

  // PIN Unlock submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === config.gatePin) {
      onSetUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect Security PIN. Access denied.');
      playErrorBuzzer();
    }
  };

  // LOCKED STATE: PIN Keypad Screen
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#121217] border border-[#CFB28A]/40 rounded-3xl p-8 shadow-2xl text-center space-y-6 text-stone-100 gold-box-glow">
          <div className="w-14 h-14 rounded-2xl bg-[#1A1A22] border border-[#CFB28A]/40 text-[#F5E8D2] flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
            🛡️
          </div>

          <div className="space-y-1">
            <h2 className="font-cinzel text-xl sm:text-2xl font-semibold text-stone-900 tracking-wider uppercase">
              Gate Security Terminal
            </h2>
            <p className="text-xs font-serif-luxury text-[#EDE0CC]">
              Restricted check-in terminal for venue gatekeepers & security personnel.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-cinzel text-[#CFB28A]">
                Enter Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 bg-[#181820] border border-stone-700 rounded-xl focus:outline-none focus:border-[#CFB28A] text-stone-900"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-medium text-center">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] text-black font-cinzel text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-lg"
            >
              Unlock Gate Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered guests for emergency name search
  const filteredSearchGuests = guestSearch.trim()
    ? allGuests.filter(
        (g) =>
          g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
          g.ticketCode.includes(guestSearch)
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-[#FBF9F5] text-stone-900 rounded-3xl shadow-2xl border border-stone-200">
      {/* Top Header & Gate Selector */}
      <div className="bg-white border border-stone-200 shadow-md rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#886438] font-cinzel font-bold">
              Live Express Gate Terminal
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Swan Creek Check-In
          </h1>
          <p className="text-xs text-stone-600">
            Instant 4-digit code check-in · Anti-passback duplicate rejection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeGate}
            onChange={(e) => setActiveGate(e.target.value)}
            className="bg-white border border-stone-300 text-stone-800 rounded-xl px-3 py-2 shadow-sm text-xs font-cinzel focus:outline-none cursor-pointer"
          >
            <option value="Gletwyn Main Gate 1">Gletwyn Main Gate 1</option>
            <option value="Shawasha Hills Gate 2">Shawasha Hills Gate 2</option>
            <option value="Garden Pavilion Valet Gate">Garden Pavilion Valet Gate</option>
          </select>

          <button
            onClick={() => onSetUnlocked(false)}
            className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-colors cursor-pointer"
          >
            Lock Terminal
          </button>
        </div>
      </div>

      {/* Real-time Venue Capacity Gauge Strip */}
      <div className="bg-white border border-stone-200 shadow-md rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-[#CFB28A] font-cinzel font-semibold">
              Live Venue Attendance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {totalCheckedInHeadcount}
              </span>
              <span className="text-xs text-stone-500">
                admitted of {config.venueCapacity} max permitted capacity
              </span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`font-mono text-xl sm:text-2xl font-bold tabular-nums ${
                capacityPercent >= 90
                  ? 'text-rose-400'
                  : capacityPercent >= 75
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {capacityPercent}%
            </span>
            <span className="block text-[11px] text-stone-500">Occupancy</span>
          </div>
        </div>

        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden border border-stone-300">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              capacityPercent >= 90
                ? 'bg-rose-500'
                : capacityPercent >= 75
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
      </div>

      {/* Primary 4-Digit Check-In Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Rapid 4-Digit Numpad Terminal */}
        <div className="bg-white border border-stone-200 shadow-lg rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 uppercase tracking-wider">
              Enter 4-Digit Pass Code
            </h2>
            <span className="text-[11px] font-mono text-[#886438] font-bold">
              Shift Scans: <strong className="text-stone-900">{shiftScansCount}</strong>
            </span>
          </div>

          {/* 4-Digit Slots Display */}
          <div className="bg-stone-100 border-2 border-[#886438]/40 rounded-2xl p-4 py-5 flex items-center justify-center gap-3 shadow-inner">
            {[0, 1, 2, 3].map((slotIdx) => {
              const digit = passCodeInput[slotIdx] || '';
              return (
                <div
                  key={slotIdx}
                  className={`w-12 h-16 sm:w-14 sm:h-18 rounded-xl border-2 flex items-center justify-center transition-all ${
                    digit
                      ? 'border-[#886438] bg-white text-stone-900 shadow-md'
                      : 'border-stone-700 bg-[#101014] text-[#D6C4AD]'
                  }`}
                >
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold gold-gradient-text">
                    {digit || '—'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Touch-Friendly Numeric Keypad for Security Staff */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 select-none">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="py-3.5 sm:py-4 bg-white hover:bg-stone-100 border-2 border-stone-200 text-stone-900 font-bold shadow-sm active:bg-[#CFB28A] active:text-black border border-stone-800 hover:border-[#CFB28A]/60 rounded-xl text-xl sm:text-2xl font-mono font-bold text-stone-900 transition-all cursor-pointer shadow-md"
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleKeypadClear}
              className="py-3.5 sm:py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold rounded-xl text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-colors cursor-pointer border border-stone-800"
            >
              CLEAR
            </button>

            {/* Zero Button */}
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-3.5 sm:py-4 bg-white hover:bg-stone-100 border-2 border-stone-200 text-stone-900 font-bold shadow-sm active:bg-[#CFB28A] active:text-black border border-stone-800 hover:border-[#CFB28A]/60 rounded-xl text-xl sm:text-2xl font-mono font-bold text-stone-900 transition-all cursor-pointer shadow-md"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="py-3.5 sm:py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold rounded-xl text-lg font-bold transition-colors cursor-pointer border border-stone-800"
              title="Backspace"
            >
              ⌫
            </button>
          </div>

          {/* Manual Input Trigger */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => void handleProcessCode(passCodeInput)}
              disabled={passCodeInput.length === 0 || isVerifying}
              className="w-full py-3 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 disabled:opacity-40 text-black font-cinzel text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-md"
            >
              {isVerifying ? 'Verifying with Database...' : 'Verify Pass Code →'}
            </button>
          </div>

          {/* Emergency Fallback: Search by Guest Name */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <label className="block text-[11px] font-cinzel text-[#886438] font-bold">
              Forgot Code? Search Guest by Name
            </label>
            <input
              type="text"
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
              placeholder="e.g. Farai Matiza..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#CFB28A]"
            />

            {filteredSearchGuests.length > 0 && (
              <div className="bg-stone-50 border border-stone-300 rounded-xl p-2 max-h-40 overflow-y-auto space-y-1">
                {filteredSearchGuests.map((g) => {
                  const isAlreadyChecked = g.checkInStatus === 'checked_in';
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        void handleProcessCode(g.ticketCode);
                        setGuestSearch('');
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-xs flex items-center justify-between text-stone-900 cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold block text-stone-900">{g.name}</span>
                        <span className="text-[10px] text-stone-600">
                          Code: {g.ticketCode} · {g.confirmedHeadcount || g.partySize} seats
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          isAlreadyChecked
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-[#CFB28A] text-black'
                        }`}
                      >
                        {isAlreadyChecked ? 'Used / Checked In' : 'Admit →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scan Verification Banner & Demo Simulator */}
        <div className="space-y-6">
          {lastScanResult ? (
            <div
              className={`rounded-2xl sm:rounded-3xl p-6 border-2 shadow-2xl transition-all ${
                lastScanResult.success
                  ? 'bg-[#0E1E14] border-emerald-500/70 text-emerald-100'
                  : 'bg-[#220E12] border-rose-500/70 text-rose-100'
              }`}
            >
              {/* Result Status Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                    lastScanResult.success
                      ? 'bg-emerald-500 text-black'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {lastScanResult.success ? '✓' : '!'}
                </div>
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider">
                    {lastScanResult.success ? 'ENTRY APPROVED' : 'ACCESS DENIED'}
                  </h3>
                  <span className="text-xs font-mono font-medium opacity-90">
                    {lastScanResult.success
                      ? '4-Digit Code Verified & Admitted'
                      : lastScanResult.reason === 'ALREADY_SCANNED'
                      ? 'DUPLICATE CODE PREVENTED'
                      : 'INVALID PASS CODE'}
                  </span>
                </div>
              </div>

              {/* Duplicate Warning Box */}
              {lastScanResult.reason === 'ALREADY_SCANNED' && lastScanResult.previousCheckIn && (
                <div className="bg-rose-950/90 border border-rose-500/60 p-4 rounded-xl mb-4 text-xs text-rose-100 space-y-1">
                  <p className="font-bold text-rose-300">⚠️ DUPLICATE SCAN PREVENTED (CODE ALREADY USED):</p>
                  <p>
                    This pass code was already checked in at{' '}
                    <strong className="text-white underline">{lastScanResult.previousCheckIn.time}</strong> by{' '}
                    <strong className="text-white underline">{lastScanResult.previousCheckIn.gate}</strong>.
                  </p>
                  <p className="text-[11px] text-rose-300 pt-1">
                    Entry refused. This code cannot be used again.
                  </p>
                </div>
              )}

              {/* Guest Details if found */}
              {lastScanResult.guest && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-2.5 text-stone-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#886438] font-cinzel font-bold block">
                        Guest Name
                      </span>
                      <strong className="text-lg text-stone-900 font-serif-luxury block">
                        {lastScanResult.guest.name}
                      </strong>
                      {lastScanResult.guest.plusOneName && (
                        <p className="text-xs text-stone-600 mt-0.5">
                          Plus one: <span className="text-stone-900 font-semibold">{lastScanResult.guest.plusOneName}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-[#886438] block">
                        Code: {lastScanResult.guest.ticketCode}
                      </span>
                      {lastScanResult.guest.isVIP && (
                        <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-1">
                          VIP GUEST
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                    <div>
                      <span className="text-[10px] uppercase text-stone-500 block font-mono">Admitted Headcount</span>
                      <strong className="text-stone-900 text-sm">
                        {lastScanResult.guest.confirmedHeadcount || lastScanResult.guest.partySize} Guests
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-stone-500 block font-mono">Dietary Requirement</span>
                      <span className="text-stone-900 font-semibold truncate block">
                        {lastScanResult.guest.dietaryRequirements}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs mt-3 leading-relaxed font-medium">
                {lastScanResult.message}
              </p>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-300 shadow-md border-dashed rounded-3xl p-8 text-center text-stone-600 space-y-3">
              <span className="text-4xl block">🎟️</span>
              <h3 className="font-cinzel text-lg font-bold text-stone-900">
                Awaiting 4-Digit Pass Code
              </h3>
              <p className="text-xs max-w-xs mx-auto text-stone-600">
                Ask arriving guests for their 4-digit pass code and enter it on the keypad to verify and admit them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
