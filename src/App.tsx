/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GtmProvider, useGtm } from './context/GtmContext';
import { Header } from './components/gtm/Header';
import { Sidebar } from './components/gtm/Sidebar';
import { ExecutiveOverview } from './components/gtm/ExecutiveOverview';
import { RevenueSection } from './components/gtm/RevenueSection';
import { LeadFunnelSection } from './components/gtm/LeadFunnelSection';
import { MarketingSection } from './components/gtm/MarketingSection';
import { GrowthDecisionsSection } from './components/gtm/GrowthDecisionsSection';
import { DataQualitySection } from './components/gtm/DataQualitySection';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeSection, notificationToast } = useGtm();

  return (
    <div className="flex-1 min-w-0 bg-slate-100/60 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {activeSection === 'overview' && <ExecutiveOverview />}
        {activeSection === 'revenue' && <RevenueSection />}
        {activeSection === 'funnel' && <LeadFunnelSection />}
        {activeSection === 'marketing' && <MarketingSection />}
        {activeSection === 'decisions' && <GrowthDecisionsSection />}
        {activeSection === 'quality' && <DataQualitySection />}
      </div>

      {/* Floating Action Toast */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GtmProvider>
      <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
        {/* Sticky Executive Top Bar */}
        <Header />

        {/* Dashboard Body */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </GtmProvider>
  );
}
