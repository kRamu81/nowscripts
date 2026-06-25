import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useAppContext } from "../App";
import { moreIcon, mutePost, savePost } from "../assets/icons";
import { url } from "../baseUrl";
import { httpRequest } from "../interceptor/axiosInterceptor";
import PostMenu from "./PostMenu";
import { formatNumber } from "../utils/helper";
import { MessageSquare, Heart, Bookmark, Eye, Clock, Award } from "lucide-react";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";

type PostProps = {
  title: string;
  image?: string;
  username?: string;
  userImage?: string;
  timestamp: string;
  postId: string;
  tag?: string;
  tags?: string[];
  summary: string;
  userId: string;
  userRole?: string;
  userCertifications?: string[];
  filterPost?: (postId: string) => void;
  filterAuthorPost?: (userId: string) => void;
  showMuteicon?: boolean;
  showUserList: boolean;
  unAuth?: boolean;
  showMoreIcon?: boolean;
  views?: number;
  bookmarksCount?: number;
  likesCount?: number;
  commentsCount?: number;
  postType?: string;
  difficulty?: string;
  readTime?: number;
};

export default function Post({
  postId,
  timestamp,
  title,
  username,
  image,
  tag,
  tags = [],
  summary,
  userImage,
  userId,
  userRole,
  userCertifications = [],
  filterPost,
  showMuteicon = true,
  showUserList = true,
  unAuth = false,
  filterAuthorPost,
  showMoreIcon = true,
  views = 0,
  bookmarksCount = 0,
  likesCount = 0,
  commentsCount = 0,
  postType = "Article",
  difficulty = "Beginner",
  readTime = 5,
}: PostProps) {
  const { handleToast } = useAppContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  const { refetch: ignorePostCall } = useQuery({
    queryFn: () => httpRequest.patch(`${url}/post/ignore/${postId}`),
    queryKey: ["ignore", postId],
    enabled: false,
    onSuccess: (data) => {},
  });

  const { refetch: ignoreAuthorCall } = useQuery({
    queryFn: () => httpRequest.patch(`${url}/post/ignoreAuthor/${userId}`),
    queryKey: ["ignoreAuthor", userId],
    enabled: false,
    onSuccess: (data) => {},
  });

  const { refetch: deleteStory } = useQuery({
    queryFn: () => httpRequest.delete(`${url}/post/${postId}`),
    queryKey: ["delete", postId],
    enabled: false,
    onSuccess() {
      handleToast("Story deleted successfully");
      handleClose();
      filterPost && filterPost(postId);
    },
  });

  function ignorePost() {
    ignorePostCall();
    handleToast("Got it. You will not see this story again");
    filterPost && filterPost(postId);
  }

  function ignoreAuthor() {
    ignoreAuthorCall();
    handleToast("Got it. You will not see this author's story again");
    handleClose();
    filterAuthorPost && filterAuthorPost(userId);
  }

  function deletePost() {
    deleteStory();
  }

  function editPost() {
    navigate(`/write/${postId}`);
  }

  function handleInteraction(e: React.MouseEvent, action: () => void) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openModal('login', action);
      return;
    }
    action();
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const difficultyColors: Record<string, string> = {
    Beginner: "text-green-700 bg-green-100 border-green-200",
    Intermediate: "text-orange-700 bg-orange-100 border-orange-200",
    Advanced: "text-red-700 bg-red-100 border-red-200",
  };

  const getDifficultyColor = (diff: string) => difficultyColors[diff] || difficultyColors.Beginner;

  return (
    <Link 
      to={`/blog/${postId}`}
      className="block bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 hover:border-[#00C08B] hover:shadow-md transition-all group relative text-left"
    >
      {/* Category & Difficulty Badges */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00C08B] uppercase tracking-wider px-2.5 py-1 bg-[#00C08B]/10 rounded-md">
               {postType}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getDifficultyColor(difficulty)}`}>
               {difficulty}
            </span>
         </div>
         {showMoreIcon && (
            <button
               onClick={handleClick}
               className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F8FAFC] transition-colors"
            >
               {moreIcon}
            </button>
         )}
      </div>

      <PostMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        ignoreAuthor={ignoreAuthor}
        deletePost={deletePost}
        editPost={editPost}
        userId={userId}
      />

      {/* Author Details */}
      {showUserList && (
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${userId}`} onClick={e => e.stopPropagation()} className="relative shrink-0">
            <img src={userImage} className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" alt={username} />
            {userCertifications.length > 0 && (
               <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
                  <Award className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
               </div>
            )}
          </Link>
          <div className="flex flex-col min-w-0 flex-1">
            <Link to={`/profile/${userId}`} onClick={e => e.stopPropagation()} className="font-bold text-sm text-[#0F172A] hover:text-[#00C08B] truncate transition-colors">
               {username}
            </Link>
            <div className="flex items-center text-xs text-[#64748B] truncate">
               <span className="truncate">{userRole || "ServiceNow Developer"}</span>
               <span className="mx-1.5 opacity-50">•</span>
               <span><ReactTimeAgo date={Date.parse(timestamp)} locale="en-US" timeStyle="round" /></span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-5">
         <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] mb-2 leading-tight group-hover:text-[#00C08B] transition-colors line-clamp-2">
               {title}
            </h2>
            <p className="text-[#475569] text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
               {summary}
            </p>
         </div>
         {image && (
            <div className="shrink-0">
               <img src={image} className="w-full md:w-[180px] h-[120px] object-cover rounded-lg border border-[#E2E8F0]" alt="" />
            </div>
         )}
      </div>

      {/* Tags */}
      {(tags.length > 0 || tag) && (
         <div className="flex flex-wrap items-center gap-2 mb-5">
            {(tags.length > 0 ? tags.slice(0, 4) : [tag]).map((t, idx) => t && (
               <Link
                  key={idx}
                  to={`/tag/${t}`}
                  onClick={e => e.stopPropagation()}
                  className="text-xs font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md hover:border-[#00C08B] hover:text-[#00C08B] transition-colors"
               >
                  #{t}
               </Link>
            ))}
         </div>
      )}

      {/* Footer Metrics */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E2E8F0] text-sm font-medium text-[#64748B]">
         <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={(e) => handleInteraction(e, () => {
              // Add like logic here
              handleToast("Post liked!");
            })} className="flex items-center gap-1.5 hover:text-[#0F172A] transition-colors">
               <Heart className="w-4 h-4" />
               <span>{formatNumber(likesCount)}</span>
            </button>
            <button onClick={(e) => handleInteraction(e, () => {
              navigate(`/blog/${postId}`);
            })} className="flex items-center gap-1.5 hover:text-[#0F172A] transition-colors">
               <MessageSquare className="w-4 h-4" />
               <span>{formatNumber(commentsCount)}</span>
            </button>
            <div className="flex items-center gap-1.5 hover:text-[#0F172A] transition-colors">
               <Eye className="w-4 h-4" />
               <span>{formatNumber(views)}</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5">
               <Clock className="w-4 h-4" />
               <span>{readTime} min read</span>
            </div>
            <button 
               onClick={(e) => handleInteraction(e, () => {
                 // Add save logic here
                 handleToast("Post saved!");
               })} 
               className="hover:text-[#0F172A] transition-colors flex items-center gap-1.5"
            >
               <Bookmark className="w-4 h-4" />
               <span className="hidden sm:inline">{formatNumber(bookmarksCount)}</span>
            </button>
         </div>
      </div>
    </Link>
  );
}
