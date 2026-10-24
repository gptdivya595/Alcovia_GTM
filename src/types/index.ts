/**
 * Data structures and domain models for the Alcovia Student Study Companion.
 * Prototype educational models with local persistence.
 */

export type SubjectId = 'bio' | 'calc' | 'phys' | 'chem';

export interface Subject {
  id: SubjectId;
  name: string;
  code: string;
  color: string;
  totalChapters: number;
  completedChapters: number;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'completed';

export interface Topic {
  id: string;
  subjectId: SubjectId;
  chapterNumber: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  status: TopicStatus;
  masteryScore: number; // 0 - 100
  lastQuizScore?: number; // e.g. 3 out of 3 or 2 out of 3
  lastStudiedDate?: string;
  objectives: string[];
}

export interface RecommendedTask {
  id: string;
  topicId: string;
  subjectId: SubjectId;
  subjectTitle: string;
  topicTitle: string;
  actionTitle: string;
  reason: string;
  estimatedMinutes: number;
  recommendedDuration: 15 | 25 | 45;
  urgency: 'high' | 'recommended' | 'refresher';
  sourceChapter: number;
}

export interface StudySession {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  plannedMinutes: number;
  actualMinutes: number;
  status: 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  quizAttemptId?: string;
  isMeaningful: boolean; // Must have completed focus work and attempted learning check
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyTakeaway: string;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  sessionId?: string;
  score: number; // e.g. 3
  totalQuestions: number; // 3
  percentage: number;
  answers: number[]; // chosen indices
  completedAt: string;
}

export interface StudentProfile {
  name: string;
  avatarInitials: string;
  gradeLevel: string;
  weeklyTargetSessions: number;
  targetDailyMinutes: number;
  currentQuarter: string;
  qWeeksRemaining: number;
  tokenCount: number; // Displayed as demo coin count from screenshot: 2,03,201
}

export interface WeeklyPerformance {
  weekLabel: string;
  completedSessions: number;
  meaningfulSessions: number;
  targetSessions: number;
  totalMinutes: number;
  quizAccuracy: number;
}

export interface PlatformMetricItem {
  metric: string;
  observedValue: string;
  benchmarkTarget: string;
  status: 'critical' | 'observation' | 'prototype_target';
  hypothesis: string;
  solutionInPrototype: string;
}

export interface UpcomingTest {
  id: string;
  subjectId: SubjectId;
  subjectTitle: string;
  title: string;
  examDate: string;
  daysRemaining: number;
  topicsToRevise: string[]; // topic IDs
  weightPercentage: number;
  notificationsEnabled: boolean;
  reminderFrequency: 'daily' | '3_days_before' | '1_day_before';
  readinessScore: number; // 0 - 100
}

export interface RevisionItem {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectId: SubjectId;
  subjectTitle: string;
  testId: string;
  testTitle: string;
  daysUntilTest: number;
  lastRevisedDate?: string;
  retentionScore: number;
  isRevised: boolean;
  keyFormulas: string[];
  flashcardNotes: string;
  urgency: 'urgent' | 'moderate' | 'scheduled';
}

export interface RevisionNotification {
  id: string;
  testId: string;
  topicId: string;
  topicTitle: string;
  testTitle: string;
  daysLeft: number;
  message: string;
  timestamp: string;
  read: boolean;
}
