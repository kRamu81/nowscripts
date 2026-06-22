import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { mockRoadmaps } from "../mockRoadmapData";
import { useState, useEffect } from "react";

const getIcon = (iconName: string) => {
  // @ts-ignore
  const Icon = LucideIcons[iconName];
  return Icon ? <Icon className="w-6 h-6" /> : <LucideIcons.BookOpen className="w-6 h-6" />;
};

const RoadmapNode = ({ roadmap, index }: { roadmap: any, index: number }) => {
  const progress = index === 0 ? 100 : index === 1 ? 50 : 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative w-full md:w-[400px] bg-[#0F172A] border border-[rgba(255,255,255,0.08)] hover:border-[#00E5FF]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${roadmap.color} text-white shadow-lg`}>
            {getIcon(roadmap.iconName || "BookOpen")}
          </div>
          {progress === 100 && (
            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
              <LucideIcons.CheckCircle2 className="w-3 h-3" />
              Completed
            </div>
          )}
          {progress > 0 && progress < 100 && (
            <div className="flex items-center gap-1 bg-now-primary/20 text-now-primary px-3 py-1 rounded-full text-xs font-bold border border-now-primary/30">
              <LucideIcons.ArrowRightCircle className="w-3 h-3" />
              In Progress
            </div>
          )}
          {progress === 0 && (
            <div className="flex items-center gap-1 bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-500/30">
              <LucideIcons.Lock className="w-3 h-3" />
              Locked
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{roadmap.title}</h3>
        
        {/* Career Outcome */}
        <div className="bg-[#1E293B] rounded-lg p-3 mb-4 border border-[rgba(255,255,255,0.05)]">
          <p className="text-xs text-gray-400 mb-1">Career Outcome</p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-[#00E5FF]">{roadmap.careerOutcome}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">{roadmap.salaryRange}</span>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-400 mb-6 font-medium">
          <span className="flex items-center gap-1">
            <LucideIcons.Clock className="w-3 h-3" />
            {roadmap.estimatedDuration}
          </span>
          <span className="flex items-center gap-1">
            <LucideIcons.Book className="w-3 h-3" />
            {roadmap.modules.length} Modules
          </span>
        </div>

        {/* Unlocks */}
        {roadmap.unlocks && roadmap.unlocks.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <LucideIcons.Unlock className="w-3 h-3" /> Unlocks
            </p>
            <div className="flex flex-wrap gap-2">
              {roadmap.unlocks.map((u: string, idx: number) => (
                <span key={idx} className="text-[10px] px-2 py-1 bg-gray-800/50 text-gray-300 rounded border border-gray-700">
                  {u}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
          <div className="w-2/3">
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
              <div 
                className={`h-1.5 rounded-full ${progress === 100 ? "bg-green-400" : "bg-now-primary"}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">{progress}% Completed</span>
          </div>
          
          <Link to={roadmap.slug === "certification-path" ? "/certifications" : `/roadmaps/${roadmap.slug}`} className="text-sm font-bold text-white hover:text-now-primary transition-colors flex items-center gap-1">
            View <LucideIcons.ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function RoadmapDashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getRoadmap = (slug: string) => mockRoadmaps.find(r => r.slug === slug);

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-[#00E5FF] selection:text-black pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0F172A] border-b border-[rgba(255,255,255,0.05)] pt-24 pb-16">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF] opacity-[0.05] blur-[100px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C3AED] opacity-[0.05] blur-[100px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-now-primary/10 border border-now-primary/20 text-now-primary text-sm font-bold mb-6">
              <LucideIcons.Rocket className="w-4 h-4" />
              Your Path to Success
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">ServiceNow Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Accelerator</span></h1>
            <p className="text-xl text-gray-400 mb-8">Master the platform, earn certifications, and unlock premium enterprise salaries. Become job-ready in 4-6 months.</p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">10</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Learning Tracks</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">74</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Modules</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">32</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Projects</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">4</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Certifications</span>
              </div>
            </div>
          </div>
          
          <div className="w-64 h-64 relative flex items-center justify-center shrink-0">
             {/* Progress Ring */}
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
               <motion.circle 
                 initial={{ strokeDashoffset: 283 }}
                 animate={{ strokeDashoffset: 283 - (283 * 0.15) }} 
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 cx="50" cy="50" r="45" fill="none" stroke="#00E5FF" strokeWidth="10" 
                 strokeDasharray="283"
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white">15%</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Completed</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        {/* Mobile Phase View */}
        {isMobile ? (
          <div className="space-y-12">
            {[1, 2, 3, 4, 5].map((phaseNum) => {
              const phaseRoadmaps = mockRoadmaps.filter(r => r.phase === phaseNum);
              return (
                <div key={phaseNum} className="relative pl-8 border-l-2 border-[#334155]">
                  <div className="absolute top-0 left-[-17px] bg-[#020617] p-1">
                    <div className="w-6 h-6 rounded-full bg-now-primary flex items-center justify-center text-black font-bold text-xs">
                      {phaseNum}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Phase {phaseNum}</h2>
                  <div className="space-y-6">
                    {phaseRoadmaps.map((r, i) => (
                      <RoadmapNode key={r.id} roadmap={r} index={i + (phaseNum * 2)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop Skill Tree View */
          <div className="flex flex-col items-center relative py-10">
            {/* Fundamentals */}
            <div className="z-10 relative">
              <RoadmapNode roadmap={getRoadmap('fundamentals')} index={0} />
            </div>

            {/* Connecting Line 1 to Split */}
            <div className="w-0.5 h-16 bg-[#334155] relative z-0">
               <div className="absolute top-1/2 left-[calc(-200px-20px)] w-[440px] h-0.5 bg-[#334155]"></div>
               <div className="absolute top-1/2 left-[calc(-200px-20px)] w-0.5 h-8 bg-[#334155]"></div>
               <div className="absolute top-1/2 right-[calc(-200px-20px)] w-0.5 h-8 bg-[#334155]"></div>
            </div>

            {/* Row 2: Admin & Dev */}
            <div className="flex gap-[40px] z-10 relative">
              <RoadmapNode roadmap={getRoadmap('administration')} index={1} />
              <RoadmapNode roadmap={getRoadmap('development')} index={2} />
            </div>

            {/* Vertical connections for two columns */}
            <div className="flex gap-[40px] z-0 relative h-16">
               <div className="w-[400px] flex justify-center"><div className="w-0.5 h-full bg-[#334155]"></div></div>
               <div className="w-[400px] flex justify-center"><div className="w-0.5 h-full bg-[#334155]"></div></div>
            </div>

            {/* Row 3: ITSM & Workflow */}
            <div className="flex gap-[40px] z-10 relative">
              <RoadmapNode roadmap={getRoadmap('itsm')} index={3} />
              <RoadmapNode roadmap={getRoadmap('workflow-automation')} index={4} />
            </div>

            {/* Vertical connections for two columns */}
            <div className="flex gap-[40px] z-0 relative h-16">
               <div className="w-[400px] flex justify-center"><div className="w-0.5 h-full bg-[#334155]"></div></div>
               <div className="w-[400px] flex justify-center"><div className="w-0.5 h-full bg-[#334155]"></div></div>
            </div>

            {/* Row 4: CMDB & Integrations */}
            <div className="flex gap-[40px] z-10 relative">
              <RoadmapNode roadmap={getRoadmap('cmdb-discovery')} index={5} />
              <RoadmapNode roadmap={getRoadmap('integrations')} index={6} />
            </div>

            {/* Connecting Line from Split to Center */}
            <div className="flex gap-[40px] z-0 relative h-16">
               <div className="w-[400px] relative">
                  <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-[#334155]"></div>
                  <div className="absolute top-8 left-1/2 w-[220px] h-0.5 bg-[#334155]"></div>
               </div>
               <div className="w-[400px] relative">
                  <div className="absolute top-0 right-1/2 w-0.5 h-8 bg-[#334155]"></div>
                  <div className="absolute top-8 right-1/2 w-[220px] h-0.5 bg-[#334155]"></div>
               </div>
               {/* Center vertical drop to next node */}
               <div className="absolute top-8 left-1/2 -ml-[1px] w-0.5 h-8 bg-[#334155]"></div>
            </div>

            {/* Advanced Development */}
            <div className="z-10 relative">
              <RoadmapNode roadmap={getRoadmap('advanced-development')} index={7} />
            </div>

            {/* Vertical connection */}
            <div className="w-0.5 h-16 bg-[#334155] z-0 relative"></div>

            {/* Security */}
            <div className="z-10 relative">
              <RoadmapNode roadmap={getRoadmap('security-governance')} index={8} />
            </div>

            {/* Vertical connection */}
            <div className="w-0.5 h-16 bg-[#334155] z-0 relative"></div>

            {/* Certifications */}
            <div className="z-10 relative w-full max-w-[840px]">
              <RoadmapNode roadmap={getRoadmap('certification-path')} index={9} />
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
