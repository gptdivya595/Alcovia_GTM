import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { formatINR, formatPercent, WORKSHOP_SEAT_PRICE_INR } from '../../data/gtmData';
import { InvoiceStatus } from '../../types/gtm';

export const RevenueSection: React.FC = () => {
  const {
    currentKpiSummary,
    monthlyTrend,
    invoices,
    renewals,
    markInvoicePaid,
  } = useGtm();

  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = invoices.filter(
    (inv) => invoiceFilter === 'all' || inv.status === invoiceFilter
  );

  const totalFilteredOverdue = filteredInvoices
    .filter((inv) => inv.status === 'overdue' || inv.status === 'disputed')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Revenue Streams, Pricing & Accounts Receivable
          </h2>
          <p className="text-xs text-slate-500">
            Strict separation between Program tuition and Workshop seat revenue (₹{WORKSHOP_SEAT_PRICE_INR}/seat) with detailed receivables ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
            Zero Double-Counting Architecture
          </span>
        </div>
      </div>

      {/* Revenue Stream Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Combined Total Revenue
          </span>
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums block">
            {formatINR(currentKpiSummary.totalRevenue)}
          </span>
          <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
            Target: <strong className="text-slate-800">{formatINR(currentKpiSummary.monthlyRevenueTarget)}</strong> ({currentKpiSummary.achievementPercentage}% achieved)
          </p>
        </div>

        {/* Program Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Program Tuition Revenue
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {((currentKpiSummary.programRevenue / currentKpiSummary.totalRevenue) * 100).toFixed(1)}% Share
            </span>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums block">
            {formatINR(currentKpiSummary.programRevenue)}
          </span>
          <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
            {currentKpiSummary.threeMonthTrialSignups} Trials (₹29,999) + {currentKpiSummary.fullProgramSignups} Full Programs (₹98,000)
          </p>
        </div>

        {/* Workshop Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Workshop Revenue
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              ₹{WORKSHOP_SEAT_PRICE_INR} / Seat
            </span>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums block">
            {formatINR(currentKpiSummary.workshopRevenue)}
          </span>
          <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
            <strong>{currentKpiSummary.workshopSeatsSold} seats sold</strong> × ₹{WORKSHOP_SEAT_PRICE_INR} (No cross-crediting)
          </p>
        </div>
      </div>

      {/* 6-Month Trend Ledger Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Revenue Performance Trend (May – Oct 2026)
            </h3>
            <p className="text-xs text-slate-500">
              Tracked against growth targets with workshop vs program stream separation.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            6 Periods Observed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Month</th>
                <th className="py-2.5 px-3 font-semibold text-right">Target (INR)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Program Revenue</th>
                <th className="py-2.5 px-3 font-semibold text-right">Workshop Revenue</th>
                <th className="py-2.5 px-3 font-semibold text-right">Seats (@₹3,999)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Actual</th>
                <th className="py-2.5 px-3 font-semibold text-right">Pacing (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {monthlyTrend.map((row, idx) => {
                const pacing = ((row.totalActual / row.target) * 100).toFixed(1);
                const isCurrent = row.month.includes('Oct');

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCurrent ? 'bg-emerald-50/40 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-900 font-sans font-medium flex items-center gap-2">
                      <span>{row.month}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-semibold">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 tabular-nums">
                      {formatINR(row.target)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 tabular-nums">
                      {formatINR(row.programRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 tabular-nums">
                      {formatINR(row.workshopRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums font-sans">
                      {row.workshopSeatsSold}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 font-bold tabular-nums">
                      {formatINR(row.totalActual)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          Number(pacing) >= 95
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pacing}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unpaid Invoices Ledger */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Unpaid Invoices & Receivables Ledger
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold font-mono">
                {currentKpiSummary.unpaidInvoicesCount} Active · {formatINR(currentKpiSummary.unpaidInvoicesTotal)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Outstanding student fee installments with aging days and client touchpoint records.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['all', 'overdue', 'pending', 'disputed', 'paid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setInvoiceFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors cursor-pointer ${
                  invoiceFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Invoice #</th>
                <th className="py-2.5 px-3 font-semibold">Client / Student</th>
                <th className="py-2.5 px-3 font-semibold">Product</th>
                <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                <th className="py-2.5 px-3 font-semibold">Due Date</th>
                <th className="py-2.5 px-3 font-semibold">Aging</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                    No invoices match the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  let badgeClass = 'bg-slate-100 text-slate-700';
                  if (inv.status === 'overdue') badgeClass = 'bg-rose-100 text-rose-800 border border-rose-200';
                  if (inv.status === 'pending') badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
                  if (inv.status === 'disputed') badgeClass = 'bg-purple-100 text-purple-800 border border-purple-200';
                  if (inv.status === 'paid') badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{inv.clientName}</span>
                        <span className="text-[11px] text-slate-400">{inv.studentName} · {inv.contactEmail}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {inv.productType}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatINR(inv.amount)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {inv.dueDate}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {inv.daysOverdue > 0 ? (
                          <span className={`font-bold ${inv.daysOverdue >= 20 ? 'text-rose-700' : 'text-amber-700'}`}>
                            {inv.daysOverdue}d overdue
                          </span>
                        ) : (
                          <span className="text-slate-400">Current</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${badgeClass}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => markInvoicePaid(inv.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            inv.status === 'paid'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {inv.status === 'paid' ? 'Mark Overdue' : 'Mark Paid'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Renewals Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Upcoming Cohort Renewals (Next 30–60 Days)
            </h3>
            <p className="text-xs text-slate-500">
              Student cohort terms concluding with advisor likelihood classifications.
            </p>
          </div>
          <span className="text-xs font-bold font-mono text-slate-900">
            Pipeline Value: {formatINR(currentKpiSummary.upcomingRenewalsValue)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Student / Parent</th>
                <th className="py-2.5 px-3 font-semibold">Program Track</th>
                <th className="py-2.5 px-3 font-semibold">Term End Date</th>
                <th className="py-2.5 px-3 font-semibold text-right">Renewal Value</th>
                <th className="py-2.5 px-3 font-semibold text-center">Likelihood</th>
                <th className="py-2.5 px-3 font-semibold">Advisor</th>
                <th className="py-2.5 px-3 font-semibold">Recent Touchpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renewals.map((ren) => (
                <tr key={ren.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{ren.studentName}</span>
                    <span className="text-[11px] text-slate-400">Parent: {ren.parentName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {ren.programEnrolled}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {ren.currentTermEndDate}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatINR(ren.renewalValue)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        ren.likelihood === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ren.likelihood === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ren.likelihood}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium">
                    {ren.assignedAdvisor}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs">
                    {ren.lastTouchpoint}
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
