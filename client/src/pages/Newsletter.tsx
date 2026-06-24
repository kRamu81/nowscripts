import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Filter, Calendar, ExternalLink, Sparkles, BookOpen, Settings, Users, Flame, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { useAppContext } from "../App";
import { url } from "../baseUrl";

interface Article {
  _id: string;
  title: string;
  source: string;
  author?: string;
  publishedAt: string;
  summary: string;
  articleUrl: string;
  category: string;
  imageUrl?: string;
}

interface NewsletterResponse {
  articles: Article[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const CATEGORIES = ["All", "Releases", "Certifications", "AI", "ITSM", "Development", "Community", "Careers"];

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "releases": return <Settings className="w-4 h-4" />;
    case "ai": return <Sparkles className="w-4 h-4 text-purple-400" />;
    case "certifications": return <BookOpen className="w-4 h-4" />;
    case "community": return <Users className="w-4 h-4" />;
    case "development": return <Flame className="w-4 h-4" />;
    case "careers": return <Briefcase className="w-4 h-4" />;
    default: return null;
  }
};

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "releases": return "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40";
    case "ai": return "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40";
    case "certifications": return "bg-[#00C9A7]/10 text-[#00C9A7] border-[#00C9A7]/20 hover:border-[#00C9A7]/40";
    case "community": return "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/40";
    case "development": return "bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/40";
    case "itsm": return "bg-green-500/10 text-green-400 border-green-500/20 hover:border-green-500/40";
    case "careers": return "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:border-pink-500/40";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:border-gray-500/40";
  }
};

export default function Newsletter() {
  const { hideNavbar } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12; // articles per page

  useEffect(() => {
    hideNavbar(true);
    document.title = "ServiceNow Pulse | NowScripts";
    return () => hideNavbar(false);
  }, []);

  // Debounce search query to avoid spamming the API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchArticles = async (page: number, category: string, search: string): Promise<NewsletterResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (category !== "All") params.append("category", category);
    if (search) params.append("search", search);

    try {
      const response = await axios.get(`${url}/newsletter?${params.toString()}`);
      if (response.data && Array.isArray(response.data.articles)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return { articles: response.data, pagination: { total: response.data.length, page: 1, pages: 1 } };
      }
      return { articles: [], pagination: { total: 0, page: 1, pages: 1 } };
    } catch (err) {
      console.error(err);
      return { articles: [], pagination: { total: 0, page: 1, pages: 1 } };
    }
  };

  const { data, isLoading, isError } = useQuery<NewsletterResponse>({
    queryKey: ["newsletterArticles", currentPage, activeCategory, debouncedSearch],
    queryFn: () => fetchArticles(currentPage, activeCategory, debouncedSearch),
    keepPreviousData: true,
  });

  const articles = data?.articles || [];
  const pagination = data?.pagination;

  // For visual hierarchy, if on page 1 without search/category, treat the first as featured
  const isDefaultView = currentPage === 1 && activeCategory === "All" && !debouncedSearch;
  const featuredArticle = isDefaultView && articles.length > 0 ? articles[0] : null;
  const gridArticles = isDefaultView ? articles.slice(1) : articles;

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#00E5FF] text-sm font-semibold tracking-wide uppercase mb-6"
          >
            <Flame className="w-4 h-4 text-[#00E5FF]" />
            Live Updates
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            ServiceNow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500">Pulse</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#94A3B8] max-w-2xl leading-relaxed"
          >
            Your daily digest of ecosystem updates, technical deep dives, certifications, and community highlights.
          </motion.p>
        </div>

        {/* Controls: Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-[#00E5FF] text-[#020617]"
                    : "bg-[#0F172A] text-[#94A3B8] border border-[rgba(255,255,255,0.08)] hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-full py-3 pl-12 pr-4 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
            />
          </div>
        </div>

        {/* Featured Article Section */}
        {featuredArticle && !isLoading && (
          <div className="mb-12">
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-[#0F172A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] rounded-3xl flex flex-col md:flex-row overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              {featuredArticle.imageUrl && (
                <div className="md:w-2/5 relative min-h-[250px] overflow-hidden bg-[#020617]">
                  <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F172A]/90 hidden md:block z-10"></div>
                </div>
              )}
              
              <div className={`p-8 md:p-10 flex flex-col justify-center relative z-20 ${featuredArticle.imageUrl ? 'md:w-3/5' : 'w-full'}`}>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getCategoryColor(featuredArticle.category)}`}>
                    {getCategoryIcon(featuredArticle.category)}
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-[#00E5FF] transition-colors">
                  {featuredArticle.title}
                </h3>
                
                <p className="text-[#94A3B8] text-lg mb-8 leading-relaxed max-w-3xl">
                  {featuredArticle.summary}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{featuredArticle.source}</span>
                    {featuredArticle.author && <span className="text-xs text-[#64748B]">by {featuredArticle.author}</span>}
                  </div>
                  <a 
                    href={featuredArticle.articleUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-bold hover:bg-[#00E5FF]/20 transition-colors w-full sm:w-auto"
                  >
                    Read Full Story <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-[#0F172A]/40 rounded-3xl animate-pulse border border-[rgba(255,255,255,0.05)]"></div>
            ))}
          </div>
        ) : gridArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {gridArticles.map((article, idx) => (
                <motion.article 
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="group relative bg-[#0F172A]/60 backdrop-blur-md border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] rounded-3xl flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]/80 pointer-events-none z-0"></div>
                  
                  <div className="p-8 flex flex-col h-full relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${getCategoryColor(article.category)}`}>
                        {getCategoryIcon(article.category)}
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-[#00E5FF] transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    
                    <p className="text-[#94A3B8] mb-8 line-clamp-3 leading-relaxed flex-1">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.08)] mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                          {article.source}
                        </span>
                        {article.author && <span className="text-[10px] text-[#475569]">{article.author}</span>}
                      </div>
                      <a 
                        href={article.articleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-bold text-white hover:text-[#00E5FF] transition-colors"
                      >
                        Read <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-[#94A3B8]">
                  Page <span className="text-white">{pagination.page}</span> of {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                  className="p-2 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Filter className="w-16 h-16 text-[#334155] mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-[#94A3B8]">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-6 px-6 py-2 rounded-full bg-[#1E293B] text-white hover:bg-[#334155] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
