import React, { useState } from 'react';
import { Compass, Sun, RotateCcw, Sparkles, CheckCircle2, BookOpen, AlertCircle, X, User } from 'lucide-react';
import { ReviseMeSoonIcon } from '../common/ReviseMeSoonIcon';
import { useApp } from '../../context/AppContext';

export const TopHeader: React.FC = () => {
  const {
    student,
    setCurrentView,
    resetAllDemoData,
    notificationMessage,
    revisionNotifications,
    markNotificationRead,
    startRevisionForTopic,
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = revisionNotifications.filter((n) => !n.read).length;
  const totalNotifs = 5 + unreadCount;

  const academicTips = [
    { id: 'tip-1', title: 'Biology Midterm in 3 Days', desc: 'Cellular Respiration & Photosynthesis formulas need retrieval review.', time: '1h ago', type: 'urgent' },
    { id: 'tip-2', title: 'Spaced Retrieval Refresher', desc: '4 days since your last Physics Incline Friction session.', time: '5h ago', type: 'info' },
    { id: 'tip-3', title: 'Calculus Milestone Ready', desc: 'You scored 100% on Derivatives! Chapter 3 is unlocked.', time: '1d ago', type: 'success' },
    { id: 'tip-4', title: 'Study Tip: Retrieval vs Re-reading', desc: 'A 3-minute quiz produces 3x greater retention than re-reading notes.', time: '2d ago', type: 'tip' },
    { id: 'tip-5', title: 'Q3 Academic Target Check', desc: '6 weeks remaining in Q3 syllabus calendar.', time: '3d ago', type: 'info' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#F6F1E8]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-[#E9E1D2]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: User Avatar & Greeting */}
          <div
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="View Student Profile"
          >
            <div className="w-10 h-10 rounded-full bg-[#1E3F35] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              {student.avatarInitials}
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-medium text-[#687972]">
                Good Evening
              </span>
              <span className="block text-sm font-bold text-[#182B24] truncate max-w-[140px] sm:max-w-xs group-hover:text-[#1E3F35] transition-colors">
                {student.name}
              </span>
            </div>
          </div>

          {/* Right: Functional Action Icons matching screenshot */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compass / Syllabus shortcut */}
            <button
              onClick={() => setCurrentView('syllabus')}
              aria-label="Explore Syllabus"
              className="w-9 h-9 rounded-full bg-[#E5ECE7] hover:bg-[#D7E3DA] text-[#1E3F35] flex items-center justify-center transition-colors cursor-pointer"
              title="Explore Syllabus & Topics"
            >
              <Compass className="w-5 h-5" />
            </button>

            {/* Revise Me Soon Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Revise Me Soon Alerts"
                className="w-9 h-9 rounded-full bg-white border border-[#E4DBD0] hover:bg-[#FAF7F2] text-[#475751] flex items-center justify-center transition-colors cursor-pointer relative"
                title="Revise Me Soon · Upcoming Test Alerts"
              >
                <ReviseMeSoonIcon className="w-4.5 h-4.5 text-[#1E3F35]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B91C1C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalNotifs}
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E6DDCE] p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
                    <span className="text-xs font-bold text-[#1C2E27] tracking-wider uppercase flex items-center gap-1.5">
                      <ReviseMeSoonIcon className="w-4 h-4 text-[#B91C1C]" />
                      Revise Me Soon ({totalNotifs})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#7B8B84] hover:text-[#1C2E27]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {/* Urgent Revision Notifications */}
                    {revisionNotifications.map((rn) => (
                      <div
                        key={rn.id}
                        onClick={() => markNotificationRead(rn.id)}
                        className={`p-2.5 rounded-xl border text-xs space-y-1.5 transition-colors cursor-pointer ${
                          !rn.read
                            ? 'bg-[#FFF9EE] border-[#F2DEBF]'
                            : 'bg-[#FAF8F5] border-[#EFE8DD]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[#182B24]">
                          <span className="flex items-center gap-1.5 text-[#8F5509]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                            {rn.testTitle}
                          </span>
                          <span className="text-[10px] text-[#8A9A93] font-normal">{rn.timestamp}</span>
                        </div>
                        <p className="text-[#475750] text-[11px] leading-relaxed">{rn.message}</p>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[#92550A]">
                            {rn.daysLeft} days to exam
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationRead(rn.id);
                              setShowNotifications(false);
                              startRevisionForTopic(rn.topicId, 15);
                            }}
                            className="px-2.5 py-1 bg-[#1E3F35] text-white hover:bg-[#152E27] rounded-lg text-[10px] font-bold"
                          >
                            Revise Now
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* General Academic Tips */}
                    {academicTips.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-[#182B24]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#8A9A93] font-normal">{n.time}</span>
                        </div>
                        <p className="text-[#596962] text-[11px] leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#F0EAE0] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentView('revision');
                      }}
                      className="text-xs font-bold text-[#1E3F35] hover:underline"
                    >
                      Open Revision Hub →
                    </button>
                    <span className="text-[10px] text-[#8A9A93]">Auto-reminders enabled</span>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Coin Pill from screenshot: 2,03,201 */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6ECCF]/80 border border-[#E9DCB8] rounded-full text-xs font-semibold text-[#8B6114] shadow-2xs select-none"
              title="Fictional Demo Points earned from completed learning checks"
            >
              <span>🪙</span>
              <span className="tabular-nums font-mono">2,03,201</span>
            </div>

            {/* Sun indicator / Aesthetic touch */}
            <div
              className="w-9 h-9 rounded-full bg-[#FAF3DE] text-[#D97706] flex items-center justify-center select-none"
              title="Calm Daytime Theme"
            >
              <Sun className="w-4 h-4" />
            </div>

            {/* Quick Reset Demo Data Action */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5EFE6] border border-[#E2D8C9] text-xs font-medium text-[#4B5C55] rounded-xl transition-colors cursor-pointer"
              title="Reset all demo data to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {notificationMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#1E3F35] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#8CE2BA]" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Student Profile Modal */}
      {showProfileModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#E6DCCE] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1E3F35] text-white flex items-center justify-center text-lg font-bold">
                  {student.avatarInitials}
                </div>
                <div>
                  <h3 id="student-profile-title" className="font-bold text-[#182B24]">{student.name}</h3>
                  <p className="text-xs text-[#687871]">{student.gradeLevel}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#7F9089] hover:text-[#182B24] p-1 rounded-full hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#EDE5D6]">
                <span className="text-[#75867F] block">Curriculum Term</span>
                <span className="font-bold text-[#182B24] text-sm mt-0.5 block">{student.currentQuarter} ({student.qWeeksRemaining} weeks left)</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#EDE5D6]">
                <span className="text-[#75867F] block">Weekly Meaningful Target</span>
                <span className="font-bold text-[#182B24] text-sm mt-0.5 block">{student.weeklyTargetSessions} sessions</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#EDE5D6]">
                <span className="text-[#75867F] block">Focus Pacing Target</span>
                <span className="font-bold text-[#182B24] text-sm mt-0.5 block">15 – 25 min/session</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#EDE5D6]">
                <span className="text-[#75867F] block">Learning Signal</span>
                <span className="font-bold text-[#1E3F35] text-sm mt-0.5 block">Verified by Quiz</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowResetConfirm(true);
                }}
                className="text-xs text-[#991B1B] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-[#1E3F35] text-white text-xs font-semibold rounded-xl hover:bg-[#152E27]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-demo-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[#E9E1D2] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 id="reset-demo-title" className="font-bold text-[#182B24] text-base">Reset Prototype Data?</h4>
              <p className="text-xs text-[#5D6F68] mt-1 leading-relaxed">
                This will reset your local demo data back to the clean initial benchmark state with fresh sessions and quiz questions.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#5D6F68] hover:text-[#182B24]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-[#1E3F35] text-white text-xs font-semibold rounded-xl hover:bg-[#152E27] transition-colors"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
