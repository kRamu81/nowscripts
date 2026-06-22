import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useEffect, useState } from "react";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  
  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  // Mouse move effect for spotlight
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] bg-[#020617] overflow-hidden flex items-center justify-center pt-10 pb-20">
      
      {/* Dynamic Mouse Spotlight Glow */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,229,255,0.1), transparent 40%)`
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />

      {/* Static Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-now-primary/20 rounded-full blur-[150px] -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[150px] translate-y-1/2 z-0"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Content */}
        <motion.div 
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-8 max-w-2xl relative z-20"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2"
            >
              <div className="px-3 py-1 rounded-full bg-[#111827]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-now-accent text-sm font-semibold tracking-wide uppercase shadow-[0_0_20px_rgba(20,184,166,0.1)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-now-accent animate-pulse"></span>
                The Ultimate ServiceNow Platform
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-[76px] font-extrabold text-white tracking-tight leading-[1.05]"
            >
              Master <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] via-[#00E5FF] to-[#7C3AED]">
                ServiceNow
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-[#94A3B8] leading-relaxed max-w-xl font-medium"
            >
              Accelerate your career with structured learning paths, real-world projects, community notes, and interview preparation. Built for developers, by developers.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/learn");
                } else {
                  openModal('signup');
                }
              }}
              className="relative group overflow-hidden px-8 py-4 text-base font-bold text-[#020617] bg-white rounded-full text-center transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00C9A7] via-[#00E5FF] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Start Building Free</span>
            </button>
            <Link
              to="/roadmaps"
              className="px-8 py-4 text-base font-bold text-white bg-[#0F172A]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[#111827] transition-all duration-300 rounded-full text-center"
            >
              Explore Roadmaps
            </Link>
          </motion.div>

          {/* Premium Statistics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-6 border-t border-[rgba(255,255,255,0.08)]"
          >
            {[
              { value: "33+", label: "Modules" },
              { value: "1000+", label: "Flashcards" },
              { value: "100+", label: "Interviews" },
              { value: "50+", label: "Projects" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-extrabold text-white">{stat.value}</span>
                <span className="text-xs text-[#64748B] uppercase tracking-wider font-bold mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content: 3D Visualization */}
        <motion.div 
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative z-20 w-full max-w-3xl flex justify-center perspective-1000"
        >
          {/* Main 3D Image */}
          <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
            
            {/* The Image */}
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              src="/images/saas_hero_workflow.png" 
              alt="ServiceNow 3D Workflow" 
              className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(0,229,255,0.2)] relative z-10"
            />

            {/* Floating Glassmorphism UI Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[15%] left-0 md:left-[5%] z-20 p-4 rounded-xl bg-[#0F172A]/60 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                ✓
              </div>
              <div>
                <p className="text-white font-bold text-sm">Flow Deployed</p>
                <p className="text-[#94A3B8] text-xs">0 errors, 3 warnings</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[20%] right-0 md:right-[5%] z-20 p-4 rounded-xl bg-[#0F172A]/60 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] flex items-center justify-center text-white font-bold">
                JS
              </div>
              <div>
                <p className="text-white font-bold text-sm">Script Validated</p>
                <p className="text-[#94A3B8] text-xs">Execution: 42ms</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
