import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DateRangeKey,
  ExecutiveKpiSummary,
  RevenueMonthlyTrend,
  InvoiceRecord,
  RenewalRecord,
  FunnelStage,
  MarketingCampaign,
  GrowthInsight,
  CampaignChannel,
} from '../types/gtm';
import {
  DATE_RANGES,
  KPI_DATA_BY_PERIOD,
  MONTHLY_TREND_DATA,
  INITIAL_INVOICES,
  INITIAL_RENEWALS,
  FUNNEL_DATA_BY_PERIOD,
  INITIAL_CAMPAIGNS,
  INITIAL_GROWTH_INSIGHTS,
} from '../data/gtmData';

export type GtmSection = 'overview' | 'revenue' | 'funnel' | 'marketing' | 'decisions' | 'quality';

interface GtmContextType {
  selectedPeriod: DateRangeKey;
  setSelectedPeriod: (period: DateRangeKey) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  currentKpiSummary: ExecutiveKpiSummary;
  currentFunnelStages: FunnelStage[];
  monthlyTrend: RevenueMonthlyTrend[];
  invoices: InvoiceRecord[];
  renewals: RenewalRecord[];
  campaigns: MarketingCampaign[];
  growthInsights: GrowthInsight[];
  activeSection: GtmSection;
  setActiveSection: (sec: GtmSection) => void;
  selectedChannelFilter: CampaignChannel | 'all';
  setSelectedChannelFilter: (ch: CampaignChannel | 'all') => void;
  campaignSearchQuery: string;
  setCampaignSearchQuery: (query: string) => void;
  markInvoicePaid: (id: string) => void;
  toggleCampaignStatus: (id: string) => void;
  resetToDefaultDate: () => void;
  resetAllDemoData: () => void;
  notificationToast: string | null;
  setNotificationToast: (msg: string | null) => void;
}

const GTM_STORAGE_KEY = 'alcovia_gtm_dashboard_v1';

const GtmContext = createContext<GtmContextType | undefined>(undefined);

export const GtmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangeKey>(() => {
    try {
      const saved = localStorage.getItem(`${GTM_STORAGE_KEY}_period`);
      return (saved as DateRangeKey) || 'this_month';
    } catch {
      return 'this_month';
    }
  });

  const [customStartDate, setCustomStartDate] = useState('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');
  const [activeSection, setActiveSection] = useState<GtmSection>('overview');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<CampaignChannel | 'all'>('all');
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${GTM_STORAGE_KEY}_invoices`);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [renewals] = useState<RenewalRecord[]>(INITIAL_RENEWALS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(`${GTM_STORAGE_KEY}_campaigns`);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [growthInsights] = useState<GrowthInsight[]>(INITIAL_GROWTH_INSIGHTS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${GTM_STORAGE_KEY}_period`, selectedPeriod);
      localStorage.setItem(`${GTM_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${GTM_STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [selectedPeriod, invoices, campaigns]);

  // Derive active period data
  const baseKpi = KPI_DATA_BY_PERIOD[selectedPeriod] || KPI_DATA_BY_PERIOD.this_month;
  
  // Dynamically calculate unpaid invoices total based on current active invoice state
  const unpaidInvoices = invoices.filter(inv => inv.status === 'overdue' || inv.status === 'pending' || inv.status === 'disputed');
  const dynamicUnpaidTotal = unpaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  const currentKpiSummary: ExecutiveKpiSummary = {
    ...baseKpi,
    unpaidInvoicesTotal: dynamicUnpaidTotal,
    unpaidInvoicesCount: unpaidInvoices.length,
  };

  const currentFunnelStages: FunnelStage[] =
    FUNNEL_DATA_BY_PERIOD[selectedPeriod] || FUNNEL_DATA_BY_PERIOD.this_month;

  // Actions
  const markInvoicePaid = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const newStatus = inv.status === 'paid' ? 'overdue' : 'paid';
          return { ...inv, status: newStatus };
        }
        return inv;
      })
    );
    setNotificationToast(`Invoice ${id} updated.`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(camp => {
        if (camp.id === id) {
          const nextSig = camp.recommendationSignal === 'Refresh Review' ? 'Healthy' : 'Refresh Review';
          return { ...camp, recommendationSignal: nextSig };
        }
        return camp;
      })
    );
  };

  const resetToDefaultDate = () => {
    setSelectedPeriod('this_month');
    setCustomStartDate('2026-10-01');
    setCustomEndDate('2026-10-31');
    setNotificationToast('Reset date filter to default: This Month (Oct 2026).');
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const resetAllDemoData = () => {
    try {
      localStorage.removeItem(`${GTM_STORAGE_KEY}_period`);
      localStorage.removeItem(`${GTM_STORAGE_KEY}_invoices`);
      localStorage.removeItem(`${GTM_STORAGE_KEY}_campaigns`);
    } catch {}

    setSelectedPeriod('this_month');
    setCustomStartDate('2026-10-01');
    setCustomEndDate('2026-10-31');
    setInvoices(INITIAL_INVOICES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setSelectedChannelFilter('all');
    setCampaignSearchQuery('');
    setNotificationToast('Restored all demo records and filters to initial state.');
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <GtmContext.Provider
      value={{
        selectedPeriod,
        setSelectedPeriod,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        currentKpiSummary,
        currentFunnelStages,
        monthlyTrend: MONTHLY_TREND_DATA,
        invoices,
        renewals,
        campaigns,
        growthInsights,
        activeSection,
        setActiveSection,
        selectedChannelFilter,
        setSelectedChannelFilter,
        campaignSearchQuery,
        setCampaignSearchQuery,
        markInvoicePaid,
        toggleCampaignStatus,
        resetToDefaultDate,
        resetAllDemoData,
        notificationToast,
        setNotificationToast,
      }}
    >
      {children}
    </GtmContext.Provider>
  );
};

export const useGtm = () => {
  const context = useContext(GtmContext);
  if (!context) {
    throw new Error('useGtm must be used within a GtmProvider');
  }
  return context;
};
