import React, { useEffect, useState } from "react";
import API from "../api";
import { 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Megaphone, 
  AlertCircle, 
  Info 
} from "lucide-react";

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await API.get("/announcements");
        // Handle both direct arrays or wrapped data objects
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-slate-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500">Here's what's happening with your team today.</p>
      </div>

      {/* ANNOUNCEMENT SECTION */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-700">Recent Announcements</h2>
        </div>
        
        {announcements.length > 0 ? (
          <div className="grid gap-4">
            {announcements.map((item) => (
              <div 
                key={item._id} 
                className={`p-5 rounded-2xl border-l-4 bg-white shadow-sm transition-transform hover:scale-[1.01] ${
                  item.priority === 'High' ? 'border-red-500 bg-red-50/30' : 'border-blue-500'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-2 rounded-xl h-fit ${
                    item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.priority === 'High' ? <AlertCircle size={20} /> : <Info size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
            {loading ? "Loading updates..." : "No recent announcements to show."}
          </div>
        )}
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Employees" value="0" color="bg-blue-50" />
        <StatCard icon={<CheckSquare className="text-emerald-600" />} label="Active Tasks" value="0" color="bg-emerald-50" />
        <StatCard icon={<TrendingUp className="text-purple-600" />} label="Avg Performance" value="0%" color="bg-purple-50" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
