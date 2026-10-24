import React, { useState } from 'react';
import {
  Filter,
  ArrowDown,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { formatPercent } from '../../data/gtmData';
import { FunnelStage } from '../../types/gtm';

export const LeadFunnelSection: React.FC = () => {
  const { currentFunnelStages, currentKpiSummary, selectedPeriod } = useGtm();
  const [selectedStage, setSelectedStage] = useState<FunnelStage>(currentFunnelStages[5]); // Default to architect session for diagnostics

  const topOfFunnelCount = currentFunnelStages[0]?.count || 1;
  const totalConverted = currentKpiSummary.threeMonthTrialSignups + currentKpiSummary.fullProgramSignups;
  const overallConversionRate = ((totalConverted / topOfFunnelCount) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            8-Stage Admissions & Conversion Funnel
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end inquiry progression with explicit mathematical denominators and stage drop-off analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
            Overall Conversion: {overallConversionRate}% ({totalConverted}/{topOfFunnelCount})
          </span>
        </div>
      </div>

      {/* Funnel Visual Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive 8-Stage Cascade */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider px-2">
            <span>Stage Progression</span>
            <span>Count · Prev Stage Conv · Drop-off</span>
          </div>

          <div className="space-y-2.5">
            {currentFunnelStages.map((stage, idx) => {
              const widthPct = Math.max(12, Math.round((stage.count / topOfFunnelCount) * 100));
              const isSelected = selectedStage?.stageId === stage.stageId;
              const isConversionStage = stage.order >= 7;

              return (
                <div
                  key={stage.stageId}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : isConversionStage
                      ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isConversionStage
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {stage.order}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-sm block truncate">
                          {stage.stageName}
                        </span>
                        <span
                          className={`text-[11px] block truncate ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {stage.denominatorLabel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm sm:text-base font-extrabold block tabular-nums">
                        {stage.count.toLocaleString()}
                      </span>
                      <span
                        className={`text-[11px] font-mono block ${
                          isSelected ? 'text-emerald-300' : 'text-emerald-700 font-semibold'
                        }`}
                      >
                        {stage.order === 1
                          ? '100% (Top)'
                          : `${stage.conversionFromPrevious?.toFixed(1)}% step`}
                      </span>
                    </div>
                  </div>

                  {/* Width Scale Bar */}
                  <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-emerald-400'
                          : isConversionStage
                          ? 'bg-emerald-600'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Stage Diagnostic Inspector */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 sticky top-20">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Stage Detail Inspector (Stage {selectedStage.order} of 8)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedStage.stageName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-500 block">Candidate Volume</span>
                <span className="text-lg font-extrabold font-mono text-slate-900 block">
                  {selectedStage.count.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  {((selectedStage.count / topOfFunnelCount) * 100).toFixed(1)}% of Initial Leads
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-500 block">Step Conversion</span>
                <span className="text-lg font-extrabold font-mono text-emerald-700 block">
                  {selectedStage.conversionFromPrevious !== null
                    ? `${selectedStage.conversionFromPrevious.toFixed(1)}%`
                    : '100%'}
                </span>
                <span className="text-[10px] text-slate-400">From immediate prior</span>
              </div>
            </div>

            {/* Explicit Denominator Formula Block */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Mathematical Denominator Specification:
              </span>
              <p className="font-mono text-slate-800 text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                Formula: ({selectedStage.count} ÷ {selectedStage.previousCount}) × 100 ={' '}
                {selectedStage.conversionFromPrevious?.toFixed(2)}%
              </p>
              <p className="text-slate-500 text-[11px]">
                {selectedStage.denominatorLabel}
              </p>
            </div>

            {/* Drop-off Calculation */}
            {selectedStage.dropOffCount > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-rose-800 font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
                    Drop-off Volume
                  </span>
                  <span className="font-mono">{selectedStage.dropOffCount} lost ({selectedStage.dropOffRate.toFixed(1)}%)</span>
                </div>
                <p className="text-rose-900 text-[11px] leading-relaxed">
                  Candidates who reached the prior milestone but did not advance to {selectedStage.stageName}.
                </p>
              </div>
            )}

            {/* Diagnostic Note */}
            {selectedStage.diagnosticNote && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1">
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">
                  Pedagogical Workflow Context
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedStage.diagnosticNote}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Denominator Reference Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Funnel Denominator Matrix & Drop-off Ledger
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            8 Stages Reconciled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Stage</th>
                <th className="py-2.5 px-3 font-semibold text-right">Volume</th>
                <th className="py-2.5 px-3 font-semibold">Step Denominator & Math</th>
                <th className="py-2.5 px-3 font-semibold text-right">Step Conv</th>
                <th className="py-2.5 px-3 font-semibold text-right">Overall Conv (Leads)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Drop-off Lost</th>
                <th className="py-2.5 px-3 font-semibold text-right">Drop-off %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentFunnelStages.map((st) => (
                <tr key={st.stageId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">
                    {st.order}. {st.stageName}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900 tabular-nums">
                    {st.count.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600 text-[11px]">
                    {st.denominatorLabel}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold tabular-nums">
                    {st.conversionFromPrevious !== null ? `${st.conversionFromPrevious.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    {st.conversionFromLead.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-rose-700 font-bold tabular-nums">
                    {st.dropOffCount > 0 ? st.dropOffCount.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-700 tabular-nums">
                    {st.dropOffRate > 0 ? `${st.dropOffRate.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
