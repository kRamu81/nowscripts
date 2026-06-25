import Navbar from "./components/Navbar";
import LandingNavbar from "./components/LandingNavbar";
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { Toaster, toast, Toast } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import { url } from "./baseUrl";
import { BrandIconOnly } from "./components/BrandLogo";

const UnAuthHome = lazy(() => import("./pages/UnAuthHome"));
const CommunityFeed = lazy(() => import("./pages/Home"));
const AuthRedirect = lazy(() => import("./pages/AuthRedirect"));
const Post = lazy(() => import("./pages/Post"));
const Notifications = lazy(() => import("./pages/Notifications"));
const User = lazy(() => import("./pages/User"));
const Profile = lazy(() => import("./pages/Profile"));
const Write = lazy(() => import("./pages/Write"));
const SignIn = lazy(() => import("./pages/SignIn"));
const LearnDashboard = lazy(() => import("./pages/LearnDashboard"));
const InterviewPrepDashboard = lazy(() => import("./pages/InterviewPrepDashboard"));
const RoadmapDashboard = lazy(() => import("./pages/RoadmapDashboard"));
const RoadmapViewer = lazy(() => import("./pages/RoadmapViewer"));
const CertificationCenter = lazy(() => import("./pages/CertificationCenter"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const AdminCertificates = lazy(() => import("./pages/admin/AdminCertificates"));
const CertificateStudio = lazy(() => import("./pages/admin/CertificateStudio"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
import AdminLayout from "./components/admin/AdminLayout";
const InterviewExperiences = lazy(() => import("./pages/InterviewExperiences"));
const InterviewExperienceDetail = lazy(() => import("./pages/InterviewExperienceDetail"));
const SubmitInterviewExperience = lazy(() => import("./pages/SubmitInterviewExperience"));
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/Auth";
import ProtectedRoute from "./router/Authentication";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { AuthModal } from "./components/AuthModal";
import AdminGuard from "./router/AdminGuard";
export const DEFAULT_IMG =
  "https://api.dicebear.com/7.x/adventurer/svg?seed=NowScripts";

type AppContextType = {
  hideNavbar(val: boolean): void;
  handleToast(message: string): void;
  socket: any;
};

const Context = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  return useContext(Context) as AppContextType;
}

function PublicLayout({ notificationsCount }: { notificationsCount: number }) {
  const { isAuthenticated } = useAuth();
  return (
    <AuthModalProvider>
      <div className={`flex flex-col min-h-screen ${isAuthenticated ? "bg-[#F8FAFC] text-[#0F172A]" : "bg-now-background text-now-text"} font-sans relative`}>
        {isAuthenticated ? (
          <Navbar notificationsCount={notificationsCount} />
        ) : (
          <LandingNavbar notificationsCount={notificationsCount} />
        )}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}

function AppLayout({ notificationsCount }: { notificationsCount: number }) {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-now-primary selection:text-black">
      <Navbar notificationsCount={notificationsCount} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const { user, isLoading } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const socket = useMemo(() => io(url), []);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("Socket connection failed", err);
    });

    if (!user) return;
    socket.emit("start", { userId: user?._id });
    socket.emit("checkNotifications", { userId: user?._id });
    socket.on("notificationsCount", ({ count }) => {
      setNotificationsCount(count);
    });
    socket.on("haveNotifications", (have) => {
      if (have) {
        setNotificationsCount((prev) => prev + 1);
        handleToast("You have a new notification!");
      }
    });
  }, [socket, user]);

  function hideNavbar(val: boolean) {
    // Deprecated. We use layouts now. Kept for backwards compatibility if needed by deep components.
  }
  
  function handleToast(message: string) {
    toast((t) => <ToastComponent message={message} t={t} />, {
      style: {
        borderRadius: "4px",
        background: "#333",
        color: "#fff",
        padding: "15px 18px",
      },
    });
  }
  
  function NullifyNotificationsCount() {
    setNotificationsCount(0);
  }

  const contextValue: AppContextType = {
    hideNavbar,
    handleToast,
    socket,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-4">
        <BrandIconOnly className="h-16 w-auto animate-pulse" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-now-primary"></div>
      </div>
    );
  }

  return (
    <Context.Provider value={contextValue}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="App selection:bg-now-primary selection:text-black min-h-screen">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <BrandIconOnly className="h-12 w-auto animate-pulse" />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-now-primary"></div>
          </div>
        }>
          <Routes>
            {/* Public Layout Routes (Accessible to all, but shows AvatarMenu if logged in) */}
            <Route element={<PublicLayout notificationsCount={notificationsCount} />}>
              <Route path="/" element={<UnAuthHome />} />
              <Route path="/roadmaps" element={<RoadmapDashboard />} />
              <Route path="/roadmaps/:slug" element={<RoadmapViewer />} />
              <Route path="/certifications" element={<CertificationCenter />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
              <Route path="/interviews" element={<InterviewExperiences />} />
              <Route path="/interviews/:id" element={<InterviewExperienceDetail />} />
              <Route path="/learn" element={<LearnDashboard />} />
              <Route path="/learn/:categorySlug/:lessonSlug" element={<LearnDashboard />} />
              <Route path="/interview-prep" element={<InterviewPrepDashboard />} />
              <Route path="/interview-prep/:categoryId" element={<InterviewPrepDashboard />} />
              <Route path="/community" element={<CommunityFeed />} />
              <Route path="/tag/:tag" element={<CommunityFeed />} />
              <Route path="/projects" element={<div className="text-[#0F172A] text-center mt-20 text-2xl font-bold">Projects Coming Soon</div>} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/search/:tab/:query" element={<SearchResults />} />
              <Route path="/blog/:id" element={<Post />} />
            </Route>

            {/* Protected App Layout Routes (Requires Login) */}
            <Route element={<ProtectedRoute><AppLayout notificationsCount={notificationsCount} /></ProtectedRoute>}>
              <Route path="/interviews/submit" element={<SubmitInterviewExperience />} />
              <Route path="/profile/:username/:tab?" element={<Profile />} />
              <Route path="/user/:username/:tab?" element={<Profile />} />
              <Route path="/notifications" element={<Notifications emptyNotifications={NullifyNotificationsCount} />} />
              <Route path="/write/:postId?" element={
                <div className="write_page mx-auto w-full md:w-3/4 lg:w-1/2 h-full">
                  <Write />
                </div>
              } />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/certificates/studio" element={<CertificateStudio />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Auth Pages (No layout) */}
            <Route path="/signin/:tab" element={<SignIn />} />
            {/* Other standalone protected routes */}
            <Route path="/authredirect" element={<AuthRedirect />} />
          </Routes>
        </Suspense>
      </div>
    </Context.Provider>
  );
}

function ToastComponent({ message, t }: { message: string; t: Toast }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <span style={{ color: "white", fontFamily: "Roboto Slab", fontSize: "14px", marginRight: "30px" }}>
        {message}
      </span>
      <button
        style={{ color: "white", backgroundColor: "transparent", border: "none", outline: "none", marginLeft: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        onClick={() => toast.dismiss(t.id)}
      >
        <CloseIcon sx={{ fontSize: "17px" }} />
      </button>
    </div>
  );
}
