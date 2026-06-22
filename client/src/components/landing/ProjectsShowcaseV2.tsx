import { motion } from "framer-motion";
import { Clock, PlayCircle, Code2, Rocket, ArrowRight } from "lucide-react";

export function ProjectsShowcaseV2() {
  const projects = [
    {
      title: "Enterprise Incident Management",
      desc: "Build a custom scoped application for handling IT incidents with SLA workflows, automated assignment rules, and a custom Service Portal widget.",
      diff: "Advanced",
      diffColor: "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20",
      time: "8 Hours",
      tags: ["Scoped Apps", "Flow Designer", "Service Portal"],
      featured: true,
      icon: <Rocket className="w-8 h-8 text-[#00E5FF]" />
    },
    {
      title: "Employee Onboarding Workflow",
      desc: "Automate the new hire process with Order Guides and Workflows.",
      diff: "Intermediate",
      diffColor: "bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/20",
      time: "4 Hours",
      tags: ["Flow Designer", "Catalog"],
      featured: false,
      icon: <Code2 className="w-6 h-6 text-[#00C9A7]" />
    },
    {
      title: "Asset Tracker",
      desc: "Track hardware lifecycle stages and assignments.",
      diff: "Intermediate",
      diffColor: "bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/20",
      time: "3 Hours",
      tags: ["CMDB", "Business Rules"],
      featured: false,
      icon: <Code2 className="w-6 h-6 text-[#00C9A7]" />
    },
    {
      title: "HR Portal",
      desc: "Create a stunning portal for HR requests.",
      diff: "Advanced",
      diffColor: "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20",
      time: "6 Hours",
      tags: ["Service Portal", "AngularJS"],
      featured: false,
      icon: <Code2 className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "CMDB Implementation",
      desc: "Setup Discovery schedules and map application services.",
      diff: "Expert",
      diffColor: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      time: "8 Hours",
      tags: ["Discovery", "Service Mapping"],
      featured: false,
      icon: <Code2 className="w-6 h-6 text-rose-400" />
    }
  ];

  return (
    <section className="py-32 bg-[#020617] relative z-10 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Real Projects</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#94A3B8]"
            >
              Stop watching tutorials. Start building enterprise-grade applications to add to your developer portfolio.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.1)] text-white font-medium hover:bg-[#111827] transition-colors whitespace-nowrap"
          >
            View Portfolio <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative bg-[#0F172A]/40 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 flex flex-col group overflow-hidden hover:border-[rgba(255,255,255,0.2)] transition-colors ${proj.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-[#111827] rounded-xl border border-[rgba(255,255,255,0.05)] shadow-inner">
                  {proj.icon}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1 text-[#94A3B8] text-sm font-medium mr-2">
                    <Clock className="w-4 h-4" /> {proj.time}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${proj.diffColor}`}>
                    {proj.diff}
                  </span>
                </div>
              </div>

              <h3 className={`font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors relative z-10 ${proj.featured ? 'text-3xl' : 'text-xl'}`}>
                {proj.title}
              </h3>
              <p className={`text-[#94A3B8] mb-8 flex-1 relative z-10 ${proj.featured ? 'text-lg max-w-xl' : 'text-sm'}`}>
                {proj.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                {proj.tags.map(tag => (
                  <span key={tag} className="bg-[#111827] border border-[rgba(255,255,255,0.05)] text-[#94A3B8] text-xs px-3 py-1.5 rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative z-10 ${proj.featured ? 'bg-[#00E5FF] text-[#020617] hover:bg-white' : 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-[#020617]'}`}>
                <PlayCircle className="w-5 h-5" /> Start Project
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
