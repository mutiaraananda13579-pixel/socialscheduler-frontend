// frontend/src/layouts/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/UserContext"; 
import {
  HomeIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  BellIcon, 
} from "@heroicons/react/24/outline";
import api from "../api/axios";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, setUser, loading } = useUser(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); 
  
  // State untuk menyimpan data postingan yang gagal secara dinamis
  const [failedPosts, setFailedPosts] = useState([]);

  // Mengambil data postingan secara otomatis (polling background)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/posts");
        // Memfilter data postingan yang statusnya 'failed'
        const failedData = response.data.filter((post) => post.status === "failed");
        setFailedPosts(failedData);
      } catch (error) {
        console.error("Gagal memuat data notifikasi:", error);
      }
    };

    // Jalankan langsung saat komponen pertama kali dirender
    fetchNotifications();

    // Cek otomatis ke API setiap 3 detik agar langsung muncul tanpa refresh halaman
    const interval = setInterval(fetchNotifications, 3000);
    
    // Bersihkan interval saat komponen dilepas agar tidak memicu memory leak
    return () => clearInterval(interval);
  }, []);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('/storage/')) {
      return `http://127.0.0.1:8000${avatar}`;
    }
    return `http://127.0.0.1:8000/storage/${avatar}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Buat Post", path: "/create-post", icon: PlusCircleIcon },
    { name: "Semua Post", path: "/posts", icon: DocumentTextIcon },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/create-post") return "Buat Post";
    if (path === "/posts") return "Semua Post";
    if (path.includes("/posts/edit")) return "Edit Post";
    if (path === "/profile") return "Profile";
    if (path === "/settings") return "Settings";
    return "";
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 text-slate-100" 
        : "bg-gradient-to-br from-rose-50 via-purple-50/30 to-blue-50/50 text-gray-800"
    }`}>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex fixed top-0 left-0 h-full w-64 z-40 transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-b from-slate-800/95 via-slate-800/90 to-purple-900/30 border-slate-700/50 backdrop-blur-xl" 
          : "bg-gradient-to-b from-white/95 via-white/90 to-purple-50/50 border-gray-200/50 backdrop-blur-xl"
      } border-r flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-transparent">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-slow">
              <CalendarDaysIcon className="w-7 h-7 text-white drop-shadow-sm" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 ${darkMode ? "border-slate-800" : "border-white"} shadow-lg shadow-emerald-400/50`}>
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              SocialScheduler
            </h1>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
              ✨ Content Manager
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                    : darkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                      : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive && !darkMode ? "text-purple-600" : 
                  isActive && darkMode ? "text-purple-300" : ""
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-purple-400" : "bg-purple-600"
                  } shadow-lg shadow-purple-500/50 animate-pulse`}></span>
                )}
              </Link>
            );
          })}

          <div className={`h-px my-4 ${darkMode ? "bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"}`} />

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/settings"
                ? darkMode
                  ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                  : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/profile"
                ? darkMode
                  ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                  : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className={`border-t ${darkMode ? "border-slate-700/50" : "border-gray-200/50"}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 transition-all duration-300 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* NAVBAR / HEADER */}
        <header className={`sticky top-0 z-30 transition-all duration-500 ${
          darkMode 
            ? "bg-slate-800/80 backdrop-blur-xl border-slate-700/50" 
            : "bg-white/80 backdrop-blur-xl border-gray-200/50"
        } border-b px-4 py-3 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-xl transition-all duration-300 lg:hidden ${
                  darkMode ? "hover:bg-slate-700/50 text-white" : "hover:bg-purple-50 text-gray-900"
                }`}
              >
                {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>

              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  SocialScheduler
                </span>
              </div>

              <h1 className={`hidden lg:block text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {getPageTitle()}
              </h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? "hover:bg-slate-700/50 text-amber-400 hover:text-amber-300" 
                    : "hover:bg-purple-50 text-purple-600 hover:text-purple-700"
                }`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {/* Tombol Notifikasi */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setDropdownOpen(false); 
                  }}
                  className={`p-2 rounded-xl relative transition-all duration-300 ${
                    darkMode 
                      ? "hover:bg-slate-700/50 text-slate-300 hover:text-white" 
                      : "hover:bg-purple-50 text-gray-600 hover:text-purple-600"
                  }`}
                  title="Notifikasi"
                >
                  <BellIcon className="w-5 h-5" />
                  
                  {/* BADGE DINAMIS: Cek realtime jumlah failedPosts */}
                  {failedPosts.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {failedPosts.length}
                    </span>
                  )}
                </button>

                {/* Dropdown Box Notifikasi */}
                {notificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden transition-all duration-300 ${
                      darkMode 
                        ? "bg-slate-800/95 backdrop-blur-xl border border-slate-700/50" 
                        : "bg-white/95 backdrop-blur-xl border border-gray-200/50"
                    }`}>
                      <div className={`px-4 py-2 font-semibold text-sm border-b ${darkMode ? "border-slate-700/50 text-white" : "border-gray-200 text-gray-900"}`}>
                        Pemberitahuan
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50">
                        {failedPosts.length === 0 ? (
                          <div className={`p-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                            Tidak ada notifikasi baru
                          </div>
                        ) : (
                          failedPosts.map((post) => (
                            <div 
                              key={post.id} 
                              className={`p-4 text-left transition-colors ${
                                darkMode 
                                  ? "hover:bg-slate-700/30" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start gap-1">
                                <div>
                                  <p className="text-sm font-medium text-rose-500">
                                    Postingan Gagal Diterbitkan ❌
                                  </p>
                                  <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                    Postingan '{post.title || "Tanpa Judul"}' {post.error_message || "gagal terunggah - Tidak dapat diedit."}
                                  </p>
                                  <span className={`text-[10px] block mt-2 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                                    {post.created_at_relative || "Baru saja"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotificationOpen(false); 
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                    darkMode ? "hover:bg-slate-700/50" : "hover:bg-purple-50"
                  } group`}
                >
                  <div className="relative flex-shrink-0">
                    {user?.avatar ? (
                      <img 
                        src={getAvatarUrl(user.avatar)} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/20">
                        <span className="text-sm font-bold text-white">
                          {loading ? "..." : user ? getInitials(user.name) : "U"}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 ${darkMode ? "border-slate-800" : "border-white"} shadow-lg shadow-emerald-400/50`}>
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                    </div>
                  </div>

                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium truncate max-w-[120px] ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {loading ? "Loading..." : user ? user.name : "Guest"}
                    </p>
                    <p className={`text-xs truncate max-w-[120px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      {loading ? "..." : user ? user.email : "guest@example.com"}
                    </p>
                  </div>

                  <ChevronDownIcon className={`hidden md:block w-4 h-4 transition-all duration-300 ${
                    darkMode ? "text-slate-400 group-hover:text-white" : "text-gray-400 group-hover:text-purple-600"
                  }`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl z-50 py-1 overflow-hidden transition-all duration-300 ${
                      darkMode 
                        ? "bg-slate-800/95 backdrop-blur-xl border border-slate-700/50" 
                        : "bg-white/95 backdrop-blur-xl border border-gray-200/50"
                    }`}>
                      <div className={`px-4 py-3 border-b ${darkMode ? "border-slate-700/50" : "border-gray-200/50"}`}>
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img 
                              src={getAvatarUrl(user.avatar)} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center ring-2 ring-purple-400/20">
                              <span className="text-sm font-bold text-white">
                                {loading ? "..." : user ? getInitials(user.name) : "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {loading ? "Loading..." : user ? user.name : "Guest"}
                            </p>
                            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                              {loading ? "..." : user ? user.email : "guest@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-300 ${
                          darkMode 
                            ? "text-slate-300 hover:text-white hover:bg-slate-700/50" 
                            : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-300 ${
                          darkMode 
                            ? "text-slate-300 hover:text-white hover:bg-slate-700/50" 
                            : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>

                      <div className={`border-t ${darkMode ? "border-slate-700/50" : "border-gray-200/50"}`}>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-300"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER UTAMA */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-all duration-500 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${darkMode ? "bg-slate-800/95 backdrop-blur-xl border-slate-700/50" : "bg-white/95 backdrop-blur-xl border-gray-200/50"} border-r flex flex-col shadow-2xl`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <CalendarDaysIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              SocialScheduler
            </h1>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
              ✨ Content Manager
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                    : darkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                      : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          <div className={`h-px my-4 ${darkMode ? "bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"}`} />

          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/settings"
                ? darkMode
                  ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                  : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>

          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/profile"
                ? darkMode
                  ? "bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : "bg-gradient-to-r from-purple-100/80 via-pink-100/50 to-blue-100/50 text-purple-700 border border-purple-200/50 shadow-lg shadow-purple-500/10"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border hover:border-slate-600/50"
                  : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 hover:border hover:border-purple-200/50"
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </nav>

        <div className={`border-t ${darkMode ? "border-slate-700/50" : "border-gray-200/50"}`}>
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 transition-all duration-300 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}