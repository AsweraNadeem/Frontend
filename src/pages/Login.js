import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calls your backend at http://localhost:5000/auth/login
      const res = await API.post("/auth/login", { email, password });
      
      toast.success("Logged In successfully");

      // Store the JWT and user email for the session
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email || email);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || "Invalid Credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 rounded-lg transition`}
          >
            {loading ? "Connecting..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}