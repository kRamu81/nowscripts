import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function TestimonialsV2() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Certified CSA",
      company: "Deloitte",
      avatar: "https://i.pravatar.cc/150?u=sarahj",
      text: "NowScripts helped me understand ServiceNow before I even graduated. The projects I built gave me a massive advantage in my first technical interview."
    },
    {
      name: "Michael Chen",
      role: "ServiceNow Developer",
      company: "Accenture",
      avatar: "https://i.pravatar.cc/150?u=michaelc",
      text: "I was stuck in a generic IT support role. The CAD roadmap on NowScripts gave me the exact scripting knowledge I needed to transition into a full-time ServiceNow Developer."
    },
    {
      name: "Priya Sharma",
      role: "CAD Certified",
      company: "TCS",
      avatar: "https://i.pravatar.cc/150?u=priyas",
      text: "The interview prep section is gold. I faced the exact same GlideRecord scenario questions in my interview. Landed my first job thanks to this platform!"
    },
    {
      name: "David Rodriguez",
      role: "ServiceNow Consultant",
      company: "Infosys",
      avatar: "https://i.pravatar.cc/150?u=davidr",
      text: "Even as an experienced developer, I use NowScripts to review advanced integrations and Service Portal widget design. The architecture tracks are incredibly detailed."
    }
  ];

  // Duplicate for infinite marquee effect
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-[#020617] relative z-10 border-t border-[rgba(255,255,255,0.05)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-16 relative z-10">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#00E5FF]">Professionals</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#94A3B8] max-w-2xl mx-auto"
          >
            Join developers from top enterprise companies advancing their careers on NowScripts.
          </motion.p>
        </div>
      </div>

      {/* Marquee Carousel */}
      <div className="relative flex overflow-x-hidden w-full group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex flex-nowrap gap-6 py-4 px-3 w-max"
        >
          {marqueeItems.map((test, idx) => (
            <div 
              key={idx}
              className="w-[380px] flex-shrink-0 bg-[#0F172A]/40 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 hover:border-[rgba(255,255,255,0.15)] hover:bg-[#0F172A]/60 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#E2E8F0] leading-relaxed mb-8 text-sm">
                "{test.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)]" />
                <div>
                  <h4 className="font-bold text-white text-sm">{test.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#00C9A7] font-medium">{test.role}</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#94A3B8] font-medium">{test.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
