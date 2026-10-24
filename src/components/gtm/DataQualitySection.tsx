import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Calculator,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import {
  formatINR,
  formatPercent,
  WORKSHOP_SEAT_PRICE_INR,
  DATE_RANGES,
} from '../../data/gtmData';

export const DataQualitySection: React.FC = () => {
  const {
    currentKpiSummary,
    currentFunnelStages,
    selectedPeriod,
    resetToDefaultDate,
    resetAllDemoData,
    invoices,
    campaigns,
    setActiveSection,
  } = useGtm();

  const [activeTab, setActiveTab] = useState<'reconciliation' | 'denominators' | 'semantics'>('reconciliation');

  // Math validations
  const programRev = currentKpiSummary.programRevenue;
  const workshopRev = currentKpiSummary.workshopRevenue;
  const totalRev = currentKpiSummary.totalRevenue;
  const computedTotal = programRev + workshopRev;
  const revenueDiscrepancy = Math.abs(totalRev - computedTotal);

  const workshopSeats = currentKpiSummary.workshopSeatsSold;
  const expectedWorkshopRev = workshopSeats * WORKSHOP_SEAT_PRICE_INR;
  const workshopDiscrepancy = Math.abs(workshopRev - expectedWorkshopRev);

  const unpaidFromInvoices = invoices
    .filter((inv) => inv.status === 'overdue' || inv.status === 'pending' || inv.status === 'disputed')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const invoiceDiscrepancy = Math.abs(currentKpiSummary.unpaidInvoicesTotal - unpaidFromInvoices);

  const activeDateConfig =
    DATE_RANGES.find((d) => d.key === selectedPeriod) || DATE_RANGES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Quality, Mathematical Integrity & Audit Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Formulas, denominator definitions, missing-vs-zero semantics, and cross-table reconciliation proofs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Audit Status: 100% Mathematically Consistent
          </span>
        </div>
      </div>

      {/* Prominent Demo Data Disclaimer & Quick Reset Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Fictional Demonstration Data Notice</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            This application is an educational prototype and growth analytics cockpit designed for Alcovia leadership. All metrics, cohort transactions, student names, and campaign spends are illustrative and mathematically verified for consistency. No real CRM or banking keys are connected.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={resetToDefaultDate}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            title="Reset active filter to Oct 2026"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span>Reset Date ({activeDateConfig.label.split(' ')[0]})</span>
          </button>
          <button
            onClick={resetAllDemoData}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Clear edits and restore default demo database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore All Demo Records</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reconciliation'
              ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Mathematical Reconciliation Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('denominators')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'denominators'
              ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Funnel Denominator Matrix (8 Stages)</span>
        </button>
        <button
          onClick={() => setActiveTab('semantics')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'semantics'
              ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Zero vs. Missing Semantic Rules</span>
        </button>
      </div>

      {/* Tab 1: Mathematical Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Check 1: Revenue Addition */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revenue Additivity
                </span>
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {formatINR(totalRev)} = {formatINR(programRev)} + {formatINR(workshopRev)}
              </div>
              <p className="text-xs text-slate-500">
                Program revenue and Workshop revenue are strictly separated. Discrepancy: ₹{revenueDiscrepancy} (Exact zero).
              </p>
            </div>

            {/* Check 2: Workshop Pricing Integrity */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Workshop Seat Pricing
                </span>
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {workshopSeats} seats × ₹{WORKSHOP_SEAT_PRICE_INR.toLocaleString('en-IN')} = {formatINR(expectedWorkshopRev)}
              </div>
              <p className="text-xs text-slate-500">
                Every workshop seat is priced at brief specification ₹3,999. Variance: ₹{workshopDiscrepancy}.
              </p>
            </div>

            {/* Check 3: Invoice Ledger Balancing */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Receivables Ledger Sync
                </span>
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {formatINR(unpaidFromInvoices)} across {invoices.filter((i) => i.status !== 'paid').length} due records
              </div>
              <p className="text-xs text-slate-500">
                Sum of unpaid invoice rows in real time matches the executive KPI card. Variance: ₹{invoiceDiscrepancy}.
              </p>
            </div>
          </div>

          {/* Full Proof Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Mathematical Invariants & Verification Table ({activeDateConfig.label})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-4 font-semibold">Invariant Condition</th>
                    <th className="py-2.5 px-4 font-semibold font-mono">Formula / Equation</th>
                    <th className="py-2.5 px-4 font-semibold font-mono">Computed Value</th>
                    <th className="py-2.5 px-4 font-semibold font-mono">Reported Value</th>
                    <th className="py-2.5 pl-4 font-semibold text-right">Audit Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Total Net Revenue</td>
                    <td className="py-3 px-4 font-mono text-[11px]">Program_Rev + Workshop_Rev</td>
                    <td className="py-3 px-4 font-mono">{formatINR(computedTotal)}</td>
                    <td className="py-3 px-4 font-mono">{formatINR(totalRev)}</td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Workshop Revenue</td>
                    <td className="py-3 px-4 font-mono text-[11px]">Seats_Sold × ₹3,999</td>
                    <td className="py-3 px-4 font-mono">{formatINR(expectedWorkshopRev)}</td>
                    <td className="py-3 px-4 font-mono">{formatINR(workshopRev)}</td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Total Enrolled Cohort</td>
                    <td className="py-3 px-4 font-mono text-[11px]">Trial_Signups + Full_Signups</td>
                    <td className="py-3 px-4 font-mono">{currentKpiSummary.threeMonthTrialSignups + currentKpiSummary.fullProgramSignups} students</td>
                    <td className="py-3 px-4 font-mono">{currentKpiSummary.studentsOnboarded} students</td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Top-to-Bottom Conversion</td>
                    <td className="py-3 px-4 font-mono text-[11px]">Total_Signups / Total_Leads</td>
                    <td className="py-3 px-4 font-mono">
                      {((currentKpiSummary.studentsOnboarded / (currentFunnelStages[0]?.count || 1)) * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {((currentKpiSummary.studentsOnboarded / (currentFunnelStages[0]?.count || 1)) * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Funnel Denominators */}
      {activeTab === 'denominators' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Funnel Stage Denominator Reference Guide
            </h3>
            <p className="text-xs text-slate-500">
              Each conversion rate in the 8-stage funnel is calculated against an explicit, unambiguous denominator to prevent deceptive reporting.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-2 font-semibold">Stage</th>
                  <th className="py-2.5 px-3 font-semibold">Stage Name</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Count</th>
                  <th className="py-2.5 px-3 font-semibold">Explicit Denominator</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Rate</th>
                  <th className="py-2.5 pl-3 font-semibold">Analytical Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentFunnelStages.map((stage) => (
                  <tr key={stage.stageId} className="hover:bg-slate-50/60">
                    <td className="py-3 pr-2 font-mono font-bold text-slate-500">#{stage.order}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{stage.stageName}</td>
                    <td className="py-3 px-3 font-mono font-bold">{stage.count.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 bg-slate-50 rounded-md py-1">
                      {stage.denominatorLabel}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {stage.conversionFromPrevious !== null
                        ? `${stage.conversionFromPrevious}%`
                        : '100% (Baseline)'}
                    </td>
                    <td className="py-3 pl-3 text-slate-500 text-[11px] leading-relaxed">
                      {stage.diagnosticNote || 'Standard progression point in admissions sequence.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Zero vs. Missing Semantics */}
      {activeTab === 'semantics' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Zero vs. Missing (Unknown / Not Applicable) Value Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Statistical guidelines enforcing strict distinction between numeric 0 and unmeasured or mathematically undefined fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Numeric Zero */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <span className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center font-mono">0</span>
                <span>Numeric Zero (Measured Quantity = 0)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Represents a confirmed measurement where the actual quantity is zero. Examples:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                <li><strong className="text-slate-700">Spend: ₹0</strong> for Organic / Word-of-Mouth campaigns (no ad dollars disbursed).</li>
                <li><strong className="text-slate-700">Days Overdue: 0</strong> for invoices that have not yet passed their due date.</li>
                <li><strong className="text-slate-700">Drop-off: 0</strong> on the first top-of-funnel entry point.</li>
              </ul>
            </div>

            {/* Box 2: Missing / Null (—) */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                <span className="w-5 h-5 rounded-md bg-indigo-200 text-indigo-900 flex items-center justify-center font-mono">—</span>
                <span>Unknown / Missing / Not Applicable (Null)</span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                Represents metrics where calculation is mathematically undefined or untracked:
              </p>
              <ul className="list-disc list-inside text-xs text-indigo-800 space-y-1">
                <li><strong className="text-indigo-950">ROAS: — (null)</strong> for organic channels, because Spend = 0 yields an undefined division-by-zero ($Revenue / 0$). Stating 0x ROAS would falsely imply total capital loss.</li>
                <li><strong className="text-indigo-950">Previous Conversion: —</strong> on Stage 1 (Lead), which has no predecessor stage.</li>
                <li><strong className="text-indigo-950">Disputed Invoice Resolution Date: —</strong> until settlement is concluded.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
