import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  TrendingUp,
  Briefcase,
  AlertOctagon,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  X,
  RotateCcw,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Info,
  Globe,
  Cpu,
  Award,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  Search,
  BookMarked,
  Layers,
  Check,
  Building,
  ArrowRight
} from "lucide-react";
import { CHART_DATA, EVENTS, QUIZ_QUESTIONS, MarkerEvent } from "./data";

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"baseline" | "events">("baseline");
  
  // Chart style toggle: 'line' vs 'area'
  const [chartStyle, setChartStyle] = useState<"line" | "area">("line");
  
  // Audio toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // States for active event (Modal)
  const [selectedEvent, setSelectedEvent] = useState<MarkerEvent | null>(null);
  
  // Interactive Hover values for raw data tracing
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);

  // Event category matching inside Tab 2
  const [eventFilter, setEventFilter] = useState<"all" | "red" | "green">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  // Dynamic Learning Walkthrough Steps
  // 0: Welcome overview, 1: Baseline inspection & reading, 2: Interactive Decoupling Quiz, 3: Explore Event Map
  const [lessonProgress, setLessonProgress] = useState(0);

  // Read checklist completed count
  const [readEventIds, setReadEventIds] = useState<Set<string>>(new Set());

  // Refs for audio context (lazy initialized)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Simple Web Audio API Synthesizer for premium tactile feedback
  const playSoundEffect = (type: "correct" | "incorrect" | "click" | "warning" | "success" | "transition") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "correct") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "incorrect") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.setValueAtTime(147, now + 0.1); // D3
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "warning") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "transition") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "success") {
        // G-Major Arpeggio
        osc.type = "sine";
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(493.88, now + 0.08);
        osc.frequency.setValueAtTime(587.33, now + 0.16);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Web Audio failure:", e);
    }
  };

  // Dimension scaling constants for responsive standard SVG viewport (1000 x 500)
  const svgWidth = 1000;
  const svgHeight = 500;
  const paddingLeft = 60;
  const paddingRight = 950;
  const paddingTop = 50;
  const paddingBottom = 420;

  // Coordinate mapping computations
  const getX = (index: number) => {
    return paddingLeft + (index / (CHART_DATA.length - 1)) * (paddingRight - paddingLeft);
  };

  const getY = (val: number) => {
    const minVal = 0;
    const maxVal = 350;
    return paddingBottom - (val / (maxVal - minVal)) * (paddingBottom - paddingTop);
  };

  // Generate continuous SVG paths and coordinate lookups
  const sp500PointsPath = useMemo(() => {
    return "M " + CHART_DATA.map((d, index) => `${getX(index)},${getY(d.sp500)}`).join(" L ");
  }, []);

  const jobsPointsPath = useMemo(() => {
    return "M " + CHART_DATA.map((d, index) => `${getX(index)},${getY(d.jobs)}`).join(" L ");
  }, []);

  const sp500AreaPath = useMemo(() => {
    return `${sp500PointsPath} L ${getX(CHART_DATA.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;
  }, [sp500PointsPath]);

  const jobsAreaPath = useMemo(() => {
    return `${jobsPointsPath} L ${getX(CHART_DATA.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;
  }, [jobsPointsPath]);

  // Handle checking of details
  const markAsRead = (eventId: string) => {
    if (!readEventIds.has(eventId)) {
      const updated = new Set(readEventIds);
      updated.add(eventId);
      setReadEventIds(updated);
    }
  };

  // Filter Event markers on Tab 2
  const filteredEvents = useMemo(() => {
    return EVENTS.filter((evt) => {
      const typeMatches =
        eventFilter === "all" ||
        (eventFilter === "red" && evt.type === "red") ||
        (eventFilter === "green" && evt.type === "green");

      const searchMatches =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.originalLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase());

      return typeMatches && searchMatches;
    });
  }, [eventFilter, searchQuery]);

  // Dynamically position event shapes to resolve overlapping boxes safely on the SVG chart
  const positionedEvents = useMemo(() => {
    // Clone events to work with coordinates
    const list = EVENTS.map((evt) => {
      const markerX = getX(evt.xMonthIndex);
      const targetY = getY(evt.yVal);
      // Start with original offset position
      let markerY = targetY + evt.yOffset;
      return {
        ...evt,
        markerX,
        markerY,
        targetY
      };
    });

    // Run simple force relaxation pass to prevent overlaps
    // Each label is width 120 (starts at markerX - 60) and height 44 (starts at markerY - 22)
    for (let pass = 0; pass < 22; pass++) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          
          const a = list[i];
          const b = list[j];
          
          const dx = Math.abs(a.markerX - b.markerX);
          // If close horizontally (two boxes side-by-side or overlapping)
          if (dx < 125) {
            const dy = a.markerY - b.markerY;
            const minDy = 52; // Enforce minimum vertical separation between box centers
            
            if (Math.abs(dy) < minDy) {
              const overlap = minDy - Math.abs(dy);
              const push = overlap / 2;
              
              if (dy >= 0) {
                a.markerY += push;
                b.markerY -= push;
              } else {
                a.markerY -= push;
                b.markerY += push;
              }
              
              // Frame inside SVG safe bounds
              a.markerY = Math.max(50, Math.min(410, a.markerY));
              b.markerY = Math.max(50, Math.min(410, b.markerY));
            }
          }
        }
      }
    }

    return list.map((evt) => {
      // Determine vertical arrow connection direction based on relaxed position
      const arrowDir = evt.markerY < evt.targetY ? "down" : "up";
      return {
        ...evt,
        arrowDir
      };
    });
  }, []);

  // Quiz evaluation
  const score = useMemo(() => {
    let count = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) count++;
    });
    return count;
  }, [quizAnswers]);

  const calculateCertificatePercentage = () => {
    // We base standard course percentage on checklist tasks:
    // 1. Reading Intro (10%)
    // 2. Answering all quiz questions (30%)
    // 3. Exploring at least 5 events on the timeline (60%)
    let quizPoints = Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length ? 30 : (Object.keys(quizAnswers).length * 10);
    let eventProgress = Math.min(100, Math.round((readEventIds.size / 15) * 100));
    let finalPercentage = Math.round(10 + (quizPoints) + (eventProgress * 0.6));
    return Math.min(100, finalPercentage);
  };

  // Handle tab switcher
  const navigateTab = (tab: "baseline" | "events") => {
    playSoundEffect("transition");
    setActiveTab(tab);
    if (tab === "events" && lessonProgress < 3) {
      setLessonProgress(3);
    }
  };

  // Restart Course Core Action
  const handleResetModule = () => {
    playSoundEffect("click");
    setActiveTab("baseline");
    setQuizAnswers({});
    setQuizCompleted(false);
    setShowExplanation({});
    setLessonProgress(0);
    setReadEventIds(new Set());
    setSearchQuery("");
    setEventFilter("all");
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-indigo-100 font-sans antialiased text-slate-800">
      
      {/* PROFESSIONAL ELEARNING STAGE HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left: Branding & Module Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Layers className="w-5 h-5" id="header-icon" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">INDEXED MULTI-DECADE MODULE</span>
              <span className="text-xs text-slate-400 font-mono">ID: S5-FRED</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              S&P 500 versus New Jobs Decoupling
            </h1>
          </div>
        </div>

        {/* Middle/Right: Controls, Progress and Audio */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200">
            <span>Progress:</span>
            <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${calculateCertificatePercentage()}%` }}
              />
            </div>
            <span className="text-indigo-600 font-mono">{calculateCertificatePercentage()}%</span>
          </div>

          {/* Sound Controls */}
          <button
            onClick={() => {
              const active = !soundEnabled;
              setSoundEnabled(active);
              if (active) {
                setTimeout(() => playSoundEffect("click"), 100);
              }
            }}
            id="audio-toggle"
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled 
                ? "bg-slate-50 border-indigo-200 text-indigo-600 hover:bg-slate-100" 
                : "bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200"
            }`}
            title={soundEnabled ? "Mute interactive audio" : "Unmute interactive audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Module */}
          <button
            onClick={handleResetModule}
            id="restart-module"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-indigo-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Module
          </button>

        </div>
      </header>

      {/* CORE CONTENT LAYOUT: DUAL COLUMN WORKSPACE */}
      <main className="flex-1 max-w-[1700px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: GUIDED LESSON PORTAL (SPAN 4) */}
        {/* ========================================================= */}
        <section className="xl:col-span-4 flex flex-col gap-6" id="lesson-portal">
          
          {/* Interactive Learning Assistant Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center gap-2 justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-indigo-600" />
                <h2 className="font-semibold text-slate-900 text-sm tracking-tight">Active Lesson Guide</h2>
              </div>
              <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                Step {lessonProgress + 1} of 4
              </span>
            </div>

            {/* Stage Content */}
            <AnimatePresence mode="wait">
              {lessonProgress === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base">The Decoupling Mystery</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Welcome to this modern macroeconomic analytical workspace. Traditional economics asserts that 
                    <strong> Stock Market Value (corporate profits)</strong> and <strong> Employment (hiring strength)</strong> 
                    climb alongside each other as products are generated and purchased.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                    Analyze the baseline chart. From 2016 through 2019, they were tightly paired. However, in the late 2020s, a 
                    dramatic decoupling occurred where stocks reached record highs, while jobs remained depressed.
                  </p>
                  <button
                    onClick={() => {
                      playSoundEffect("click");
                      setLessonProgress(1);
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
                  >
                    Examine the Baseline Chart
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {lessonProgress === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base">Analyzing the Decades</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Hover your mouse over the blue line (<strong>S&P 500</strong>) and the orange line (<strong>New Jobs</strong>) to track how 
                    they fluctuated from Jun 2016. Both indices are standardized at <strong>100.0</strong> in June 2016.
                  </p>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Quiz Requirements</span>
                    <p className="text-xs text-slate-600 leading-normal">
                      Examine the separation between the lines in March 2020. Notice how the jobs index recovered, spiked, and then 
                      permanently entered into a structural downward drift after late 2022.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        playSoundEffect("click");
                        setLessonProgress(0);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm border border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        playSoundEffect("click");
                        setLessonProgress(2);
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm shadow-xs"
                    >
                      Unlock Decoupling Quiz
                    </button>
                  </div>
                </motion.div>
              )}

              {lessonProgress === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base">Unlock Core Quiz</h3>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Synthesize what you have observed. Answer these three core questions to unlock the complex 
                    <strong> Interactive Event Mapping (Slide 2 equivalent)</strong>.
                  </p>

                  {/* MINI QUIZ CONTAINER */}
                  <div className="flex flex-col gap-4 mt-1 border-t border-slate-100 pt-3">
                    {QUIZ_QUESTIONS.map((q, qidx) => {
                      const selectedOpt = quizAnswers[q.id];
                      const isCorrect = selectedOpt === q.correctIndex;
                      return (
                        <div key={q.id} className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <p className="text-xs font-bold text-slate-800 leading-snug">
                            {qidx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-1.5 mt-2">
                            {q.options.map((opt, oidx) => {
                              const isSelected = selectedOpt === oidx;
                              let btnClass = "bg-white hover:bg-slate-100 text-slate-700 border-slate-200";
                              if (isSelected) {
                                btnClass = oidx === q.correctIndex 
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                                  : "bg-rose-50 border-rose-400 text-rose-800";
                              }
                              return (
                                <button
                                  key={oidx}
                                  onClick={() => {
                                    if (quizCompleted) return;
                                    const updated = { ...quizAnswers, [q.id]: oidx };
                                    setQuizAnswers(updated);
                                    if (oidx === q.correctIndex) {
                                      playSoundEffect("correct");
                                    } else {
                                      playSoundEffect("incorrect");
                                    }
                                    setShowExplanation({ ...showExplanation, [q.id]: true });
                                    
                                    // check if all answered
                                    if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
                                      setQuizCompleted(true);
                                      playSoundEffect("success");
                                    }
                                  }}
                                  disabled={quizCompleted}
                                  className={`text-left text-xs p-2 rounded-lg border transition-all text-neutral-700 leading-relaxed font-medium ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {showExplanation[q.id] && (
                            <div className="mt-2 text-[11px] leading-relaxed text-indigo-900 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                              <strong>Takeaway:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {quizCompleted && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex flex-col gap-2 "
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Core Quiz Completed! Score: {score}/3</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Excellent analysis. You have unlocked the full event overlay map. Continue to review active geopolitical 
                        headwinds (Red) and technological triggers (Green).
                      </p>
                      <button
                        onClick={() => {
                          playSoundEffect("click");
                          setActiveTab("events");
                          setLessonProgress(3);
                        }}
                        className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-center transition-all shadow-xs flex items-center justify-center gap-1"
                      >
                        Explore Event Timeline (Slide 2)
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        playSoundEffect("click");
                        setLessonProgress(1);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl transition-colors text-xs border border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        playSoundEffect("click");
                        setActiveTab("events");
                        setLessonProgress(3);
                      }}
                      className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-3 rounded-xl transition-all text-xs border border-indigo-200"
                    >
                      Skip to Timeline Map
                    </button>
                  </div>
                </motion.div>
              )}

              {lessonProgress === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base">S&P 500 & Jobs Interactive Map</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You have unlocked the comprehensive interactive landscape. The 15 pivotal events represent both geopolitical headwinds <strong>(Red)</strong> and AI labor efficiency drivers <strong>(Green)</strong>.
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Progress Checklist</span>
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{readEventIds.size} / 15 explored</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${(readEventIds.size / 15) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Click the rectangular red and green markers explicitly placed on the timeline to analyze detailed educational case studies on this shift.
                    </p>
                  </div>

                  {readEventIds.size === 15 && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-indigo-900 text-white p-4 rounded-xl border border-indigo-950 flex flex-col gap-2 shadow-md relative overflow-hidden"
                    >
                      <div className="absolute right-[-10px] bottom-[-20px] text-indigo-800 opacity-20">
                        <Award className="w-24 h-24" />
                      </div>
                      <div className="flex items-center gap-2 font-bold z-10 text-amber-300">
                        <Sparkles className="w-4 h-4" />
                        <span>Curriculum Mastered!</span>
                      </div>
                      <p className="text-xs leading-relaxed z-10 text-indigo-100">
                        Outstanding task completion. You have successfully mapped every single core component showing the AI decoupling shift of S&P500 vs. physical employment!
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        playSoundEffect("click");
                        setLessonProgress(2);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl transition-colors text-xs border border-slate-200"
                    >
                      Back to Quiz
                    </button>
                    <button
                      onClick={handleResetModule}
                      className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold py-2 px-3 rounded-xl transition-colors text-xs border border-slate-200 hover:border-rose-200"
                    >
                      Restart Module
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* EVENTS FILTER PANEL (SLIDE 2 EVENT LIST DIRECTORY) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex-1 flex flex-col gap-4 overflow-hidden min-h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <h2 className="font-semibold text-slate-900 text-sm tracking-tight">Timeline Indices</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">15 Total Shifts</span>
            </div>

            {/* Event Category Filters */}
            <div className="flex flex-col gap-2.5">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => { playSoundEffect("click"); setEventFilter("all"); }}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                    eventFilter === "all" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  All Components
                </button>
                <button
                  onClick={() => { playSoundEffect("click"); setEventFilter("red"); }}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                    eventFilter === "red" ? "bg-rose-50 text-rose-700 shadow-xs border-b border-rose-100" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Headwinds (Red)
                </button>
                <button
                  onClick={() => { playSoundEffect("click"); setEventFilter("green"); }}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                    eventFilter === "green" ? "bg-emerald-50 text-emerald-700 shadow-xs border-b border-emerald-100" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Automation (Green)
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-hidden focus:border-indigo-400 focus:bg-white transition-all text-neutral-800"
                />
              </div>
            </div>

            {/* List of elements */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                {filteredEvents.map((evt) => {
                  const isRead = readEventIds.has(evt.id);
                  return (
                    <button
                      key={evt.id}
                      onClick={() => {
                        playSoundEffect("click");
                        setSelectedEvent(evt);
                        markAsRead(evt.id);
                      }}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 group relative overflow-hidden ${
                        evt.type === "red"
                          ? "bg-rose-50/20 hover:bg-rose-50/50 border-rose-100 hover:border-rose-200"
                          : "bg-emerald-50/20 hover:bg-emerald-50/50 border-emerald-100 hover:border-emerald-200"
                      }`}
                    >
                      <div className="mt-0.5">
                        {evt.type === "red" ? (
                          <div className="p-1 bg-red-100 text-red-700 rounded-lg">
                            <TrendingDown className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 truncate block group-hover:text-indigo-600 transition-colors">
                            {evt.title}
                          </span>
                          {isRead && (
                            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] px-1 py-0.2 rounded-sm uppercase font-mono tracking-tight shrink-0 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 text-emerald-600" /> Done
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold text-slate-400 font-mono bg-slate-100/60 border border-slate-200/50 px-1.5 py-0.2 rounded-md">
                            {evt.date}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {evt.originalLabel}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE VISUAL CANVAS GRAPH (SPAN 8) */}
        {/* ========================================================= */}
        <section className="xl:col-span-8 flex flex-col gap-4">
          
          {/* Main Visual Interface Board */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-6 shadow-xs flex flex-col gap-4">
            
            {/* Slide Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              
              {/* Slide Navigation Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => navigateTab("baseline")}
                  id="tab-baseline"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === "baseline"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Tab 1: Baseline Analysis
                </button>
                <button
                  onClick={() => navigateTab("events")}
                  id="tab-events"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === "events"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Tab 2: Interactive Events
                </button>
              </div>

              {/* Chart style toggle and Legends */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center bg-slate-200 p-0.5 rounded-md border border-slate-300 shrink-0">
                  <button
                    onClick={() => { playSoundEffect("click"); setChartStyle("line"); }}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-xs transition-all ${
                      chartStyle === "line"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Pure Line
                  </button>
                  <button
                    onClick={() => { playSoundEffect("click"); setChartStyle("area"); }}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-xs transition-all ${
                      chartStyle === "area"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Line + Area
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-1.5 bg-[#11537e] rounded-sm inline-block" />
                    <span className="text-slate-500">S&P500 INDEXED</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-1.5 bg-[#e65c00] rounded-sm inline-block" />
                    <span className="text-slate-500">NEW JOBS INDEXED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THE RESPONSIVE HIGH-FIDELITY COMPONENT CANVAS VIEW */}
            <div className="relative w-full overflow-hidden bg-slate-50 rounded-xl" style={{ border: "1px solid #e2e8f0" }}>
              
              {/* Inner Title Label faithfully matching Slide */}
              <div className="w-full text-center py-2 bg-white/70 backdrop-blur-xs border-b border-slate-200 flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
                  <span>S&P500 versus New Jobs (Source: FRED)</span>
                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.1 border border-indigo-200 rounded-sm">
                    {activeTab === "baseline" ? "Baseline Timeline" : "With Interactive Decoupling Overlays"}
                  </span>
                </h3>
              </div>

              {/* Main Vector SVG Graph */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px] relative">
                  <svg 
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                    className="w-full h-auto select-none"
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setHoveredPos(null);
                    }}
                    onMouseMove={(e) => {
                      const svgRect = e.currentTarget.getBoundingClientRect();
                      // Calculate client pointer position relative to SVG coordinates
                      const relativeX = ((e.clientX - svgRect.left) / svgRect.width) * svgWidth;
                      
                      // Map relativeX back to data point index
                      if (relativeX >= paddingLeft && relativeX <= paddingRight) {
                        const index = Math.round(
                          ((relativeX - paddingLeft) / (paddingRight - paddingLeft)) * (CHART_DATA.length - 1)
                        );
                        if (index >= 0 && index < CHART_DATA.length) {
                          setHoveredIndex(index);
                          
                          // Track position for tooltips
                          setHoveredPos({
                            x: getX(index),
                            // Tooltip can track the mid-point or top
                            y: getY(CHART_DATA[index].sp500)
                          });
                        }
                      }
                    }}
                  >
                    {/* Background Grid Ticks (Standard FRED layout matches) */}
                    {[0, 50, 100, 150, 200, 250, 300, 350].map((tick) => (
                      <g key={tick} className="opacity-90">
                        <line
                          x1={paddingLeft}
                          y1={getY(tick)}
                          x2={paddingRight}
                          y2={getY(tick)}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray={tick === 100 ? "0" : "2 2"}
                        />
                        <text
                          x={paddingLeft - 8}
                          y={getY(tick) + 4}
                          textAnchor="end"
                          className="font-mono text-[10px] text-slate-500 font-semibold"
                        >
                          {tick.toFixed(1)}
                        </text>
                      </g>
                    ))}

                    {/* Gradient Fill under curves */}
                    <defs>
                      <linearGradient id="sp500Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#11537e" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#11537e" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e65c00" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#e65c00" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {chartStyle === "area" && (
                      <>
                        <path d={sp500AreaPath} fill="url(#sp500Grad)" />
                        <path d={jobsAreaPath} fill="url(#jobsGrad)" />
                      </>
                    )}

                    {/* Left X axis boundary line */}
                    <line
                      x1={paddingLeft}
                      y1={paddingTop}
                      x2={paddingLeft}
                      y2={paddingBottom}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />

                    {/* Dynamic Date Markers and vertical ticks on the bottom */}
                    {CHART_DATA.map((d, index) => {
                      // We only render text ticks for every 3 months, aligning with FRED S&P versus New Jobs slide labels
                      const hasText = index % 3 === 0;
                      if (!hasText) return null;
                      return (
                        <g key={index}>
                          <line
                            x1={getX(index)}
                            y1={paddingBottom}
                            x2={getX(index)}
                            y2={paddingBottom + 5}
                            stroke="#cbd5e1"
                            strokeWidth="1.2"
                          />
                          <text
                            x={getX(index)}
                            y={paddingBottom + 16}
                            textAnchor="middle"
                            transform={`rotate(-90, ${getX(index)}, ${paddingBottom + 16})`}
                            className="font-mono text-[9px] text-slate-400 font-bold"
                          >
                            {d.date}
                          </text>
                        </g>
                      );
                    })}

                    {/* CORE S&P 500 PATH DRAWING (Dark Navy Line) */}
                    <path
                      d={sp500PointsPath}
                      fill="none"
                      stroke="#11537e"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />

                    {/* CORE NEW JOBS PATH DRAWING (Orange Line) */}
                    <path
                      d={jobsPointsPath}
                      fill="none"
                      stroke="#e65c00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />

                    {/* HOVER INTERACTIVITY GUIDE LINE */}
                    {hoveredIndex !== null && hoveredPos && (
                      <g>
                        <line
                          x1={hoveredPos.x}
                          y1={paddingTop}
                          x2={hoveredPos.x}
                          y2={paddingBottom}
                          stroke="#6366f1"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        {/* Hover points for tracking values */}
                        <circle
                          cx={hoveredPos.x}
                          cy={getY(CHART_DATA[hoveredIndex].sp500)}
                          r="5.5"
                          fill="#11537e"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle
                          cx={hoveredPos.x}
                          cy={getY(CHART_DATA[hoveredIndex].jobs)}
                          r="5.5"
                          fill="#e65c00"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </g>
                    )}

                    {/* ACTIVE EVENTS LAYOUT (RED AND GREEN SHAPES CO-ORDINATED ON CHART) */}
                    {activeTab === "events" &&
                      positionedEvents.map((evt) => {
                        const markerX = evt.markerX;
                        const markerY = evt.markerY;
                        const isRead = readEventIds.has(evt.id);

                        // Visual styling elements based on event headwinds vs automation driver
                        const isRed = evt.type === "red";
                        const baseColor = isRed ? "#dc2626" : "#16a34a"; // Red-600 vs Green-600
                        const hoverColor = isRed ? "#991b1b" : "#14532d"; 
                        const pulseClass = isRed ? "pulsing-red-arrow" : "pulsing-green-arrow";

                        // We render standard interactive blocks resembling Image-2 faithfully:
                        // Each event box has a downward pointing red arrow or upward pointing green arrow
                        return (
                          <g 
                            key={evt.id} 
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSoundEffect(isRed ? "warning" : "click");
                              setSelectedEvent(evt);
                              markAsRead(evt.id);
                            }}
                          >
                            {/* Connect Line from Box to the Data Point */}
                            <line
                              x1={markerX}
                              y1={evt.targetY}
                              x2={markerX}
                              y2={evt.arrowDir === "up" ? markerY + 30 : markerY + 10}
                              stroke={baseColor}
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                              className="opacity-70 group-hover:opacity-100 transition-opacity"
                            />

                            {/* Outer Group Container with Hover Zoom Effects */}
                            <g className="transition-transform duration-200 hover:scale-[1.03]">
                              
                              {/* Background Box/Container for text */}
                              <rect
                                x={markerX - 60}
                                y={markerY - 22}
                                width="120"
                                height="44"
                                rx="4"
                                fill={baseColor}
                                stroke="white"
                                strokeWidth="1.5"
                                className="shadow-md"
                              />

                              {/* Text Description within box */}
                              <foreignObject
                                x={markerX - 58}
                                y={markerY - 18}
                                width="116"
                                height="36"
                              >
                                <div className="text-white text-[8.5px] font-bold text-center leading-normal h-full flex items-center justify-center p-0.5 select-none overflow-hidden">
                                  {evt.originalLabel}
                                </div>
                              </foreignObject>

                              {/* Arrow Indicator pointing to exact data trend lines */}
                              {evt.arrowDir === "down" ? (
                                <g transform={`translate(${markerX - 10}, ${markerY + 22})`} className={pulseClass}>
                                  <polygon points="0,0 20,0 10,12" fill={baseColor} stroke="white" strokeWidth="1" />
                                </g>
                              ) : (
                                <g transform={`translate(${markerX - 10}, ${markerY - 33})`} className={pulseClass}>
                                  <polygon points="10,0 20,12 0,12" fill={baseColor} stroke="white" strokeWidth="1" />
                                </g>
                              )}

                              {/* High-contrast pulsing indicator circle around the exact line-intersect marker */}
                              <circle
                                cx={markerX}
                                cy={evt.targetY}
                                r="4"
                                fill={baseColor}
                                stroke="white"
                                strokeWidth="1.5"
                              />

                              {/* Completed Badge Indicator on Marker top-right */}
                              {isRead && (
                                <circle
                                  cx={markerX + 62}
                                  cy={markerY - 24}
                                  r="6"
                                  fill="#10b981"
                                  stroke="white"
                                  strokeWidth="1"
                                />
                              )}
                            </g>
                          </g>
                        );
                      })}
                  </svg>

                  {/* HOVER CURVE TOOLTIP POPUP (VIRTUAL FLOATING ELEMENT) */}
                  {hoveredIndex !== null && hoveredPos && (
                    <div
                      className="absolute z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg pointer-events-none transition-all duration-75 max-w-[240px]"
                      style={{
                        left: `${(hoveredPos.x / svgWidth) * 100}%`,
                        top: `${Math.max(10, (hoveredPos.y / svgHeight) * 100 - 32)}%`,
                        transform: hoveredIndex > CHART_DATA.length / 2 ? 'translateX(-105%)' : 'translateX(5%)'
                      }}
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-1.5 mb-2">
                        <span className="text-xs font-bold text-slate-800 font-mono">FRED Index Timeline</span>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded-md font-mono">
                          {CHART_DATA[hoveredIndex].date}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                        <div className="flex justify-between items-center gap-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#11537e]" /> S&P 500 Index:
                          </span>
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded-sm text-right">
                            {CHART_DATA[hoveredIndex].sp500.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#e65c00]" /> New Jobs Index:
                          </span>
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded-sm text-right">
                            {CHART_DATA[hoveredIndex].jobs.toFixed(1)}
                          </span>
                        </div>

                        <div className="border-t border-slate-100 pt-1.5 mt-1 flex justify-between items-center text-[11px] font-semibold">
                          <span className="text-slate-400">Decoupling Ratio:</span>
                          <span className="text-indigo-600 font-mono">
                            {(CHART_DATA[hoveredIndex].sp500 / CHART_DATA[hoveredIndex].jobs).toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Instructions Helper Bar */}
              <div className="w-full bg-white/70 backdrop-blur-xs border-t border-slate-200 px-4 py-3 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-3">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  Hovering crosshair outputs real-time normalized indexes starting at base 100.0 (June 2016).
                </span>
                
                {activeTab === "baseline" ? (
                  <button 
                    onClick={() => navigateTab("events")}
                    className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-0.5 border border-indigo-100 hover:border-indigo-350 bg-indigo-50 px-2 py-1 rounded-sm"
                  >
                    View Marker Event Timeline
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="font-semibold text-indigo-600 font-mono">
                    Slide 2 Map unlocked. Click markers to inspect.
                  </span>
                )}
              </div>

            </div>

            {/* CURRICULUM HIGHLIGHTS & KEY PERSPECTIVES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3">
                <div className="mt-0.5 text-indigo-600 bg-indigo-50 p-1.5 rounded-lg shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Macro Correlation Era</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    2016–2019 represented traditional balance: corporate values trended sideways/up and physical employment scaled linearly together.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3">
                <div className="mt-0.5 text-red-650 bg-red-55/70 p-1.5 rounded-lg shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Decoupling Mechanics</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    2020 launched massive fiscal stimulus, injecting enormous liquidity into tech assets while real physical workplaces suffered persistent quarantine freezes.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3">
                <div className="mt-0.5 text-emerald-600 bg-emerald-55/70 p-1.5 rounded-lg shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">AI Productivity Automation</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Mid 2023 onward shows cognitive automation (writing, programming, support) expanding profit margins without physical hiring expansions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* POPUP / MODAL INSPECTOR COMPONENT WINDOW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Dim Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="modal-backdrop"
            />

            {/* Inner Content Card */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col"
              id="modal-container"
            >
              {/* Colored Header Banner */}
              <div
                className={`p-1.5 flex justify-between items-center text-white text-xs font-mono font-bold tracking-wider uppercase px-4 ${
                  selectedEvent.type === "red" ? "bg-red-600" : "bg-emerald-600"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {selectedEvent.type === "red" ? <AlertOctagon className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                  {selectedEvent.type === "red" ? "System Headwind & Geopolitical Stress Case Study" : "Technology Integration & Labor Restructuring Shift"}
                </span>
                
                <span className="bg-white/20 px-2 py-0.5 rounded-sm">
                  DATE: {selectedEvent.date}
                </span>
              </div>

              {/* Main Modal Body */}
              <div className="p-6 md:p-8 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
                
                {/* Topic Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 font-mono uppercase">Original Slide Component label:</span>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                      {selectedEvent.title}
                    </h2>
                    <span className="inline-block mt-1 text-slate-700 font-semibold bg-slate-100 rounded-lg px-2.5 py-1 text-xs border border-slate-200">
                      Label: &quot;{selectedEvent.originalLabel}&quot;
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      playSoundEffect("click");
                      setSelectedEvent(null);
                    }}
                    id="close-modal"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Brief introduction summary box */}
                <div className="text-slate-700 text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 bg-indigo-50/50 py-2.5 pr-3 rounded-r-xl">
                  {selectedEvent.description}
                </div>

                {/* Extended Analysis Segment */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-650 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Macroeconomic Narrative & Analysis
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed leading-normal bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {selectedEvent.extendedAnalysis}
                  </p>
                </div>

                {/* Key takeaways highlighting Decoupling impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Core Takeaway
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
                      {selectedEvent.keyTakeaway}
                    </p>
                  </div>

                  <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-4">
                    <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1 text-indigo-700">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Critical Thinking Exercise
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5 italic">
                      &quot;{selectedEvent.reflectionQuestion}&quot;
                    </p>
                  </div>
                </div>

                {/* Interactive Reflection Form for Cognitive Engagement */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-slate-700 leading-normal block">
                    Synthesize: How does this specific shift explain the growing divide between corporate valuations (S&P 500) and middle-class physical jobs recruitment?
                  </label>
                  <textarea
                    placeholder="Reflect on the above question. (Your answer will be dynamically analyzed and logged to lock in step progress)..."
                    rows={2}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 placeholder:text-slate-400 text-slate-800"
                    onChange={(e) => {
                      if (e.target.value.length > 5) {
                        markAsRead(selectedEvent.id);
                      }
                    }}
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>*Type and complete thoughts to register completion progress.</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-tight">Active Analytics Log</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">
                  Case Study Checklist: {readEventIds.size}/15 Analyzed
                </span>
                
                <button
                  onClick={() => {
                    playSoundEffect("click");
                    setSelectedEvent(null);
                  }}
                  className={`text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors ${
                    selectedEvent.type === "red" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Close Case Study
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SYSTEM METADATA BLOCK */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 mt-auto text-center md:flex md:justify-between items-center text-xs text-slate-400 gap-4">
        <div>
          <span>Designed with high-contrast, accessibility compliance for corporate eLearning modules. S&P500 & Jobs are indexed relative to June 2016 (Jun-16 = 100.0).</span>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0 justify-center">
          <span className="font-mono text-[10px]">VER: 3.4.19</span>
          <span className="font-mono text-[10px]">DATA SOURCE: FRED</span>
        </div>
      </footer>

    </div>
  );
}
