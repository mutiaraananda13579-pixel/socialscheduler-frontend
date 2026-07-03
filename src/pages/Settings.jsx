// frontend/src/pages/Settings.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { 
  Cog6ToothIcon, 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon // BellIcon sudah dihapus dari sini
} from "@heroicons/react/24/outline";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDarkMode } from "../context/DarkModeContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Bagian Notifikasi sudah dihapus dari array ini
  const settingsSections = [
    {
      title: "Profil",
      icon: UserIcon,
      description: "Kelola informasi profil Anda",
      link: "/profile",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Keamanan",
      icon: ShieldCheckIcon,
      description: "Ubah password dan keamanan akun",
      link: "/keamanan",
      color: "from-red-500 to-orange-500"
    }
  ];

  const bgCard = darkMode ? 'bg-slate-800' : 'bg-white';
  const borderCard = darkMode ? 'border-slate-700' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-gray-500';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
            <Cog6ToothIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Pengaturan</h1>
            <p className={`text-sm ${textSecondary}`}>
              Kelola akun dan preferensi aplikasi Anda
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                {darkMode ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`font-medium ${textPrimary}`}>
                  {darkMode ? "Mode Gelap" : "Mode Terang"}
                </h3>
                <p className={`text-sm ${textSecondary}`}>
                  {darkMode ? "Gunakan tema gelap" : "Gunakan tema terang"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                darkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                  darkMode ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Mengubah md:grid-cols-3 menjadi md:grid-cols-2 agar grid rapi karena sisa 2 item */}
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-500/30 cursor-pointer group`}
                onClick={() => {
                  if (section.link) {
                    navigate(section.link);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${textPrimary} group-hover:text-purple-500 transition-colors`}>
                      {section.title}
                    </h3>
                    <p className={`text-sm ${textSecondary} mt-1`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Account Info */}
        <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-colors duration-300`}>
          <h3 className={`font-medium ${textPrimary} mb-4`}>Informasi Akun</h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
              <UserIcon className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${textSecondary}`}>Nama</p>
                <p className={`text-sm font-medium ${textPrimary}`}>
                  {user?.name || "User"}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
              <EnvelopeIcon className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${textSecondary}`}>Email</p>
                <p className={`text-sm font-medium ${textPrimary}`}>
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}