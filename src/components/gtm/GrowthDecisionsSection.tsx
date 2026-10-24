import React, { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Search,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { GrowthInsight } from '../../types/gtm';

export const GrowthDecisionsSection: React.FC = () => {
  const { growthInsights, setActiveSection, setNotificationToast } = useGtm();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [investigatedMap, setInvestigatedMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Growth Insights' },
    { id: 'Campaign Fatigue', label: 'Campaign Fatigue' },
    { id: 'Funnel Friction', label: 'Funnel Friction' },
    { id: 'Receivables Risk', label: 'Receivables Risk' },
    { id: 'Landing Page Drop-off', label: 'Landing Page Drop-off' },
  ];

  const filteredInsights = growthInsights.filter(
    (ins) => selectedCategory === 'all' || ins.category === selectedCategory
  );

  const toggleInvestigationStatus = (id: string, title: string) => {
    setInvestigatedMap((prev) => {
      const next = !prev[id];
      setNotificationToast(
        next
          ? `Logged investigation ticket for: "${title}"`
          : `Reverted investigation status for: "${title}"`
      );
      setTimeout(() => setNotificationToast(null), 3000);
      return { ...prev, [id]: next };
    });
  };

  const getSectionTarget = (category: GrowthInsight['category']) => {
    switch (category) {
      case 'Campaign Fatigue':
        return { section: 'marketing' as const, label: 'View Marketing Campaigns' };
      case 'Funnel Friction':
        return { section: 'funnel' as const, label: 'Inspect 8-Stage Funnel' };
      case 'Receivables Risk':
        return { section: 'revenue' as const, label: 'Review Overdue Invoices' };
      case 'Landing Page Drop-off':
        return { section: 'marketing' as const, label: 'View Landing Page Metrics' };
      default:
        return { section: 'overview' as const, label: 'Go to Executive Overview' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Growth Decisions & Diagnostic Audit Panel
          </h2>
          <p className="text-xs text-slate-500">
            Empirical observations matched with structured benchmarks and non-causal investigation recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
            Anti-False Causation Protocol Active
          </span>
        </div>
      </div>

      {/* Decision Protocol Callout Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Core Analytical Standard: Do Not Assert Causation From Correlation</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Observed metric divergences indicate areas of statistical friction or operational variance. In our decision model, an anomaly generates a hypothesis to verify via targeted research (call audits, creative decay curves, user testing), never an unvalidated assumption of root cause.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Insights Cards Grid */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const isInvestigated = !!investigatedMap[insight.id];
          const target = getSectionTarget(insight.category);

          return (
            <div
              key={insight.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                isInvestigated
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Top row: Category, Severity, and Investigation Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {insight.category}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      insight.severity === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {insight.severity === 'high' ? 'High Attention' : 'Moderate Variance'}
                  </span>
                  {isInvestigated && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Investigation Open
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection(target.section)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    <span>{target.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleInvestigationStatus(insight.id, insight.title)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isInvestigated
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isInvestigated ? 'In Progress' : 'Launch Audit'}
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 mb-4">{insight.title}</h3>

              {/* 4-Box Structured Audit Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                {/* 1. Metric & Observed Value */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Metric & Observed Value
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {insight.observedValue}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Tracking metric: {insight.metricName}
                  </div>
                </div>

                {/* 2. Relevant Comparison Benchmark */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Relevant Comparison Benchmark
                  </span>
                  <div className="text-sm font-bold text-slate-800 font-mono">
                    {insight.comparisonBenchmark}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Source: Internal SLA, cohort historical baseline, or target policy
                  </div>
                </div>

                {/* 3. Non-Causal Hypothesis Note */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Observed Correlation / Non-Causal Hypothesis</span>
                  </div>
                  <p className="text-xs text-indigo-950 leading-relaxed font-sans">
                    {insight.hypothesisOnlyNote}
                  </p>
                </div>

                {/* 4. Recommended Next Investigation */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Recommended Next Investigation (Actionable Verification)</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {insight.recommendedNextInvestigation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
