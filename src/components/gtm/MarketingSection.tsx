import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { formatINR, formatPercent } from '../../data/gtmData';
import { CampaignChannel, MarketingCampaign } from '../../types/gtm';

export const MarketingSection: React.FC = () => {
  const {
    campaigns,
    selectedChannelFilter,
    setSelectedChannelFilter,
    campaignSearchQuery,
    setCampaignSearchQuery,
    toggleCampaignStatus,
  } = useGtm();

  const [activeFrequencyModal, setActiveFrequencyModal] = useState<MarketingCampaign | null>(null);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesChannel =
      selectedChannelFilter === 'all' || camp.channel === selectedChannelFilter;
    const matchesSearch =
      campaignSearchQuery.trim() === '' ||
      camp.name.toLowerCase().includes(campaignSearchQuery.toLowerCase()) ||
      camp.channel.toLowerCase().includes(campaignSearchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  // Calculate totals
  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalQualifiedLeads = filteredCampaigns.reduce((acc, c) => acc + c.qualifiedLeads, 0);
  const blendedCPQL = totalQualifiedLeads > 0 ? totalSpend / totalQualifiedLeads : 0;
  const flaggedCount = filteredCampaigns.filter((c) => c.frequency >= 3.0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Marketing Acquisition & Unit Economics
          </h2>
          <p className="text-xs text-slate-500">
            Campaign-level spend efficiency, CTR, frequency review thresholds, and landing page drop-off rates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {flaggedCount} Campaigns at ≥3.0 Frequency Threshold
          </span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Campaign Spend
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums block">
            {formatINR(totalSpend)}
          </span>
          <span className="text-[11px] text-slate-500">Across {filteredCampaigns.length} active channels</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Qualified Leads Acquired
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums block">
            {totalQualifiedLeads}
          </span>
          <span className="text-[11px] text-slate-500">Pre-screened student inquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Blended Cost per Qualified Lead (CPQL)
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums block">
            {formatINR(blendedCPQL)}
          </span>
          <span className="text-[11px] text-slate-500">Spend ÷ Qualified Leads</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Frequency Review Threshold
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-800 tabular-nums block">
            {flaggedCount} Flagged
          </span>
          <span className="text-[11px] text-slate-500">Frequency ≥ 3.0 (Review trigger)</span>
        </div>
      </div>

      {/* Threshold Definition Callout */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs flex items-start gap-3 text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="block font-bold">Policy Note on Frequency ≥ 3.0:</strong>
          <p className="leading-relaxed text-amber-950">
            In our GTM framework, an ad frequency at or above 3.0 is an explicit <strong>creative refresh review threshold</strong>, not an automatic directive to stop or pause a campaign. Retargeting audiences and high-intent consideration campaigns naturally tolerate higher frequency without brand fatigue.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={campaignSearchQuery}
            onChange={(e) => setCampaignSearchQuery(e.target.value)}
            placeholder="Search campaigns by name or channel..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:bg-white"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Meta Ads', 'Google Search', 'LinkedIn', 'Partner Workshops', 'Organic / Referral'] as const).map(
            (ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannelFilter(ch)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedChannelFilter === ch
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {ch === 'all' ? 'All Channels' : ch}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Campaign Performance Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Campaign Performance & Economics Table
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredCampaigns.length} Campaigns Loaded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Campaign Name</th>
                <th className="py-2.5 px-3 font-semibold">Channel</th>
                <th className="py-2.5 px-3 font-semibold text-right">Spend</th>
                <th className="py-2.5 px-3 font-semibold text-right">Impr / Clicks</th>
                <th className="py-2.5 px-3 font-semibold text-right">CTR (%)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Frequency</th>
                <th className="py-2.5 px-3 font-semibold text-right">LP Visits</th>
                <th className="py-2.5 px-3 font-semibold text-right">LP Drop-off</th>
                <th className="py-2.5 px-3 font-semibold text-right">Qual. Leads</th>
                <th className="py-2.5 px-3 font-semibold text-right">CPQL</th>
                <th className="py-2.5 px-3 font-semibold text-right">Conversions</th>
                <th className="py-2.5 px-3 font-semibold text-right">ROAS</th>
                <th className="py-2.5 px-3 font-semibold text-center">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredCampaigns.map((camp) => {
                const isOverFrequencyThreshold = camp.frequency >= 3.0;

                return (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-slate-900 max-w-[200px] truncate" title={camp.name}>
                      {camp.name}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {camp.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {camp.spend > 0 ? formatINR(camp.spend) : '₹0 (Organic)'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {camp.impressions > 0 ? `${(camp.impressions / 1000).toFixed(0)}k / ${camp.clicks.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {camp.ctr > 0 ? (
                        <span className={`font-semibold ${camp.ctr >= 4.0 ? 'text-emerald-700 font-bold' : 'text-slate-800'}`}>
                          {camp.ctr.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums">
                      {isOverFrequencyThreshold ? (
                        <button
                          onClick={() => setActiveFrequencyModal(camp)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold hover:bg-amber-200 transition-colors cursor-pointer"
                          title="Frequency ≥ 3.0 review threshold reached"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>{camp.frequency.toFixed(2)}</span>
                        </button>
                      ) : (
                        <span className="text-slate-600">{camp.frequency.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 tabular-nums font-sans">
                      {camp.landingPageVisits.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          camp.landingPageDropOffRate >= 50
                            ? 'text-rose-700 font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        {camp.landingPageDropOffRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {camp.qualifiedLeads}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 font-semibold tabular-nums">
                      {camp.costPerQualifiedLead > 0 ? formatINR(camp.costPerQualifiedLead) : '₹0'}
                    </td>
                    <td className="py-3 px-3 text-right font-sans tabular-nums">
                      <span className="font-bold text-slate-900">
                        {camp.trialSignups + camp.fullProgramSignups}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({camp.trialSignups}T / {camp.fullProgramSignups}F)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold tabular-nums">
                      {camp.roas !== null ? (
                        <span className={camp.roas >= 4.0 ? 'text-emerald-700 font-extrabold' : 'text-slate-800'}>
                          {camp.roas.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-slate-400" title="Organic channel has no paid ad spend denominator">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          camp.recommendationSignal === 'Scale'
                            ? 'bg-emerald-100 text-emerald-800'
                            : camp.recommendationSignal === 'Refresh Review'
                            ? 'bg-amber-100 text-amber-900'
                            : camp.recommendationSignal === 'Optimize LP'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {camp.recommendationSignal}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequency Diagnostic Modal */}
      {activeFrequencyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setActiveFrequencyModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Frequency Threshold Review: {activeFrequencyModal.frequency.toFixed(2)}
                </h3>
              </div>
              <button
                onClick={() => setActiveFrequencyModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Campaign <strong>"{activeFrequencyModal.name}"</strong> has reached an ad frequency of{' '}
              <span className="font-mono font-bold text-amber-800">{activeFrequencyModal.frequency.toFixed(2)}</span>, exceeding the review threshold of 3.0.
            </p>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong className="block">Investigation Guidance:</strong>
              <p>
                Do not stop this campaign immediately. Check CTR decay over the past 7 days. Because this is a high-intent video/retargeting sequence, higher frequency may be acceptable if CPQL remains under ₹1,000. Prepare 2 fresh visual hooks before making budget allocation changes.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  toggleCampaignStatus(activeFrequencyModal.id);
                  setActiveFrequencyModal(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Acknowledge Review Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
