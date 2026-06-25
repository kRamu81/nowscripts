import React, { useEffect, useState } from "react";
import { 
  Users, Activity, UserPlus, Fingerprint, Award, FileText, Layout,
  Server, MonitorPlay, Zap, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { format } from "date-fns";
import { httpRequest } from "../../interceptor/axiosInterceptor";
import { url } from "../../baseUrl";
import { useAppContext } from "../../App";

// Interfaces
interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsersToday: number;
  googleSignins: number;
  emailSignins: number;
  usersOnlineNow: number;
}

interface UserGrowth {
  _id: string;
  count: number;
}

interface ContentStats {
  learning: { totalCourses: number; totalLessons: number; totalRoadmaps: number };
  community: { totalPosts: number };
  certificates: { issued: number };
  newsletter: { totalArticles: number };
}

interface SystemHealth {
  backendStatus: string;
  databaseStatus: string;
  socketIoStatus: string;
  serverUptime: number;
  memoryUsage: string;
  cpuModel: string;
  platform: string;
}

interface LiveUser {
  socketId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  currentPage: string;
  browser: string;
  device: string;
  loginTime: string;
  lastActivity: string;
}

interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  timestamp: string;
  userId?: { name: string; avatar: string; email: string };
  details?: string;
}

interface RecentUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { socket } = useAppContext();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growth, setGrowth] = useState<UserGrowth[]>([]);
  const [content, setContent] = useState<ContentStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchLiveData, 10000); // refresh health and live users every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        { data: statsData },
        { data: growthData },
        { data: contentData },
        { data: activityData },
        { data: recentUsersData }
      ] = await Promise.all([
        httpRequest.get(`${url}/admin/dashboard`),
        httpRequest.get(`${url}/admin/user-growth`),
        httpRequest.get(`${url}/admin/content-analytics`),
        httpRequest.get(`${url}/admin/activity?limit=5`),
        httpRequest.get(`${url}/admin/recent-users?limit=5`)
      ]);

      setStats(statsData);
      setGrowth(growthData.dailyRegistrations);
      setContent(contentData);
      setActivities(activityData.activities);
      setRecentUsers(recentUsersData.users);
      setLoading(false);
      fetchLiveData();
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      const [{ data: liveData }, { data: healthData }] = await Promise.all([
        httpRequest.get(`${url}/admin/live-users`),
        httpRequest.get(`${url}/admin/system-health`)
      ]);
      setLiveUsers(liveData.users);
      setHealth(healthData);
      if (stats) {
        setStats(prev => prev ? { ...prev, usersOnlineNow: liveData.users.length } : null);
      }
    } catch (error) {
      console.error("Failed to fetch live data", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-now-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live Analytics Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          trend={`+${stats?.newUsersToday || 0} today`}
          trendUp={true}
        />
        <StatsCard 
          title="Users Online Now" 
          value={stats?.usersOnlineNow || 0} 
          icon={<Activity className="w-5 h-5 text-emerald-500" />} 
          trend="Real-time"
          trendUp={true}
        />
        <StatsCard 
          title="Active Users Today" 
          value={stats?.activeUsersToday || 0} 
          icon={<Fingerprint className="w-5 h-5 text-purple-500" />} 
          trend={`vs ${stats?.newUsersThisWeek || 0} this week`}
          trendUp={true}
        />
        <StatsCard 
          title="Total Courses" 
          value={content?.learning.totalCourses || 0} 
          icon={<Layout className="w-5 h-5 text-orange-500" />} 
          trend={`${content?.learning.totalLessons || 0} lessons total`}
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">User Growth (Last 30 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="_id" 
                  tickFormatter={(val) => format(new Date(val), "MMM dd")}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dx={-10}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#38bdf8" }}
                  labelFormatter={(val) => format(new Date(val as string), "MMM dd, yyyy")}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-400" />
            System Health
          </h2>
          
          <div className="space-y-6">
            <HealthMetric 
              label="Backend API" 
              value={health?.backendStatus || "Checking"} 
              status={health?.backendStatus === "Online" ? "good" : "warning"} 
            />
            <HealthMetric 
              label="MongoDB" 
              value={health?.databaseStatus || "Checking"} 
              status="good" 
            />
            <HealthMetric 
              label="Socket.IO" 
              value={health?.socketIoStatus || "Checking"} 
              status="good" 
            />
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Memory Usage</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{health?.memoryUsage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${parseFloat(health?.memoryUsage || "0") > 80 ? "bg-red-500" : "bg-now-primary"}`} 
                  style={{ width: `${health?.memoryUsage || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Uptime</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {health ? Math.floor(health.serverUptime / 3600) : 0}h {health ? Math.floor((health.serverUptime % 3600) / 60) : 0}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Live Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-emerald-500" />
              Live Users ({liveUsers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Current Page</th>
                  <th className="px-6 py-3 font-medium">Device/Browser</th>
                  <th className="px-6 py-3 font-medium">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {liveUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No users currently online.</td>
                  </tr>
                ) : (
                  liveUsers.slice(0, 5).map((u) => (
                    <tr key={u.socketId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{u.currentPage}</td>
                      <td className="px-6 py-4 text-xs">{u.device} • {u.browser}</td>
                      <td className="px-6 py-4 text-xs text-emerald-500">Just now</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              Recent Registrations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                        <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">{u.email}</td>
                    <td className="px-6 py-4 text-xs">{format(new Date(u.createdAt), "MMM dd, yyyy")}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${u.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Revenue (Disabled) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Content Overview</h2>
          <div className="space-y-4">
            <ContentStatRow icon={<FileText />} label="Community Posts" value={content?.community.totalPosts || 0} />
            <ContentStatRow icon={<Award />} label="Certificates Issued" value={content?.certificates.issued || 0} />
            <ContentStatRow icon={<Layout />} label="Roadmaps" value={content?.learning.totalRoadmaps || 0} />
            <ContentStatRow icon={<Zap />} label="Newsletter Articles" value={content?.newsletter.totalArticles || 0} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 opacity-75 relative overflow-hidden group">
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/80 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity">
            <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-medium">
              Coming Soon
            </div>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
            Revenue Analytics
            <span className="text-xs bg-now-primary/10 text-now-primary px-2 py-1 rounded">Beta</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-slate-500 text-sm mb-1">Total Revenue</div>
              <div className="text-2xl font-bold">₹0.00</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-slate-500 text-sm mb-1">Premium Members</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
        <div className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function HealthMetric({ label, value, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <span className={`text-sm font-medium ${status === 'good' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {value}
      </span>
    </div>
  );
}

function ContentStatRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
