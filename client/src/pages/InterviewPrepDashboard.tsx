import React, { useState, useEffect } from "react";
import { 
  Search, ChevronRight, CheckCircle, Bookmark, Star, ArrowLeft, ArrowRight,
  Target, BarChart3, AlertCircle, PlayCircle, RefreshCw, BookOpen, Menu, X, List
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- Types ---
interface Category {
  id: string;
  title: string;
  status: string;
  dataFile?: string;
  url?: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: { option_id: string; option_text: string }[];
  correct_options: string[];
  explanation: string;
}

interface Module {
  name: string;
  questions: Question[];
}

interface QuestionBank {
  title: string;
  modules: Module[];
}

interface Progress {
  completedQuestions: string[];
  bookmarkedQuestions: string[];
  importantQuestions: string[];
  lastViewedQuestion: string | null;
  progressPercentage: number;
}

// Ensure axios includes credentials
axios.defaults.withCredentials = true;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewPrepDashboard() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  
  const [progress, setProgress] = useState<Progress>({
    completedQuestions: [], bookmarkedQuestions: [], importantQuestions: [], lastViewedQuestion: null, progressPercentage: 0
  });

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mobile responsiveness states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questionPaletteOpen, setQuestionPaletteOpen] = useState(false);

  // Load index.json on mount
  useEffect(() => {
    fetch("/content/interview-prep/index.json")
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        let active = null;
        if (categoryId) {
          active = data.categories.find((c: Category) => c.id === categoryId);
        }
        if (!active && data.categories.length > 0) {
          active = data.categories[0];
          navigate(`/interview-prep/${active.id}`, { replace: true });
        }
        setActiveCategory(active || null);
      })
      .catch(err => {
        console.error("Failed to load categories", err);
        setLoading(false);
      });
  }, [categoryId, navigate]);

  // Load data.json & progress when category changes
  useEffect(() => {
    if (!activeCategory) return;

    if (activeCategory.status !== "active" || !activeCategory.dataFile) {
      setQuestionBank(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch JSON question bank
    fetch(activeCategory.dataFile)
      .then(res => res.json())
      .then(data => {
        setQuestionBank(data);
        return axios.get(`${API_BASE}/api/progress/interview-prep/${activeCategory.id}`);
      })
      .then(res => {
        const p = res.data;
        setProgress({
          completedQuestions: p.completedQuestions || [],
          bookmarkedQuestions: p.bookmarkedQuestions || [],
          importantQuestions: p.importantQuestions || [],
          lastViewedQuestion: p.lastViewedQuestion || null,
          progressPercentage: p.progressPercentage || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load question bank or progress", err);
        setLoading(false);
      });
  }, [activeCategory]);

  // Jump to last viewed question
  useEffect(() => {
    if (questionBank && progress.lastViewedQuestion) {
      let found = false;
      questionBank.modules.forEach((mod, mIdx) => {
        const qIdx = mod.questions.findIndex(q => q.id === progress.lastViewedQuestion);
        if (qIdx !== -1) {
          setActiveModuleIndex(mIdx);
          setActiveQuestionIndex(qIdx);
          found = true;
        }
      });
      if (!found) {
        setActiveModuleIndex(0);
        setActiveQuestionIndex(0);
      }
    } else if (questionBank) {
      setActiveModuleIndex(0);
      setActiveQuestionIndex(0);
    }
  }, [questionBank]);

  // Reset state on question change
  useEffect(() => {
    setSelectedOptions([]);
    setShowAnswer(false);
  }, [activeQuestionIndex, activeModuleIndex]);

  const activeModule = questionBank?.modules[activeModuleIndex];
  const activeQuestion = activeModule?.questions[activeQuestionIndex];

  const totalQuestions = questionBank?.modules.reduce((acc, m) => acc + m.questions.length, 0) || 0;
  
  const updateProgressBackend = async (updates: Partial<Progress>) => {
    try {
      await axios.post(`${API_BASE}/api/progress/interview-prep/${activeCategory?.id}/update`, updates);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOptionToggle = (optId: string) => {
    if (showAnswer) return; // Prevent changing answer after reveal
    if (activeQuestion?.question_type === "single") {
      setSelectedOptions([optId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]
      );
    }
  };

  const handleCheckAnswer = () => {
    if (!activeQuestion) return;
    setShowAnswer(true);

    const isCorrect = 
      activeQuestion.correct_options.length === selectedOptions.length &&
      activeQuestion.correct_options.every(opt => selectedOptions.includes(opt));

    if (isCorrect) {
      const newCompleted = [...new Set([...progress.completedQuestions, activeQuestion.id])];
      const newPercent = Math.round((newCompleted.length / totalQuestions) * 100);
      const newProgress = { 
        ...progress, 
        completedQuestions: newCompleted,
        progressPercentage: newPercent,
        lastViewedQuestion: activeQuestion.id
      };
      setProgress(newProgress);
      updateProgressBackend({ 
        completedQuestions: newCompleted, 
        progressPercentage: newPercent,
        lastViewedQuestion: activeQuestion.id
      });
    } else {
      updateProgressBackend({ lastViewedQuestion: activeQuestion.id });
    }
  };

  const handleToggleBookmark = () => {
    if (!activeQuestion) return;
    const isBookmarked = progress.bookmarkedQuestions.includes(activeQuestion.id);
    const newBookmarked = isBookmarked 
      ? progress.bookmarkedQuestions.filter(id => id !== activeQuestion.id)
      : [...progress.bookmarkedQuestions, activeQuestion.id];
    
    setProgress(prev => ({ ...prev, bookmarkedQuestions: newBookmarked }));
    updateProgressBackend({ bookmarkedQuestions: newBookmarked });
  };

  const handleToggleImportant = () => {
    if (!activeQuestion) return;
    const isImportant = progress.importantQuestions.includes(activeQuestion.id);
    const newImportant = isImportant 
      ? progress.importantQuestions.filter(id => id !== activeQuestion.id)
      : [...progress.importantQuestions, activeQuestion.id];
    
    setProgress(prev => ({ ...prev, importantQuestions: newImportant }));
    updateProgressBackend({ importantQuestions: newImportant });
  };

  const goToNext = () => {
    if (!activeModule) return;
    if (activeQuestionIndex < activeModule.questions.length - 1) {
      setActiveQuestionIndex(i => i + 1);
    } else if (activeModuleIndex < questionBank!.modules.length - 1) {
      setActiveModuleIndex(i => i + 1);
      setActiveQuestionIndex(0);
    }
  };

  const goToPrev = () => {
    if (!activeModule) return;
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(i => i - 1);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(i => i - 1);
      setActiveQuestionIndex(questionBank!.modules[activeModuleIndex - 1].questions.length - 1);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all your progress for this category?")) {
      try {
        await axios.post(`${API_BASE}/api/progress/interview-prep/${activeCategory?.id}/reset`);
        setProgress({ ...progress, completedQuestions: [], lastViewedQuestion: null, progressPercentage: 0 });
        setActiveModuleIndex(0);
        setActiveQuestionIndex(0);
        toast.success("Progress reset successfully.");
      } catch (e) {
        toast.error("Failed to reset progress.");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center dark:text-white">Loading Content...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex h-full overflow-hidden relative">
      
      {/* Mobile Overlays */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {questionPaletteOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setQuestionPaletteOpen(false)}
        />
      )}

      {/* Main Categories Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="text-now-primary w-5 h-5" /> Interview Prep
          </h2>
          <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.id}>
              <Link
                to={cat.url || `/interview-prep/${cat.id}`}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors border-l-4 ${
                  activeCategory?.id === cat.id 
                    ? "bg-now-primary/10 border-now-primary text-now-primary font-bold" 
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{cat.title}</span>
                {cat.status === "coming_soon" && cat.id !== "interview-experiences" && (
                  <span className="text-[10px] uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                )}
                {cat.id === "interview-experiences" && (
                   <span className="text-[10px] uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                     New Platform
                   </span>
                )}
              </Link>
              
              {/* Modules List for Active Category */}
              {activeCategory?.id === cat.id && questionBank && (
                <div className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                  {questionBank.modules.map((mod, mIdx) => (
                    <button
                      key={mIdx}
                        onClick={() => {
                        setActiveModuleIndex(mIdx);
                        setActiveQuestionIndex(0);
                        setMobileMenuOpen(false); // Close on selection (mobile)
                      }}
                      className={`w-full px-6 py-2.5 pl-10 text-sm text-left transition-colors flex items-center gap-2 ${
                        activeModuleIndex === mIdx
                          ? "text-now-primary font-bold bg-now-primary/5"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${activeModuleIndex === mIdx ? "bg-now-primary" : "bg-slate-300 dark:bg-slate-700"}`} />
                      <span className="truncate">{mod.name}</span>
                      <span className="ml-auto text-xs opacity-50">{mod.questions.length}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question Palette Sidebar (Right side, primarily for mobile overlay) */}
      <div className={`fixed inset-y-0 right-0 z-50 transform ${questionPaletteOpen ? "translate-x-0" : "translate-x-full"} lg:hidden w-80 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out`}>
         <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
               Question Palette
            </h2>
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => setQuestionPaletteOpen(false)}>
               <X className="w-5 h-5" />
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeModule?.questions.map((q, idx) => {
               const isCompleted = progress.completedQuestions.includes(q.id);
               return (
                 <button
                   key={q.id}
                   onClick={() => {
                     setActiveQuestionIndex(idx);
                     setQuestionPaletteOpen(false);
                   }}
                   className={`w-full p-3 mb-2 text-left text-sm rounded-lg border transition-colors flex items-center gap-3 ${
                     activeQuestionIndex === idx 
                       ? "bg-now-primary/10 border-now-primary text-now-primary font-bold"
                       : isCompleted
                         ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400"
                         : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-now-primary/50"
                   }`}
                 >
                   <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border ${
                     activeQuestionIndex === idx ? "bg-now-primary text-white border-now-primary" :
                     isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "border-slate-300 dark:border-slate-700 text-slate-500"
                   }`}>
                     {idx + 1}
                   </div>
                   <div className="truncate flex-1">
                     Question {idx + 1}
                   </div>
                 </button>
               );
            })}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-slate-950 relative">
        {activeCategory?.status === "coming_soon" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{activeCategory.title}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
              We're working hard to prepare this content. Stay tuned for updates!
            </p>
          </div>
        ) : questionBank ? (
          <>
            {/* Top Stats Bar */}
            <div className="px-4 lg:px-8 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-4 lg:gap-8 min-w-max">
                <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-200 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</div>
                  <div className="text-lg lg:text-xl font-bold">{totalQuestions}</div>
                </div>
                <div>
                  <div className="text-[10px] lg:text-xs text-emerald-500 uppercase tracking-wider font-semibold">Completed</div>
                  <div className="text-lg lg:text-xl font-bold text-emerald-600 dark:text-emerald-400">{progress.completedQuestions.length}</div>
                </div>
                <div>
                  <div className="text-[10px] lg:text-xs text-now-primary uppercase tracking-wider font-semibold">Progress</div>
                  <div className="text-lg lg:text-xl font-bold text-now-primary">{progress.progressPercentage}%</div>
                </div>
                <div className="flex gap-4 border-l border-slate-200 dark:border-slate-700 pl-4 lg:pl-8 ml-2">
                   <div className="flex flex-col items-center">
                      <Bookmark className="w-4 h-4 text-amber-500 mb-0.5 lg:mb-1" />
                      <span className="text-[10px] lg:text-xs font-medium">{progress.bookmarkedQuestions.length}</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <Star className="w-4 h-4 text-rose-500 mb-0.5 lg:mb-1" />
                      <span className="text-[10px] lg:text-xs font-medium">{progress.importantQuestions.length}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 min-w-max pl-4">
                 <button onClick={() => setQuestionPaletteOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <List className="w-4 h-4" /> Palette
                 </button>
                 <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" /> Reset
                 </button>
              </div>
            </div>

            {/* Question Viewer */}
            {activeQuestion && (
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                  
                  {/* Category & Module Header */}
                  <div className="flex justify-between items-start lg:items-center mb-6 lg:mb-8 flex-col lg:flex-row gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="text-now-primary truncate max-w-[120px] lg:max-w-none">{questionBank.title}</span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate max-w-[120px] lg:max-w-none">{activeModule?.name}</span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">Question {activeQuestionIndex + 1} of {activeModule?.questions.length}</span>
                    </div>

                    <div className="flex gap-2 self-end lg:self-auto">
                      <button onClick={handleToggleBookmark} className={`p-2 rounded-lg transition-colors ${progress.bookmarkedQuestions.includes(activeQuestion.id) ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"}`} title="Bookmark">
                        <Bookmark className="w-5 h-5" fill={progress.bookmarkedQuestions.includes(activeQuestion.id) ? "currentColor" : "none"} />
                      </button>
                      <button onClick={handleToggleImportant} className={`p-2 rounded-lg transition-colors ${progress.importantQuestions.includes(activeQuestion.id) ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"}`} title="Mark Important">
                        <Star className="w-5 h-5" fill={progress.importantQuestions.includes(activeQuestion.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 leading-snug whitespace-pre-wrap">
                    {activeQuestion.question_text}
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-10">
                    {activeQuestion.options.map(opt => {
                      const isSelected = selectedOptions.includes(opt.option_id);
                      const isCorrect = activeQuestion.correct_options.includes(opt.option_id);
                      
                      let optionClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-now-primary";
                      
                      if (showAnswer) {
                        if (isCorrect) optionClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100";
                        else if (isSelected && !isCorrect) optionClass = "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100";
                        else optionClass = "border-slate-200 dark:border-slate-800 opacity-50";
                      } else if (isSelected) {
                        optionClass = "border-now-primary bg-now-primary/5 text-now-primary";
                      }

                      return (
                        <button
                          key={opt.option_id}
                          onClick={() => handleOptionToggle(opt.option_id)}
                          className={`w-full min-h-[44px] text-left p-3 lg:p-4 rounded-xl border-2 flex items-start gap-3 lg:gap-4 transition-all ${optionClass}`}
                        >
                          <div className={`w-5 h-5 lg:w-6 lg:h-6 shrink-0 rounded ${activeQuestion.question_type === 'single' ? 'rounded-full' : 'rounded'} border-2 flex items-center justify-center ${
                             showAnswer && isCorrect ? "border-emerald-500 bg-emerald-500 text-white" :
                             showAnswer && isSelected && !isCorrect ? "border-rose-500 bg-rose-500 text-white" :
                             isSelected ? "border-now-primary bg-now-primary text-white" : "border-slate-300 dark:border-slate-600"
                          }`}>
                            {(showAnswer && isCorrect) || isSelected ? <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" /> : null}
                          </div>
                          <div className="flex-1 mt-0 lg:mt-0.5 text-sm lg:text-base whitespace-pre-wrap font-medium">
                            {opt.option_text}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {showAnswer && activeQuestion.explanation && (
                    <div className="mb-10 p-6 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Explanation
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                        {activeQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="flex flex-col-reverse lg:flex-row items-stretch lg:items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 lg:pt-8 pb-12 gap-4">
                    <button 
                      onClick={goToPrev}
                      disabled={activeModuleIndex === 0 && activeQuestionIndex === 0}
                      className="min-h-[44px] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" /> <span className="lg:inline">Previous</span>
                    </button>
                    
                    {!showAnswer ? (
                      <button 
                        onClick={handleCheckAnswer}
                        disabled={selectedOptions.length === 0}
                        className="min-h-[44px] px-10 py-3 rounded-xl font-bold bg-now-primary text-white hover:bg-now-accent shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button 
                        onClick={goToNext}
                        className="min-h-[44px] px-10 py-3 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        Next Question <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

    </div>
  );
}
