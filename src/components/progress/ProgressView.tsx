import React, { useState } from 'react';
import { BarChart3, Clock, CheckCircle2, Award, BookOpen, AlertTriangle, ShieldCheck, HelpCircle, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgressView: React.FC = () => {
  const {
    sessions,
    quizAttempts,
    subjects,
    weeklyPerformance,
    setIsMeaningfulInfoOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'quizzes'>('overview');

  // Metrics computation
  const totalCompletedSessions = sessions.filter((s) => s.status === 'completed').length;
  const meaningfulSessions = sessions.filter((s) => s.isMeaningful);
  const meaningfulCount = meaningfulSessions.length;
  const abandonedCount = sessions.filter((s) => s.status === 'abandoned').length;

  const totalActualMinutes = sessions.reduce((acc, s) => acc + (s.actualMinutes || 0), 0);

  const averageQuizAccuracy =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length
        )
      : 0;

  const totalChapters = subjects.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.completedChapters, 0);
  const syllabusPercentage = Math.round((completedChapters / totalChapters) * 100);

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
            Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Verified study metrics, real elapsed focus time, and conceptual mastery.
          </p>
        </div>

        {/* Demo Data Disclaimer Banner */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FAF5E8] border border-[#EBE2CB] text-[#7A6126] text-[11px] font-semibold">
            Illustrative Local Demo Data
          </span>
        </div>
      </div>

      {/* Meaningful Session Callout Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF8F4] border border-[#EAE2D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#EAF2ED] text-[#1E3F35] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider block">
              Meaningful Study Session Standard
            </span>
            <p className="text-xs text-[#485B53] leading-relaxed">
              We count sessions where you complete a focused task and record a learning signal (such as a 3-question quiz). Merely starting a timer or glancing at the app is excluded.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMeaningfulInfoOpen(true)}
          className="shrink-0 px-3.5 py-1.5 bg-white hover:bg-[#F3EDE2] border border-[#DDD3C2] text-xs font-bold text-[#2A3F37] rounded-xl transition-colors cursor-pointer"
        >
          View Rule
        </button>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Completed Sessions */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E9E1D2] space-y-2">
          <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider block">
            Completed Sessions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#182B24] font-mono tabular-nums">
              {totalCompletedSessions}
            </span>
            <span className="text-xs text-[#1E3F35] font-semibold">
              ({meaningfulCount} verified)
            </span>
          </div>
          <span className="text-[11px] text-[#71827B] block">
            {abandonedCount} abandoned / exited early
          </span>
        </div>

        {/* KPI 2: Actual Focused Minutes */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E9E1D2] space-y-2">
          <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider block">
            Actual Focused Time
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#182B24] font-mono tabular-nums">
              {totalActualMinutes}
            </span>
            <span className="text-xs font-bold text-[#6D7F77]">mins</span>
          </div>
          <span className="text-[11px] text-[#71827B] block">
            Exact stopwatch elapsed time
          </span>
        </div>

        {/* KPI 3: Quiz Accuracy */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E9E1D2] space-y-2">
          <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider block">
            Quiz Accuracy
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#182B24] font-mono tabular-nums">
              {averageQuizAccuracy}%
            </span>
          </div>
          <span className="text-[11px] text-[#71827B] block">
            Across {quizAttempts.length} learning checks
          </span>
        </div>

        {/* KPI 4: Syllabus Mastered */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E9E1D2] space-y-2">
          <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider block">
            Syllabus Mastered
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3F35] font-mono tabular-nums">
              {syllabusPercentage}%
            </span>
          </div>
          <span className="text-[11px] text-[#71827B] block">
            {completedChapters}/{totalChapters} chapters complete
          </span>
        </div>
      </div>

      {/* Weekly Progress Breakdown Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
          <div>
            <h2 className="text-base font-bold text-[#182B24]">
              Weekly Meaningful Sessions vs Target
            </h2>
            <p className="text-xs text-[#6A7B74]">
              Comparing verified sessions with learning checks against the 6 session/week pacing target
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#63746D]">
              <span className="w-3 h-3 rounded-md bg-[#1E3F35]" />
              Meaningful Sessions
            </span>
            <span className="flex items-center gap-1.5 text-[#63746D]">
              <span className="w-3 h-3 rounded-md bg-[#EDE6DC]" />
              Target (6)
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-4 pt-1">
          {weeklyPerformance.map((wp, idx) => {
            const pct = Math.min(100, (wp.meaningfulSessions / wp.targetSessions) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#182B24]">{wp.weekLabel}</span>
                  <div className="flex items-center gap-3 text-[#64756E]">
                    <span>
                      <strong className="text-[#182B24]">{wp.meaningfulSessions}</strong> / {wp.targetSessions} sessions
                    </span>
                    <span>·</span>
                    <span>{wp.totalMinutes} mins</span>
                    <span>·</span>
                    <span className="font-semibold text-[#1E3F35]">{wp.quizAccuracy}% quiz</span>
                  </div>
                </div>

                <div className="w-full h-3.5 bg-[#EDE7DE] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#1E3F35] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs: Session Log vs Quiz Log */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9E1D2] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#182B24] shadow-2xs'
                  : 'text-[#62736C] hover:text-[#182B24]'
              }`}
            >
              All Sessions ({sessions.length})
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-white text-[#182B24] shadow-2xs'
                  : 'text-[#62736C] hover:text-[#182B24]'
              }`}
            >
              Quiz Attempts ({quizAttempts.length})
            </button>
          </div>

          <span className="text-[11px] text-[#7E8F88] font-mono">
            Chronological records
          </span>
        </div>

        {activeTab === 'overview' ? (
          /* Sessions History Table */
          <div className="divide-y divide-[#F2ECE2] text-xs">
            {sessions.map((sess) => {
              const formattedDate = new Date(sess.startedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={sess.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#182B24] block">
                      {sess.topicTitle}
                    </span>
                    <span className="text-[#64756E] block text-[11px]">
                      {sess.subjectTitle} · {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#182B24] block">
                        {sess.actualMinutes}m / {sess.plannedMinutes}m
                      </span>
                      <span className="text-[10px] text-[#7C8D86]">
                        {sess.status === 'abandoned' ? 'Early exit' : 'Completed focus'}
                      </span>
                    </div>

                    {sess.isMeaningful ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#E5F2EC] text-[#1E3F35] font-semibold text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#1E3F35]" />
                        Meaningful
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] text-[#71827B] font-medium text-[11px]">
                        Focus Logged
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Quiz Attempts Log */
          <div className="divide-y divide-[#F2ECE2] text-xs">
            {quizAttempts.map((qa) => {
              const formattedDate = new Date(qa.completedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={qa.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#182B24] block">
                      {qa.topicTitle}
                    </span>
                    <span className="text-[#64756E] block text-[11px]">
                      {qa.subjectTitle} · {formattedDate}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-extrabold text-[#1E3F35] block text-sm">
                      {qa.score} / {qa.totalQuestions} ({qa.percentage}%)
                    </span>
                    <span className="text-[10px] text-[#7C8D86]">
                      Verified Learning Signal
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
