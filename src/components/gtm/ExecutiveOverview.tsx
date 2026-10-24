import React from 'react';
import {
  IndianRupee,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { formatINR, formatPercent, WORKSHOP_SEAT_PRICE_INR } from '../../data/gtmData';

export const ExecutiveOverview: React.FC = () => {
  const { currentKpiSummary, setActiveSection, selectedPeriod } = useGtm();

  const isTargetMet = currentKpiSummary.actualRevenue >= currentKpiSummary.monthlyRevenueTarget;

  return (
    <div className="space-y-6">
      {/* Top Level Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Executive Overview & Financial Health
          </h2>
          <p className="text-xs text-slate-500">
            High-level revenue pacing, stream attribution, receivables risk, and cohort conversion metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
            Currency: INR (₹)
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentKpiSummary.revenueGrowthMoM > 0 ? `+${currentKpiSummary.revenueGrowthMoM}% MoM` : `${currentKpiSummary.revenueGrowthMoM}% MoM`}
          </span>
        </div>
      </div>

      {/* Primary KPI Grid: Target vs Actual Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Card: Revenue Pacing */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Revenue vs Target
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {formatINR(currentKpiSummary.totalRevenue)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  of {formatINR(currentKpiSummary.monthlyRevenueTarget)} Target
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span
                className={`text-xl font-extrabold font-mono tabular-nums ${
                  currentKpiSummary.achievementPercentage >= 90
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {currentKpiSummary.achievementPercentage}%
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Achievement Rate
              </span>
            </div>
          </div>

          {/* Achievement Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, currentKpiSummary.achievementPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0%</span>
              <span>Target: {formatINR(currentKpiSummary.monthlyRevenueTarget)}</span>
              <span>100%</span>
            </div>
          </div>

          {/* Revenue Attribution Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Program Revenue
              </span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums block">
                {formatINR(currentKpiSummary.programRevenue)}
              </span>
              <span className="text-[11px] text-slate-500">
                Trials, Full Programs & Ongoing Cohorts
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Workshop Revenue
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded-md font-bold">
                  ₹{WORKSHOP_SEAT_PRICE_INR}/seat
                </span>
              </div>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums block">
                {formatINR(currentKpiSummary.workshopRevenue)}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentKpiSummary.workshopSeatsSold} seats sold across Masterclasses
              </span>
            </div>
          </div>
        </div>

        {/* Quick Decision / Jump Card */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              GTM Health Pulse
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              Growth Pacing: {currentKpiSummary.achievementPercentage}% of Target
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Programs contribute 84.6% of revenue, with workshops acting as the primary low-friction gateway for qualified discovery calls.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveSection('revenue')}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Inspect Detailed Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveSection('funnel')}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Explore 8-Stage Funnel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Students, Trials, Full Programs, Receivables & Renewals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students Onboarded */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Students Onboarded</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {currentKpiSummary.studentsOnboarded}
            </span>
            <span className="text-xs font-semibold text-emerald-700">active this term</span>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-1">
            <span>3-Month Trials:</span>
            <span className="font-bold text-slate-800">{currentKpiSummary.threeMonthTrialSignups}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Full Programs:</span>
            <span className="font-bold text-slate-800">{currentKpiSummary.fullProgramSignups}</span>
          </div>
        </div>

        {/* Metric 2: 3-Month Trial Signups */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">3-Month Trials</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {currentKpiSummary.threeMonthTrialSignups}
            </span>
            <span className="text-xs text-slate-500">signups</span>
          </div>
          <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1 leading-snug">
            Introductory pricing @ ₹29,999. High historical conversion to full annual programs.
          </p>
        </div>

        {/* Metric 3: Full-Program Signups */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Full Program Signups</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {currentKpiSummary.fullProgramSignups}
            </span>
            <span className="text-xs text-slate-500">enrolled</span>
          </div>
          <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1 leading-snug">
            Direct annual enrollments @ ₹98,000 tuition. Long-term student LTV anchor.
          </p>
        </div>

        {/* Metric 4: Unpaid Invoices & Renewals */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Receivables & Renewals</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-rose-700 font-semibold">Unpaid Invoices:</span>
              <span className="text-sm font-bold text-rose-700 font-mono tabular-nums">
                {formatINR(currentKpiSummary.unpaidInvoicesTotal)}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-100 pt-1">
              <span className="text-xs text-slate-700 font-semibold">Upcoming Renewals:</span>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {formatINR(currentKpiSummary.upcomingRenewalsValue)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('revenue')}
            className="text-[11px] font-bold text-slate-900 hover:text-emerald-700 pt-1 flex items-center gap-1 cursor-pointer"
          >
            <span>Review {currentKpiSummary.unpaidInvoicesCount} overdue accounts</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
