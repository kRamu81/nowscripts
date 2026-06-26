import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Target, Users } from 'lucide-react';
import { useAuth } from '../contexts/Auth';
import { useAppContext } from '../App';

export default function AboutUs() {
  const { isAuthenticated } = useAuth();
  const { hideNavbar } = useAppContext();

  useEffect(() => {
    document.title = "About Us - NowScripts";
    // We don't hide navbar, let PublicLayout handle it
  }, []);

  return (
    <div className="bg-[#020617] min-h-[calc(100vh-80px)] text-white font-sans selection:bg-[#00E5FF] selection:text-black w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-now-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tight">
            About NowScripts
          </h1>
          <p className="text-xl md:text-2xl text-now-primary font-semibold mb-6">
            "Where ServiceNow Developers Connect"
          </p>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            The Premium ServiceNow Learning Platform built by developers, for developers
          </p>
        </div>
      </section>

      {/* 2. MISSION SECTION */}
      <section className="py-20 px-6 lg:px-8 bg-white/5 border-y border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Our Mission</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            We help ServiceNow professionals master the platform through structured learning paths, real-world projects, interview preparation, and a thriving developer community. Whether you are preparing for CSA, CAD, or CIS certifications or leveling up your ServiceNow career, NowScripts is your home.
          </p>
        </div>
      </section>

      {/* 3. WHAT WE OFFER */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-now-primary/50 transition-colors group">
            <div className="w-14 h-14 bg-now-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-now-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured Courses</h3>
            <p className="text-gray-400 leading-relaxed">
              Step-by-step lessons from Administration basics to advanced development
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-now-primary/50 transition-colors group">
            <div className="w-14 h-14 bg-now-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code className="w-7 h-7 text-now-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-World Projects</h3>
            <p className="text-gray-400 leading-relaxed">
              Hands-on projects that mirror real ServiceNow implementations
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-now-primary/50 transition-colors group">
            <div className="w-14 h-14 bg-now-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-now-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interview Prep</h3>
            <p className="text-gray-400 leading-relaxed">
              Curated questions and answers to ace your ServiceNow interviews
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-now-primary/50 transition-colors group">
            <div className="w-14 h-14 bg-now-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-now-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Developer Community</h3>
            <p className="text-gray-400 leading-relaxed">
              Connect, share, and grow with fellow ServiceNow professionals
            </p>
          </div>

        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-20 px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">30+</div>
            <div className="text-now-primary font-medium tracking-wide uppercase text-sm">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">100%</div>
            <div className="text-now-primary font-medium tracking-wide uppercase text-sm">Free to Learn</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">1</div>
            <div className="text-now-primary font-medium tracking-wide uppercase text-sm">Community</div>
          </div>
        </div>
      </section>

      {/* 5. CLOSING CTA SECTION */}
      <section className="py-24 px-6 lg:px-8 text-center relative z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-now-primary/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
            Ready to level up your ServiceNow career?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-now-primary text-[#020617] font-bold rounded-full hover:bg-now-accent transition-colors shadow-[0_0_20px_rgba(0,192,139,0.3)] hover:shadow-[0_0_30px_rgba(0,192,139,0.5)] flex items-center justify-center"
            >
              Start Learning
            </Link>
            {isAuthenticated && (
              <Link 
                to="/community"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors flex items-center justify-center border border-white/10 hover:border-white/30"
              >
                Join Community
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
