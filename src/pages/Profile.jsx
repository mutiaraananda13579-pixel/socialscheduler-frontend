// frontend/src/pages/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { 
  UserIcon, 
  EnvelopeIcon, 
  CameraIcon, 
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDarkMode } from "../context/DarkModeContext";

export default function Profile() {
  const { user, setUser, updateAvatar } = useUser(); // ✅ Ambil updateAvatar
  const { darkMode } = useDarkMode();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("📡 Mengambil data profil...");
      
      const res = await api.get('/profile');
      console.log("✅ Data profil:", res.data);
      
      const userData = res.data.user;
      
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
      });
      
      if (userData.avatar) {
        let avatarUrl = userData.avatar;
        if (!avatarUrl.startsWith('http')) {
          avatarUrl = `http://127.0.0.1:8000/storage/${userData.avatar}`;
        }
        setAvatar(avatarUrl);
        setAvatarPreview(avatarUrl);
      }
      
      // Update user context
      if (setUser) {
        setUser(userData);
      }
      
    } catch (err) {
      console.error('❌ Error mengambil profil:', err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Gagal memuat data profil" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: "error", text: "File harus berupa gambar" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran gambar maksimal 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setIsUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      console.log("📤 Mengupload avatar...");
      
      const res = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ Avatar berhasil diupload:", res.data);

      let avatarUrl = res.data.avatar;
      if (!avatarUrl.startsWith('http')) {
        avatarUrl = `http://127.0.0.1:8000${res.data.avatar}`;
      }
      
      setAvatar(avatarUrl);
      setAvatarPreview(avatarUrl);
      
      // ✅ UPDATE AVATAR MENGGUNAKAN FUNGSI DARI CONTEXT - LANGSUNG UPDATE SEMUA KOMPONEN
      updateAvatar(avatarUrl);
      
      setMessage({ type: "success", text: "Foto profil berhasil diupload!" });
      
      // Refresh data profil
      await fetchProfile();
      
    } catch (err) {
      console.error('❌ Error upload:', err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Gagal upload foto" 
      });
      setAvatarPreview(avatar);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setShowDeleteModal(false);
    setIsUploading(true);

    try {
      console.log("🗑️ Menghapus avatar...");
      
      await api.delete('/profile/avatar');
      
      setAvatar(null);
      setAvatarPreview(null);
      
      // ✅ HAPUS AVATAR MENGGUNAKAN FUNGSI DARI CONTEXT - LANGSUNG UPDATE SEMUA KOMPONEN
      updateAvatar(null);
      
      setMessage({ type: "success", text: "Foto profil berhasil dihapus!" });
      
      // Refresh data profil
      await fetchProfile();
      
    } catch (err) {
      console.error('❌ Error hapus:', err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Gagal hapus foto" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("📝 Mengupdate profil...", formData);
      
      const res = await api.put("/profile", formData);
      console.log("✅ Profil berhasil diupdate:", res.data);
      
      if (setUser) {
        setUser(res.data.user);
      }
      
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      
      await fetchProfile();
      
    } catch (err) {
      console.error('❌ Error update:', err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Gagal memperbarui profil" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const bgCard = darkMode ? 'bg-slate-800/90' : 'bg-white';
  const borderCard = darkMode ? 'border-slate-700/60' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-gray-500';
  const bgInput = darkMode 
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400';

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`text-center py-20 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          Memuat profil...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Profil Saya</h1>
            <p className={`text-sm ${textSecondary}`}>Kelola informasi dan foto profil Anda</p>
          </div>
        </div>

        <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm`}>
          {message.text && (
            <div className={`mb-4 p-3 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Bagian Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg shadow-purple-500/20">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white">
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button
                  onClick={handleAvatarClick}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                  title="Upload foto"
                >
                  <CameraIcon className="w-5 h-5 text-white" />
                </button>
                {avatar && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-full transition-all"
                    title="Hapus foto"
                  >
                    <TrashIcon className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className={`px-4 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50`}
              >
                <CameraIcon className="w-4 h-4" />
                Upload Foto
              </button>
              {avatar && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isUploading}
                  className={`px-4 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                    darkMode 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                  } disabled:opacity-50`}
                >
                  <TrashIcon className="w-4 h-4" />
                  Hapus Foto
                </button>
              )}
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>
              Format: JPG, PNG, GIF • Maks: 2MB
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-sm font-medium ${textSecondary} mb-1.5 block`}>
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all ${bgInput}`}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium ${textSecondary} mb-1.5 block`}>
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all ${bgInput}`}
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium ${textSecondary} mb-1.5 block`}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none ${bgInput}`}
                placeholder="Tuliskan bio singkat tentang Anda"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 ${
                (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal Hapus Avatar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className={`${bgCard} border ${borderCard} rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${darkMode ? "bg-red-500/20" : "bg-red-100"} rounded-full`}>
                <TrashIcon className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"}`} />
              </div>
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Hapus Foto Profil</h3>
            </div>
            <p className={`${textSecondary} mb-6`}>
              Apakah Anda yakin ingin menghapus foto profil? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-2 ${
                  darkMode 
                    ? "bg-slate-700/50 hover:bg-slate-700 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } rounded-xl font-medium transition-all`}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAvatar}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-medium text-white transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}