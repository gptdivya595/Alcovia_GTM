import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, RotateCcw, Award, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOPIC_QUIZ_QUESTIONS } from '../../data/demoData';
import { QuizQuestion } from '../../types';

export const LearningCheckView: React.FC = () => {
  const {
    focusConfig,
    topics,
    subjects,
    pendingQuizSession,
    learningCheckTopicId,
    submitQuizResults,
    setCurrentView,
    setIsMeaningfulInfoOpen,
  } = useApp();

  // Selected topic for the quiz
  const topicId = learningCheckTopicId || focusConfig.topicId;
  const currentTopic = topics.find((t) => t.id === topicId);
  const currentSubject = currentTopic ? subjects.find((s) => s.id === currentTopic.subjectId) : null;

  // Retrieve 3 questions or fallback
  const questions: QuizQuestion[] =
    TOPIC_QUIZ_QUESTIONS[topicId] || TOPIC_QUIZ_QUESTIONS['default'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, idx]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      // Completed all 3 questions
      setIsFinished(true);
      submitQuizResults(
        topicId,
        score + (selectedAnswer === currentQ.correctIndex ? 0 : 0),
        questions.length,
        answers,
        pendingQuizSession?.id
      );
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setAnswers([]);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-2xl mx-auto">
      {/* View Header with Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
              Learning Check
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F2EDE1] text-[#71827B]">
              Sample Educational Content · Demo Prototype
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            3 retrieval questions to verify conceptual comprehension and reinforce memory.
          </p>
        </div>

        <button
          onClick={() => setIsMeaningfulInfoOpen(true)}
          className="text-xs font-semibold text-[#1E3F35] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Why this signals learning</span>
        </button>
      </div>

      {/* Main Assessment Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E9E1D2] space-y-6">
        {/* Topic Context Kicker */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
          <div>
            <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider block">
              {currentSubject?.name || 'Curriculum'} · Topic Assessment
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#182B24] mt-0.5">
              {currentTopic?.title || 'Selected Study Topic'}
            </h2>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F4EFE6] text-[#4F6059] font-mono">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Finished State Screen */}
        {isFinished ? (
          <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-[#EBF2EE] text-[#1E3F35] flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-widest block">
                Assessment Completed
              </span>
              <h3 className="text-3xl font-extrabold text-[#182B24]">
                Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6C65] max-w-md mx-auto">
                {score === 3
                  ? 'Outstanding! You demonstrated complete conceptual mastery of this topic.'
                  : score === 2
                  ? 'Solid recall! You understand the key foundations with minor refinement needed.'
                  : 'Good effort! Review the explanations below and revisit this topic in your next 15-minute sprint.'}
              </p>
            </div>

            {/* Meaningful Session Confirmation Badge */}
            <div className="p-4 rounded-2xl bg-[#F6F8F6] border border-[#D7E6DC] text-left max-w-md mx-auto flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1E3F35] text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-[#8CE2BA]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1E3F35] block">
                  Meaningful Study Session Verified!
                </span>
                <p className="text-xs text-[#42544D] leading-relaxed">
                  Because you completed your focused study period and submitted this Learning Check, this session is officially recorded as a verified learning signal in your progress history.
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('progress')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Progress History</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="w-full sm:w-auto px-5 py-3 border border-[#D5CCC0] text-[#556760] text-xs font-semibold rounded-2xl hover:bg-[#FAF7F2] transition-colors"
              >
                Return to Home
              </button>

              <button
                onClick={handleRetryQuiz}
                className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-[#7E8F88] hover:text-[#182B24] flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question View */
          <div className="space-y-6">
            {/* Question Prompt */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#7C8D86] uppercase tracking-wider block">
                Question {currentIndex + 1}
              </span>
              <p className="text-base sm:text-lg font-bold text-[#182B24] leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let stateClasses = 'border-[#EAE1D3] bg-[#FAF8F4] hover:bg-white hover:border-[#D9CFC1] text-[#293B34]';

                if (hasAnswered) {
                  if (isCorrect) {
                    stateClasses = 'border-[#1E3F35] bg-[#EDF5F0] text-[#1E3F35] font-semibold';
                  } else if (isSelected && !isCorrect) {
                    stateClasses = 'border-[#B91C1C] bg-[#FDF2F2] text-[#B91C1C]';
                  } else {
                    stateClasses = 'border-[#EBE4D8] bg-[#FAF8F4] text-[#8C9C96] opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${stateClasses}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        hasAnswered && isCorrect
                          ? 'bg-[#1E3F35] text-white'
                          : hasAnswered && isSelected && !isCorrect
                          ? 'bg-[#B91C1C] text-white'
                          : isSelected
                          ? 'bg-[#1E3F35] text-white'
                          : 'border border-[#D7CDC0] text-[#6E7F78]'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[#1E3F35] shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#B91C1C] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanation Feedback Banner */}
            {hasAnswered && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                  selectedAnswer === currentQ.correctIndex
                    ? 'bg-[#EBF5EF] border-[#CDE5D6] text-[#1E3F35]'
                    : 'bg-[#FDF6EE] border-[#F0DFCD] text-[#784315]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {selectedAnswer === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#1E3F35]" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#B91C1C]" />
                      <span>Conceptual Clarification:</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed text-[#2C3E37]">
                  {currentQ.explanation}
                </p>
                <div className="pt-1 text-[11px] font-semibold text-[#1E3F35]">
                  💡 Takeaway: {currentQ.keyTakeaway}
                </div>
              </div>
            )}

            {/* Next / Submit Button */}
            {hasAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-[#1E3F35] hover:bg-[#152E27] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results & Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
