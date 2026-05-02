import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, ClipboardList, Users, Calendar, Award, CreditCard, TrendingUp } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("email") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path 
      ? "bg-blue-600 text-white shadow-md" 
      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight hidden lg:block">
              EMS Pro
            </span>
          </Link>

          {token && (
            <div className="hidden md:flex items-center space-x-1 font-medium text-sm">
              <NavLink to="/dashboard" icon={<LayoutDashboard size={16}/>} label="Dashboard" active={isActive("/dashboard")} />
              <NavLink to="/tasks" icon={<ClipboardList size={16}/>} label="Tasks" active={isActive("/tasks")} />
              <NavLink to="/employees" icon={<Users size={16}/>} label="Employees" active={isActive("/employees")} />
              <NavLink to="/attendance" icon={<Award size={16}/>} label="Attendance" active={isActive("/attendance")} />
              <NavLink to="/leave" icon={<Calendar size={16}/>} label="Leave" active={isActive("/leave")} />
              <NavLink to="/performance" icon={<TrendingUp size={16}/>} label="Performance" active={isActive("/performance")} />
              <NavLink to="/payroll" icon={<CreditCard size={16}/>} label="Payroll" active={isActive("/payroll")} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <div className="flex flex-col items-end mr-2 hidden sm:block">
                <span className="text-xs text-slate-400 font-medium leading-none">Logged in as</span>
                <span className="text-sm font-semibold text-slate-700">{userName.split('@')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-transparent hover:border-red-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-blue-200 shadow-lg transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${active}`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}
