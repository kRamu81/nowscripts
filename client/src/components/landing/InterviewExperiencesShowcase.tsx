import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Star, Clock } from "lucide-react";
import axios from "axios";
import { url } from "../../baseUrl";

export function InterviewExperiencesShowcase() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest 5 approved experiences
    axios.get(`${url}/interviews?limit=5&status=Approved`)
      .then(res => {
        if (res.data && Array.isArray(res.data.experiences)) {
          setExperiences(res.data.experiences);
        } else {
          setExperiences([]);
        }
      })
      .catch(err => console.error("Failed to fetch experiences", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Real Interview Experiences
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn from the community. Read genuine interview experiences from top companies and prepare yourself for your dream ServiceNow role.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-now-primary"></div></div>
        ) : experiences.length === 0 ? (
           <div className="text-center text-gray-500 bg-[#080c17] border border-gray-800 rounded-xl p-10">
             Experiences coming soon...
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.slice(0, 3).map((exp, idx) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#080c17] border border-gray-800 rounded-xl p-6 hover:border-now-primary/50 transition-colors group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-now-primary font-bold text-lg uppercase">
                     {exp.company?.substring(0, 2) || "N/A"}
                   </div>
                   <div className="flex items-center gap-1 text-yellow-500">
                     <Star className="w-4 h-4 fill-current" />
                     <span className="text-sm font-medium">{exp.overallRating}</span>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-now-primary transition-colors">
                   {exp.role} at {exp.company}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                   <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {exp.experienceLevel}</span>
                   <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exp.rounds?.length || 0} Rounds</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                   <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${exp.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : exp.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                     {exp.difficulty}
                   </span>
                   <Link to={`/interviews/${exp._id}`} className="text-now-primary hover:text-now-primary/80 font-medium text-sm flex items-center gap-1">
                     Read More <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/interviews" className="inline-flex items-center gap-2 bg-now-primary text-black font-bold px-8 py-3 rounded-full hover:bg-now-primary/90 transition-colors">
            View All Experiences <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
