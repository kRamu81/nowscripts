import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  carrotIcon,
  mediumLogo,
  NotificationIcon,
  writeBlogIcon,
} from "../assets/icons";
import { useAuth } from "../contexts/Auth";
import { useAuthModal } from "../contexts/AuthModalContext";
import AvatarMenu from "./AvatarMenu";
import Search from "./Search";
import { BrandLogo } from "./BrandLogo";

export default function Navbar({
  notificationsCount,
}: {
  notificationsCount: number;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  return (
    <>
      <nav
        style={{
          height: "56px",
          borderBottom: "solid 1px #E2E8F0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="left"
          style={{
            marginLeft: "23px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "17px",
          }}
        >
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-1 text-[#64748B] hover:text-[#0F172A]"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="hidden md:block"><BrandLogo /></Link>
          <div className="hidden md:block">
            <Search />
          </div>
        </div>
        <div
          className="right"
          style={{
            marginRight: "25px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            height: "100%",
          }}
        >
          <Link to="/learn" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Learn</Link>
          <Link to="/roadmaps" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Roadmaps</Link>
          <Link to="/projects" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Projects</Link>
          <Link to="/interview-prep" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Interview Prep</Link>
          <Link to="/community" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Community</Link>
          <Link to="/newsletter" className="hidden md:block" style={{ textDecoration: "none", color: "#64748B", fontSize: "14px", whiteSpace: "nowrap" }}>Newsletter</Link>
          
          {isAuthenticated ? (
            <Link
              to="/write"
              className="writeBtn"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "gray",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "#64748B" }}>
                {writeBlogIcon}
              </span>
              <p style={{ fontSize: "14.5px", marginTop: "-4px", color: "#64748B" }}>Share Content</p>
            </Link>
          ) : (
            <button
              onClick={() => openModal('login', () => window.location.href = '/write', 'Please log in to share content.')}
              className="writeBtn"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "gray",
                gap: "8px",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#64748B" }}>
                {writeBlogIcon}
              </span>
              <p style={{ fontSize: "14.5px", marginTop: "-4px", color: "#64748B" }}>Share Content</p>
            </button>
          )}

          <div className="notifactionBtn">
            <Link
              to="/notifications"
              style={{
                color: "#64748B",
                textDecoration: "none",
                position: "relative",
              }}
            >
              {NotificationIcon}
              {notificationsCount > 0 && (
                <span
                  style={{
                    fontSize: "9.5px",
                    position: "absolute",
                    top: "-15px",
                    right: "-5px",
                    backgroundColor: "#1a8917",
                    color: "white",
                    padding: "3px 3.75px",
                    borderRadius: "4px",
                  }}
                >
                  {notificationsCount}
                </span>
              )}
            </Link>
          </div>
          <AvatarMenu />
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
        {isMobileMenuOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
                <BrandLogo />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-md"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col space-y-1 px-4">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Home</Link>
                  <Link to="/learn" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Learn</Link>
                  <Link to="/roadmaps" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Roadmaps</Link>
                  <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Projects</Link>
                  <Link to="/interview-prep" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Interview Prep</Link>
                  <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Community</Link>
                  <Link to="/newsletter" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] rounded-md font-medium">Newsletter</Link>
                </nav>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
