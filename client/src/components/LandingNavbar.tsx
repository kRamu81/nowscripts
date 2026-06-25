import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NotificationIcon } from "../assets/icons";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";
import AvatarMenu from "./AvatarMenu";
import { BrandLogo } from "./BrandLogo";

export default function LandingNavbar({ notificationsCount = 0 }: { notificationsCount?: number }) {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
    <div className="w-full h-20 bg-now-background/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-1 text-gray-300 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-white hover:text-now-primary transition-colors hidden md:block">
            <BrandLogo textColor="text-white" hideTextOnMobile={true} />
          </Link>
        </div>

        {/* Right Side: Links & CTA */}
        <div className="flex items-center gap-6">
          <Link to="/learn" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Learn
          </Link>
          <Link to="/newsletter" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Newsletter
          </Link>
          <Link to="/community" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Community
          </Link>
          <Link to="#" className="hidden lg:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Projects
          </Link>
          <Link to="/interview-prep" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors hidden md:block">
            Interview Prep
          </Link>
          <Link to={isAuthenticated ? "/write" : "/signin/write"} className="hidden sm:flex text-sm font-medium text-now-primary hover:text-now-accent transition-colors">
            Share Content
          </Link>
          
          <div className="flex items-center gap-3 ml-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => openModal('login')}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-now-primary transition-colors rounded-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openModal('signup')}
                  className="px-5 py-2.5 text-sm font-bold text-now-background bg-now-primary hover:bg-now-accent transition-colors rounded-full shadow-[0_0_15px_rgba(0,192,139,0.3)] hover:shadow-[0_0_20px_rgba(0,192,139,0.5)]"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4 h-full">
                <Link
                  to="/notifications"
                  className="relative text-gray-400 hover:text-white transition-colors"
                >
                  {NotificationIcon}
                  {notificationsCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 bg-now-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    >
                      {notificationsCount}
                    </span>
                  )}
                </Link>
                <AvatarMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-now-background border-r border-gray-800 z-50 flex flex-col shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <BrandLogo textColor="text-white" hideTextOnMobile={false} className="scale-90 origin-left" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-300 hover:text-white rounded-md"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col space-y-1 px-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Home</Link>
                <Link to="/learn" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Learn</Link>
                <Link to="/newsletter" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Newsletter</Link>
                <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Projects</Link>
                <Link to="/interview-prep" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Interview Prep</Link>
                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md font-medium">Community</Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
