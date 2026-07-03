// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  UserIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name.trim()) {
      setError("Nama harus diisi");
      return;
    }
    if (!form.username.trim()) {
      setError("Username harus diisi");
      return;
    }
    if (!form.email.trim()) {
      setError("Email harus diisi");
      return;
    }
    if (!form.password.trim()) {
      setError("Password harus diisi");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/register", form);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/50 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400/50 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-indigo-400/50 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-blue-300/50 rounded-full animate-float animation-delay-3000"></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-purple-300/50 rounded-full animate-float animation-delay-1500"></div>
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-indigo-300/50 rounded-full animate-float animation-delay-2500"></div>
        
        {/* Gradient Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse-slow"></div>
        
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
          
          {/* Sparkle Decoration */}
          <div className="absolute -top-3 -right-3">
            <SparklesIcon className="w-6 h-6 text-blue-400/70 animate-pulse-slow" />
          </div>
          <div className="absolute -bottom-3 -left-3">
            <SparklesIcon className="w-5 h-5 text-purple-400/70 animate-pulse-slow animation-delay-2000" />
          </div>

          {/* Logo / Brand - lebih kecil */}
          <div className="text-center mb-5">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse-slow"></div>
              <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-3 ring-2 ring-blue-400/20">
                <SparklesIcon className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SocialScheduler
            </h1>
            <p className="text-slate-400 mt-1 text-xs flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ✨ Buat akun baru Anda
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-400 text-xs backdrop-blur-sm animate-shake">
              <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2 text-emerald-400 text-xs backdrop-blur-sm">
              <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Registrasi berhasil! Mengalihkan ke login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div className="group">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder:text-slate-500 text-white hover:border-slate-600"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="group">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder:text-slate-500 text-white hover:border-slate-600"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder:text-slate-500 text-white hover:border-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder:text-slate-500 text-white hover:border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {form.password.length > 0 && form.password.length < 6 && (
                  <span className="text-yellow-400">
                    ⚠️ Password minimal 6 karakter
                  </span>
                )}
                {form.password.length >= 6 && (
                  <span className="text-emerald-400">
                    ✅ Password kuat
                  </span>
                )}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-1.5">
              <input
                type="checkbox"
                id="terms"
                className="w-3.5 h-3.5 mt-0.5 bg-slate-900/50 border-slate-700 rounded focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
                Saya setuju dengan{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                >
                  Syarat & Ketentuan
                </button>{" "}
                dan{" "}
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                >
                  Kebijakan Privasi
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-sm text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Mendaftar...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-xs text-slate-400">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
              >
                Masuk di sini ✨
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-blue-500"></span>
              SocialScheduler v1.0 • Manage your content easier
              <span className="w-1 h-1 rounded-full bg-purple-500"></span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}