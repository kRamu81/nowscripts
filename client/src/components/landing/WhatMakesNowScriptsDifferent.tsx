import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function WhatMakesNowScriptsDifferent() {
  const points = [
    { title: "Structured Learning Paths", desc: "Clear step-by-step guidance from beginner to advanced topics." },
    { title: "Real ServiceNow Projects", desc: "Build actual applications and instances, not just theory." },
    { title: "Community Driven Learning", desc: "Learn alongside peers, mentors, and industry experts." },
    { title: "Interview Preparation", desc: "Mock interviews, common questions, and resume reviews." },
    { title: "Notes & Resources", desc: "Downloadable guides, scripts, and cheat sheets." },
    { title: "Certification Guidance", desc: "Targeted study material for CSA, CAD, and CIS." }
  ];

  return (
    <section className="py-24 bg-[#050a15] relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            What Makes <span className="text-transparent bg-clip-text bg-gradient-to-r from-now-primary to-now-accent">NowScripts Different</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            We focus on real outcomes, structured paths, and a community-first approach.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0f172a] border border-gray-800 rounded-2xl p-8 hover:border-now-primary/50 transition-colors flex items-start gap-4 group"
            >
              <div className="mt-1">
                <CheckCircle2 className="w-6 h-6 text-now-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                <p className="text-gray-400">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
