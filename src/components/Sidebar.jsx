import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/posts", label: "Posts", icon: DocumentTextIcon },
    { path: "/create-post", label: "Create Post", icon: PlusCircleIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-4 hidden lg:block z-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">SocialScheduler</h1>
        <p className="text-slate-400 text-sm">Social Media Scheduler</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-4 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400">SocialScheduler v1.0</p>
          <p className="text-xs text-slate-500">Manage your content easier 🚀</p>
        </div>
      </div>
    </aside>
  );
}