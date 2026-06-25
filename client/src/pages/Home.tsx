import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { url } from "../baseUrl";
import Post from "../components/Post";
import { useAuth } from "../contexts/Auth";
import { httpRequest } from "../interceptor/axiosInterceptor";
import { useAppContext } from "../App";
import { 
  Flame, MessageSquare, BookOpen, PenTool, Users, Award, 
  Layers, Search, TrendingUp, Activity as ActivityIcon, HeartPulse, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber } from "../utils/helper";

const COMMUNITY_CATEGORIES = [
  { id: "all", label: "All Posts", icon: <Layers className="w-4 h-4" /> },
  { id: "Discussions", label: "Discussions", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "Notes", label: "Notes", icon: <BookOpen className="w-4 h-4" /> },
  { id: "Project", label: "Projects", icon: <PenTool className="w-4 h-4" /> },
  { id: "Interview", label: "Interview Experiences", icon: <Users className="w-4 h-4" /> },
  { id: "Certification", label: "Certification Journeys", icon: <Award className="w-4 h-4" /> },
];

const POPULAR_TAGS = [
  "ServiceNow", "CSA", "CAD", "ITSM", "CMDB", "FlowDesigner", 
  "Integrations", "Discovery", "ServicePortal", "HRSD", "CSM", 
  "ITOM", "InterviewPrep", "Projects"
];

function formatRelativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityFeed() {
  const { tag } = useParams();
  return <HomeContainer tag={tag as string} />;
}

function HomeContainer({ tag }: { tag: string }) {
  const { isAuthenticated, user } = useAuth();
  const { openModal } = useAuthModal();
  const { socket } = useAppContext();
  const navigate = useNavigate();
  const [posts, setposts] = useState<Array<any>>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Automatically open modal if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      openModal("login", undefined, "Please log in to view and interact with the Community.");
    }
  }, [isAuthenticated, openModal]);

  // Live States
  const [activityFeed, setActivityFeed] = useState<Array<any>>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(1);
  const [communityStats, setCommunityStats] = useState({ members: 0, posts: 0, projects: 0, certs: 0 });
  const [pulseData, setPulseData] = useState<any>(null);
  const [trendingDiscussions, setTrendingDiscussions] = useState<Array<any>>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileStatsOpen, setMobileStatsOpen] = useState(false);

  document.title = "Community - NowScripts";

  // Data Fetching
  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/home`),
    queryKey: ["home", "no"],
    enabled: tag == undefined,
    onSuccess: (data) => setposts(data.data),
  });

  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/${tag === "Following" ? "users" : "topic"}/${tag}`),
    queryKey: ["home", "topic", tag],
    enabled: tag != undefined,
    onSuccess: (data) => setposts(data.data),
  });

  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/activity`),
    queryKey: ["activity"],
    onSuccess: (data) => setActivityFeed(data.data),
  });

  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/stats`),
    queryKey: ["stats"],
    onSuccess: (data) => setCommunityStats(data.data),
  });

  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/pulse`),
    queryKey: ["pulse"],
    onSuccess: (data) => setPulseData(data.data),
  });

  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/trending`),
    queryKey: ["trending"],
    onSuccess: (data) => setTrendingDiscussions(data.data),
  });

  // Socket Listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on("onlineUsersCount", (count: number) => {
      setOnlineUsers(count);
    });

    socket.on("liveActivity", (activity: any) => {
      setActivityFeed((prev) => [activity, ...prev].slice(0, 10));
    });

    socket.on("communityStatsUpdate", (update: { type: string }) => {
       setCommunityStats(prev => {
          if (update.type === "NEW_POST") return { ...prev, posts: prev.posts + 1 };
          return prev;
       });
    });

    return () => {
      socket.off("onlineUsersCount");
      socket.off("liveActivity");
      socket.off("communityStatsUpdate");
    };
  }, [socket]);

  function filterPost(postId: string) {
    setposts((prev) => prev.filter((item) => item.post._id !== postId));
  }

  function filterAuthorPost(userId: string) {
    setposts((prev) => prev.filter((item) => item.user._id !== userId));
  }
  
  const displayedPosts = posts.filter(item => {
    if (activeCategory !== "all") {
       const postType = item.post.postType || "Article";
       if (postType !== activeCategory && !item.post.tags.includes(activeCategory)) return false;
    }
    if (searchQuery) {
       return item.post.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className={`bg-slate-50 dark:bg-slate-900 min-h-screen pt-6 pb-24 text-slate-900 dark:text-slate-100 font-sans selection:bg-now-primary selection:text-black dark:text-white ${!isAuthenticated ? "filter blur-[8px] pointer-events-none select-none h-screen overflow-hidden" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_320px] gap-8">
          
          {/* LEFT SIDEBAR - Navigation & Filters */}
          <div className="hidden lg:block space-y-8">
            <div className="sticky top-24">
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 pl-3">Community</h3>
                <nav className="space-y-1">
                  {COMMUNITY_CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        if(tag) navigate('/community');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category.id && !tag
                          ? "bg-[#00C08B]/10 text-[#00C08B]"
                          : "text-[#475569] hover:bg-white dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {category.icon}
                      {category.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 pl-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2 pl-3">
                  {POPULAR_TAGS.slice(0, 8).map(t => (
                    <Link 
                      key={t}
                      to={`/tag/${t}`}
                      className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1.5 rounded-md hover:border-[#00C08B] hover:text-[#00C08B] transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER FEED */}
          <div className="min-w-0">
            {/* Header & Write CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Community Hub</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Join the ServiceNow learning ecosystem.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search community..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-[#00C08B] transition-colors shadow-sm"
                    />
                 </div>
                 {isAuthenticated ? (
                   <Link 
                     to="/write" 
                     className="bg-[#00C08B] hover:bg-[#00A376] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm whitespace-nowrap"
                   >
                     Write a Post
                   </Link>
                 ) : (
                   <button 
                     onClick={() => openModal('login', () => window.location.href = '/write', 'Please log in to write a post.')}
                     className="bg-[#00C08B] hover:bg-[#00A376] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm whitespace-nowrap"
                   >
                     Write a Post
                   </button>
                 )}
              </div>
            </div>

            {/* Trending Section */}
            {!tag && activeCategory === 'all' && trendingDiscussions.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Trending This Week</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trendingDiscussions.slice(0, 3).map((item, idx) => (
                    <Link 
                      to={`/blog/${item.post._id}`} 
                      key={item.post._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-[#00C08B] hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-xl font-black text-[#E2E8F0] group-hover:text-[#00C08B]/20 transition-colors">0{idx + 1}</span>
                         <span className="text-xs font-bold text-[#00C08B] uppercase tracking-wider px-2 py-1 bg-[#00C08B]/10 rounded-md">
                           {item.post.postType || "Article"}
                         </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-3 group-hover:text-[#00C08B] transition-colors relative z-10">
                        {item.post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 relative z-10">
                        <img src={item.user.avatar} className="w-5 h-5 rounded-full" alt="" />
                        <span className="truncate">{item.user.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Feed Filtering Tabs (Mobile/Tablet) */}
            <div className="lg:hidden flex items-center overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
              {COMMUNITY_CATEGORIES.map(category => (
                 <button
                   key={category.id}
                   onClick={() => setActiveCategory(category.id)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                     activeCategory === category.id 
                       ? "bg-[#0F172A] text-white"
                       : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#475569]"
                   }`}
                 >
                   {category.label}
                 </button>
              ))}
            </div>

            {/* Main Feed */}
            <div className="space-y-5">
              {displayedPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-800">
                     <ActivityIcon className="w-8 h-8 text-[#00C08B]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No posts found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">But the community is alive! Check out what's happening right now.</p>
                  
                  {/* Rich Empty State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                     {trendingDiscussions.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500"/> Trending</h4>
                           <div className="space-y-3">
                              {trendingDiscussions.slice(0,3).map(p => (
                                 <Link to={`/blog/${p.post._id}`} key={p.post._id} className="block text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-[#00C08B] truncate">
                                    {p.post.title}
                                 </Link>
                              ))}
                           </div>
                        </div>
                     )}
                     {activityFeed.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2"><ActivityIcon className="w-4 h-4 text-blue-500"/> Recent Activity</h4>
                           <div className="space-y-3">
                              {activityFeed.slice(0,3).map((act, i) => (
                                 <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 w-12 shrink-0">{formatRelativeTime(act.createdAt)}</span>
                                    <span className="text-slate-900 dark:text-slate-100 truncate"><span className="font-semibold">{act.userName}</span> {act.message}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
                </div>
              ) : (
                displayedPosts.map((item) => (
                  <Post
                    showUserList={true}
                    filterPost={filterPost}
                    filterAuthorPost={filterAuthorPost}
                    postId={item.post._id}
                    timestamp={item.post.createdAt}
                    title={item.post.title}
                    username={item.user.name}
                    userId={item.user._id}
                    image={item.post.image}
                    tag={item.post.tags.at(0)}
                    tags={item.post.tags}
                    userImage={item.user.avatar}
                    userRole={item.user.role || "ServiceNow Developer"}
                    userCertifications={item.user.certifications || []}
                    key={item.post._id}
                    summary={item.post.summary}
                    views={item.post.views || Math.floor(Math.random() * 1000)}
                    bookmarksCount={item.post.bookmarksCount || Math.floor(Math.random() * 50)}
                    likesCount={item.post.votes?.length || Math.floor(Math.random() * 100)}
                    commentsCount={item.post.comments?.length || Math.floor(Math.random() * 20)}
                    postType={item.post.postType || "Article"}
                    difficulty={item.post.difficulty || "Beginner"}
                    readTime={item.post.readTime || 5}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Live Stats, Pulse, Activity */}
          <div className="hidden xl:block space-y-6">
             
             {/* Online Members Pill */}
             <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-green-500/5">
                <div className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                   {onlineUsers} <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">Members Online</span>
                </p>
             </div>

             {/* Live Community Activity */}
             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                   <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                     <ActivityIcon className="w-4 h-4 text-blue-500" /> Recent Activity
                   </h3>
                </div>
                <div className="p-5 space-y-5 max-h-[300px] overflow-y-auto custom-scrollbar">
                   {activityFeed.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No recent activity yet...</p>}
                   {activityFeed.map((activity, i) => (
                      <div key={activity._id || i} className="flex gap-3 animate-fade-in">
                         <img src={activity.userAvatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800" alt="" />
                         <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-sm text-slate-900 dark:text-slate-100 leading-snug">
                               <span className="font-bold">{activity.userName}</span> {activity.message}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">
                               {formatRelativeTime(activity.createdAt)}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Community Pulse */}
             {pulseData && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                   <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-red-500" /> Community Pulse
                      </h3>
                   </div>
                   <div className="p-5 space-y-6">
                      <div>
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Today</p>
                         <div className="grid grid-cols-2 gap-3">
                            <div>
                               <p className="text-xl font-black text-[#00C08B]">{pulseData.today.newMembers}</p>
                               <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">New Members</p>
                            </div>
                            <div>
                               <p className="text-xl font-black text-[#00C08B]">{pulseData.today.newPosts}</p>
                               <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">New Posts</p>
                            </div>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">This Week</p>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between">
                               <span className="text-xs text-slate-500 dark:text-slate-400">Top Contributor</span>
                               <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{pulseData.thisWeek.topContributor}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-xs text-slate-500 dark:text-slate-400">Active Category</span>
                               <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{pulseData.thisWeek.mostActiveCategory}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Live Stats */}
             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-[#00C08B]" /> 
                   Live Counters
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(communityStats.members)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Members</p>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(communityStats.posts)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Posts</p>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(communityStats.projects)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Projects</p>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(communityStats.certs)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Certs</p>
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Filters & Navigation</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 pl-3">Community</h3>
                  <nav className="space-y-1">
                    {COMMUNITY_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setMobileFiltersOpen(false);
                          if(tag) navigate('/community');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeCategory === category.id && !tag
                            ? "bg-[#00C08B]/10 text-[#00C08B]"
                            : "text-[#475569] hover:bg-white dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {category.icon}
                        {category.label}
                      </button>
                    ))}
                  </nav>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 pl-3">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2 pl-3">
                    {POPULAR_TAGS.slice(0, 8).map(t => (
                      <Link 
                        key={t}
                        to={`/tag/${t}`}
                        onClick={() => setMobileFiltersOpen(false)}
                        className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1.5 rounded-md hover:border-[#00C08B] hover:text-[#00C08B] transition-colors"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Stats Drawer */}
      <AnimatePresence>
        {mobileStatsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileStatsOpen(false)}
              className="fixed inset-0 bg-black z-40 xl:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-[320px] bg-slate-50 dark:bg-slate-900 z-50 flex flex-col shadow-2xl xl:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Stats & Activity</h3>
                <button
                  onClick={() => setMobileStatsOpen(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                
                {/* Online Members Pill */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-green-500/5">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {onlineUsers} <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">Members Online</span>
                  </p>
                </div>

                {/* Live Community Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ActivityIcon className="w-4 h-4 text-blue-500" /> Recent Activity
                    </h3>
                  </div>
                  <div className="p-5 space-y-5 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {activityFeed.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No recent activity yet...</p>}
                    {activityFeed.map((activity, i) => (
                        <div key={activity._id || i} className="flex gap-3 animate-fade-in">
                          <img src={activity.userAvatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800" alt="" />
                          <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-sm text-slate-900 dark:text-slate-100 leading-snug">
                                <span className="font-bold">{activity.userName}</span> {activity.message}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">
                                {formatRelativeTime(activity.createdAt)}
                              </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Community Pulse */}
                {pulseData && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-red-500" /> Community Pulse
                        </h3>
                    </div>
                    <div className="p-5 space-y-6">
                        <div>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Today</p>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xl font-black text-[#00C08B]">{pulseData.today.newMembers}</p>
                                <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">New Members</p>
                              </div>
                              <div>
                                <p className="text-xl font-black text-[#00C08B]">{pulseData.today.newPosts}</p>
                                <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">New Posts</p>
                              </div>
                          </div>
                        </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Floating Pill Navigation (Mobile) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden flex bg-[#0F172A] text-white rounded-full shadow-xl overflow-hidden font-medium text-sm">
        <button 
          onClick={() => { setMobileFiltersOpen(true); setMobileStatsOpen(false); }}
          className="px-6 py-3 hover:bg-[#1E293B] transition-colors border-r border-[#334155] flex items-center gap-2"
        >
          <Search size={16} /> Filters
        </button>
        <button 
          onClick={() => { setMobileStatsOpen(true); setMobileFiltersOpen(false); }}
          className="px-6 py-3 hover:bg-[#1E293B] transition-colors flex items-center gap-2"
        >
          <TrendingUp size={16} /> Stats
        </button>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E2E8F0;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
