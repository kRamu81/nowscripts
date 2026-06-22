import { motion } from "framer-motion";
import { Star, Briefcase, Download, Users, Award, FileCode2 } from "lucide-react";
import Explore from "../Explore";

export const CommunitySection = () => {
  const metrics = [
    { label: "Community Members", value: "500+", icon: <Users className="w-6 h-6 text-[#00E5FF]" />, colSpan: 1 },
    { label: "Notes Downloaded", value: "1000+", icon: <Download className="w-6 h-6 text-[#7C3AED]" />, colSpan: 1 },
    { label: "Certifications Earned", value: "100+", icon: <Award className="w-6 h-6 text-[#00C9A7]" />, colSpan: 1 },
    { label: "Open Source Contributions", value: "50+", icon: <FileCode2 className="w-6 h-6 text-orange-400" />, colSpan: 1 },
    { label: "GitHub Stars", value: "200+", icon: <Star className="w-6 h-6 text-white" />, colSpan: 1 },
    { label: "LinkedIn Followers", value: "800+", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: 1 },
  ];

  return (
    <section className="py-32 bg-[#020617] relative z-10 border-t border-[rgba(255,255,255,0.05)]" id="community">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00C9A7]">Community</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#94A3B8] max-w-2xl mx-auto"
          >
            Join a thriving ecosystem of ServiceNow developers sharing knowledge, open-source projects, and career opportunities.
          </motion.p>
        </div>

        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
          {metrics.map((metric, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className={`col-span-${metric.colSpan} bg-[#0F172A]/40 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgba(255,255,255,0.2)] hover:bg-[#0F172A]/60 transition-all duration-300 group`}
            >
              <div className="p-3 bg-[#111827] rounded-xl border border-[rgba(255,255,255,0.05)] shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Existing Explore Section for Posts */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-[#0F172A]/30 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[2rem] overflow-hidden p-6 md:p-10 shadow-2xl relative"
        >
          {/* Subtle Glow inside the container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent"></div>
          
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Community Discussions</h3>
            <p className="text-[#94A3B8]">Read the latest tutorials, architectures, and stories from experts.</p>
          </div>
          
          <div className="bg-[#020617]/50 rounded-2xl p-4 border border-[rgba(255,255,255,0.03)]">
            <Explore />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};
