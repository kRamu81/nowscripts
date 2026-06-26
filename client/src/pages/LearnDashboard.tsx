import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ChevronDown, ChevronRight, PlayCircle, FileText, 
  CheckSquare, Award, Clock, Target, List, Video, BookOpen, ChevronLeft, ChevronRight as IconNext, CheckCircle, X
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { MarkdownRenderer } from "../components/markdown/MarkdownRenderer";
import { courseData, LessonData, Subtopic, generateSlug } from "../utils/markdownParser";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";


export default function LearnDashboard() {
  const { categorySlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  // Find initial lesson based on URL params, or default to the very first one
  const getInitialLesson = () => {
    if (categorySlug && lessonSlug) {
      const found = courseData.flatMap(c => c.lessons).find(l => l.categorySlug === categorySlug && l.slug === lessonSlug);
      if (found) return found;
    }
    return courseData[0]?.lessons[0];
  };

  const [activeLesson, setActiveLesson] = useState<LessonData>(getInitialLesson());
  const [searchQuery, setSearchQuery] = useState("");
  
  // By default, expand the section of the active lesson
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [activeLesson?.category || courseData[0]?.sectionTitle]: true
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tocMenuOpen, setTocMenuOpen] = useState(false);
  
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    [activeLesson?.id]: true
  });
  
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [completedSubtopics, setCompletedSubtopics] = useState<Record<string, boolean>>({});
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Flatten lessons for next/prev navigation
  const allLessons = courseData.flatMap(section => section.lessons);
  const currentIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;

  // Sync URL when activeLesson changes
  useEffect(() => {
    if (activeLesson) {
      const newUrl = `/learn/${activeLesson.categorySlug}/${activeLesson.slug}`;
      if (window.location.pathname !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    }
  }, [activeLesson, navigate]);

  const filteredData = courseData.map(section => {
    const filteredLessons = section.lessons.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, lessons: filteredLessons };
  }).filter(section => section.lessons.length > 0);

  useEffect(() => {
    if (!activeLesson) return;
    setExpandedLessons(prev => ({ ...prev, [activeLesson.id]: true }));
    setExpandedSections(prev => ({ ...prev, [activeLesson.category]: true }));
    
    if (activeLesson.subtopics && activeLesson.subtopics.length > 0) {
      if (!window.location.hash) {
         setActiveSubtopicId(activeLesson.subtopics[0].id);
      }
    }
    
    if (scrollContainerRef.current) {
       scrollContainerRef.current.scrollTop = 0;
       setReadingProgress(0);
    }
  }, [activeLesson]);

  // Jump to hash on mount or when activeLesson changes
  useEffect(() => {
    if (!activeLesson) return;
    const hash = window.location.hash.replace('#', '');
    if (hash && activeLesson.subtopics && activeLesson.subtopics.some(s => s.id === hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el && scrollContainerRef.current) {
           el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [activeLesson]);

  // Intersection Observer
  useEffect(() => {
    if (!activeLesson) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const totalScroll = container.scrollHeight - container.clientHeight;
      const currentScroll = container.scrollTop;
      if (totalScroll > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      } else {
        setReadingProgress(100);
      }
    };

    container.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topMost = visibleEntries[0].target.id;
        
        setActiveSubtopicId(topMost);
        
        window.history.replaceState(null, "", `#${topMost}`);

        setCompletedSubtopics(prev => ({ ...prev, [topMost]: true }));
      }
    }, { 
      root: container, 
      rootMargin: '-10% 0px -60% 0px' 
    });

    if (activeLesson.subtopics) {
      activeLesson.subtopics.forEach(sub => {
        const el = document.getElementById(sub.id);
        if (el) observer.observe(el);
      });
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [activeLesson]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const toggleLesson = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const goToNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  const scrollToSubtopic = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!activeLesson) return <div className="p-8 text-center">Loading Content...</div>;

  // We slice the rawMarkdown to remove the frontmatter block at the top before rendering
  const contentToRender = activeLesson.rawMarkdown.replace(/^---[\s\S]+?---/, '').trim();

  return (
    <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col h-full overflow-hidden selection:bg-now-primary selection:text-black relative">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div 
          className="h-full bg-now-primary transition-all duration-300 ease-out" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden h-full mt-1 relative">
        
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#0F172A]/20 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className={`absolute lg:relative w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 flex flex-col z-50 h-full overflow-hidden transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BookOpen className="text-now-primary w-5 h-5" /> Course Contents
              </h2>
              <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input 
                type="text" 
                placeholder="Search lessons..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-now-primary transition-colors text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24">
            {filteredData.map((section, sIdx) => (
              <div key={sIdx} className="border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => toggleSection(section.sectionTitle)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-900 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{section.sectionTitle}</span>
                  {expandedSections[section.sectionTitle] ? (
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections[section.sectionTitle] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/50"
                    >
                      {section.lessons.map(lesson => {
                        const isLessonActive = activeLesson.id === lesson.id;
                        const isLessonExpanded = expandedLessons[lesson.id];

                        return (
                          <div key={lesson.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                            <div className="flex items-stretch">
                              <button
                                onClick={() => setActiveLesson(lesson)}
                                className={`flex-1 px-6 py-3 flex items-center gap-3 text-left transition-all ${
                                  isLessonActive 
                                    ? "bg-now-primary/5 text-slate-900 dark:text-slate-100" 
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100"
                                }`}
                              >
                                <div className="flex flex-col truncate flex-1">
                                  <span className="text-xs font-semibold uppercase tracking-wider mb-0.5 opacity-70">
                                    Lesson {lesson.order}
                                  </span>
                                  <span className={`text-sm truncate ${isLessonActive ? "font-bold" : "font-medium"}`}>
                                    {lesson.title.replace(/\*\*/g, '')}
                                  </span>
                                </div>
                              </button>
                              {lesson.subtopics && lesson.subtopics.length > 0 && (
                                <button 
                                  onClick={(e) => toggleLesson(lesson.id, e)}
                                  className={`px-4 flex items-center justify-center transition-colors border-l border-transparent ${isLessonActive ? "hover:bg-now-primary/10" : "hover:bg-slate-200 dark:bg-slate-800"}`}
                                >
                                  {isLessonExpanded ? (
                                    <ChevronDown className={`w-4 h-4 ${isLessonActive ? "text-now-primary" : "text-slate-500 dark:text-slate-400"}`} />
                                  ) : (
                                    <ChevronRight className={`w-4 h-4 ${isLessonActive ? "text-now-primary" : "text-slate-500 dark:text-slate-400"}`} />
                                  )}
                                </button>
                              )}
                            </div>

                            <AnimatePresence>
                              {isLessonExpanded && lesson.subtopics && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-white dark:bg-slate-900 dark:bg-slate-950"
                                >
                                  <div className="py-2">
                                    {lesson.subtopics.map(sub => {
                                      const isSubActive = isLessonActive && activeSubtopicId === sub.id;
                                      return (
                                        <button
                                          key={sub.id}
                                          onClick={() => {
                                            if (!isLessonActive) {
                                              setActiveLesson(lesson);
                                              setMobileMenuOpen(false);
                                              setTimeout(() => scrollToSubtopic(sub.id), 100);
                                            } else {
                                              scrollToSubtopic(sub.id);
                                              setMobileMenuOpen(false);
                                            }
                                          }}
                                          className={`w-full px-6 py-2 pl-12 flex items-center text-left text-sm transition-colors ${
                                            isSubActive
                                              ? "text-now-primary font-bold bg-now-primary/5 border-r-2 border-now-primary"
                                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:bg-slate-900"
                                          }`}
                                        >
                                          <div className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 transition-colors ${isSubActive ? "bg-now-primary" : "bg-slate-200 dark:bg-slate-800"}`} />
                                          <span className="truncate">{sub.title}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 dark:bg-slate-950 custom-scrollbar relative h-full flex justify-center w-full min-w-0"
        >
          <div className="w-full max-w-[960px] px-4 lg:px-8 xl:px-12 py-8 xl:py-12 pb-48 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center gap-2 font-medium"
                  >
                    <List className="w-5 h-5" /> Menu
                  </button>
                  {activeLesson.subtopics && activeLesson.subtopics.length > 0 && (
                    <button 
                      onClick={() => setTocMenuOpen(true)}
                      className="xl:hidden p-2 -mr-2 rounded-lg hover:bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center gap-2 font-medium"
                    >
                      <List className="w-5 h-5" /> TOC
                    </button>
                  )}
                </div>
                
                <div id={activeLesson.id} className="mb-16">
                  <MarkdownRenderer content={contentToRender} lessonData={activeLesson} />
                </div>

                {/* Bottom Navigation Cards */}
                <div className="mt-20 lg:mt-32 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {currentIndex > 0 ? (
                     <button 
                       onClick={goToPrevLesson}
                       className="group flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-now-primary dark:hover:border-now-primary transition-all text-left"
                     >
                       <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2">
                         <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Previous Lesson
                       </span>
                       <span className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-now-primary transition-colors line-clamp-2">
                         {allLessons[currentIndex - 1].title.replace(/\*\*/g, '')}
                       </span>
                     </button>
                   ) : <div />}
                   
                   {currentIndex < allLessons.length - 1 ? (
                     <button 
                       onClick={(e) => {
                          if (!isAuthenticated) {
                            openModal('login', () => {
                              setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }));
                              goToNextLesson();
                            });
                            return;
                          }
                          if(!completedLessons[activeLesson.id]) {
                             setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }));
                          }
                          goToNextLesson();
                       }}
                       className="group flex flex-col items-end p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-now-primary dark:hover:border-now-primary transition-all text-right shadow-sm hover:shadow-md"
                     >
                       <span className="text-sm font-bold text-now-primary flex items-center gap-2 mb-2">
                         Complete & Continue <IconNext className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </span>
                       <span className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-now-primary transition-colors line-clamp-2">
                         {allLessons[currentIndex + 1].title.replace(/\*\*/g, '')}
                       </span>
                     </button>
                   ) : <div />}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile TOC Overlay */}
        {tocMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#0F172A]/20 z-40 xl:hidden"
            onClick={() => setTocMenuOpen(false)}
          />
        )}
        <div className={`fixed right-0 top-0 xl:relative w-60 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 flex flex-col z-50 h-full overflow-hidden transition-transform duration-300 ${
          tocMenuOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"
        }`}>
          <div className="p-6 pb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">On This Page</h3>
            <button onClick={() => setTocMenuOpen(false)} className="xl:hidden p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-2 custom-scrollbar">
            {activeLesson.subtopics && activeLesson.subtopics.map(sub => (
               <button 
                 key={sub.id}
                 onClick={() => { scrollToSubtopic(sub.id); setTocMenuOpen(false); }}
                 className={`block text-left text-sm transition-all w-full border-l-2 pl-4 py-2 ${
                   activeSubtopicId === sub.id 
                     ? "border-now-primary text-now-primary font-bold bg-now-primary/5" 
                     : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:border-[#64748B]"
                 }`}
               >
                 {sub.title}
               </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Floating Pill Navigation (Mobile) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden flex bg-[#0F172A] text-white rounded-full shadow-xl overflow-hidden font-medium text-sm">
        <button 
          onClick={() => { setMobileMenuOpen(true); setTocMenuOpen(false); }}
          className="px-6 py-3 hover:bg-[#1E293B] transition-colors border-r border-[#334155] flex items-center gap-2"
        >
          <List size={16} /> Contents
        </button>
        <button 
          onClick={() => { setTocMenuOpen(true); setMobileMenuOpen(false); }}
          className="px-6 py-3 hover:bg-[#1E293B] transition-colors flex items-center gap-2"
        >
          <List size={16} /> TOC
        </button>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900 dark:bg-slate-800 text-white shadow-lg hover:bg-now-primary transition-all duration-300 transform ${
          readingProgress > 10 ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <ChevronLeft className="w-5 h-5 rotate-90" />
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94A3B8;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
