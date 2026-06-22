import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function PlatformShowcase() {
  const features = [
    "Interactive Roadmaps",
    "Learning Modules",
    "Certification Tracking",
    "Project Based Learning",
    "Interview Preparation"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-now-background to-[#050a15] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Realistic UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-3/5"
          >
            <div className="relative rounded-xl border border-gray-800 bg-[#080c17] shadow-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10]">
              {/* Window Header */}
              <div className="h-8 border-b border-gray-800 bg-[#0f1423] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              
              {/* Realistic Screenshot Placeholder */}
              <div className="w-full h-full relative group bg-[#020617] flex items-center justify-center p-4">
                <img 
                  src="/images/platform_dashboard_real.png" 
                  alt="NowScripts Learning Platform Dashboard" 
                  className="w-full h-full object-cover rounded-lg shadow-[0_0_40px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_60px_rgba(0,229,255,0.2)] transition-shadow duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/1200x800/0f172a/00E5FF?text=Upload+Platform+Screenshot+Here\n(/images/platform_dashboard_real.png)";
                  }}
                />
              </div>
              
              {/* Glowing gradient effect behind mockup */}
              <div className="absolute -inset-10 bg-gradient-to-r from-now-primary/20 to-now-accent/20 blur-3xl -z-10 opacity-50 rounded-full"></div>
            </div>
          </motion.div>

          {/* Right: Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-2/5"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Everything You Need To Master ServiceNow
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Stop hunting for tutorials. NowScripts provides a comprehensive, modern dashboard equipped with all the tools you need to succeed.
            </p>
            
            <div className="space-y-5">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-now-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-now-primary" />
                  </div>
                  <span className="text-lg font-medium text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className="mt-12 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg">
              Explore Dashboard
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
