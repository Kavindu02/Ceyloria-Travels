import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function login(e) {
    e?.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email, password })
      .then((res) => {
        // save token if present
        const token = res.data?.token ?? res.data?.data?.token;
        if (token) localStorage.setItem("token", token);

        // determine role
        let role = res.data?.role ?? res.data?.user?.role ?? res.data?.data?.role;
        if (!role && token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = payload?.role ?? payload?.user?.role ?? (payload?.isAdmin ? "admin" : undefined);
          } catch (err) {
            // ignore decode errors
          }
        }

        // persist role
        if (role) localStorage.setItem("role", role);
        toast.success("Login Successful");
        navigate(role === "admin" ? "/admin" : "/");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login Failed");
      });
  }

  return (
    <div className="relative min-h-screen w-full font-sans text-white">
      {/* Background Image - Replace 'travelbg.jpg' with a high-quality Sri Lanka image (e.g., Sigiriya or Nine Arch Bridge) */}
      <div 
        className="absolute inset-0 bg-[url(./travelbg.jpg)] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      
      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm">
              Sign in to continue your journey through paradise.
            </p>
          </div>

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-white/70 pl-1">
                  Password
                </label>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 transition-all duration-300 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <Link 
                to="/forget" 
                className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
              >
                {/* Forgot Password? */}
              </Link>
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-red-600 p-3.5 font-bold text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-900/40 active:scale-[0.98]"
            >
              <span className="relative z-10">Sign In</span>
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              {/* New to our platform?{" "} */}
              <Link 
                to="/register" 
                className="font-semibold text-white hover:text-orange-400 underline decoration-orange-500/50 underline-offset-4 transition-all hover:decoration-orange-400"
              >
                {/* Create an account */}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}