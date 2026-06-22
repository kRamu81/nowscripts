import { motion } from "framer-motion";
import { TrendingUp, Building2, Globe2, Briefcase } from "lucide-react";

export function CompanyDemand() {
  const points = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-400" />,
      title: "Enterprise Adoption",
      desc: "80% of Fortune 500 companies run on ServiceNow. The platform is central to enterprise operations."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: "Salary Growth",
      desc: "Certified Application Developers (CAD) average $120k+ salaries, with rapid growth opportunities."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-400" />,
      title: "Unmatched Demand",
      desc: "There are currently far more ServiceNow developer positions open globally than qualified candidates."
    },
    {
      icon: <Globe2 className="w-8 h-8 text-orange-400" />,
      title: "Global Opportunities",
      desc: "Work remotely or relocate easily. The ecosystem is global and standardized across regions."
    }
  ];

  return (
    <section className="py-24 bg-[#020617] relative border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Why Companies Hire <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                ServiceNow Developers
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              ServiceNow is the fastest-growing enterprise cloud platform. As organizations digitally transform their workflows, the demand for skilled developers has skyrocketed, making it one of the most lucrative and stable career paths in tech.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Start Your Career Path
            </button>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {points.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors"
              >
                <div className="mb-4 bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center border border-gray-800">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
