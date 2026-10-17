import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Guest, WeddingConfig } from '../types/wedding';

interface QRPassModalProps {
  guest: Guest | null;
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({
  guest,
  config,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrBackup, setShowQrBackup] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  React.useEffect(() => {
    if (!guest) return;
    const cleanCode = guest.ticketCode.replace(/\D/g, '') || guest.ticketCode;

    QRCode.toDataURL(
      cleanCode,
      {
        width: 240,
        margin: 2,
        color: {
          dark: '#0B0B0C',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [guest]);

  if (!isOpen || !guest) return null;

  const isCheckedIn = guest.checkInStatus === 'checked_in';
  const cleanCode = guest.ticketCode.replace(/\D/g, '') || guest.ticketCode;
  const digits = cleanCode.padStart(4, '0').slice(-4).split('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto safe-pb safe-pt">
      <div className="bg-[#101014] border-2 border-[#CFB28A]/50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden my-auto max-h-[94dvh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 text-stone-100 gold-box-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors no-print"
          aria-label="Close pass modal"
        >
          ✕
        </button>

        {/* Top Gala Header Strip in Rich Black & Gold */}
        <div className="bg-[#070709] border-b border-[#CFB28A]/30 text-white p-6 pb-5 text-center space-y-1 relative">
          <div className="inline-block border border-[#CFB28A]/50 bg-[#CFB28A]/10 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-[0.25em] text-[#E8D5B5] font-cinzel mb-1">
            Official Gate Pass
          </div>
          <h3 className="font-wedding text-3xl sm:text-4xl font-normal text-white">
            {config.coupleNames}
          </h3>
          <p className="font-cinzel text-xs text-[#CFB28A] tracking-wider font-light">
            {config.venueName} · Shawasha Hills
          </p>
        </div>

        {/* Ticket Perforation Graphic */}
        <div className="relative bg-[#070709] pb-3">
          <div className="flex items-center justify-between px-2">
            <div className="w-5 h-5 rounded-full bg-[#101014] -ml-5.5 border-r border-[#CFB28A]/30" />
            <div className="border-b border-dashed border-[#CFB28A]/30 w-full mx-2" />
            <div className="w-5 h-5 rounded-full bg-[#101014] -mr-5.5 border-l border-[#CFB28A]/30" />
          </div>
        </div>

        {/* Pass Body Content */}
        <div className="p-5 sm:p-6 pt-2 space-y-4 sm:space-y-5">
          {/* Guest Callout */}
          <div className="bg-[#16161C] border border-[#CFB28A]/30 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#CFB28A] font-mono block">
                  Guest of Honour
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-white leading-tight">
                  {guest.name}
                </h4>
                {guest.plusOneName && (
                  <p className="text-xs text-stone-300 mt-0.5">
                    with guest: <span className="font-medium text-[#E8D5B5]">{guest.plusOneName}</span>
                  </p>
                )}
              </div>

              {guest.isVIP && (
                <span className="bg-[#CFB28A]/20 text-[#E8D5B5] border border-[#CFB28A]/40 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-bold">
                  VIP Guest
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">
                  Admitted Capacity
                </span>
                <span className="font-semibold text-white block">
                  {guest.confirmedHeadcount || guest.partySize} {guest.confirmedHeadcount > 1 ? 'Seats' : 'Seat'} Reserved
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Adults Only
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">
                  Dietary Request
                </span>
                <span className="font-semibold text-white block truncate">
                  {guest.dietaryRequirements}
                </span>
                <span className="text-[11px] text-[#CFB28A] block">
                  Swan Creek Banquet
                </span>
              </div>
            </div>
          </div>

          {/* 4-Digit Pass Code Hero Card */}
          <div className="bg-gradient-to-b from-[#181822] to-[#0E0E14] border-2 border-[#CFB28A]/60 rounded-2xl p-5 text-center shadow-xl space-y-3">
            <span className="font-cinzel text-[11px] uppercase tracking-[0.25em] text-[#CFB28A] font-semibold block">
              Express Gate Entry Code
            </span>

            {/* Stylized 4 Gold Digit Tiles */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1">
              {digits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-13 h-16 sm:w-15 sm:h-18 bg-[#09090D] border-2 border-[#CFB28A] rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5E8D2] to-transparent" />
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold gold-gradient-text tracking-wider select-all">
                    {digit}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-300 font-serif-luxury max-w-xs mx-auto">
              Tell or show this <strong>4-digit code</strong> to the security gatekeeper for rapid check-in at the gate.
            </p>

            <div className="flex items-center justify-center gap-2 pt-1 no-print">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 bg-[#1F1F28] hover:bg-[#2A2A38] border border-[#CFB28A]/40 rounded-full text-xs font-mono text-[#F5E8D2] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'Copied to Clipboard' : `Copy Code (${cleanCode})`}</span>
              </button>
            </div>

            {/* Check-in Status Banner */}
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-2 ${
                isCheckedIn
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                  : 'bg-[#1C1812] text-[#E8D5B5] border border-[#CFB28A]/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span>
                {isCheckedIn
                  ? `Checked In at ${guest.checkInTime ? new Date(guest.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} (${guest.checkedInBy || 'Gate'})`
                  : 'Valid For Single-Use Gate Entry'}
              </span>
            </div>
          </div>

          {/* Optional QR Code Drawer (Backup) */}
          <div className="text-center no-print">
            <button
              type="button"
              onClick={() => setShowQrBackup(!showQrBackup)}
              className="text-[11px] text-stone-400 hover:text-[#CFB28A] underline cursor-pointer"
            >
              {showQrBackup ? '▲ Hide QR Backup' : '▼ Need QR Backup instead?'}
            </button>

            {showQrBackup && (
              <div className="mt-3 p-3 bg-white rounded-xl inline-block shadow-md">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for pass ${cleanCode}`}
                    className="w-36 h-36 object-contain mx-auto"
                  />
                )}
                <span className="font-mono text-xs font-bold text-black block mt-1">Code: {cleanCode}</span>
              </div>
            )}
          </div>

          {/* Pass Action Buttons */}
          <div className="space-y-2 no-print pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 px-3 bg-[#1F1F28] hover:bg-[#2A2A38] text-stone-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-[#CFB28A]/40 flex items-center justify-center gap-1.5 font-cinzel tracking-wider uppercase"
              >
                <span>Print / Save PDF</span>
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${config.venueName}, ${config.venueAddress}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:brightness-105 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md font-cinzel tracking-wider uppercase flex items-center justify-center gap-1.5 text-center border border-[#FFF0D4]/60"
              >
                <span>Directions to Venue</span>
              </a>
            </div>

            <p className="text-[10px] text-center text-stone-400 font-light">
              Tip: Screenshot this pass or keep this page bookmarked on your phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
