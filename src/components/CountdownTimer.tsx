import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeRemaining(target: string): TimeRemaining {
  const targetTime = new Date(target).getTime();
  const now = new Date().getTime();
  const total = Math.max(0, targetTime - now);

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-[#121217] border border-[#CFB28A]/35 rounded-2xl p-4 sm:p-6 max-w-md mx-auto space-y-3.5 gold-box-glow">
      {/* Urgency Badge Header */}
      <div className="flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#CFB28A] animate-ping" />
        <p className="font-cinzel uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-[#CFB28A] font-semibold">
          Days Remaining Until The Union
        </p>
      </div>

      {/* Countdown Grid (Prominently highlighting Days) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Days - Highlighted with gold gradient */}
        <div className="bg-[#181822] border border-[#CFB28A]/45 rounded-xl py-2 sm:py-3 px-1 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#CFB28A] to-transparent" />
          <span className="font-cinzel text-2xl sm:text-4xl font-bold gold-gradient-text tabular-nums block leading-none">
            {timeLeft.days}
          </span>
          <span className="font-cinzel text-[8px] sm:text-[10px] uppercase tracking-wider text-[#CFB28A] block mt-1">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="bg-[#16161D] border border-stone-800 rounded-xl py-2 sm:py-3 px-1 text-center shadow-inner">
          <span className="font-cinzel text-xl sm:text-3xl font-semibold text-white tabular-nums block leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="font-cinzel text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-400 block mt-1">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-[#16161D] border border-stone-800 rounded-xl py-2 sm:py-3 px-1 text-center shadow-inner">
          <span className="font-cinzel text-xl sm:text-3xl font-semibold text-white tabular-nums block leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="font-cinzel text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-400 block mt-1">
            Mins
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-[#16161D] border border-stone-800 rounded-xl py-2 sm:py-3 px-1 text-center shadow-inner">
          <span className="font-cinzel text-xl sm:text-3xl font-semibold text-[#CFB28A] tabular-nums block leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="font-cinzel text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-400 block mt-1">
            Secs
          </span>
        </div>
      </div>

      {/* Urgency Callout Caption */}
      <p className="font-serif-luxury italic text-xs text-[#E8D5B5]/90 text-center leading-relaxed">
        ✦ Only <strong className="text-white font-semibold not-italic font-cinzel">{timeLeft.days} days</strong> remaining to confirm your attendance and secure your reception seat ✦
      </p>
    </div>
  );
};
