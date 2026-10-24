import React from 'react';
import { Home, Timer, BookOpen, BarChart3, HelpCircle, Lightbulb, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, setIsMeaningfulInfoOpen, sessions, quizAttempts } = useApp();

  const meaningfulSessionsCount = sessions.filter(s => s.isMeaningful).length;

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'focus',
      label: 'Focus Session',
      icon: <Timer className="w-5 h-5" />,
      badge: 'Timer',
    },
    {
      id: 'revision',
      label: 'Revision & Test Prep',
      icon: <Sparkles className="w-5 h-5" />,
      badge: 'Exam in 3d',
    },
    {
      id: 'syllabus',
      label: 'Syllabus & Quizzes',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: `${meaningfulSessionsCount}`,
    },
    {
      id: 'analytics',
      label: 'Product Problem Audit',
      icon: <Lightbulb className="w-5 h-5" />,
      badge: '2.15m Study',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#FAF7F2] border-r border-[#E8DFD1] min-h-[calc(100vh-65px)] p-4 justify-between select-none">
      <div className="space-y-6">
        {/* Brand Lockup */}
        <div className="px-3 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#1E3F35] text-white flex items-center justify-center font-bold text-base shadow-xs">
              A
            </div>
            <div>
              <span className="block text-sm font-bold text-[#182B24] tracking-tight">
                Alcovia Companion
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#798A83]">
                Education Prototype
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1E3F35] text-white shadow-xs'
                    : 'text-[#4A5D55] hover:bg-[#F0E9DC] hover:text-[#182B24]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-[#5F736A]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#EAE2D4] text-[#697A73]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Meaningful Session definition card */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7DECE] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1E3F35] tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3F35]" />
              Meaningful Sessions
            </span>
            <button
              onClick={() => setIsMeaningfulInfoOpen(true)}
              className="text-[#7A8B84] hover:text-[#1E3F35] p-0.5"
              title="What is a Meaningful Session?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#55675F] leading-relaxed">
            Must pair focused task time with a 3-question learning check. Screen open time alone is not counted.
          </p>
          <button
            onClick={() => setIsMeaningfulInfoOpen(true)}
            className="w-full text-left text-[11px] font-semibold text-[#1E3F35] hover:underline pt-0.5 block"
          >
            Read pedagogical definition →
          </button>
        </div>

        <div className="px-3 text-[11px] text-[#8C9C95] flex items-center justify-between">
          <span>Local Demo Prototype</span>
          <span className="font-mono">v1.2</span>
        </div>
      </div>
    </aside>
  );
};
