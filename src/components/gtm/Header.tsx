import React, { useState } from 'react';
import {
  Calendar,
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Download,
  CheckCircle2,
  ChevronDown,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { DATE_RANGES, formatINR } from '../../data/gtmData';
import { DateRangeKey } from '../../types/gtm';

export const Header: React.FC = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    resetToDefaultDate,
    resetAllDemoData,
    currentKpiSummary,
    notificationToast,
    setNotificationToast,
  } = useGtm();

  const [showExportModal, setShowExportModal] = useState(false);

  const activeDateConfig =
    DATE_RANGES.find((d) => d.key === selectedPeriod) || DATE_RANGES[0];

  const handleExportData = () => {
    setShowExportModal(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              ALC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Alcovia Growth & Revenue
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Fictional Demo Data
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                GTM & Revenue Executive Console
              </h1>
            </div>
          </div>

          {/* Right: Date-Range Selector & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Shared Date Range Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-500 ml-2 mr-1" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as DateRangeKey)}
                className="bg-transparent text-xs font-semibold text-slate-800 pr-3 py-1 focus:outline-hidden cursor-pointer"
                aria-label="Select Date Range Filter"
              >
                {DATE_RANGES.map((range) => (
                  <option key={range.key} value={range.key}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset to Default Date Button */}
            {selectedPeriod !== 'this_month' && (
              <button
                onClick={resetToDefaultDate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl border border-amber-200 transition-colors cursor-pointer"
                title="Reset to default: This Month (Oct 2026)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Default Date</span>
              </button>
            )}

            {/* Export Summary Action */}
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Export executive summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Summary</span>
            </button>

            {/* Global Reset Demo Data Action */}
            <button
              onClick={resetAllDemoData}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Reset all demo records and filters to baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {notificationToast && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Executive GTM Summary ({activeDateConfig.label})
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Period Target:</span>
                <span className="font-bold">{formatINR(currentKpiSummary.monthlyRevenueTarget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Actual Revenue:</span>
                <span className="font-bold text-emerald-700">{formatINR(currentKpiSummary.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Achievement:</span>
                <span className="font-bold">{currentKpiSummary.achievementPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Program Revenue:</span>
                <span>{formatINR(currentKpiSummary.programRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Workshop Revenue (₹3,999/seat):</span>
                <span>{formatINR(currentKpiSummary.workshopRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Workshop Seats Sold:</span>
                <span>{currentKpiSummary.workshopSeatsSold} seats</span>
              </div>
              <div className="flex justify-between">
                <span>Students Onboarded:</span>
                <span>{currentKpiSummary.studentsOnboarded} (18 trial + 22 full)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-rose-700">
                <span>Unpaid Invoices (6 accounts):</span>
                <span>{formatINR(currentKpiSummary.unpaidInvoicesTotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Notice: All records reflect realistic fictional demo metrics prepared for Alcovia GTM and Revenue modeling.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setNotificationToast('CSV Export simulated successfully.');
                  setTimeout(() => setNotificationToast(null), 3000);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Download CSV (Simulated)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
