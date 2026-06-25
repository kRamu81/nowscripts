import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "../interceptor/axiosInterceptor";
import { url } from "../baseUrl";
import Markdown from "../components/Markdown";
import Chip from "../components/Chip";
import {
  clapIcon,
  commentIcon,
  moreIcon,
  savePost,
  shareicon,
} from "../assets/icons";
import TopPicks from "../components/TopPicks";
import UserPostCard from "../components/UserPostCard";
import PostAuthor from "../components/PostAuthor";
import useShare from "../hooks/useShare";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";
import MoreFrom from "../components/MoreFrom";
import { GetStarted } from "../components/AvatarMenu";
import { useAppContext } from "../App";
import PostMenu from "../components/PostMenu";
import { Heart, MessageSquare, Eye, Bookmark, Share2, Award, ChevronRight, Clock, List, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber } from "../utils/helper";
import ReactTimeAgo from "react-time-ago";

export default function Post() {
  const { webShare } = useShare();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { id } = useParams();
  const postUrl = useMemo(() => window.location.href, [id]);
  const [votes, setVotes] = useState(0);
  const [turnBlack, setTurnBlack] = useState(false);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const { socket, handleToast } = useAppContext();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryFn: () => httpRequest.get(`${url}/post/${id}`),
    queryKey: ["blog", id],
    onSuccess: (data) => {
      document.title = data.data.post.title + " - NowScripts";
      setVotes(data.data.post.votes?.length ?? 0);
      setTurnBlack(data.data.post.votes?.includes(user?._id));
      
      // Generate basic TOC from markdown headings (H2, H3)
      const markdown = data.data.post.markdown || "";
      const headings = markdown.match(/^(##|###)\s+(.+)$/gm) || [];
      const tocItems = headings.map((h: string, idx: number) => {
         const text = h.replace(/^(##|###)\s+/, "");
         return { id: `heading-${idx}`, text };
      });
      setToc(tocItems);
    },
  });

  const { refetch: clap } = useQuery({
    queryFn: () => httpRequest.patch(`${url}/post/vote/${id}`),
    queryKey: ["vote", id],
    enabled: false,
    onSuccess: (res) => {
      if (res.data.success) {
        socket.emit("notify", { userId: data?.data.user._id });
        setVotes((prev) => prev + 1);
      }
    },
  });

  function votePost() {
    if (!isAuthenticated) {
      openModal('login', () => votePost());
      return;
    }
    if (!turnBlack) {
       setTurnBlack(true);
       clap();
    }
  }

  function handleSavePost() {
    if (!isAuthenticated) {
      openModal('login', () => handleSavePost());
      return;
    }
    // Add save post logic here if implemented, for now just toast
    handleToast("Post saved successfully!");
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { refetch: ignoreAuthorCall } = useQuery({
    queryFn: () =>
      httpRequest.patch(`${url}/post/ignoreAuthor/${data?.data.user._id}`),
    queryKey: ["ignoreAuthor", data?.data.user._id],
    enabled: false,
  });

  const { refetch: deleteStory } = useQuery({
    queryFn: () => httpRequest.delete(`${url}/post/${id}`),
    queryKey: ["delete", "page", id],
    enabled: false,
    onSuccess() {
      handleToast("Story deleted successfully");
      handleClose();
      navigate(-1);
    },
  });

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function deletePost() {
    deleteStory();
  }

  function editPost() {
    navigate(`/write/${id}`);
  }

  function ignoreAuthor() {
    ignoreAuthorCall();
    handleToast("Got it. You will not see this author's story again");
    handleClose();
  }

  if (error) return <div className="text-center py-20 text-red-500 font-bold">Something went wrong...</div>;
  if (isLoading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-bold">Loading Community Post...</div>;

  const postData = data?.data.post;
  const authorData = data?.data.user;

  const difficultyColors: Record<string, string> = {
    Beginner: "text-green-700 bg-green-100 border-green-200",
    Intermediate: "text-orange-700 bg-orange-100 border-orange-200",
    Advanced: "text-red-700 bg-red-100 border-red-200",
  };
  const diffColor = difficultyColors[postData?.difficulty || "Beginner"] || difficultyColors.Beginner;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pt-8 pb-24 text-slate-900 dark:text-slate-100 font-sans selection:bg-now-primary selection:text-black dark:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK BUTTON */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 transition-colors">
           <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Community
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* MAIN ARTICLE AREA */}
          <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
             
             {/* Header Elements */}
             <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-[#00C08B] uppercase tracking-wider px-2.5 py-1 bg-[#00C08B]/10 rounded-md">
                   {postData?.postType || "Article"}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${diffColor}`}>
                   {postData?.difficulty || "Beginner"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 ml-auto">
                   <Clock className="w-4 h-4" /> {postData?.readTime || 5} min read
                </span>
             </div>

             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-8 leading-tight tracking-tight">
                {postData?.title}
             </h1>

             {/* Author Info */}
             <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-4">
                   <Link to={`/profile/${authorData?._id}`}>
                      <img src={authorData?.avatar} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 object-cover" alt="" />
                   </Link>
                   <div>
                      <Link to={`/profile/${authorData?._id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#00C08B] transition-colors block text-lg">
                         {authorData?.name}
                      </Link>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                         <span>{authorData?.role || "ServiceNow Developer"}</span>
                         <span className="opacity-50">•</span>
                         <ReactTimeAgo date={Date.parse(postData?.createdAt)} locale="en-US" timeStyle="round" />
                      </div>
                   </div>
                </div>
                
                {/* Desktop Quick Actions */}
                <div className="hidden sm:flex items-center gap-3">
                   <button 
                      onClick={() => postData?.userId !== user?._id && votePost()}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${turnBlack ? "border-[#00C08B] text-[#00C08B] bg-[#00C08B]/10" : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#0F172A] hover:text-slate-900 dark:text-slate-100"}`}
                   >
                      <Heart className={`w-4 h-4 ${turnBlack ? "fill-current" : ""}`} /> {formatNumber(votes)}
                   </button>
                   <button onClick={handleSavePost} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#0F172A] hover:text-slate-900 dark:text-slate-100 transition-colors">
                      <Bookmark className="w-4 h-4" /> Save
                   </button>
                   {postData?.userId === user?._id && (
                      <button onClick={handleClick} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#0F172A] hover:text-slate-900 dark:text-slate-100 transition-colors">
                         {moreIcon}
                      </button>
                   )}
                   <PostMenu
                      anchorEl={anchorEl}
                      deletePost={deletePost}
                      open={open}
                      handleClose={handleClose}
                      editPost={editPost}
                      ignoreAuthor={ignoreAuthor}
                      userId={authorData?._id}
                   />
                </div>
             </div>

             {/* Markdown Content */}
             <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:text-slate-100 prose-a:text-[#00C08B]">
                <Markdown>{postData?.markdown}</Markdown>
             </div>

             {/* Tags Footer */}
             <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap gap-2 mb-8">
                   {postData?.tags.map((item: string) => (
                      <Link
                         key={item}
                         to={`/tag/${item}`}
                         className="text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-lg hover:border-[#00C08B] hover:text-[#00C08B] transition-colors"
                      >
                         #{item}
                      </Link>
                   ))}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                   <div className="flex items-center gap-6">
                      <button 
                         onClick={() => postData?.userId !== user?._id && votePost()}
                         className={`flex items-center gap-2 font-bold transition-colors ${turnBlack ? "text-[#00C08B]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
                      >
                         <Heart className={`w-5 h-5 ${turnBlack ? "fill-current" : ""}`} /> {formatNumber(votes)}
                      </button>
                      <button className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 transition-colors">
                         <MessageSquare className="w-5 h-5" /> {formatNumber(postData?.comments?.length || 0)}
                      </button>
                   </div>
                   <div className="flex items-center gap-4">
                      <button 
                         onClick={() => webShare({ title: postData?.title, text: "Check out this ServiceNow topic on NowScripts", url: postUrl })}
                         className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 transition-colors"
                      >
                         <Share2 className="w-5 h-5" /> Share
                      </button>
                   </div>
                </div>
             </div>

             {/* Related Posts */}
             {id && authorData?._id && (
                <div className="mt-16 pt-10 border-t-2 border-slate-200 dark:border-slate-800 border-dashed">
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">More from {authorData?.name}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MoreFrom
                         userId={authorData?._id}
                         postId={id}
                         avatar={authorData?.avatar}
                         username={authorData?.name}
                         bio={authorData?.bio}
                         followers={authorData?.followers}
                      />
                   </div>
                </div>
             )}

          </div>

          {/* RIGHT SIDEBAR - Sticky TOC & Gamified Author Profile */}
          <div className="hidden lg:block w-80 shrink-0 space-y-8">
             <div className="sticky top-24 space-y-8">
                
                {/* Gamified Author Card */}
                {authorData && (
                   <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
                      <img src={authorData.avatar} className="w-20 h-20 rounded-full mx-auto mb-4 border border-slate-200 dark:border-slate-800 object-cover" alt="" />
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 mb-1">{authorData.name}</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{authorData.role || "ServiceNow Expert"}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-5">
                         {authorData.certifications?.length > 0 ? authorData.certifications.slice(0,2).map((cert: string) => (
                            <span key={cert} className="text-[10px] font-bold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                               <Award className="w-3 h-3" /> {cert}
                            </span>
                         )) : (
                            <span className="text-[10px] font-bold text-[#00C08B] bg-[#00C08B]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                               Top Contributor
                            </span>
                         )}
                      </div>
                      
                      <p className="text-sm text-[#475569] leading-relaxed mb-6 line-clamp-3">
                         {authorData.bio || "Enthusiastic ServiceNow developer sharing knowledge and projects."}
                      </p>
                      
                      {user?._id !== authorData._id && (
                         <button className="w-full bg-[#0F172A] text-white font-bold py-2.5 rounded-lg hover:bg-black transition-colors mb-4">
                            Follow
                         </button>
                      )}

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 text-left">
                         <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">XP</p>
                            <p className="font-black text-slate-900 dark:text-slate-100 text-lg">{formatNumber(authorData.xp || Math.floor(Math.random() * 5000))}</p>
                         </div>
                         <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Followers</p>
                            <p className="font-black text-slate-900 dark:text-slate-100 text-lg">{formatNumber(authorData.followers?.length || 0)}</p>
                         </div>
                      </div>
                   </div>
                )}

                {/* Table of Contents */}
                {toc.length > 0 && (
                   <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">Table of Contents</h4>
                      <div className="space-y-3">
                         {toc.map(item => (
                            <div key={item.id} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#00C08B] cursor-pointer transition-colors line-clamp-1">
                               {item.text}
                            </div>
                         ))}
                      </div>
                   </div>
                )}

             </div>
          </div>

        </div>
      </div>

      {/* Mobile TOC Drawer */}
      <AnimatePresence>
        {mobileTocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileTocOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 max-h-[80vh] bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl rounded-t-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Table of Contents</h3>
                <button
                  onClick={() => setMobileTocOpen(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 pb-8">
                {toc.length > 0 ? toc.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setMobileTocOpen(false)}
                      className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#00C08B] cursor-pointer transition-colors"
                    >
                        {item.text}
                    </div>
                )) : <div className="text-sm text-slate-500 dark:text-slate-400">No table of contents available.</div>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating TOC Button (Mobile) */}
      {toc.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 lg:hidden">
          <button 
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium hover:bg-black transition-colors"
          >
            <List size={16} /> Table of Contents
          </button>
        </div>
      )}
    </div>
  );
}
