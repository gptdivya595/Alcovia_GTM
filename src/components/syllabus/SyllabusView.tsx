import React, { useState } from 'react';
import { Search, Filter, BookOpen, Play, Award, CheckCircle2, Clock, ChevronRight, X, Sparkles, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Topic, SubjectId } from '../../types';

export const SyllabusView: React.FC = () => {
  const {
    subjects,
    topics,
    startFocusForTopic,
    launchQuizForTopic,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicDetail, setActiveTopicDetail] = useState<Topic | null>(null);

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchesSubject = selectedSubjectId === 'all' || topic.subjectId === selectedSubjectId;
    const matchesStatus = selectedStatus === 'all' || topic.status === selectedStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStatus && matchesSearch;
  });

  const getSubjectName = (id: SubjectId) => {
    return subjects.find((s) => s.id === id)?.name || id;
  };

  const getStatusBadge = (status: Topic['status'], mastery: number) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5F2EC] text-[#1E3F35] text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-[#1E3F35]" />
            Completed ({mastery}%)
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-[11px] font-semibold">
            In Progress ({mastery}%)
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F3EDE2] text-[#697A73] text-[11px] font-medium">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
            Syllabus & Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Structured curriculum roadmap. Select any topic to focus or take a practice quiz.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E6DDCE] text-[#465750] self-start sm:self-auto font-mono">
          {topics.filter((t) => t.status === 'completed').length} / {topics.length} Chapters Mastered
        </span>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedSubjectId === 'all'
              ? 'bg-[#1E3F35] text-white shadow-xs'
              : 'bg-white border border-[#E5DCD0] text-[#556760] hover:bg-[#FAF7F2]'
          }`}
        >
          All Subjects ({topics.length})
        </button>

        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubjectId(sub.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubjectId === sub.id
                ? 'bg-[#1E3F35] text-white shadow-xs'
                : 'bg-white border border-[#E5DCD0] text-[#556760] hover:bg-[#FAF7F2]'
            }`}
          >
            {sub.name} ({sub.completedChapters}/{sub.totalChapters})
          </button>
        ))}
      </div>

      {/* Search and Status Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#E9E1D2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8B9C95] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, equations, or concepts..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xl text-xs text-[#182B24] placeholder:text-[#90A099] focus:outline-hidden focus:border-[#1E3F35] focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-xl shrink-0 self-start sm:self-auto">
          {(['all', 'in_progress', 'completed', 'not_started'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
                selectedStatus === st
                  ? 'bg-white text-[#182B24] shadow-2xs'
                  : 'text-[#63746D] hover:text-[#182B24]'
              }`}
            >
              {st === 'all' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-[#E9E1D2] space-y-2">
            <BookOpen className="w-8 h-8 text-[#98A8A1] mx-auto" />
            <h3 className="text-base font-bold text-[#182B24]">No topics match your filter</h3>
            <p className="text-xs text-[#6B7B75]">
              Try selecting another subject or clearing your search term.
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setActiveTopicDetail(topic)}
              className="bg-white rounded-3xl p-5 shadow-xs border border-[#E9E1D2] hover:border-[#1E3F35] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider">
                    {getSubjectName(topic.subjectId)} · Ch. {topic.chapterNumber}
                  </span>
                  {getStatusBadge(topic.status, topic.masteryScore)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#182B24] group-hover:text-[#1E3F35] transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-[#52645D] line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-4 mt-3 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#6E7F78]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.estimatedMinutes} min focus</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startFocusForTopic(topic.id, 25);
                    }}
                    className="px-2.5 py-1.5 bg-[#EAF2ED] hover:bg-[#D7E8DE] text-[#1E3F35] rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors"
                    title="Start focus timer for this topic"
                  >
                    <Play className="w-3 h-3 fill-[#1E3F35]" />
                    <span>Focus</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      launchQuizForTopic(topic.id);
                    }}
                    className="px-2.5 py-1.5 bg-[#F6ECCF]/80 hover:bg-[#F3E2B8] text-[#845E16] rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors"
                    title="Take learning check quiz for this topic"
                  >
                    <Award className="w-3 h-3" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Topic Detail Modal / Drawer */}
      {activeTopicDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="topic-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setActiveTopicDetail(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#E9E1D2] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#F0EAE0]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider block">
                  {getSubjectName(activeTopicDetail.subjectId)} · Chapter {activeTopicDetail.chapterNumber}
                </span>
                <h2 id="topic-detail-title" className="text-lg font-bold text-[#182B24]">
                  {activeTopicDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveTopicDetail(null)}
                className="text-[#84958E] hover:text-[#182B24] p-1.5 rounded-full hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-[#64756E] uppercase tracking-wider block mb-1">
                  Topic Overview
                </span>
                <p className="text-xs sm:text-sm text-[#384A43] leading-relaxed">
                  {activeTopicDetail.summary}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-[#64756E] uppercase tracking-wider block mb-1">
                  Target Learning Objectives
                </span>
                <ul className="space-y-1.5 text-xs text-[#3E5049]">
                  {activeTopicDetail.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1E3F35] font-bold">·</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs">
                  <span className="text-[#73847D] block">Curriculum Status</span>
                  <span className="font-bold text-[#182B24] capitalize mt-0.5 block">
                    {activeTopicDetail.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs">
                  <span className="text-[#73847D] block">Current Retention Score</span>
                  <span className="font-bold text-[#1E3F35] mt-0.5 block font-mono">
                    {activeTopicDetail.masteryScore}% Mastery
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0EAE0] flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  const id = activeTopicDetail.id;
                  setActiveTopicDetail(null);
                  launchQuizForTopic(id);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#FAF3DE] hover:bg-[#F3E7C3] text-[#7A5714] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Take Practice Quiz</span>
              </button>

              <button
                onClick={() => {
                  const id = activeTopicDetail.id;
                  setActiveTopicDetail(null);
                  startFocusForTopic(id, 25);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start 25m Focus Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
