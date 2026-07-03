// frontend/src/pages/Keamanan.jsx
import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from "../context/DarkModeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

export default function Keamanan() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [passwordLastChanged, setPasswordLastChanged] = useState(null);

  // Ambil info kapan terakhir password diubah
  useEffect(() => {
    fetchPasswordInfo();
  }, []);

  const fetchPasswordInfo = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data?.user?.password_updated_at) {
        setPasswordLastChanged(response.data.user.password_updated_at);
      }
    } catch (error) {
      console.error('Gagal mengambil info password:', error);
    }
  };

  const bgCard = darkMode ? 'bg-slate-800' : 'bg-white';
  const borderCard = darkMode ? 'border-slate-700' : 'border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700/50' : 'bg-gray-50';
  const inputBorder = darkMode ? 'border-slate-600' : 'border-gray-200';
  const inputFocus = darkMode ? 'focus:border-purple-500 focus:ring-purple-500/20' : 'focus:border-purple-500 focus:ring-purple-500/20';

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSuccess(false);
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password saat ini wajib diisi';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password baru wajib diisi';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'Password baru tidak boleh sama dengan password saat ini';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleChangePassword = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setApiError('');

    try {
      console.log("🔄 Mengubah password...");
      
      const response = await api.put('/profile/password', {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword
      });

      console.log("✅ Password berhasil diubah:", response.data);
      
      setSuccess(true);
      setCountdown(5);
      
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Hapus token dan user dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Countdown timer sebelum redirect
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error mengubah password:', err);
      
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.errors) {
          const newErrors = {};
          Object.keys(data.errors).forEach(key => {
            if (key === 'current_password') {
              newErrors.currentPassword = data.errors[key][0];
            } else if (key === 'new_password') {
              newErrors.newPassword = data.errors[key][0];
            } else if (key === 'new_password_confirmation') {
              newErrors.confirmPassword = data.errors[key][0];
            }
          });
          setErrors(newErrors);
        } else if (data.message) {
          setApiError(data.message);
        }
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Gagal mengubah password. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength(formData.newPassword);
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600'
  ];

  // Format tanggal
  const formatDate = (date) => {
    if (!date) return 'Belum pernah diubah';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Hari ini';
    if (diff === 1) return 'Kemarin';
    if (diff < 7) return `${diff} hari yang lalu`;
    if (diff < 30) return `${Math.floor(diff / 7)} minggu yang lalu`;
    if (diff < 365) return `${Math.floor(diff / 30)} bulan yang lalu`;
    return `${Math.floor(diff / 365)} tahun yang lalu`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/settings')}
            className={`p-2 rounded-xl ${bgCard} ${borderCard} border shadow-sm hover:shadow-md transition-all hover:scale-105`}
          >
            <ArrowLeftIcon className={`w-5 h-5 ${textPrimary}`} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 animate-pulse-slow">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>Keamanan</h1>
              <p className={`text-sm ${textSecondary}`}>
                Ubah password dan keamanan akun Anda
              </p>
            </div>
          </div>
        </div>

        {/* Success Message with Countdown */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-slideDown">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/40">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Password berhasil diubah!
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Redirect ke halaman login dalam {countdown} detik...
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slideDown">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              {apiError}
            </p>
          </div>
        )}

        {/* Change Password Form */}
        <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
              <KeyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-medium ${textPrimary}`}>Ubah Password</h3>
              <p className={`text-sm ${textSecondary}`}>
                Ganti password akun Anda untuk keamanan yang lebih baik
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Password Saat Ini <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Masukkan password saat ini"
                  className={`w-full px-4 py-3 pr-14 rounded-xl ${inputBg} ${inputBorder} border ${inputFocus} ${textPrimary} placeholder:text-sm transition-all outline-none ${
                    errors.currentPassword ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {showPassword.current ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {formData.currentPassword && (
                  <div className="absolute right-11 top-1/2 -translate-y-1/2">
                    {formData.currentPassword.length >= 6 ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-slideDown">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  className={`w-full px-4 py-3 pr-14 rounded-xl ${inputBg} ${inputBorder} border ${inputFocus} ${textPrimary} placeholder:text-sm transition-all outline-none ${
                    errors.newPassword ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {showPassword.new ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {formData.newPassword && (
                  <div className="absolute right-11 top-1/2 -translate-y-1/2">
                    {formData.newPassword.length >= 6 && formData.newPassword !== formData.currentPassword ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : formData.newPassword.length > 0 ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-slideDown">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}

              {/* Password Strength Indicator - Enhanced */}
              {formData.newPassword.length > 0 && (
                <div className="mt-3 space-y-2 animate-slideDown">
                  {/* Progress Bar */}
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          index < strengthLevel
                            ? strengthColors[strengthLevel - 1]
                            : 'bg-gray-200 dark:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className={`text-xs ${textSecondary}`}>
                      Kekuatan: <span className={`font-medium ${
                        strengthLevel >= 4 ? 'text-green-500' :
                        strengthLevel >= 3 ? 'text-yellow-500' :
                        strengthLevel >= 2 ? 'text-orange-500' :
                        'text-red-500'
                      }`}>
                        {strengthLevel > 0 ? strengthLabels[strengthLevel - 1] : 'Masukkan password'}
                      </span>
                    </p>
                    <span className="text-xs text-slate-400">
                      {formData.newPassword.length}/20 karakter
                    </span>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <p className={`text-xs flex items-center gap-1.5 transition-all duration-300 ${
                      formData.newPassword.length >= 6 ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {formData.newPassword.length >= 6 ? '✅' : '⬜'} Min 6 karakter
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 transition-all duration-300 ${
                      formData.newPassword.match(/[a-z]/) ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {formData.newPassword.match(/[a-z]/) ? '✅' : '⬜'} Huruf kecil
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 transition-all duration-300 ${
                      formData.newPassword.match(/[A-Z]/) ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {formData.newPassword.match(/[A-Z]/) ? '✅' : '⬜'} Huruf kapital
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 transition-all duration-300 ${
                      formData.newPassword.match(/[0-9]/) ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {formData.newPassword.match(/[0-9]/) ? '✅' : '⬜'} Angka
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 transition-all duration-300 col-span-2 ${
                      formData.newPassword.match(/[^a-zA-Z0-9]/) ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {formData.newPassword.match(/[^a-zA-Z0-9]/) ? '✅' : '⬜'} Karakter khusus (!@#$%^&*)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Konfirmasi Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi password baru"
                  className={`w-full px-4 py-3 pr-14 rounded-xl ${inputBg} ${inputBorder} border ${inputFocus} ${textPrimary} placeholder:text-sm transition-all outline-none ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {showPassword.confirm ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {formData.confirmPassword && formData.newPassword && (
                  <div className="absolute right-11 top-1/2 -translate-y-1/2">
                    {formData.confirmPassword === formData.newPassword ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-slideDown">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.newPassword && formData.confirmPassword === formData.newPassword && formData.newPassword.length >= 6 && (
                <p className="mt-1 text-sm text-green-500 flex items-center gap-1 animate-slideDown">
                  <CheckCircleIcon className="w-4 h-4" />
                  Password cocok ✓
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                'Ubah Password'
              )}
            </button>
          </form>
        </div>

        {/* Password Info & Security Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password Last Changed */}
          <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-colors duration-300`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <ClockIcon className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className={`font-medium ${textPrimary}`}>Info Password</h3>
            </div>
            <p className={`text-sm ${textSecondary}`}>
              Terakhir diubah: <span className="font-medium text-purple-500">
                {formatDate(passwordLastChanged)}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheckIcon className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500">Akun Anda aman</span>
            </div>
          </div>

          {/* Security Tips */}
          <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm transition-colors duration-300`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <InformationCircleIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className={`font-medium ${textPrimary}`}>Tips Keamanan</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-sm">✓</span>
                <p className={`text-xs ${textSecondary}`}>
                  Gunakan password yang unik
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-sm">✓</span>
                <p className={`text-xs ${textSecondary}`}>
                  Kombinasi huruf, angka, dan simbol
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-sm">✓</span>
                <p className={`text-xs ${textSecondary}`}>
                  Jangan bagikan password
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-sm">✓</span>
                <p className={`text-xs ${textSecondary}`}>
                  Ganti secara berkala
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`${bgCard} border ${borderCard} rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-full`}>
                <ExclamationTriangleIcon className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Konfirmasi</h3>
            </div>
            <p className={`${textSecondary} mb-2`}>
              Apakah Anda yakin ingin mengubah password?
            </p>
            <p className={`text-sm ${textSecondary} mb-6 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20`}>
              ⚠️ Anda akan logout dan harus login kembali dengan password baru.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg text-white rounded-xl font-medium transition-all"
              >
                {loading ? 'Memproses...' : 'Ya, Ubah Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}