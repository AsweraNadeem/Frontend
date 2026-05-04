// ... imports stay the same

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Set your STATIC values here for the bottom rows
  const [stats] = useState({ 
    employees: 25,        // Static Total Employees
    activeTasks: 8,       // Static Active Tasks
    performance: 92       // Static Avg Performance
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // 2. ONLY fetch announcements to keep them linked with your form
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-slate-50">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500">Here's what's happening with your team today.</p>
      </div>

      {/* ANNOUNCEMENT SECTION (This stays dynamic/linked) */}
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
                className="p-6 rounded-3xl border-l-[6px] border-blue-500 bg-white shadow-sm flex items-start gap-4"
              >
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Info size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                      <p className="text-slate-600 mt-1">{item.message}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
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

      {/* STATIC STATISTICS ROWS (These will not change) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Employees" 
          value={stats.employees} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<CheckSquare className="text-emerald-600" />} 
          label="Active Tasks" 
          value={stats.activeTasks} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-600" />} 
          label="Avg Performance" 
          value={`${stats.performance}%`} 
          color="bg-purple-50" 
        />
      </div>
    </div>
  );
};
