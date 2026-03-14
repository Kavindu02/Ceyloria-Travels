import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, formData);
      toast.success(res.data.message || "Signed up successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-white">
      {/* Background Image - Matches Login Page */}
      <div 
        className="absolute inset-0 bg-[url(./travelbg.jpg)] bg-cover bg-center bg-no-repeat fixed"
        aria-hidden="true"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Start Your Adventure
            </h1>
            <p className="text-white/60 text-sm">
              Create an account to explore the beauty of Sri Lanka.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Name Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Saman"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Perera"
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="saman@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="+94 7X XXX XXXX"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-red-600 p-3.5 font-bold text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-900/40 active:scale-[0.98]"
            >
              <span className="relative z-10">Create Account</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-semibold text-white hover:text-orange-400 underline decoration-orange-500/50 underline-offset-4 transition-all hover:decoration-orange-400"
              >
                {/* Login here */}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}