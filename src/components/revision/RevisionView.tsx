import React, { useState } from 'react';
import {
  Calendar,
  BellOff,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  BookmarkCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { ReviseMeSoonIcon } from '../common/ReviseMeSoonIcon';
import { useApp } from '../../context/AppContext';
import { UpcomingTest, RevisionItem } from '../../types';

export const RevisionView: React.FC = () => {
  const {
    upcomingTests,
    revisionItems,
    revisionNotifications,
    toggleTestNotification,
    markRevisionItemCompleted,
    triggerManualRevisionAlert,
    startRevisionForTopic,
    launchQuizForTopic,
    markNotificationRead,
    setCurrentView,
  } = useApp();

  const [selectedUrgency, setSelectedUrgency] = useState<'all' | 'urgent' | 'moderate' | 'completed'>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>('rev-1');
  const [activeTestFilter, setActiveTestFilter] = useState<string>('all');

  // Filter revision items
  const filteredItems = revisionItems.filter((item) => {
    const matchesTest = activeTestFilter === 'all' || item.testId === activeTestFilter;
    if (!matchesTest) return false;

    if (selectedUrgency === 'completed') return item.isRevised;
    if (selectedUrgency === 'urgent') return item.urgency === 'urgent' && !item.isRevised;
    if (selectedUrgency === 'moderate') return item.urgency === 'moderate' && !item.isRevised;
    return true;
  });

  const urgentCount = revisionItems.filter((i) => i.urgency === 'urgent' && !i.isRevised).length;
  const revisedCount = revisionItems.filter((i) => i.isRevised).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
              Revision & Test Prep
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF5E8] text-[#866518]">
              Targeted Retrieval
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Prepare for upcoming exams. Receive automated revision reminders as tests approach.
          </p>
        </div>

        {/* Quick Simulation Button for notifications */}
        <button
          onClick={() => triggerManualRevisionAlert(upcomingTests[0]?.id || 'test-bio-midterm')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          title="Simulate receiving a Revise Me Soon test notification"
        >
          <ReviseMeSoonIcon className="w-3.5 h-3.5" />
          <span>Simulate "Revise Me Soon" Alert</span>
        </button>
      </div>

      {/* Urgent Exam Alert Banner (If test is <= 3 days away) */}
      <div className="p-5 rounded-3xl bg-[#FFF9EE] border border-[#F3DFC1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FBEFD9] text-[#92550A] flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8E5107] uppercase tracking-wider">
                Exam Countdown Alert
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#B91C1C] text-white text-[10px] font-bold">
                3 Days Remaining
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4E3917] leading-relaxed">
              <strong>Biology Midterm Examination</strong> is scheduled for <strong>Oct 27</strong> (30% weight). You have <strong>{urgentCount} priority topics</strong> due for retrieval revision today.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const bio1 = revisionItems.find((r) => r.topicId === 'bio-1');
            if (bio1) startRevisionForTopic(bio1.topicId, 15);
          }}
          className="shrink-0 px-4 py-2.5 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Start 15m Sprint Revision</span>
        </button>
      </div>

      {/* Upcoming Tests Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#6B7C75] uppercase tracking-wider">
            Upcoming Examinations & Test Notifications
          </span>
          <span className="text-xs text-[#7B8B84]">
            {upcomingTests.filter((t) => t.notificationsEnabled).length} of {upcomingTests.length} alerts enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingTests.map((test) => {
            const isSelected = activeTestFilter === test.id;

            return (
              <div
                key={test.id}
                onClick={() => setActiveTestFilter(isSelected ? 'all' : test.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative bg-white ${
                  isSelected
                    ? 'border-[#1E3F35] ring-1 ring-[#1E3F35] shadow-xs'
                    : 'border-[#E9E1D2] hover:border-[#D6CAB8]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider block">
                        {test.subjectTitle} · {test.weightPercentage}% Course Weight
                      </span>
                      <h3 className="text-base font-bold text-[#182B24]">
                        {test.title}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono shrink-0 ${
                        test.daysRemaining <= 3
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : test.daysRemaining <= 7
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#F2ECE1] text-[#63746D]'
                      }`}
                    >
                      {test.daysRemaining} days left
                    </span>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64756E]">Exam Readiness:</span>
                      <span className="font-mono font-bold text-[#182B24]">
                        {test.readinessScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#EDE6DC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E3F35] rounded-full transition-all duration-500"
                        style={{ width: `${test.readinessScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Notification Toggle and Filter Button */}
                  <div className="pt-2 border-t border-[#F1EBE1] flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTestNotification(test.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        test.notificationsEnabled
                          ? 'bg-[#EBF2EE] text-[#1E3F35] hover:bg-[#DCEAE1]'
                          : 'bg-[#F4EFE6] text-[#7A8B84] hover:bg-[#EAE3D6]'
                      }`}
                      title={test.notificationsEnabled ? 'Click to mute reminders' : 'Click to enable test reminders'}
                    >
                      {test.notificationsEnabled ? (
                        <>
                          <ReviseMeSoonIcon className="w-3.5 h-3.5 text-[#1E3F35]" />
                          <span>Revise Me Soon On</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5" />
                          <span>Muted</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-[#71827B]">
                      {isSelected ? '✓ Showing topics' : 'Click to filter topics'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revision Queue Filter & Content */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE0]">
          <div>
            <h2 className="text-base font-bold text-[#182B24]">
              Revision Tasks & High-Yield Cheat Sheets
            </h2>
            <p className="text-xs text-[#6A7B74]">
              {revisedCount} of {revisionItems.length} topics revised before exams
            </p>
          </div>

          {/* Urgency Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-xl self-start sm:self-auto">
            {(['all', 'urgent', 'moderate', 'completed'] as const).map((urg) => (
              <button
                key={urg}
                onClick={() => setSelectedUrgency(urg)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  selectedUrgency === urg
                    ? 'bg-white text-[#182B24] shadow-2xs font-bold'
                    : 'text-[#63746D] hover:text-[#182B24]'
                }`}
              >
                {urg === 'all'
                  ? 'All'
                  : urg === 'urgent'
                  ? `Urgent (${urgentCount})`
                  : urg === 'moderate'
                  ? 'Upcoming'
                  : `Revised (${revisedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Revision Items Accordion / Cards */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#70807A]">
              No revision topics found for this filter.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all ${
                    item.isRevised
                      ? 'border-[#E2DDD3] bg-[#FAF8F5] opacity-80'
                      : item.urgency === 'urgent'
                      ? 'border-[#EEDECB] bg-[#FFFBF7]'
                      : 'border-[#EAE2D5] bg-white'
                  }`}
                >
                  <div
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox to Mark Revised */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRevisionItemCompleted(item.id);
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                          item.isRevised
                            ? 'bg-[#1E3F35] text-white'
                            : 'border border-[#D1C7BA] hover:border-[#1E3F35]'
                        }`}
                        title={item.isRevised ? 'Marked as revised' : 'Click to mark as revised'}
                      >
                        {item.isRevised && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider">
                            {item.subjectTitle}
                          </span>
                          <span className="text-xs text-[#8C9C95]">·</span>
                          <span className="text-[11px] text-[#697A73]">
                            For: <strong>{item.testTitle}</strong>
                          </span>
                          <span className="text-xs text-[#8C9C95]">·</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              item.urgency === 'urgent'
                                ? 'bg-[#FEE2E2] text-[#991B1B]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}
                          >
                            Exam in {item.daysUntilTest} days
                          </span>
                        </div>

                        <h3 className={`text-base font-bold text-[#182B24] ${item.isRevised ? 'line-through text-[#6C7C75]' : ''}`}>
                          {item.topicTitle}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-[#63746D]">
                          <span>Current Retention: <strong>{item.retentionScore}%</strong></span>
                          <span>·</span>
                          <span>Last Revised: {item.lastRevisedDate || 'Never'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#889891]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#889891]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded High-Yield Formulas & Actions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-[#F2ECE1] space-y-4 text-xs">
                      {/* Key Formulas Sheet */}
                      <div className="p-3.5 rounded-xl bg-[#F6F2E9] border border-[#E9DFCF] space-y-1.5">
                        <span className="font-bold text-[#1E3F35] text-[11px] uppercase tracking-wider block">
                          ⚡ High-Yield Exam Formulas & Equations
                        </span>
                        <ul className="space-y-1 font-mono text-[11px] text-[#293B34]">
                          {item.keyFormulas.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#1E3F35] font-bold">›</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Flashcard Notes */}
                      <div className="p-3 rounded-xl bg-white border border-[#EBE3D7] text-xs text-[#455750]">
                        <strong className="text-[#182B24]">Exam Tip:</strong> {item.flashcardNotes}
                      </div>

                      {/* Interactive Action Buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => launchQuizForTopic(item.topicId)}
                          className="px-3.5 py-2 bg-[#FAF3DE] hover:bg-[#F3E7C3] text-[#7A5714] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Practice 3-Q Quiz</span>
                        </button>

                        <button
                          onClick={() => startRevisionForTopic(item.topicId, 15)}
                          className="px-4 py-2 bg-[#1E3F35] hover:bg-[#152E27] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start 15m Sprint</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Revision Notifications History */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <ReviseMeSoonIcon className="w-4 h-4 text-[#1E3F35]" />
            <h2 className="text-sm font-bold text-[#182B24] uppercase tracking-wider">
              Revise Me Soon Reminders
            </h2>
          </div>
          <span className="text-xs text-[#7B8B84]">
            Automated alerts based on exam proximity
          </span>
        </div>

        <div className="space-y-2.5">
          {revisionNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                notif.read
                  ? 'bg-[#FAF8F5] border-[#EFE8DD] text-[#60716A]'
                  : 'bg-[#FFFBF2] border-[#F2E1C9] text-[#1E2E28] font-medium'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#182B24]">{notif.testTitle}</span>
                  <span className="text-[10px] text-[#869790]">{notif.timestamp}</span>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
                  )}
                </div>
                <p className="text-xs leading-relaxed">{notif.message}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRevisionForTopic(notif.topicId, 15);
                }}
                className="shrink-0 px-3 py-1.5 bg-[#EAF2ED] hover:bg-[#D8E9DF] text-[#1E3F35] font-bold rounded-xl text-[11px] transition-colors"
              >
                Revise Topic
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
