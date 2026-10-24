import React from 'react';
import { Home, BookOpen, CheckSquare, Sparkles, BarChart3 } from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: 'revision',
      label: 'Revise',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'syllabus',
      label: 'Study',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFD1] px-4 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive =
            currentView === item.id ||
            (item.id === 'progress' && currentView === 'analytics') ||
            (item.id === 'focus' && currentView === 'learning_check');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 relative cursor-pointer"
            >
              <div
                className={`transition-colors ${
                  isActive ? 'text-[#1E3F35]' : 'text-[#84958E]'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[11px] font-medium mt-0.5 ${
                  isActive ? 'text-[#1E3F35] font-bold' : 'text-[#84958E]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F35] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
