import React, { useEffect, useState } from "react";
import API from "../api";
import { 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Megaphone, 
  Info,
  Clock,
  Calendar,
  FileText,
  Award,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Bell,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Static values for the bottom row stats (Unchanged logic)
  const [stats] = useState({ 
    employees: 25,        
    activeTasks: 8,       
    performance: 92       
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // 2. Dynamic fetch for announcements only (Unchanged logic)
        const res = await API.get("/announcements");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    /* 
      DRIBBBLE CANVAS BLUEPRINT BACKGROUND
      Combines a mesh gradient with soft ambient light orbs and a crisp engineering grid.
    */
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Decorative Dribbble Soft Glow Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Modern Dribbble Utilities & Welcome Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Workspace Core</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your team today.</p>
          </div>
          
          {/* Mock Global Dashboard Search & Notifications (Standard Dribbble Aesthetic) */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-60 shadow-sm" />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl relative hover:bg-slate-50 transition shadow-sm">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* DRIBBBLE METRIC CARDS (Using high-contrast glassmorphism profiles) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<Users size={22} />} 
            label="Total Employees" 
            value={stats.employees} 
            themeColor="text-blue-600"
            bgColor="bg-blue-600/5"
            borderColor="hover:border-blue-200"
          />
          <StatCard 
            icon={<CheckSquare size={22} />} 
            label="Active Tasks" 
            value={stats.activeTasks} 
            themeColor="text-emerald-600"
            bgColor="bg-emerald-600/5"
            borderColor="hover:border-emerald-200"
          />
          <StatCard 
            icon={<TrendingUp size={22} />} 
            label="Avg Performance" 
            value={`${stats.performance}%`} 
            themeColor="text-purple-600"
            bgColor="bg-purple-600/5"
            borderColor="hover:border-purple-200"
          />
        </div>

        {/* MODERN 2-COLUMN DRIBBBLE ASYMMETRIC GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT 2-COLUMNS: Workspace Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task Tracking Hub Element */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Deliverables Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time team synchronization tasks</p>
                </div>
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                  View Schedule <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Process Pending Loan Request Queues</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Finance Administration Matrix</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Review Employee Attendance Submissions</h4>
                      <p className="text-xs text-slate-400 mt-0.5">HR Operations Workflow</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Actions Panel with Custom UI Interaction States */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Quick Operations Panel</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ActionButton icon={<Clock size={20} />} label="Log Attendance" />
                <ActionButton icon={<Calendar size={20} />} label="Request Leave" />
                <ActionButton icon={<FileText size={20} />} label="Payroll Slips" />
                <ActionButton icon={<Award size={20} />} label="Appraisals" />
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN: Updates & Marketing Cards */}
          <div className="space-y-6">
            
            {/* Dynamic Dribbble Styled Broadcast Station Feed */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Megaphone size={16} />
                </div>
                <div>
                  <h2 className="text-md font-bold text-slate-900">Broadcast Station</h2>
                  <p className="text-[11px] text-slate-400">Live organization alerts</p>
                </div>
              </div>
              
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <div 
                      key={item._id} 
                      className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col gap-2"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500 group-hover:w-1.5 transition-all" />
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  {loading ? "Fetching real-time updates..." : "No active announcements to show."}
                </div>
              )}
            </div>

            {/* Premium Radial Dark Accent Card */}
            <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 shadow-xl bg-[radial-gradient(circle_at_top_right,#3b82f635,transparent_55%)] border border-slate-800">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="p-2 bg-white/10 border border-white/10 rounded-xl w-fit text-blue-400 mb-4 backdrop-blur-sm">
                    <ShieldAlert size={20} />
                  </div>
                  <h3 className="font-bold text-md text-white tracking-wide">IT Support Center</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Encountering authentication delays or profile sync discrepancies?
                  </p>
                </div>
                <button className="mt-5 w-full bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-xs font-bold py-2.5 rounded-xl">
                  Open Workspace Ticket
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Dribbble High-Fidelity Refactored Stat Component
const StatCard = ({ icon, label, value, themeColor, bgColor, borderColor }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center justify-between transition-all duration-300 border-b-2 hover:translate-y-[-2px] ${borderColor}`}>
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
    </div>
    <div className={`p-3.5 rounded-2xl ${themeColor} ${bgColor} transition-transform duration-300`}>
      {icon}
    </div>
  </div>
);

// Modular helper for beautiful dashboard shortcut keys
const ActionButton = ({ icon, label }) => (
  <button className="p-4 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 shadow-sm/5 hover:shadow-md hover:border-blue-100 text-center transition-all duration-200 flex flex-col items-center gap-2.5 group">
    <div className="text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
);

export default Dashboard;
