import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, TrendingUp, Users, Target, ShieldCheck, ArrowRight, BarChart2 } from 'lucide-react';
import { PLATFORM_METRICS_DATA } from '../../data/demoData';
import { useApp } from '../../context/AppContext';

export const ProductInsightsView: React.FC = () => {
  const { sessions, quizAttempts, setIsMeaningfulInfoOpen } = useApp();

  const totalSessions = sessions.length;
  const meaningfulSessions = sessions.filter(s => s.isMeaningful).length;
  const abandonedSessions = sessions.filter(s => s.status === 'abandoned').length;
  const completionRate = totalSessions > 0 ? Math.round((meaningfulSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
              Product Problem & Metric Audit
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF5E8] text-[#82641B]">
              Analysis & Hypotheses
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Addressing observed analytics: 2.15-min engagement, 35% dormancy, and unverified hypotheses.
          </p>
        </div>

        <button
          onClick={() => setIsMeaningfulInfoOpen(true)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E4DBD0] text-[#1E3F35] hover:bg-[#FAF7F2] transition-colors self-start sm:self-auto"
        >
          View Meaningful Standard
        </button>
      </div>

      {/* Core Paradigm Shift Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2ED] text-[#1E3F35] flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#182B24]">
              Rethinking the 30-Minute Business Target
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6058] leading-relaxed">
              The 30-minute target is an arbitrary business metric, not proof that every student needs to spend 30 minutes staring at the app. Students often study from physical textbooks or scratchpads. Our goal is <strong>not</strong> to trap students inside the app for 30 minutes, but to help them quickly start a relevant task, complete focused study, and verify comprehension.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FBF9F6] border border-[#EFE8DD] space-y-1">
            <span className="text-[11px] font-bold text-[#991B1B] uppercase tracking-wider block">
              Observed Problem
            </span>
            <span className="font-bold text-[#182B24] block text-sm">
              2.15 min Avg Usage
            </span>
            <p className="text-[#64756E] text-[11px]">
              High planning friction caused instant drop-offs without starting.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBF9F6] border border-[#EFE8DD] space-y-1">
            <span className="text-[11px] font-bold text-[#991B1B] uppercase tracking-wider block">
              Observed Problem
            </span>
            <span className="font-bold text-[#182B24] block text-sm">
              7 of 20 Students Dormant
            </span>
            <p className="text-[#64756E] text-[11px]">
              Streak breaks and shame-based notifications discouraged returning.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBF9F6] border border-[#EFE8DD] space-y-1">
            <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider block">
              Prototype Paradigm
            </span>
            <span className="font-bold text-[#1E3F35] block text-sm">
              Verified Learning Signals
            </span>
            <p className="text-[#64756E] text-[11px]">
              Single-tap start, 15m/25m presets, and instant 3-question learning checks.
            </p>
          </div>
        </div>
      </div>

      {/* Distinct Metric Framework */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-5">
        <div className="pb-2 border-b border-[#F0EAE0]">
          <h2 className="text-base font-bold text-[#182B24]">
            Distinct Metric Framework in This Prototype
          </h2>
          <p className="text-xs text-[#6A7B74]">
            Separating vanity metrics from pedagogically sound engagement signals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Activation & Task Initiation */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider">
                1. Task Activation
              </span>
              <span className="text-xs font-mono font-bold text-[#182B24]">
                1-Tap Flow
              </span>
            </div>
            <p className="text-xs text-[#4F615A] leading-relaxed">
              Minimizes decision paralysis by recommending exactly one high-priority task with transparent rationale (e.g. low quiz retention or upcoming test).
            </p>
          </div>

          {/* Repeat Weekly Use */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider">
                2. Repeat Weekly Use
              </span>
              <span className="text-xs font-mono font-bold text-[#1E3F35]">
                Weekly Target: 6
              </span>
            </div>
            <p className="text-xs text-[#4F615A] leading-relaxed">
              No daily streak shaming. If a student misses Monday, their Tuesday session is equally celebrated without broken-streak anxiety.
            </p>
          </div>

          {/* Session Completion vs Abandonment */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider">
                3. Completion vs Abandonment
              </span>
              <span className="text-xs font-mono font-bold text-[#182B24]">
                {meaningfulSessions} Verified / {abandonedSessions} Exits
              </span>
            </div>
            <p className="text-xs text-[#4F615A] leading-relaxed">
              If a student finishes a 25-minute timer after 14 minutes, we record 14 actual focused minutes. If they cancel within 60 seconds, no false data is logged.
            </p>
          </div>

          {/* Quiz Performance & Signal */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider">
                4. Verified Learning Signal
              </span>
              <span className="text-xs font-mono font-bold text-[#1E3F35]">
                Active Recall
              </span>
            </div>
            <p className="text-xs text-[#4F615A] leading-relaxed">
              A 3-question Learning Check immediately follows focus work. Cognitive science shows this active retrieval produces 3x higher retention than re-reading notes.
            </p>
          </div>
        </div>
      </div>

      {/* Observed Metrics Table with Hypotheses */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="pb-2 border-b border-[#F0EAE0]">
          <h2 className="text-base font-bold text-[#182B24]">
            Observed Metrics & Diagnostic Breakdown
          </h2>
          <p className="text-xs text-[#6A7B74]">
            Data observed from initial pilot cohort with corresponding design interventions.
          </p>
        </div>

        <div className="space-y-3">
          {PLATFORM_METRICS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE2D4] space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-[#182B24] text-sm">
                  {item.metric}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#FCE8E6] text-[#991B1B] font-mono font-bold">
                    Observed: {item.observedValue}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E8F2EC] text-[#1E3F35] font-mono font-bold">
                    Goal: {item.benchmarkTarget}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <p className="text-[#55675F]">
                  <strong className="text-[#364841]">Unverified Hypothesis:</strong> {item.hypothesis}
                </p>
                <p className="text-[#1E3F35] font-medium">
                  <strong>Prototype Solution:</strong> {item.solutionInPrototype}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
