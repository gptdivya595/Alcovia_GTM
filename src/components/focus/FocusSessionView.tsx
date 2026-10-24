import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, CheckCircle2, ArrowRight, AlertTriangle, BookOpen, Clock, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FocusSessionView: React.FC = () => {
  const {
    focusConfig,
    setFocusConfig,
    topics,
    subjects,
    completeFocusSession,
    cancelFocusSession,
    setCurrentView,
  } = useApp();

  const [durationMinutes, setDurationMinutes] = useState<15 | 25 | 45>(
    (focusConfig.plannedMinutes as 15 | 25 | 45) || 25
  );

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);

  // Web Audio Context reference for gentle white/brown noise
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Synchronize when durationMinutes changes prior to start
  useEffect(() => {
    if (!hasStarted) {
      setTimeLeftSeconds(durationMinutes * 60);
      setElapsedSeconds(0);
      setFocusConfig({
        ...focusConfig,
        plannedMinutes: durationMinutes,
      });
    }
  }, [durationMinutes, hasStarted]);

  // Main countdown ticker
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNaturalCompletion();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSeconds]);

  // Start sound when audioEnabled and isRunning
  const toggleAmbientSound = () => {
    if (!audioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate gentle soothing noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise filter
          lastOut = data[i];
          data[i] *= 0.15; // Soft volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        noiseNodeRef.current = noise;
        setAudioEnabled(true);
      } catch (e) {
        console.warn('Audio synthesis not supported or blocked:', e);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      setAudioEnabled(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Natural completion when countdown hits zero
  const handleNaturalCompletion = () => {
    setIsRunning(false);
    setIsCompleted(true);
    const actualMins = Math.max(1, Math.round(durationMinutes));
    const session = completeFocusSession(durationMinutes, actualMins, focusConfig.topicId, false);
    setCompletedSessionId(session.id);
  };

  // Student clicks "Finish Early"
  const handleFinishEarly = () => {
    setIsRunning(false);
    setIsCompleted(true);
    const actualMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const session = completeFocusSession(durationMinutes, actualMins, focusConfig.topicId, false);
    setCompletedSessionId(session.id);
  };

  // Start / Pause toggles
  const handleStartTimer = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResumeTimer = () => {
    setIsRunning(true);
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = durationMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeftSeconds) / totalSeconds : 0;
  const strokeDashoffset = 377 - 377 * progressRatio;

  // Selected topic details
  const currentTopic = topics.find((t) => t.id === focusConfig.topicId);

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-2xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B24] tracking-tight">
            Focus Session
          </h1>
          <p className="text-xs sm:text-sm text-[#61726B] mt-0.5">
            Calm, single-task immersion. No notifications, no pressure.
          </p>
        </div>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleAmbientSound}
          className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            audioEnabled
              ? 'bg-[#EBF2EE] border-[#1E3F35] text-[#1E3F35]'
              : 'bg-white border-[#E4DBD0] text-[#60716A] hover:bg-[#FAF7F2]'
          }`}
          title="Gentle synthesized focus sound"
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{audioEnabled ? 'Focus Sound On' : 'Ambient Sound'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E9E1D2] space-y-6">
        {/* Topic Title Banner */}
        <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EBE2D4] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1E3F35] uppercase tracking-wider">
              {focusConfig.subjectTitle}
            </span>
            <span className="text-xs text-[#70807A]">
              Estimated: {durationMinutes} min
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#182B24]">
            {focusConfig.topicTitle}
          </h2>
          {currentTopic?.objectives && currentTopic.objectives.length > 0 && (
            <p className="text-xs text-[#52645D] pt-1">
              🎯 <strong>Key Objective:</strong> {currentTopic.objectives[0]}
            </p>
          )}
        </div>

        {/* Completed State View */}
        {isCompleted ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#EAF2ED] text-[#1E3F35] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-[#182B24]">
                Focus Session Completed!
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6E66] max-w-md mx-auto">
                You logged <strong className="text-[#182B24]">{Math.max(1, Math.round(elapsedSeconds / 60))} actual focused minutes</strong> on{' '}
                <span className="text-[#1E3F35] font-semibold">{focusConfig.topicTitle}</span>.
              </p>
            </div>

            {/* Next Step Callout: Take Learning Check */}
            <div className="p-4 rounded-2xl bg-[#F6F2E9] border border-[#E6DCCE] text-left max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold text-[#1E3F35] uppercase tracking-wider block">
                Next: Verify Your Comprehension
              </span>
              <p className="text-xs text-[#475851] leading-relaxed">
                Take the 3-question Learning Check now to cement what you just learned and verify this as a <strong>Meaningful Study Session</strong>.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  const topicId = focusConfig.topicId;
                  const sessId = completedSessionId || undefined;
                  setCurrentView('learning_check');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#1E3F35] hover:bg-[#152E27] text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Take 3-Question Learning Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="w-full sm:w-auto px-5 py-3 border border-[#DCD3C4] text-[#4F605A] text-xs font-semibold rounded-2xl hover:bg-[#F8F5EE] transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Active Timer & Controls */
          <div className="space-y-8">
            {/* Duration Selector Tabs (15, 25, 45 minutes) */}
            {!hasStarted && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#6D7D76] uppercase tracking-wider block text-center">
                  Select Focus Duration
                </span>
                <div className="flex items-center justify-center gap-2 p-1 bg-[#F4EFE6] rounded-2xl max-w-sm mx-auto">
                  {([15, 25, 45] as const).map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDurationMinutes(mins)}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        durationMinutes === mins
                          ? 'bg-[#1E3F35] text-white shadow-xs'
                          : 'text-[#5A6C65] hover:text-[#182B24]'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Circular Timer Display */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                {/* SVG Dial */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    className="stroke-[#EFE8DD]"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    className="stroke-[#1E3F35] transition-all duration-300"
                    strokeWidth="6"
                    strokeDasharray="376.99"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Time Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl sm:text-6xl font-extrabold text-[#182B24] tracking-tight tabular-nums font-mono">
                    {formatTime(timeLeftSeconds)}
                  </span>

                  <span className="text-xs font-semibold text-[#6E8078] mt-2">
                    {isRunning
                      ? 'Deep Focus in Progress'
                      : hasStarted
                      ? 'Session Paused'
                      : 'Ready to Begin'}
                  </span>

                  {hasStarted && (
                    <span className="text-[11px] text-[#869790] mt-1 tabular-nums">
                      Elapsed: {formatTime(elapsedSeconds)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!hasStarted ? (
                <button
                  onClick={handleStartTimer}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1E3F35] hover:bg-[#152E27] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Timer</span>
                </button>
              ) : isRunning ? (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handlePauseTimer}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#EAE2D4] hover:bg-[#DDD3C3] text-[#243730] font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>

                  <button
                    onClick={handleFinishEarly}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#1E3F35] hover:bg-[#152E27] text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Finish early and record actual elapsed time"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish Early ({Math.max(1, Math.round(elapsedSeconds / 60))}m)</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleResumeTimer}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#1E3F35] hover:bg-[#152E27] text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume</span>
                  </button>

                  <button
                    onClick={handleFinishEarly}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#EBF2EE] hover:bg-[#DDEAE2] text-[#1E3F35] font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish Early</span>
                  </button>
                </div>
              )}

              {/* Exit without recording option */}
              <button
                onClick={() => setShowExitConfirm(true)}
                className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-[#82928B] hover:text-[#182B24] transition-colors"
              >
                Exit Session
              </button>
            </div>
          </div>
        )}

        {/* Focus Tip */}
        <div className="pt-4 border-t border-[#F0EAE0] flex items-center justify-between text-xs text-[#7B8B84]">
          <span>💡 Single-task focus: Formulate questions as you read.</span>
          <span className="text-[11px] font-mono">Actual elapsed time recorded</span>
        </div>
      </div>

      {/* Exit Without Recording Confirmation Modal */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-session-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#E9E1D2] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 id="exit-session-title" className="font-bold text-[#182B24] text-base">
                Exit this Focus Session?
              </h3>
              <p className="text-xs text-[#5D6F68] mt-1 leading-relaxed">
                You can exit without falsely recording a completed session. If you only checked in for a moment, no false progress will be logged.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  cancelFocusSession(Math.round(elapsedSeconds / 60), focusConfig.topicId, false);
                }}
                className="w-full py-2.5 px-4 bg-[#F5EFE6] hover:bg-[#ECE5D8] text-[#364841] text-xs font-bold rounded-xl transition-colors"
              >
                Discard & Exit (No Record Logged)
              </button>

              {elapsedSeconds > 60 && (
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    cancelFocusSession(Math.round(elapsedSeconds / 60), focusConfig.topicId, true);
                  }}
                  className="w-full py-2.5 px-4 border border-[#D5CCC0] text-[#556760] text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Save as Abandoned ({Math.round(elapsedSeconds / 60)} min)
                </button>
              )}

              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2 text-xs text-[#7B8C85] hover:text-[#182B24]"
              >
                Continue Studying
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
