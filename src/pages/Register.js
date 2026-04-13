import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", { email, password });
      toast.success("Registered successfully");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error registering")
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
