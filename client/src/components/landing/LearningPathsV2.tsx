import { motion } from "framer-motion";
import { Clock, BarChart, Book, Award, ArrowRight, DollarSign, Briefcase } from "lucide-react";

export function LearningPathsV2() {
  const paths = [
    {
      title: "CSA Track",
      desc: "Certified System Administrator",
      duration: "4 Weeks",
      difficulty: "Beginner",
      modules: 12,
      cert: "CSA",
      outcomes: "System Administrator",
      salary: "$80k - $100k",
      color: "from-[#00C9A7]/20 to-[#00C9A7]/5",
      border: "border-[#00C9A7]/20 hover:border-[#00C9A7]/50",
      accent: "bg-[#00C9A7]"
    },
    {
      title: "CAD Track",
      desc: "Certified Application Developer",
      duration: "6 Weeks",
      difficulty: "Intermediate",
      modules: 15,
      cert: "CAD",
      outcomes: "ServiceNow Developer",
      salary: "$100k - $130k",
      color: "from-[#00E5FF]/20 to-[#00E5FF]/5",
      border: "border-[#00E5FF]/20 hover:border-[#00E5FF]/50",
      accent: "bg-[#00E5FF]"
    },
    {
      title: "ITSM Track",
      desc: "IT Service Management Professional",
      duration: "5 Weeks",
      difficulty: "Intermediate",
      modules: 10,
      cert: "CIS-ITSM",
      outcomes: "ITSM Consultant",
      salary: "$110k - $140k",
      color: "from-[#7C3AED]/20 to-[#7C3AED]/5",
      border: "border-[#7C3AED]/20 hover:border-[#7C3AED]/50",
      accent: "bg-[#7C3AED]"
    },
    {
      title: "Developer Track",
      desc: "Advanced Platform Development",
      duration: "8 Weeks",
      difficulty: "Advanced",
      modules: 18,
      cert: "Advanced Developer",
      outcomes: "Senior Developer",
      salary: "$130k - $160k",
      color: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/20 hover:border-blue-500/50",
      accent: "bg-blue-500"
    },
    {
      title: "Architect Track",
      desc: "Master Architecture & Design",
      duration: "10 Weeks",
      difficulty: "Expert",
      modules: 20,
      cert: "CMA / CTA",
      outcomes: "Technical Architect",
      salary: "$160k - $220k",
      color: "from-fuchsia-500/20 to-fuchsia-500/5",
      border: "border-fuchsia-500/20 hover:border-fuchsia-500/50",
      accent: "bg-fuchsia-500"
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
              Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] to-[#00E5FF]">Career Path</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#94A3B8]"
            >
              Industry-aligned curriculums designed to get you certified and hired faster at top enterprise companies.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.1)] text-white font-medium hover:bg-[#111827] transition-colors whitespace-nowrap"
          >
            View All Roadmaps <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative bg-[#0F172A]/40 backdrop-blur-md bg-gradient-to-br ${path.color} border ${path.border} rounded-3xl p-8 flex flex-col transition-all duration-500 group overflow-hidden`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${path.accent} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{path.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white backdrop-blur-sm">
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8]">{path.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 flex-1">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{path.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Book className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{path.modules} Modules</span>
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{path.cert}</span>
                </div>
                <div className="flex items-center gap-2 text-[#00C9A7]">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-bold">{path.outcomes}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.05)] mt-auto flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider font-bold mb-1">Avg Salary</p>
                  <p className="text-lg font-bold text-white flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-400" /> {path.salary}
                  </p>
                </div>
                <button className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:${path.accent} group-hover:text-[#020617] text-white transition-all duration-300`}>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
