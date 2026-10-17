import React from 'react';
import { WeddingConfig } from '../types/wedding';

interface EventMapProps {
  config: WeddingConfig;
}

export const EventMap: React.FC<EventMapProps> = ({ config }) => {
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${config.venueName}, ${config.venueAddress}`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-[#F7F1E6] flex flex-col items-center justify-center">
      {/* Royal Venue Card */}
      <div className="w-full bg-[#0D0D11] border-2 border-[#CFB28A]/60 rounded-3xl p-6 sm:p-12 text-center shadow-2xl relative overflow-hidden gold-box-glow space-y-6 sm:space-y-8">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5E8D2] to-transparent" />

        {/* Inner Gold Border */}
        <div className="absolute inset-2.5 sm:inset-4 border border-[#CFB28A]/25 rounded-2xl pointer-events-none" />

        {/* Monogram Crest */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#CFB28A]/60 bg-[#161620] mx-auto flex items-center justify-center shadow-xl">
          <span className="font-wedding text-2xl sm:text-3xl text-[#F5E8D2] pt-1">B&R</span>
        </div>

        <div className="space-y-3">
          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#CFB28A] font-semibold">
            Wedding Celebration Venue
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-wide">
            {config.venueName}
          </h1>
          <p className="font-serif-luxury text-base sm:text-lg text-[#F7F1E6] max-w-md mx-auto font-medium">
            {config.venueAddress}
          </p>
          <p className="font-serif-luxury italic text-xs sm:text-sm text-[#CFB28A]">
            Shawasha Hills · Harare, Zimbabwe
          </p>
        </div>

        {/* Highly Visible Google Maps Button */}
        <div className="pt-2 sm:pt-4 flex items-center justify-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 sm:px-12 py-3.5 sm:py-4 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:brightness-105 active:scale-[0.98] text-stone-950 font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_10px_35px_rgba(207,178,138,0.4)] transition-all cursor-pointer border border-[#FFF0D4]/70"
          >
            <span>Open in Google Maps</span>
          </a>
        </div>

        <p className="text-xs text-stone-400 font-serif-luxury pt-1">
          Tap the button above for instant turn-by-turn driving directions on your phone.
        </p>
      </div>
    </div>
  );
};
