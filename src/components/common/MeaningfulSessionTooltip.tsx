import React from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MeaningfulSessionTooltip: React.FC = () => {
  const { isMeaningfulInfoOpen, setIsMeaningfulInfoOpen } = useApp();

  if (!isMeaningfulInfoOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="meaningful-session-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={() => setIsMeaningfulInfoOpen(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#E9E1D2] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2ED] text-[#1E3F35] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="meaningful-session-title" className="text-lg font-bold text-[#192B24]">
                Meaningful Study Session
              </h2>
              <p className="text-xs text-[#6B7C75]">
                Alcovia Pedagogical Standard · Prototype Definition
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMeaningfulInfoOpen(false)}
            className="text-[#7F9089] hover:text-[#192B24] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#ECE4D5] text-sm text-[#273B33] leading-relaxed">
          <span className="font-semibold text-[#1E3F35]">Definition:</span> A study session is counted as{' '}
          <span className="font-semibold text-[#1E3F35]">meaningful</span> when the student initiates a concrete study task, focuses for an intentional period, and completes a verified learning signal (such as our 3-question Learning Check).
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[#485852]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1E3F35] shrink-0 mt-0.5" />
            <span>
              <strong>Verified Learning Signal:</strong> Passive open screen time does not prove comprehension. Attempting a short retrieval quiz verifies memory recall.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1E3F35] shrink-0 mt-0.5" />
            <span>
              <strong>Accurate Elapsed Time:</strong> If you choose 25 minutes and finish early after 14 minutes, we record 14 actual focused minutes—never fake or rounded data.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <span>
              <strong>What is NOT counted:</strong> Merely opening the app, glancing at the dashboard, or abandoning a timer after 2 minutes does NOT count as a meaningful session.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#EFE8DD] flex items-center justify-between">
          <span className="text-xs text-[#7B8B84]">
            Addresses the 2.15-min idle engagement problem
          </span>
          <button
            onClick={() => setIsMeaningfulInfoOpen(false)}
            className="px-4 py-2 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
