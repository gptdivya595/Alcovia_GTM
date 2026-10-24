import React, { useState } from 'react';
import { Play, Sparkles, ChevronRight, RefreshCw, Clock, CheckCircle2, BookOpen, AlertCircle, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import { ReviseMeSoonIcon } from '../common/ReviseMeSoonIcon';
import { useApp } from '../../context/AppContext';
import { ChangeTaskModal } from './ChangeTaskModal';

export const HomeView: React.FC = () => {
  const {
    student,
    activeTask,
    sessions,
    quizAttempts,
    subjects,
    topics,
    upcomingTests,
    revisionItems,
    startFocusForTask,
    startRevisionForTopic,
    setCurrentView,
    setIsMeaningfulInfoOpen,
  } = useApp();

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  // Compute stats
  const meaningfulSessions = sessions.filter(s => s.isMeaningful);
  const thisWeekMeaningfulCount = Math.min(student.weeklyTargetSessions, meaningfulSessions.length);
  const totalChapters = subjects.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.completedChapters, 0);
  const syllabusPercentage = Math.round((completedChapters / totalChapters) * 100);

  // Today's focus sessions count
  const todaySessionsCount = sessions.filter(s => {
    const today = new Date().toISOString().slice(0, 10);
    return s.startedAt.slice(0, 10) === today;
  }).length;

  // Recent 3 activities
  const recentActivities = sessions.slice(0, 3);

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-4xl mx-auto">
      {/* Welcome & Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
            Today's Focus
          </h1>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Start a concrete study task, complete a focused session, and test your understanding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMeaningfulInfoOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E4DBD0] text-xs font-medium text-[#44564E] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#1E3F35]" />
            <span>Meaningful Session Metric</span>
          </button>
        </div>
      </div>

      {/* Hero Card: TODAY'S FOCUS (Faithful to reference image aesthetic) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E9E1D2] space-y-6 relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#6D7D76] uppercase tracking-widest">
            TODAY'S FOCUS
          </span>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EBF2EE] text-[#1E3F35]">
            {activeTask.subjectTitle}
          </span>
        </div>

        {/* Big Circular Focus Meter */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-[#EFEAE1]"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-[#1E3F35] transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray="314.159"
                strokeDashoffset={314.159 - (314.159 * Math.max(1, todaySessionsCount)) / 3}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Meter Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#182B24] tracking-tight">
                {Math.max(1, todaySessionsCount)}
              </span>
              <span className="text-xs font-semibold text-[#6E7E77] mt-0.5">
                3 sessions target
              </span>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#708079] font-medium">
            Daily goal: <span className="font-bold text-[#182B24]">30 mins</span> · Flexible 15m/25m blocks
          </div>
        </div>

        {/* Dual Mini Ring Gauges: Readiness & Focus Load (Direct from reference layout) */}
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto pt-2 pb-2">
          {/* Gauge 1: Recovery / Readiness */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-3 border-[#991B1B] flex items-center justify-center bg-[#FDF9F8] shadow-2xs">
              <span className="text-lg font-bold text-[#182B24] tabular-nums font-mono">
                33
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#75847E] tracking-wider uppercase mt-2">
              RECOVERY
            </span>
            <span className="text-[10px] text-[#8E9D97]">Cognitive readiness</span>
          </div>

          {/* Gauge 2: Strain / Focus Load */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-3 border-[#D97706] flex items-center justify-center bg-[#FEFAF5] shadow-2xs">
              <span className="text-lg font-bold text-[#182B24] tabular-nums font-mono">
                8.0
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#75847E] tracking-wider uppercase mt-2">
              STRAIN
            </span>
            <span className="text-[10px] text-[#8E9D97]">Daily focus load</span>
          </div>
        </div>

        {/* Main CTA: Big Dark Forest Green Pill Button */}
        <div className="pt-2">
          <button
            onClick={() => startFocusForTask(activeTask, activeTask.recommendedDuration)}
            className="w-full py-4 px-6 rounded-2xl bg-[#1E3F35] hover:bg-[#152E27] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Focus ({activeTask.recommendedDuration} min)</span>
          </button>
        </div>
      </div>

      {/* Recommended Task Card with Reason & Switch Option */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3F35]" />
            <span className="text-xs font-bold text-[#182B24] uppercase tracking-wider">
              Recommended Study Task
            </span>
          </div>

          <button
            onClick={() => setIsChangeModalOpen(true)}
            className="text-xs font-semibold text-[#1E3F35] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Task</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#182B24]">
              {activeTask.actionTitle}
            </h2>
            <span className="text-xs font-semibold text-[#576861] shrink-0 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activeTask.estimatedMinutes} min
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4E5F58]">
            <strong className="text-[#182B24]">Topic:</strong> {activeTask.topicTitle} ({activeTask.subjectTitle} · Chapter {activeTask.sourceChapter})
          </p>

          {/* Reason for recommendation banner */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#EDE5D6] text-xs text-[#3D4F48] flex items-start gap-2.5">
            <span className="font-bold text-[#1E3F35] shrink-0">Why recommended:</span>
            <span className="leading-relaxed">{activeTask.reason}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#70807A]">
            <span>Low planning friction</span>
            <span>·</span>
            <span>Auto-syncs with syllabus</span>
          </div>

          <button
            onClick={() => startFocusForTask(activeTask, activeTask.recommendedDuration)}
            className="px-4 py-2 bg-[#EAF2ED] hover:bg-[#DCEDE2] text-[#1E3F35] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Start This Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Exam Revision Alert Card */}
      {upcomingTests.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
              <span className="text-xs font-bold text-[#182B24] uppercase tracking-wider flex items-center gap-1.5">
                <ReviseMeSoonIcon className="w-3.5 h-3.5 text-[#B91C1C]" />
                Revise Me Soon · Upcoming Test Alert
              </span>
            </div>

            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] font-mono">
              {upcomingTests[0].daysRemaining} days left
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#182B24]">
                  {upcomingTests[0].title}
                </h3>
                <span className="text-xs text-[#6B7B74]">
                  ({upcomingTests[0].subjectTitle})
                </span>
              </div>
              <p className="text-xs text-[#52645D]">
                Topic due for revision: <strong className="text-[#182B24]">Cellular Respiration & ATP Synthesis</strong> (42% retention score).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startRevisionForTopic('bio-1', 15)}
                className="px-3.5 py-2 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Quick 15m Revision</span>
              </button>

              <button
                onClick={() => setCurrentView('revision')}
                className="px-3.5 py-2 bg-[#F6F1E8] hover:bg-[#EDE5D8] text-[#374942] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <span>View All Tests</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Velocity Card (From Screenshot) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#182B24]">
            Daily Velocity
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#EBF2EE] text-[#1E3F35] font-mono">
            0.0% / 1.33%
          </span>
        </div>

        {/* Progress bar with Target marker */}
        <div className="relative pt-6 pb-2">
          {/* Target marker flag */}
          <div className="absolute top-0 right-[35%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#798A83] tracking-wider">
              TARGET
            </span>
            <div className="w-0.5 h-3 bg-[#A3B3AC]" />
          </div>

          {/* Main track */}
          <div className="w-full h-2.5 bg-[#EDE7DD] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E3F35] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todaySessionsCount / 3) * 65)}%` }}
            />
          </div>

          {/* Scale labels */}
          <div className="flex items-center justify-between text-[11px] text-[#869790] pt-2 font-mono">
            <span>0%</span>
            <span>1.0%</span>
            <span>2.0%</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE2] text-xs">
          <span className="px-3 py-1 bg-[#E8EFF0] text-[#294248] font-bold rounded-xl">
            4 tasks to go
          </span>
          <span className="text-[#6C7D76]">
            {todaySessionsCount}/4 done today · Build velocity without pressure
          </span>
        </div>
      </div>

      {/* STUDY PLANNER & SYLLABUS DUAL METRICS (Directly from reference layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attendance Ring Card */}
        <div
          onClick={() => setCurrentView('progress')}
          className="bg-white rounded-3xl p-5 shadow-sm border border-[#E9E1D2] flex flex-col items-center text-center cursor-pointer hover:border-[#1E3F35] transition-colors group"
        >
          <div className="w-full flex items-center justify-between text-xs font-bold text-[#6D7D76] uppercase tracking-wider mb-2">
            <span>ATTENDANCE</span>
            <ChevronRight className="w-4 h-4 text-[#8C9D96] group-hover:text-[#1E3F35]" />
          </div>

          <div className="my-3 relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-[#F0EBE0]" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#991B1B]"
                strokeWidth="8"
                strokeDasharray="251.32"
                strokeDashoffset={251.32 - (251.32 * 0.67)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xl font-extrabold text-[#182B24] tabular-nums font-mono">
              67%
            </span>
          </div>

          <span className="text-xs text-[#63746D] font-medium">
            37/55 sessions recorded
          </span>
        </div>

        {/* Syllabus Ring Card */}
        <div
          onClick={() => setCurrentView('syllabus')}
          className="bg-white rounded-3xl p-5 shadow-sm border border-[#E9E1D2] flex flex-col items-center text-center cursor-pointer hover:border-[#1E3F35] transition-colors group"
        >
          <div className="w-full flex items-center justify-between text-xs font-bold text-[#6D7D76] uppercase tracking-wider mb-2">
            <span>SYLLABUS</span>
            <ChevronRight className="w-4 h-4 text-[#8C9D96] group-hover:text-[#1E3F35]" />
          </div>

          <div className="my-3 relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-[#F0EBE0]" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#1E3F35]"
                strokeWidth="8"
                strokeDasharray="251.32"
                strokeDashoffset={251.32 - (251.32 * syllabusPercentage) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xl font-extrabold text-[#182B24] tabular-nums font-mono">
              {syllabusPercentage}%
            </span>
          </div>

          <span className="text-xs text-[#63746D] font-medium">
            {completedChapters}/{totalChapters} chapters completed
          </span>
        </div>
      </div>

      {/* STUDY PLANNER Card (From Screenshot) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1E3F35]" />
            <h2 className="text-xs font-bold text-[#182B24] uppercase tracking-wider">
              STUDY PLANNER
            </h2>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#EAE2D4] text-[#4F6059]">
            ON TRACK · Q3 (6 WEEKS LEFT)
          </span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#EFE7DC] text-center pt-2">
          <div className="px-2">
            <span className="text-lg sm:text-xl font-bold text-[#182B24] block tabular-nums">
              59h
            </span>
            <span className="text-[11px] text-[#71827B]">Estimated</span>
          </div>

          <div className="px-2">
            <span className="text-lg sm:text-xl font-bold text-[#1E3F35] block tabular-nums">
              4.5h
            </span>
            <span className="text-[11px] text-[#71827B]">Completed</span>
          </div>

          <div className="px-2">
            <span className="text-lg sm:text-xl font-bold text-[#182B24] block tabular-nums">
              260h
            </span>
            <span className="text-[11px] text-[#71827B]">Available</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-[#EDE6DC] rounded-full overflow-hidden mt-3">
          <div className="w-[18%] h-full bg-[#1E3F35]" />
        </div>

        <p className="text-xs text-[#5D6E67] pt-1">
          💡 9.8h/week needed · Biology needs most time before midterms
        </p>
      </div>

      {/* Weekly Meaningful Study Sessions Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
          <div>
            <h2 className="text-sm font-bold text-[#182B24]">
              Weekly Meaningful Sessions
            </h2>
            <p className="text-xs text-[#6A7B74]">
              {thisWeekMeaningfulCount} of {student.weeklyTargetSessions} target sessions completed with verified quiz signals
            </p>
          </div>

          <button
            onClick={() => setIsMeaningfulInfoOpen(true)}
            className="text-[#7F9088] hover:text-[#1E3F35] p-1"
            title="Read definition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: student.weeklyTargetSessions }).map((_, idx) => {
            const isFilled = idx < thisWeekMeaningfulCount;
            return (
              <div
                key={idx}
                className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  isFilled
                    ? 'bg-[#1E3F35] text-white shadow-2xs'
                    : 'bg-[#F2ECE1] text-[#93A39C] border border-dashed border-[#DDD4C5]'
                }`}
              >
                {isFilled ? <CheckCircle2 className="w-4 h-4 text-[#7DE2B5]" /> : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Small Recent Activity Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
          <h2 className="text-sm font-bold text-[#182B24]">
            Recent Learning Activity
          </h2>
          <button
            onClick={() => setCurrentView('progress')}
            className="text-xs font-semibold text-[#1E3F35] hover:underline"
          >
            View all history →
          </button>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DD] flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-[#182B24] block">
                  {act.topicTitle}
                </span>
                <span className="text-[#64756E] block">
                  {act.subjectTitle} · {act.actualMinutes} mins focused
                </span>
              </div>

              <div className="text-right shrink-0">
                {act.isMeaningful ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#E5F2EC] text-[#1E3F35] font-semibold text-[11px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#1E3F35]" />
                    Quiz Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[#73837D] font-medium text-[11px]">
                    Focus Logged
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Switcher Modal */}
      <ChangeTaskModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
      />
    </div>
  );
};
