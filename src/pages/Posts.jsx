// frontend/src/pages/PostsList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDarkMode } from "../context/DarkModeContext";

export default function PostsList() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      setPosts(res.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Gagal mengambil data post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${deleteId}`);
      setPosts(posts.filter(post => post.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.log(err);
      setError("Gagal menghapus post");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: darkMode 
        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
        : "bg-blue-100 text-blue-700 border-blue-200",
      published: darkMode 
        ? "bg-green-500/20 text-green-300 border-green-500/30"
        : "bg-green-100 text-green-700 border-green-200",
      draft: darkMode 
        ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
        : "bg-gray-100 text-gray-700 border-gray-200",
      failed: darkMode
        ? "bg-red-500/20 text-red-300 border-red-500/30"
        : "bg-red-100 text-red-700 border-red-200",
    };

    const icons = {
      scheduled: <ClockIcon className="w-3 h-3" />,
      published: <CheckCircleIcon className="w-3 h-3" />,
      draft: <DocumentTextIcon className="w-3 h-3" />,
      failed: <ExclamationCircleIcon className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.published}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return Math.floor(diff / 60) + " menit yang lalu";
    if (diff < 86400) return Math.floor(diff / 3600) + " jam yang lalu";
    if (diff < 604800) return Math.floor(diff / 86400) + " hari yang lalu";
    return formatDate(dateString);
  };

  // Styles berdasarkan mode
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-gray-500";
  const textMuted = darkMode ? "text-slate-500" : "text-gray-400";
  const bgCard = darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200";
  const bgCardHover = darkMode ? "hover:border-slate-600" : "hover:border-gray-300 hover:shadow-md";
  const bgEmpty = darkMode ? "bg-slate-800/30 border-slate-700/30" : "bg-gray-50 border-gray-200";
  const bgModal = darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200";
  const borderColor = darkMode ? "border-slate-700/50" : "border-gray-200";

  const isEditable = (post) => {
    return post.status !== 'failed';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>Semua Post</h1>
            <p className={`${textSecondary} mt-1`}>Kelola semua postingan Anda</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`flex items-start gap-3 p-4 mb-6 ${
            darkMode 
              ? "bg-red-500/10 border-red-500/30 text-red-400" 
              : "bg-red-50 border-red-200 text-red-600"
          } border rounded-xl`}>
            <ExclamationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className={textSecondary}>Memuat data...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className={`text-center py-20 ${bgEmpty} border rounded-2xl`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${
              darkMode ? "bg-slate-700/50" : "bg-gray-200"
            } flex items-center justify-center`}>
              <DocumentTextIcon className={`w-10 h-10 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
            </div>
            <h3 className={`text-xl font-medium ${textPrimary} mb-2`}>Belum Ada Post</h3>
            <p className={`${textSecondary} mb-6`}>Mulai buat post pertama Anda sekarang</p>
            <button
              onClick={() => navigate("/create-post")}
              className={`inline-flex items-center gap-2 px-6 py-3 ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-500 hover:bg-blue-600"
              } rounded-xl font-medium transition-all text-white`}
            >
              <DocumentTextIcon className="w-5 h-5" />
              Buat Post Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const editable = isEditable(post);
              const isScheduled = post.status === 'scheduled';
              const showScheduledDate = isScheduled && post.scheduled_at;
              
              return (
                <div
                  key={post.id}
                  className={`${bgCard} border rounded-xl p-6 ${bgCardHover} transition-all ${
                    !editable ? 'opacity-75' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold ${textPrimary} truncate`}>
                          {post.title || "Tanpa Judul"}
                        </h3>
                        <p className={`text-sm ${textSecondary} line-clamp-2 mt-1`}>
                          {post.caption || "Tidak ada caption"}
                        </p>
                      </div>
                      {getStatusBadge(post.status)}
                    </div>

                    {/* Meta Info - TAMPILKAN TANGGAL UNTUK SEMUA STATUS */}
                    <div className={`space-y-2 text-sm ${textSecondary}`}>
                      {/* 🔥 TAMPILKAN SCHEDULED_AT JIKA ADA (UNTUK SEMUA STATUS) */}
                      {post.scheduled_at && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {isScheduled ? 'Dijadwalkan: ' : 'Jadwal: '}
                            {formatDate(post.scheduled_at)}
                          </span>
                        </div>
                      )}
                      
                      {/* 🔥 TAMPILKAN CREATED_AT UNTUK SEMUA POST */}
                      {post.created_at && (
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>Dibuat {getTimeAgo(post.created_at)}</span>
                        </div>
                      )}
                      
                      {/* 🔥 TAMPILKAN PUBLISHED_AT JIKA STATUS PUBLISHED */}
                      {post.status === 'published' && post.published_at && (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Dipublish {getTimeAgo(post.published_at)}</span>
                        </div>
                      )}

                      {/* 🔥 TAMPILKAN FAILED MESSAGE */}
                      {post.status === 'failed' && (
                        <div className="flex items-center gap-2 text-red-500 text-xs">
                          <ExclamationCircleIcon className="w-4 h-4" />
                          <span>Gagal terunggah - Tidak dapat diedit</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex items-center gap-2 pt-4 border-t ${borderColor}`}>
                      <button
                        onClick={() => editable && navigate(`/posts/edit/${post.id}`)}
                        disabled={!editable}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          editable
                            ? darkMode 
                              ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400" 
                              : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                            : darkMode
                              ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title={!editable ? "Post gagal terunggah, tidak dapat diedit" : "Edit post"}
                      >
                        {editable ? (
                          <PencilSquareIcon className="w-4 h-4" />
                        ) : (
                          <LockClosedIcon className="w-4 h-4" />
                        )}
                        {editable ? "Edit" : "Terkunci"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setDeleteId(post.id);
                          setShowDeleteModal(true);
                        }}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 ${
                          darkMode 
                            ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" 
                            : "bg-red-50 hover:bg-red-100 text-red-600"
                        } rounded-lg text-sm font-medium transition-all`}
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
            <div className={`${bgModal} border rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${darkMode ? "bg-red-500/20" : "bg-red-100"} rounded-full`}>
                  <TrashIcon className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                </div>
                <h3 className={`text-xl font-semibold ${textPrimary}`}>Konfirmasi Hapus</h3>
              </div>
              <p className={`${textSecondary} mb-6`}>
                Apakah Anda yakin ingin menghapus post ini? Tindakan ini tidak dapat dibatalkan.
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
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-medium text-white transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}