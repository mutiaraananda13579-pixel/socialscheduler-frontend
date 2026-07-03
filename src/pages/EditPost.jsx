// frontend/src/pages/EditPost.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  PencilSquareIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDarkMode } from "../context/DarkModeContext";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);

      setTitle(res.data.title || "");
      setCaption(res.data.caption || "");
      setStatus(res.data.status || "draft");

      if (res.data.scheduled_at) {
        setScheduledAt(res.data.scheduled_at.slice(0, 16));
      }
    } catch (err) {
      console.log(err.response?.data);
      setError("Gagal mengambil data post");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title.trim()) {
      setError("Judul harus diisi");
      return;
    }

    if (!caption.trim()) {
      setError("Caption harus diisi");
      return;
    }

    if (status === "scheduled" && !scheduledAt) {
      setError("Silakan pilih waktu jadwal");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        caption: caption.trim(),
        status: status,
        scheduled_at: scheduledAt ? scheduledAt.replace("T", " ") + ":00" : null,
      };

      await api.put(`/posts/${id}`, payload);

      setSuccess(true);
      setTimeout(() => {
        navigate("/posts");
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Gagal mengupdate post");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      switch (status) {
        case "scheduled":
          return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        case "draft":
          return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        default:
          return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      }
    } else {
      switch (status) {
        case "scheduled":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "draft":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        default:
          return "bg-blue-100 text-blue-700 border-blue-200";
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <ClockIcon className="w-4 h-4" />;
      case "draft":
        return <PencilSquareIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  // Styles berdasarkan mode
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-gray-600";
  const textMuted = darkMode ? "text-slate-500" : "text-gray-400";
  
  const bgForm = darkMode 
    ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50" 
    : "bg-white border-gray-200 shadow-xl";
  
  const bgInput = darkMode 
    ? "bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500" 
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white";
  
  const bgSelect = darkMode 
    ? "bg-slate-900/50 border-slate-700 text-white" 
    : "bg-gray-50 border-gray-200 text-gray-900";
  
  const borderColor = darkMode ? "border-slate-700/50" : "border-gray-200";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Edit Post
              </h1>
              <p className={`${textSecondary} mt-2`}>
                Perbarui konten dan pengaturan postingan Anda
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="text-sm font-medium capitalize">{status}</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className={`${bgForm} backdrop-blur-sm border rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className={`flex items-start gap-3 p-4 ${
                darkMode 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-red-50 border-red-200 text-red-600"
              } border rounded-xl`}>
                <ExclamationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className={`flex items-start gap-3 p-4 ${
                darkMode 
                  ? "bg-green-500/10 border-green-500/30 text-green-400" 
                  : "bg-green-50 border-green-200 text-green-600"
              } border rounded-xl`}>
                <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Post berhasil diupdate! Mengalihkan...</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className={`flex items-center gap-2 text-sm font-semibold ${textSecondary}`}>
                <DocumentTextIcon className="w-5 h-5" />
                Judul Post
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul post..."
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all ${bgInput}`}
              />
              <p className={`text-xs ${textMuted}`}>
                {title.length}/100 karakter
              </p>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className={`flex items-center gap-2 text-sm font-semibold ${textSecondary}`}>
                <TagIcon className="w-5 h-5" />
                Caption / Deskripsi
              </label>
              <textarea
                rows="6"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tulis caption atau deskripsi post..."
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-y ${bgInput}`}
              />
              <p className={`text-xs ${textMuted}`}>
                {caption.length}/500 karakter
              </p>
            </div>

            {/* Status & Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${textSecondary}`}>
                  <PencilSquareIcon className="w-5 h-5" />
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (e.target.value === "draft") {
                      setScheduledAt("");
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer ${bgSelect}`}
                >
                  <option value="draft">📝 Draft</option>
                  <option value="scheduled">📅 Scheduled</option>
                </select>
                <p className={`text-xs ${textMuted}`}>
                  {status === "draft" 
                    ? "Post akan disimpan sebagai draft" 
                    : "Post akan dijadwalkan dan otomatis published"}
                </p>
              </div>

              {/* Schedule */}
              {status === "scheduled" && (
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${textSecondary}`}>
                    <CalendarIcon className="w-5 h-5" />
                    Jadwal Posting
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all ${bgInput}`}
                    required={status === "scheduled"}
                  />
                  <p className="text-xs text-blue-500 font-medium">
                    ⏰ Post akan otomatis terbit (Published) pada waktu ini
                  </p>
                </div>
              )}

              {/* Placeholder saat draft */}
              {status === "draft" && (
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${textSecondary}`}>
                    <CalendarIcon className="w-5 h-5" />
                    Jadwal Posting
                  </label>
                  <div className={`w-full px-4 py-3 ${
                    darkMode 
                      ? "bg-slate-900/30 border-slate-700/30 text-slate-500" 
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  } border rounded-xl`}>
                    — Tidak ada jadwal (Draft)
                  </div>
                  <p className={`text-xs ${textMuted}`}>
                    Ubah status ke "Scheduled" untuk mengatur jadwal
                  </p>
                </div>
              )}
            </div>

            {/* Info Otomatis Published */}
            <div className={`${
              darkMode 
                ? "bg-blue-500/10 border-blue-500/20 text-blue-300" 
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
            } border rounded-xl p-4`}>
              <p className={`text-sm flex items-center gap-2 font-medium`}>
                <CheckCircleIcon className="w-5 h-5" />
                {status === "draft" 
                  ? "📝 Post disimpan sebagai Draft. Ubah ke Scheduled untuk penjadwalan."
                  : `⏰ Post akan otomatis berstatus Published pada ${scheduledAt ? new Date(scheduledAt).toLocaleString('id-ID') : 'waktu yang ditentukan'}`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${borderColor}`}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-medium text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  status === "draft" ? "Update Draft" : "Update & Jadwalkan"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/posts")}
                className={`px-6 py-3 ${
                  darkMode 
                    ? "bg-slate-700/50 hover:bg-slate-700 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } rounded-xl font-medium transition-all`}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}