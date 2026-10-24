import React from 'react';
import { X, Clock, Check, ArrowRight, BookOpen, AlertCircle, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecommendedTask } from '../../types';

interface ChangeTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeTaskModal: React.FC<ChangeTaskModalProps> = ({ isOpen, onClose }) => {
  const { recommendedTasks, activeTaskId, setActiveTaskId, startFocusForTask } = useApp();

  if (!isOpen) return null;

  const handleSelectTask = (task: RecommendedTask, immediateStart = false) => {
    setActiveTaskId(task.id);
    if (immediateStart) {
      startFocusForTask(task);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-task-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-[#E8DFD1] space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#F0E9DC]">
          <div>
            <h2 id="change-task-title" className="text-lg font-bold text-[#192C25]">
              Choose Your Focus Task
            </h2>
            <p className="text-xs text-[#6B7B75] mt-0.5">
              Select what to work on today. Each task includes clear pedagogical justification.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#84958E] hover:text-[#192C25] p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendedTasks.map((task) => {
            const isSelected = task.id === activeTaskId;

            return (
              <div
                key={task.id}
                onClick={() => handleSelectTask(task, false)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#1E3F35] bg-[#F5F8F6] ring-1 ring-[#1E3F35]'
                    : 'border-[#EAE1D3] bg-[#FAF8F4] hover:bg-white hover:border-[#D9CFC1]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider">
                        {task.subjectTitle} · Chapter {task.sourceChapter}
                      </span>
                      <span className="text-xs text-[#8C9C95]">·</span>
                      <span className="text-[11px] text-[#63746D] flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes} min
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#182B24]">
                      {task.actionTitle}
                    </h3>

                    <p className="text-xs text-[#394B44] font-medium">
                      Topic: <span className="text-[#182B24]">{task.topicTitle}</span>
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#EAE3D6]/70 flex items-start gap-1.5 text-[11px] text-[#556760]">
                      <span className="font-semibold text-[#1E3F35] shrink-0">Why recommended:</span>
                      <span>{task.reason}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-[#1E3F35] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full border border-[#D5CCC0]" />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTask(task, true);
                      }}
                      className="mt-4 px-3 py-1.5 bg-[#1E3F35] text-white hover:bg-[#152E27] text-[11px] font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <span>Study Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#7B8B84]">
          <span>You can also choose any chapter directly from the Syllabus tab.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#DDD4C6] rounded-xl text-xs font-semibold text-[#485953] hover:bg-[#F6F1E8]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
