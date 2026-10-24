/**
 * Type definitions for Alcovia GTM & Revenue Dashboard.
 * Models executive KPIs, revenue streams, 8-stage funnels, marketing campaigns, and growth decision insights.
 */

export type DateRangeKey = 'this_month' | 'last_month' | 'q3_2026' | 'ytd_2026' | 'custom';

export interface DateRangeConfig {
  key: DateRangeKey;
  label: string;
  startDate: string;
  endDate: string;
  isDefault?: boolean;
}

export interface ExecutiveKpiSummary {
  monthlyRevenueTarget: number; // in INR
  actualRevenue: number; // in INR
  achievementPercentage: number;
  programRevenue: number; // in INR
  workshopRevenue: number; // in INR
  totalRevenue: number; // programRevenue + workshopRevenue
  unpaidInvoicesTotal: number; // in INR
  unpaidInvoicesCount: number;
  upcomingRenewalsValue: number; // in INR
  upcomingRenewalsCount: number;
  studentsOnboarded: number;
  threeMonthTrialSignups: number;
  fullProgramSignups: number;
  workshopSeatsSold: number;
  previousPeriodRevenue: number;
  revenueGrowthMoM: number;
}

export interface RevenueMonthlyTrend {
  month: string;
  target: number;
  programRevenue: number;
  workshopRevenue: number;
  totalActual: number;
  workshopSeatsSold: number;
}

export type InvoiceStatus = 'overdue' | 'pending' | 'paid' | 'disputed';

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  studentName: string;
  productType: 'Full Program' | '3-Month Trial' | 'Workshop Bundle';
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  daysOverdue: number;
  contactEmail: string;
}

export interface RenewalRecord {
  id: string;
  studentName: string;
  parentName: string;
  programEnrolled: string;
  currentTermEndDate: string;
  renewalValue: number;
  likelihood: 'High' | 'Medium' | 'At Risk';
  assignedAdvisor: string;
  lastTouchpoint: string;
}

export interface FunnelStage {
  stageId: string;
  stageName: string;
  order: number;
  count: number;
  previousCount: number;
  conversionFromPrevious: number | null; // % (e.g. 78.4%)
  conversionFromLead: number; // % from top of funnel
  dropOffCount: number;
  dropOffRate: number; // % drop-off
  denominatorLabel: string; // Explains exact denominator used
  diagnosticNote?: string;
}

export type CampaignChannel = 'Meta Ads' | 'Google Search' | 'LinkedIn' | 'Partner Workshops' | 'Organic / Referral';

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // %
  frequency: number; // Ad frequency
  frequencyFlagged: boolean; // frequency >= 3.0 triggers refresh-review
  landingPageVisits: number;
  landingPageDropOffRate: number; // % drop-off on LP
  qualifiedLeads: number;
  costPerQualifiedLead: number; // Spend / Qualified Leads
  trialSignups: number;
  fullProgramSignups: number;
  totalConversions: number;
  roas: number | null; // Return on Ad Spend (or null if organic)
  recommendationSignal: 'Healthy' | 'Refresh Review' | 'Optimize LP' | 'Scale' | 'Audit Targeting';
}

export interface GrowthInsight {
  id: string;
  category: 'Funnel Friction' | 'Campaign Fatigue' | 'Receivables Risk' | 'Landing Page Drop-off' | 'Conversion Shift';
  title: string;
  metricName: string;
  observedValue: string;
  comparisonBenchmark: string;
  severity: 'high' | 'medium' | 'positive';
  hypothesisOnlyNote: string; // Explicitly avoids asserting causation
  recommendedNextInvestigation: string;
}
