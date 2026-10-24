import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  Topic,
  RecommendedTask,
  StudySession,
  QuizAttempt,
  WeeklyPerformance,
  UpcomingTest,
  RevisionItem,
  RevisionNotification,
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_RECOMMENDED_TASKS,
  INITIAL_SESSIONS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_WEEKLY_PERFORMANCE,
  INITIAL_UPCOMING_TESTS,
  INITIAL_REVISION_ITEMS,
  INITIAL_REVISION_NOTIFICATIONS,
} from '../data/demoData';

export type ActiveView = 'home' | 'focus' | 'learning_check' | 'syllabus' | 'progress' | 'analytics' | 'revision';

interface FocusConfig {
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  plannedMinutes: number;
}

interface AppContextType {
  student: StudentProfile;
  subjects: Subject[];
  topics: Topic[];
  recommendedTasks: RecommendedTask[];
  activeTaskId: string;
  activeTask: RecommendedTask;
  setActiveTaskId: (id: string) => void;
  sessions: StudySession[];
  quizAttempts: QuizAttempt[];
  weeklyPerformance: WeeklyPerformance[];
  upcomingTests: UpcomingTest[];
  revisionItems: RevisionItem[];
  revisionNotifications: RevisionNotification[];
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  focusConfig: FocusConfig;
  setFocusConfig: (config: FocusConfig) => void;
  pendingQuizSession: StudySession | null;
  setPendingQuizSession: (session: StudySession | null) => void;
  learningCheckTopicId: string | null;
  startFocusForTask: (task: RecommendedTask, duration?: 15 | 25 | 45) => void;
  startFocusForTopic: (topicId: string, duration?: 15 | 25 | 45) => void;
  startRevisionForTopic: (topicId: string, duration?: 15 | 25 | 45) => void;
  launchQuizForTopic: (topicId: string, sessionId?: string) => void;
  completeFocusSession: (plannedMinutes: number, actualMinutes: number, topicId: string, proceedToQuiz: boolean) => StudySession;
  cancelFocusSession: (actualMinutes: number, topicId: string, recordAsAbandoned: boolean) => void;
  submitQuizResults: (topicId: string, score: number, total: number, answers: number[], sessionId?: string) => QuizAttempt;
  toggleTestNotification: (testId: string) => void;
  markRevisionItemCompleted: (itemId: string) => void;
  markNotificationRead: (notifId: string) => void;
  dismissAllNotifications: () => void;
  triggerManualRevisionAlert: (testId: string) => void;
  resetAllDemoData: () => void;
  isMeaningfulInfoOpen: boolean;
  setIsMeaningfulInfoOpen: (open: boolean) => void;
  notificationMessage: string | null;
  setNotificationMessage: (msg: string | null) => void;
}

const STORAGE_KEY = 'alcovia_study_companion_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or default
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_student`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_topics`);
      return saved ? JSON.parse(saved) : INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  });

  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_RECOMMENDED_TASKS;
    } catch {
      return INITIAL_RECOMMENDED_TASKS;
    }
  });

  const [activeTaskId, setActiveTaskId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeTaskId`);
      return saved || INITIAL_RECOMMENDED_TASKS[0].id;
    } catch {
      return INITIAL_RECOMMENDED_TASKS[0].id;
    }
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quizAttempts`);
      return saved ? JSON.parse(saved) : INITIAL_QUIZ_ATTEMPTS;
    } catch {
      return INITIAL_QUIZ_ATTEMPTS;
    }
  });

  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_upcomingTests`);
      return saved ? JSON.parse(saved) : INITIAL_UPCOMING_TESTS;
    } catch {
      return INITIAL_UPCOMING_TESTS;
    }
  });

  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_revisionItems`);
      return saved ? JSON.parse(saved) : INITIAL_REVISION_ITEMS;
    } catch {
      return INITIAL_REVISION_ITEMS;
    }
  });

  const [revisionNotifications, setRevisionNotifications] = useState<RevisionNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_revisionNotifications`);
      return saved ? JSON.parse(saved) : INITIAL_REVISION_NOTIFICATIONS;
    } catch {
      return INITIAL_REVISION_NOTIFICATIONS;
    }
  });

  const [weeklyPerformance] = useState<WeeklyPerformance[]>(INITIAL_WEEKLY_PERFORMANCE);

  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [isMeaningfulInfoOpen, setIsMeaningfulInfoOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Active focus configuration
  const defaultTask = recommendedTasks.find(t => t.id === activeTaskId) || recommendedTasks[0];
  const [focusConfig, setFocusConfig] = useState<FocusConfig>({
    topicId: defaultTask.topicId,
    topicTitle: defaultTask.topicTitle,
    subjectTitle: defaultTask.subjectTitle,
    plannedMinutes: defaultTask.recommendedDuration,
  });

  // Track if a session just ended and is waiting for learning check
  const [pendingQuizSession, setPendingQuizSession] = useState<StudySession | null>(null);
  const [learningCheckTopicId, setLearningCheckTopicId] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_student`, JSON.stringify(student));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_topics`, JSON.stringify(topics));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(recommendedTasks));
      localStorage.setItem(`${STORAGE_KEY}_activeTaskId`, activeTaskId);
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY}_quizAttempts`, JSON.stringify(quizAttempts));
      localStorage.setItem(`${STORAGE_KEY}_upcomingTests`, JSON.stringify(upcomingTests));
      localStorage.setItem(`${STORAGE_KEY}_revisionItems`, JSON.stringify(revisionItems));
      localStorage.setItem(`${STORAGE_KEY}_revisionNotifications`, JSON.stringify(revisionNotifications));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [student, subjects, topics, recommendedTasks, activeTaskId, sessions, quizAttempts, upcomingTests, revisionItems, revisionNotifications]);

  // Derive current active task
  const activeTask = recommendedTasks.find(t => t.id === activeTaskId) || recommendedTasks[0];

  // Helper to start focus session with a task
  const startFocusForTask = (task: RecommendedTask, duration?: 15 | 25 | 45) => {
    setActiveTaskId(task.id);
    setFocusConfig({
      topicId: task.topicId,
      topicTitle: task.topicTitle,
      subjectTitle: task.subjectTitle,
      plannedMinutes: duration || task.recommendedDuration,
    });
    setPendingQuizSession(null);
    setCurrentView('focus');
  };

  // Helper to start focus session for any topic from syllabus
  const startFocusForTopic = (topicId: string, duration: 15 | 25 | 45 = 25) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const subject = subjects.find(s => s.id === topic.subjectId);
    setFocusConfig({
      topicId: topic.id,
      topicTitle: topic.title,
      subjectTitle: subject ? subject.name : 'Curriculum',
      plannedMinutes: duration,
    });
    setPendingQuizSession(null);
    setCurrentView('focus');
  };

  // Helper to directly launch quiz for a topic
  const launchQuizForTopic = (topicId: string, sessionId?: string) => {
    setLearningCheckTopicId(topicId);
    if (sessionId) {
      const matchSession = sessions.find(s => s.id === sessionId);
      if (matchSession) setPendingQuizSession(matchSession);
    } else {
      setPendingQuizSession(null);
    }
    setCurrentView('learning_check');
  };

  // Record completed session
  const completeFocusSession = (
    plannedMinutes: number,
    actualMinutes: number,
    topicId: string,
    proceedToQuiz: boolean
  ): StudySession => {
    const topic = topics.find(t => t.id === topicId);
    const subject = topic ? subjects.find(s => s.id === topic.subjectId) : null;

    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      topicId,
      topicTitle: topic ? topic.title : 'Study Focus Session',
      subjectTitle: subject ? subject.name : 'Curriculum',
      plannedMinutes,
      actualMinutes,
      status: 'completed',
      startedAt: new Date(Date.now() - actualMinutes * 60000).toISOString(),
      completedAt: new Date().toISOString(),
      isMeaningful: false, // will become true upon completing the Learning Check!
    };

    setSessions(prev => [newSession, ...prev]);

    // Update topic status to 'in_progress' if was 'not_started'
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId && t.status === 'not_started') {
          return { ...t, status: 'in_progress', lastStudiedDate: 'Just now' };
        }
        if (t.id === topicId) {
          return { ...t, lastStudiedDate: 'Just now' };
        }
        return t;
      })
    );

    if (proceedToQuiz) {
      setPendingQuizSession(newSession);
      setLearningCheckTopicId(topicId);
      setCurrentView('learning_check');
    }

    return newSession;
  };

  // Exit focus session without falsely marking complete
  const cancelFocusSession = (
    actualMinutes: number,
    topicId: string,
    recordAsAbandoned: boolean
  ) => {
    if (recordAsAbandoned && actualMinutes >= 1) {
      const topic = topics.find(t => t.id === topicId);
      const subject = topic ? subjects.find(s => s.id === topic.subjectId) : null;

      const abandonedSession: StudySession = {
        id: `sess-${Date.now()}`,
        topicId,
        topicTitle: topic ? topic.title : 'Study Focus Session',
        subjectTitle: subject ? subject.name : 'Curriculum',
        plannedMinutes: focusConfig.plannedMinutes,
        actualMinutes,
        status: 'abandoned',
        startedAt: new Date(Date.now() - actualMinutes * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        isMeaningful: false,
      };

      setSessions(prev => [abandonedSession, ...prev]);
    }
    // Return student to home view
    setPendingQuizSession(null);
    setCurrentView('home');
  };

  // Submit quiz results from Learning Check
  const submitQuizResults = (
    topicId: string,
    score: number,
    total: number,
    answers: number[],
    sessionId?: string
  ): QuizAttempt => {
    const topic = topics.find(t => t.id === topicId);
    const subject = topic ? subjects.find(s => s.id === topic.subjectId) : null;
    const percentage = Math.round((score / total) * 100);

    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now()}`,
      topicId,
      topicTitle: topic ? topic.title : 'Topic Assessment',
      subjectTitle: subject ? subject.name : 'Curriculum',
      sessionId,
      score,
      totalQuestions: total,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
    };

    setQuizAttempts(prev => [newAttempt, ...prev]);

    // If linked to an active session, mark that session as a "Meaningful Study Session"!
    if (sessionId) {
      setSessions(prev =>
        prev.map(s => {
          if (s.id === sessionId) {
            return {
              ...s,
              quizAttemptId: newAttempt.id,
              isMeaningful: true,
            };
          }
          return s;
        })
      );
    }

    // Update topic mastery and syllabus progress
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const newMastery = Math.min(100, Math.max(t.masteryScore, percentage));
          const newStatus: Topic['status'] =
            percentage >= 67
              ? 'completed'
              : t.status === 'not_started'
              ? 'in_progress'
              : t.status;

          return {
            ...t,
            masteryScore: newMastery,
            lastQuizScore: score,
            status: newStatus,
            lastStudiedDate: 'Just now',
          };
        }
        return t;
      })
    );

    // Update subjects completedChapters if a topic graduated to completed
    if (topic && percentage >= 67 && topic.status !== 'completed') {
      setSubjects(prev =>
        prev.map(s => {
          if (s.id === topic.subjectId) {
            return {
              ...s,
              completedChapters: Math.min(s.totalChapters, s.completedChapters + 1),
            };
          }
          return s;
        })
      );
    }

    setPendingQuizSession(null);
    return newAttempt;
  };

  // Start revision focus for a specific topic with optional 15m default
  const startRevisionForTopic = (topicId: string, duration: 15 | 25 | 45 = 15) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const subject = subjects.find(s => s.id === topic.subjectId);
    setFocusConfig({
      topicId: topic.id,
      topicTitle: `Revision: ${topic.title}`,
      subjectTitle: subject ? subject.name : 'Test Prep',
      plannedMinutes: duration,
    });
    setPendingQuizSession(null);
    setCurrentView('focus');
  };

  // Toggle notification preference for an upcoming test
  const toggleTestNotification = (testId: string) => {
    setUpcomingTests(prev =>
      prev.map(t => {
        if (t.id === testId) {
          const nextState = !t.notificationsEnabled;
          const msg = nextState
            ? `Notifications enabled for ${t.title}. You'll receive revision reminders before the exam.`
            : `Notifications paused for ${t.title}.`;
          setNotificationMessage(msg);
          setTimeout(() => setNotificationMessage(null), 3500);
          return { ...t, notificationsEnabled: nextState };
        }
        return t;
      })
    );
  };

  // Mark revision item completed/reviewed
  const markRevisionItemCompleted = (itemId: string) => {
    setRevisionItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const updated = !item.isRevised;
          setNotificationMessage(
            updated ? `Marked "${item.topicTitle}" as revised.` : `Unmarked "${item.topicTitle}".`
          );
          setTimeout(() => setNotificationMessage(null), 3000);
          return {
            ...item,
            isRevised: updated,
            lastRevisedDate: updated ? 'Just now' : item.lastRevisedDate,
          };
        }
        return item;
      })
    );
  };

  // Mark a specific notification as read
  const markNotificationRead = (notifId: string) => {
    setRevisionNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Dismiss / Mark all notifications as read
  const dismissAllNotifications = () => {
    setRevisionNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationMessage('All notifications marked as read.');
    setTimeout(() => setNotificationMessage(null), 2500);
  };

  // Trigger manual instant revision test notification (for demo simulation)
  const triggerManualRevisionAlert = (testId: string) => {
    const test = upcomingTests.find(t => t.id === testId) || upcomingTests[0];
    const newNotif: RevisionNotification = {
      id: `rnotif-${Date.now()}`,
      testId: test.id,
      topicId: test.topicsToRevise[0] || 'bio-1',
      topicTitle: 'High-Priority Exam Revision',
      testTitle: test.title,
      daysLeft: test.daysRemaining,
      message: `🔔 Exam Alert: ${test.title} is approaching in ${test.daysRemaining} days! Revise your high-priority topics now.`,
      timestamp: 'Just now',
      read: false,
    };

    setRevisionNotifications(prev => [newNotif, ...prev]);
    setNotificationMessage(`🔔 Test Reminder sent: ${test.title} in ${test.daysRemaining} days!`);
    setTimeout(() => setNotificationMessage(null), 4000);
  };

  // Reset all local demo data
  const resetAllDemoData = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_student`);
      localStorage.removeItem(`${STORAGE_KEY}_subjects`);
      localStorage.removeItem(`${STORAGE_KEY}_topics`);
      localStorage.removeItem(`${STORAGE_KEY}_tasks`);
      localStorage.removeItem(`${STORAGE_KEY}_activeTaskId`);
      localStorage.removeItem(`${STORAGE_KEY}_sessions`);
      localStorage.removeItem(`${STORAGE_KEY}_quizAttempts`);
      localStorage.removeItem(`${STORAGE_KEY}_upcomingTests`);
      localStorage.removeItem(`${STORAGE_KEY}_revisionItems`);
      localStorage.removeItem(`${STORAGE_KEY}_revisionNotifications`);
    } catch (e) {
      console.warn('Storage cleanup issue:', e);
    }

    setStudent(INITIAL_STUDENT);
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setRecommendedTasks(INITIAL_RECOMMENDED_TASKS);
    setActiveTaskId(INITIAL_RECOMMENDED_TASKS[0].id);
    setSessions(INITIAL_SESSIONS);
    setQuizAttempts(INITIAL_QUIZ_ATTEMPTS);
    setUpcomingTests(INITIAL_UPCOMING_TESTS);
    setRevisionItems(INITIAL_REVISION_ITEMS);
    setRevisionNotifications(INITIAL_REVISION_NOTIFICATIONS);
    setPendingQuizSession(null);
    setLearningCheckTopicId(null);
    setCurrentView('home');

    setNotificationMessage('Demo dataset restored to initial state.');
    setTimeout(() => setNotificationMessage(null), 3500);
  };

  return (
    <AppContext.Provider
      value={{
        student,
        subjects,
        topics,
        recommendedTasks,
        activeTaskId,
        activeTask,
        setActiveTaskId,
        sessions,
        quizAttempts,
        weeklyPerformance,
        upcomingTests,
        revisionItems,
        revisionNotifications,
        currentView,
        setCurrentView,
        focusConfig,
        setFocusConfig,
        pendingQuizSession,
        setPendingQuizSession,
        learningCheckTopicId,
        startFocusForTask,
        startFocusForTopic,
        startRevisionForTopic,
        launchQuizForTopic,
        completeFocusSession,
        cancelFocusSession,
        submitQuizResults,
        toggleTestNotification,
        markRevisionItemCompleted,
        markNotificationRead,
        dismissAllNotifications,
        triggerManualRevisionAlert,
        resetAllDemoData,
        isMeaningfulInfoOpen,
        setIsMeaningfulInfoOpen,
        notificationMessage,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
