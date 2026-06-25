import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import axios from "axios";
import { url } from "../baseUrl";
import { Link } from "react-router-dom";
import { Search, Filter, Briefcase, MapPin, Calendar, Clock, Star, Plus, ThumbsUp, Eye, MessageSquare, ChevronRight, Menu, X, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const CATEGORIES = [
  "All Experiences", "Freshers", "Experienced (1-2 Years)", "Experienced (2-5 Years)", 
  "Senior Developers", "CSA Interviews", "CAD Interviews", "ServiceNow Developer", 
  "ServiceNow Administrator", "HR Round", "Technical Round", "Manager Round", 
  "Scenario Based", "Coding Round", "Offer Discussions", "Salary Discussions", "Preparation Tips"
];

const COMPANIES = [
  "Infosys", "Accenture", "Deloitte", "TCS", "Wipro", "Cognizant", "Capgemini", "EY", "IBM", "HCL", "LTIMindtree", "DXC", "NTT DATA", "KPMG", "PwC", "ServiceNow"
];

const EXPERIENCE_LEVELS = ["Freshers", "0-1 Years", "1-2 Years", "2-3 Years", "3-5 Years", "5+ Years"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const RESULTS = ["Selected", "Rejected", "Waiting"];

export default function InterviewExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Experiences");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [result, setResult] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, [page, company, difficulty, experienceLevel, result, selectedCategory]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (company) params.append("company", company);
      if (difficulty) params.append("difficulty", difficulty);
      if (experienceLevel) params.append("experienceLevel", experienceLevel);
      if (result) params.append("result", result);
      
      // Map category to filters if needed
      if (selectedCategory !== "All Experiences") {
        if (selectedCategory.includes("Year") || selectedCategory === "Freshers") {
          params.append("experienceLevel", selectedCategory.replace("Experienced (", "").replace(")", ""));
        } else if (selectedCategory.includes("Developer") || selectedCategory.includes("Administrator")) {
          params.append("search", selectedCategory);
        } else if (selectedCategory.includes("CSA") || selectedCategory.includes("CAD")) {
           params.append("search", selectedCategory);
        }
      }

      const res = await axios.get(`${url}/interviews?${params.toString()}`);
      setExperiences(res.data.experiences);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchExperiences();
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
            >
              <SidebarContent 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                toggleMobileMenu={toggleMobileMenu} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto fixed h-[calc(100vh-64px)] top-16">
        <SidebarContent 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-[calc(100vh-64px)] overflow-x-hidden p-4 lg:p-8">
        
        {/* Header / Search Area */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Real Interview Experiences</h1>
            </div>
            {user && (
              <Link 
                to="/interviews/submit" 
                className="hidden md:flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Share Experience
              </Link>
            )}
          </div>

          {/* Sticky Search and Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20 z-10">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Search by Company, Role, Technology (e.g., 'Infosys Flow Designer')"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:bg-white transition-all text-gray-900"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button type="submit" className="hidden"></button>
            </form>

            <div className="flex flex-wrap gap-3">
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#4f46e5] focus:border-[#4f46e5] block p-2.5">
                <option value="">All Companies</option>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#4f46e5] focus:border-[#4f46e5] block p-2.5">
                <option value="">Any Experience</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#4f46e5] focus:border-[#4f46e5] block p-2.5">
                <option value="">Any Difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={result} onChange={(e) => setResult(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#4f46e5] focus:border-[#4f46e5] block p-2.5">
                <option value="">Any Result</option>
                {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Floating Mobile Submit Button */}
        {user && (
          <div className="fixed bottom-6 right-6 z-30 md:hidden">
            <Link 
              to="/interviews/submit" 
              className="flex items-center justify-center w-14 h-14 bg-[#4f46e5] text-white rounded-full shadow-lg hover:bg-[#4338ca] transition-colors"
            >
              <Plus className="w-7 h-7" />
            </Link>
          </div>
        )}

        {/* List of Experiences */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4f46e5]"></div>
             </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiences found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <InterviewCard key={exp._id} experience={exp} />
              ))}
              
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 py-4">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 font-medium">Page {page} of {pages}</span>
                  <button 
                    disabled={page === pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ selectedCategory, setSelectedCategory, toggleMobileMenu }: any) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase">Categories</h2>
        {toggleMobileMenu && (
          <button onClick={toggleMobileMenu} className="p-1 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              if (toggleMobileMenu) toggleMobileMenu();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors min-h-[44px] flex items-center ${
              selectedCategory === category 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

function InterviewCard({ experience }: { experience: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 lg:p-6 group flex flex-col sm:flex-row gap-5">
      
      {/* Company Avatar / Initial */}
      <div className="flex-shrink-0 hidden sm:flex w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl items-center justify-center text-xl font-bold text-indigo-700 uppercase">
        {experience.company?.substring(0, 2) || "N/A"}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="sm:hidden font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs uppercase">{experience.company}</span>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                <Link to={`/interviews/${experience._id}`}>{experience.role} at <span className="hidden sm:inline">{experience.company}</span></Link>
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {experience.experienceLevel}</span>
              {experience.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {experience.location}</span>}
              {experience.interviewDate && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(experience.interviewDate), 'MMM yyyy')}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 md:flex-col md:items-end">
             {experience.result === "Selected" && <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5"/> Selected</span>}
             {experience.result === "Offer Received" && <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5"/> Offer Received</span>}
             {experience.result === "Rejected" && <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5"/> Rejected</span>}
             {experience.result === "Waiting" && <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5"/> Waiting</span>}
             
             <div className="flex items-center gap-1 mt-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < experience.overallRating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
           <span className="flex items-center gap-1.5 text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded-md">
             Difficulty: 
             <span className={`${experience.difficulty === 'Hard' ? 'text-red-600' : experience.difficulty === 'Medium' ? 'text-orange-500' : 'text-green-600'}`}>
               {experience.difficulty}
             </span>
           </span>
           <span className="text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">{experience.rounds?.length || 0} Rounds</span>
           
           <div className="ml-auto hidden sm:flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {experience.likes?.length || 0}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {experience.views || 0}</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {experience.comments?.length || 0}</span>
           </div>

           <Link 
             to={`/interviews/${experience._id}`} 
             className="sm:hidden ml-auto text-indigo-600 font-medium flex items-center gap-1 text-sm"
           >
             Read <ChevronRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </div>
  );
}
