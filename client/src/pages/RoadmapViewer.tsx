import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowLeft, Play, X, Award } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { mockRoadmaps } from "../mockRoadmapData";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial set
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const colorMap: Record<string, string> = {
  blue: "#3b82f6",
  emerald: "#10b981",
  purple: "#a855f7",
  orange: "#f97316",
  cyan: "#06b6d4",
  pink: "#ec4899",
  indigo: "#6366f1",
  slate: "#64748b"
};

export default function RoadmapViewer() {
  const { slug } = useParams();
  const roadmap = mockRoadmaps.find(r => r.slug === slug);
  
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const { width } = useWindowSize();

  if (!roadmap) {
    return <div className="text-white text-center mt-20">Roadmap not found.</div>;
  }

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = LucideIcons[iconName];
    return Icon ? <Icon className="w-12 h-12 text-white" /> : <LucideIcons.BookOpen className="w-12 h-12 text-white" />;
  };

  const themeColorKey = roadmap.color.split('-')[1];
  const strokeColor = colorMap[themeColorKey] || "#3b82f6";

  let itemsPerRow = 3;
  if (width < 768) {
    itemsPerRow = 1;
  } else if (width < 1024) {
    itemsPerRow = 2;
  }

  const rows = [];
  for (let i = 0; i < roadmap.modules.length; i += itemsPerRow) {
    rows.push(roadmap.modules.slice(i, i + itemsPerRow));
  }

  return (
    <div className="bg-now-background min-h-screen text-white font-sans selection:bg-now-primary selection:text-black pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <Link to="/roadmaps" className="inline-flex items-center gap-2 text-now-muted hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
        </Link>
        
        {/* Banner Section */}
        <div className={`w-full rounded-3xl bg-gradient-to-br ${roadmap.color} p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl`}>
           <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 transform scale-150 pointer-events-none">
             {getIcon(roadmap.iconName || "BookOpen")}
           </div>

           <div className="relative z-10">
              <div className="p-4 bg-black/20 rounded-2xl backdrop-blur-sm inline-block mb-6">
                {getIcon(roadmap.iconName || "BookOpen")}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">{roadmap.title}</h1>
              <p className="text-xl text-white/80 max-w-2xl mb-8">{roadmap.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                 <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center gap-2">
                    <span className="text-white/60">Modules:</span> {roadmap.modules.length}
                 </div>
                 <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center gap-2">
                    <span className="text-white/60">Duration:</span> {roadmap.estimatedDuration}
                 </div>
                 <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center gap-2">
                    <span className="text-white/60">Prerequisites:</span> {roadmap.prerequisites}
                 </div>
                 <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center gap-2">
                    <span className="text-white/60">Outcome:</span> {roadmap.certification}
                 </div>
              </div>
           </div>
        </div>

        {/* Learning Objectives Box */}
        <div className="max-w-4xl mx-auto mb-24 bg-now-card border border-gray-800 p-8 rounded-3xl text-center">
           <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <LucideIcons.Target className="w-6 h-6" style={{ color: strokeColor }} /> Learning Objectives
           </h3>
           <p className="text-now-muted leading-relaxed">{roadmap.learningObjectives}</p>
        </div>

        {/* Winding Snake Roadmap */}
        <div className="relative max-w-4xl mx-auto px-16 lg:px-20 mt-20">
          {rows.map((row, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            const isLastRow = rowIndex === rows.length - 1;

            return (
              <div 
                className="relative w-full h-[320px] flex items-center justify-around z-10" 
                key={rowIndex}
                style={{ flexDirection: isEvenRow ? 'row' : 'row-reverse' }}
              >
                {/* Horizontal connecting line */}
                <div 
                  className="absolute left-0 right-0 h-[8px] rounded-full z-0" 
                  style={{ top: 'calc(50% - 4px)', backgroundColor: strokeColor }} 
                />

                {/* U-Turn Connector */}
                {!isLastRow && (
                  <div 
                    className={`absolute w-16 h-[328px] border-t-[8px] border-b-[8px] z-0 ${isEvenRow ? 'left-full border-r-[8px]' : 'right-full border-l-[8px]'}`}
                    style={{ 
                      top: 'calc(50% - 4px)',
                      borderColor: strokeColor, 
                      borderTopRightRadius: isEvenRow ? '999px' : '0', 
                      borderBottomRightRadius: isEvenRow ? '999px' : '0',
                      borderTopLeftRadius: !isEvenRow ? '999px' : '0',
                      borderBottomLeftRadius: !isEvenRow ? '999px' : '0',
                    }} 
                  />
                )}

                {/* Row Items */}
                {row.map((mod, colIndex) => {
                  const globalIndex = rowIndex * itemsPerRow + colIndex;
                  const isTop = globalIndex % 2 === 0;
                  
                  return (
                    <motion.div 
                      key={mod.id} 
                      className="relative flex flex-col items-center flex-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                       {/* Node Circle */}
                       <div 
                         className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[6px] flex items-center justify-center text-xl font-black z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110 cursor-pointer`}
                         style={{ 
                           borderColor: strokeColor, 
                           color: mod.completed ? '#000' : strokeColor, 
                           backgroundColor: mod.completed ? strokeColor : '#0f172a' 
                         }}
                         onClick={() => setSelectedModule(mod)}
                       >
                         {mod.completed ? <CheckCircle2 className="w-8 h-8 text-black" /> : globalIndex + 1}
                       </div>
                       
                       {/* Content Card */}
                       <div 
                         className={`absolute w-40 md:w-56 p-4 md:p-5 rounded-2xl border border-gray-800 bg-now-card shadow-2xl cursor-pointer hover:border-gray-600 transition-all z-30 flex flex-col items-center text-center ${isTop ? 'bottom-[80px]' : 'top-[80px]'}`}
                         onClick={() => setSelectedModule(mod)}
                       >
                           <h3 className="text-sm md:text-base font-bold text-white mb-2 leading-tight line-clamp-2">{mod.title}</h3>
                           <p className="text-xs text-now-muted line-clamp-3 mb-3 hidden md:block">{mod.description}</p>
                           <div className="flex items-center text-[10px] md:text-xs font-semibold text-gray-400 bg-black/40 px-3 py-1.5 rounded-full">
                             ⏱ {mod.estimatedTime}
                           </div>
                       </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Certification Milestone */}
        {roadmap.certification && (
          <div className="relative flex justify-center mt-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#080d1e] to-[#0f172a] border-2 border-yellow-500/30 rounded-3xl p-8 text-center max-w-md w-full shadow-[0_0_30px_rgba(234,179,8,0.1)] relative z-10"
            >
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Milestone Reached</h2>
              <p className="text-now-muted mb-6">Complete this roadmap to unlock the <strong>{roadmap.certification}</strong> track.</p>
              <Link to="/certifications">
                <button className="px-6 py-3 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors rounded-full font-bold w-full border border-yellow-500/20">
                  View Certification Details
                </button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>

      {/* Module Details Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-now-card border border-gray-700 rounded-3xl p-8 shadow-2xl z-10"
            >
              <button onClick={() => setSelectedModule(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black/20 text-white rounded-xl backdrop-blur-sm" style={{ color: strokeColor }}>
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{selectedModule.title}</h2>
                  <span className="text-sm text-gray-400">{selectedModule.estimatedTime}</span>
                </div>
              </div>

              <p className="text-now-muted mb-8 leading-relaxed text-lg">{selectedModule.description}</p>

              <div className="space-y-4">
                <Link to={`/learn/${roadmap.slug}/${selectedModule.id.replace(/-/g, '')}`}>
                  <button className="w-full py-4 rounded-full font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors mb-4 block text-center">
                    View Study Materials
                  </button>
                </Link>
                <button className={`w-full py-4 rounded-full font-bold text-lg transition-all ${selectedModule.completed ? "bg-now-background text-gray-500 cursor-not-allowed border border-gray-800" : "bg-white text-black hover:bg-gray-200"}`}>
                  {selectedModule.completed ? "Completed" : "Mark as Complete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
