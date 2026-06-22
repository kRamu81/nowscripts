import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Users, GraduationCap, FileText, Award } from "lucide-react";

function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function StatsCounters() {
  const stats = [
    { icon: <Users className="w-8 h-8 text-[#00E5FF]" />, value: 500, suffix: "+", label: "Community Members", color: "from-[#00E5FF]/20 to-transparent", border: "border-[#00E5FF]/30" },
    { icon: <GraduationCap className="w-8 h-8 text-[#7C3AED]" />, value: 100, suffix: "+", label: "Learning Modules", color: "from-[#7C3AED]/20 to-transparent", border: "border-[#7C3AED]/30" },
    { icon: <FileText className="w-8 h-8 text-[#00C9A7]" />, value: 1000, suffix: "+", label: "Notes Downloads", color: "from-[#00C9A7]/20 to-transparent", border: "border-[#00C9A7]/30" },
    { icon: <Award className="w-8 h-8 text-rose-400" />, value: 50, suffix: "+", label: "Real Projects", color: "from-rose-500/20 to-transparent", border: "border-rose-500/30" }
  ];

  return (
    <section className="py-24 bg-[#020617] relative z-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white"
          >
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] to-[#00E5FF]">Community</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-lg max-w-2xl mx-auto"
          >
            Join thousands of developers mastering ServiceNow through structured learning, real projects, and community support.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="relative group bg-[#0F172A]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 hover:border-[rgba(255,255,255,0.15)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#111827] rounded-xl border border-[rgba(255,255,255,0.05)] shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
              
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-baseline">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
