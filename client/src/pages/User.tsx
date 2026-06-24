import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { httpRequest } from "../interceptor/axiosInterceptor";
import { url } from "../baseUrl";
import { useAuth } from "../contexts/Auth";
import Post from "../components/Post";
import ListSection from "../components/ListSection";
import UserCard from "../components/UserCard";
import AboutSection from "../components/AboutSection";
import SavedSection from "../components/SavedSection";
import { Award, Target, Zap, LayoutDashboard, Settings, MoreHorizontal, BookOpen, Star, Mail, MapPin, Link as LinkIcon, Calendar, BookMarked, MessageSquare, Flame, Medal, ExternalLink } from "lucide-react";
import { formatNumber, toTitleCase } from "../utils/helper";
import ReactTimeAgo from "react-time-ago";
import EditProfileModal from "../components/profile/EditProfileModal";

const USER_PAGE_TAB_OPTIONS_AUTH = [
  { id: 1, url: "/user/userId", title: "home" },
  { id: 2, url: "/user/userId/activity", title: "activity" },
  { id: 3, url: "/user/userId/certificates", title: "certificates" },
  { id: 4, url: "/user/userId/progress", title: "progress" },
  { id: 5, url: "/user/userId/about", title: "about" },
];

const USER_PAGE_TAB_OPTIONS_UNAUTH = [
  { id: 1, url: "/user/userId", title: "home" },
  { id: 2, url: "/user/userId/activity", title: "activity" },
  { id: 3, url: "/user/userId/certificates", title: "certificates" },
  { id: 5, url: "/user/userId/about", title: "about" },
];

export default function UserProfile() {
  const { tab, id } = useParams();
  const { user } = useAuth();
  const [query] = useSearchParams();
  const navigate = useNavigate();

  const activeQuery = query.get("active");

  const [optionsTab, setOptionsTab] = useState(USER_PAGE_TAB_OPTIONS_UNAUTH);
  const [posts, setposts] = useState<Array<any>>([]);
  const [userData, setUserData] = useState<Array<any>>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data } = useQuery({
    queryFn: () => httpRequest.get(`${url}/user/${id}`),
    queryKey: ["user", id],
    onSuccess: (data) => {
      document.title = data.data.name + " - NowScripts";
      setOptionsTab(() => {
        if (user?._id === id)
          return USER_PAGE_TAB_OPTIONS_AUTH.map((item) => ({ ...item, url: item.url.replace("userId", data.data._id) }));
        else
          return USER_PAGE_TAB_OPTIONS_UNAUTH.map((item) => ({ ...item, url: item.url.replace("userId", data.data._id) }));
      });
    },
  });

  const { refetch } = useQuery({
    queryFn: () => httpRequest.get(`${url}/post/user/${id}`),
    enabled: false,
    queryKey: ["post", "user", id],
    onSuccess(response) {
      setposts(response.data);
    },
  });

  const { refetch: getAllFollowers } = useQuery({
    queryFn: () => httpRequest.get(`${url}/user/followers/${id}`),
    enabled: false,
    queryKey: ["followers", "user", id],
    onSuccess(res) {
      setUserData(res.data);
    },
  });

  const { refetch: getAllFollowings } = useQuery({
    queryFn: () => httpRequest.get(`${url}/user/followings/${id}`),
    enabled: false,
    queryKey: ["followings", "user", id],
    onSuccess(res) {
      setUserData(res.data);
    },
  });

  useEffect(() => {
    if (!data?.data) return;
    if (tab === "followers") {
      getAllFollowers();
    } else if (tab === "followings") {
      getAllFollowings();
    } else {
      refetch();
    }
  }, [data?.data, tab, activeQuery]);

  function filterPost(postId: string) {
    setposts((prev) => prev.filter((item) => item._id !== postId));
  }

  if (!data?.data) return <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-bold">Loading Profile...</div>;

  const profile = data.data;

  // Render Tabs
  const currentTab = tab || "posts";

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen pt-12 pb-24 text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Name, Tabs, Content */}
          <div className="min-w-0">
            {/* Mobile Sidebar Content (Avatar/Bio) appears here on small screens */}
            <div className="block lg:hidden mb-10">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={profile.avatar} 
                  onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}` }}
                  className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  alt=""
                />
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {user?._id === id && (
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[#1A8917] text-sm mt-1 font-medium"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {profile.bio || "No bio yet."}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <Link to={`/user/${id}/followers`} className="hover:text-slate-900 dark:hover:text-white">
                  {formatNumber(profile.followers?.length || 0)} Followers
                </Link>
                <Link to={`/user/${id}/followings`} className="hover:text-slate-900 dark:hover:text-white">
                  {formatNumber(profile.followings?.length || 0)} Following
                </Link>
              </div>
            </div>

            <h1 className="hidden lg:block text-[42px] font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              {profile.name}
            </h1>

            {/* CONTENT TABS */}
            <div className="flex items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
               {optionsTab.map(opt => {
                  const isActive = (tab === undefined && opt.title === 'home') || tab === opt.title;
                  return (
                     <Link
                        key={opt.id}
                        to={opt.url}
                        className={`pb-4 text-[15px] whitespace-nowrap transition-colors ${
                           isActive 
                              ? "border-b border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium" 
                              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                     >
                        {toTitleCase(opt.title)}
                     </Link>
                  );
               })}
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-8">
              
              {/* Main Posts Tab (Home) */}
              {(tab === undefined || tab === "home" || tab === "posts") && (
                 <div className="space-y-8">
                    {posts.length === 0 ? (
                       <div className="text-center py-10">
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{profile.name} hasn't published any posts yet.</p>
                       </div>
                    ) : (
                       posts.map((item: any) => (
                          <Post
                             showUserList={true}
                             postId={item._id}
                             timestamp={item.createdAt}
                             title={item.title}
                             username={profile.name}
                             userId={id as string}
                             image={item.image}
                             tag={item.tags?.at(0)}
                             tags={item.tags}
                             userImage={profile.avatar}
                             key={item._id}
                             summary={item.summary}
                             showMuteicon={false}
                             filterPost={filterPost}
                             userRole={profile.role}
                             userCertifications={profile.certifications}
                             views={item.views}
                             postType={item.postType}
                             difficulty={item.difficulty}
                             readTime={item.readTime}
                             likesCount={item.votes?.length}
                             commentsCount={item.comments?.length}
                          />
                       ))
                    )}
                 </div>
              )}

              {/* Progress Tab */}
              {tab === "progress" && (
                <div className="space-y-8">
                  <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
                       <Target className="w-5 h-5 text-now-primary" /> Achievements
                    </h3>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Learning Streak</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                             <FlameIcon /> {profile.learningStreak || 0} Days
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Badges</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                             <Medal className="w-4 h-4 text-yellow-500" /> {profile.badges?.length || 0}
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">XP</span>
                          <span className="text-sm font-bold text-now-primary">
                             {formatNumber(profile.xp || 0)}
                          </span>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                     <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Skills</h3>
                     <div className="flex flex-wrap gap-2">
                        {(profile.skills?.length > 0 ? profile.skills : ["No skills listed"]).map((skill: string) => (
                           <span key={skill} className="text-sm bg-white dark:bg-[#2A2A2A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full">
                              {skill}
                           </span>
                        ))}
                     </div>
                  </div>
                  
                  {/* ServiceNow Progress component could go here */}
                </div>
              )}

              {/* Followers / Following Tab */}
              {(tab === "followers" || tab === "followings") && (
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{userData.length} {toTitleCase(tab)}</h2>
                    <div className="space-y-4">
                       {userData.map((u: any) => (
                          <UserCard
                             _id={u._id}
                             avatar={u.avatar}
                             followers={u.followers}
                             name={u.name}
                             bio={u.bio}
                             key={u._id}
                          />
                       ))}
                    </div>
                 </div>
              )}

              {/* Certificates Tab */}
              {tab === "certificates" && (
                 <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Certificates will appear here.</p>
                 </div>
              )}

              {/* Activity Tab */}
              {tab === "activity" && (
                 <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Activity feed will appear here.</p>
                 </div>
              )}

              {/* About Tab */}
              {tab === "about" && (
                 <AboutSection
                    userId={id!}
                    bio={profile.bio}
                    followers={profile.followers?.length || 0}
                    followings={profile.followings?.length || 0}
                 />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Avatar, Bio, Metadata) */}
          <div className="hidden lg:block space-y-6 pt-2">
             <img 
                src={profile.avatar} 
                onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}` }}
                className="w-[88px] h-[88px] rounded-full object-cover mb-4" 
                alt="" 
             />
             
             <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{profile.name}</h2>
             
             <p className="text-[#6B6B6B] dark:text-[#A8A8A8] text-[15px] leading-snug mb-4">
                {profile.bio || "No bio yet."}
             </p>
             
             <div className="flex items-center gap-3 mb-6">
                {user?._id !== id ? (
                   <>
                      <button className="bg-[#1A8917] hover:bg-[#156d12] text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                         Follow
                      </button>
                      <button className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                         Message
                      </button>
                   </>
                ) : (
                   <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[#1A8917] hover:text-[#156d12] text-sm font-medium transition-colors"
                   >
                      Edit profile
                   </button>
                )}
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link to={`/user/${id}/followers`} className="flex items-center gap-2 text-[15px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                   <span className="font-bold">{formatNumber(profile.followers?.length || 0)}</span>
                   <span>Followers</span>
                </Link>
                <Link to={`/user/${id}/followings`} className="flex items-center gap-2 text-[15px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                   <span className="font-bold">{formatNumber(profile.followings?.length || 0)}</span>
                   <span>Following</span>
                </Link>
                
                <div className="flex items-center gap-2 text-[15px] text-slate-600 dark:text-slate-400">
                   <Calendar className="w-4 h-4" /> 
                   <span>Joined <ReactTimeAgo date={Date.parse(profile.createdAt)} locale="en-US" timeStyle="round" /></span>
                </div>

                {profile.certifications && profile.certifications.length > 0 && (
                   <div className="flex items-center gap-2 text-[15px] text-slate-600 dark:text-slate-400">
                      <Award className="w-4 h-4" /> 
                      <span>{profile.certifications.length} Certificates</span>
                   </div>
                )}

                {profile.projects && profile.projects.length > 0 && (
                   <div className="flex items-center gap-2 text-[15px] text-slate-600 dark:text-slate-400">
                      <LayoutDashboard className="w-4 h-4" /> 
                      <span>{profile.projects.length} Projects</span>
                   </div>
                )}

                {/* Social Links */}
                {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.website) && (
                   <div className="flex items-center gap-3 pt-2">
                      {profile.socialLinks?.linkedin && (
                         <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/w0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                         </a>
                      )}
                      {profile.socialLinks?.github && (
                         <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/w0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                         </a>
                      )}
                      {profile.socialLinks?.website && (
                         <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <ExternalLink className="w-5 h-5" />
                         </a>
                      )}
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditModalOpen(false)} 
          refetch={refetch} 
        />
      )}
    </div>
  );
}

const FlameIcon = () => (
   <svg xmlns="http://www.w3.org/w0000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 fill-orange-500">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
   </svg>
);
