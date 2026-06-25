import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, Users, Activity, BarChart2, BookOpen, Target, 
  Mail, MessageSquare, Award, Briefcase, DollarSign, Settings,
  Menu, X, Server, Shield
} from "lucide-react";
import { BrandIconOnly } from "../BrandLogo";

const ADMIN_NAVIGATION = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Live Users", href: "/admin/live", icon: Activity },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Learning", href: "/admin/learning", icon: BookOpen },
  { name: "Interview Prep", href: "/admin/interviews", icon: Target },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Community", href: "/admin/community", icon: MessageSquare },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Internship Management", href: "/admin/internships", icon: Briefcase },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { name: "System Health", href: "/admin/health", icon: Server },
  { name: "Activity Logs", href: "/admin/activity", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change in mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <BrandIconOnly className="h-8 w-auto text-now-primary transition-transform group-hover:scale-110" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">Admin Console</span>
            </Link>
            <button 
              className="ml-auto lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {ADMIN_NAVIGATION.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                    ${isActive 
                      ? "bg-now-primary/10 text-now-primary dark:bg-now-primary/20 dark:text-now-primary" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-now-primary" : "text-slate-400 dark:text-slate-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Info */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-slate-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Super Admin</p>
                <Link to="/" className="text-xs text-now-primary hover:underline">Exit to platform</Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 shrink-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-8 justify-between">
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-now-primary transition-colors">
              Return to Platform
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
