import { motion } from "framer-motion";
import { CheckCircle2, Award, Star, Zap } from "lucide-react";

export function CertificationTimeline() {
  const steps = [
    {
      id: "csa",
      title: "Certified System Administrator (CSA)",
      subtitle: "The Foundation",
      desc: "Master the core configuration and administration of the ServiceNow platform.",
      icon: <CheckCircle2 className="w-6 h-6 text-white" />,
      color: "bg-blue-500"
    },
    {
      id: "cad",
      title: "Certified Application Developer (CAD)",
      subtitle: "The Developer",
      desc: "Learn to build custom applications, scoped apps, and advanced scripts.",
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "bg-emerald-500"
    },
    {
      id: "cis",
      title: "Certified Implementation Specialist (CIS)",
      subtitle: "The Expert",
      desc: "Specialize in ITSM, HRSD, CSM, or SecOps to lead enterprise deployments.",
      icon: <Award className="w-6 h-6 text-white" />,
      color: "bg-purple-500"
    },
    {
      id: "cta",
      title: "Certified Technical Architect (CTA)",
      subtitle: "The Mastermind",
      desc: "Design complex, multi-product enterprise architectures and govern platform health.",
      icon: <Star className="w-6 h-6 text-white" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-[#050a15] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-4"
          >
            Your Certification <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Roadmap</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Follow a proven path to elevate your career and maximize your earning potential in the ServiceNow ecosystem.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-800 -translate-x-1/2"></div>

          <div className="space-y-12 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className="md:w-1/2 pl-16 md:pl-0">
                  <div className={`p-6 rounded-2xl bg-[#0f172a] border border-gray-800 hover:border-gray-600 transition-colors shadow-xl ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${step.color.replace('bg-', 'text-')}`}>{step.subtitle}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#050a15] shadow-lg z-10" style={{ backgroundColor: step.color.replace('bg-', '') }}>
                  <div className={`flex items-center justify-center w-full h-full rounded-full ${step.color}`}>
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
