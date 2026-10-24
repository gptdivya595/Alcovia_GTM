import React from 'react';
import {
  LayoutDashboard,
  IndianRupee,
  Filter,
  Megaphone,
  Lightbulb,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useGtm, GtmSection } from '../../context/GtmContext';

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, currentKpiSummary, growthInsights } = useGtm();

  const navItems: { id: GtmSection; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'revenue',
      label: 'Revenue & Invoices',
      icon: <IndianRupee className="w-4 h-4" />,
      badge: `${currentKpiSummary.unpaidInvoicesCount} Due`,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'funnel',
      label: '8-Stage Lead Funnel',
      icon: <Filter className="w-4 h-4" />,
      badge: '40 Won',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'marketing',
      label: 'Marketing Campaigns',
      icon: <Megaphone className="w-4 h-4" />,
      badge: '2 Flags',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'decisions',
      label: 'Growth Decisions',
      icon: <Lightbulb className="w-4 h-4" />,
      badge: `${growthInsights.length} Audits`,
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'quality',
      label: 'Data Quality & Math',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
            Navigation Modules
          </span>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick KPI Snapshot Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Target Achievement</span>
            <span className="font-bold text-slate-900 font-mono">
              {currentKpiSummary.achievementPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, currentKpiSummary.achievementPercentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Students Onboarded:</span>
            <span className="font-bold text-slate-800">{currentKpiSummary.studentsOnboarded}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
        <p className="font-medium text-slate-600">Alcovia GTM Engine v2.4</p>
        <p>Demo Data Environment</p>
      </div>
    </aside>
  );
};
