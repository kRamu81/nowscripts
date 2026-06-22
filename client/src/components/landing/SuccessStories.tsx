import { motion } from "framer-motion";
import { ArrowUpRight, Trophy, Code2, Briefcase } from "lucide-react";

export function SuccessStories() {
  const stories = [
    {
      name: "Marcus T.",
      role: "ServiceNow Developer",
      company: "Deloitte",
      image: "https://i.pravatar.cc/150?u=marcus",
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      outcome: "Landed Big 4 Role",
      quote: "The real-world projects in NowScripts were exactly what they asked me about in my technical interview. I had actual code to show them, not just theory."
    },
    {
      name: "Sarah Jenkins",
      role: "System Administrator",
      company: "Accenture",
      image: "https://i.pravatar.cc/150?u=sarahj",
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      outcome: "Passed CSA in 3 Weeks",
      quote: "The structured modules and practice exams gave me the exact blueprint I needed. Passed on my first try with high confidence."
    },
    {
      name: "David Chen",
      role: "Technical Architect",
      company: "Independent Consultant",
      image: "https://i.pravatar.cc/150?u=david",
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      outcome: "Built 3 Enterprise Apps",
      quote: "I used the advanced scripting patterns from NowScripts to build custom applications that are now running in production for Fortune 500 clients."
    }
  ];

  return (
    <section className="py-24 bg-[#020617] relative border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-4"
            >
              Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Outcomes</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-xl"
            >
              Don't just take our word for it. See how our community members are transforming their careers.
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
          >
            Read more stories <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-gradient-to-b from-[#0f172a] to-[#080c17] p-8 rounded-3xl border border-gray-800 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-6 bg-gray-900/50 w-fit px-4 py-2 rounded-full border border-gray-800">
                {story.icon}
                <span className="text-sm font-bold text-white">{story.outcome}</span>
              </div>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                "{story.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full ring-2 ring-gray-800 group-hover:ring-emerald-500/50 transition-all" />
                <div>
                  <h4 className="font-bold text-white">{story.name}</h4>
                  <p className="text-sm text-gray-400">{story.role} at <span className="text-gray-300 font-medium">{story.company}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
