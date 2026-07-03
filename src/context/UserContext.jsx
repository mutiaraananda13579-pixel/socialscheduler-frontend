// frontend/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await api.get("/user");
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          console.log("✅ User berhasil diambil:", res.data.user);
        } else {
          console.log("ℹ️ Token tidak ditemukan, user belum login");
        }
      } catch (err) {
        console.log("❌ Gagal mengambil user:", err.response?.data || err.message);
        
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch {
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  // ✅ FUNGSI UNTUK UPDATE AVATAR
  const updateAvatar = (avatarUrl) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // ✅ FUNGSI UNTUK UPDATE USER SECARA UMUM
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    setUser,
    loading,
    updateUser,
    updateAvatar, // ✅ Tambahkan fungsi ini
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser harus digunakan di dalam UserProvider');
  }
  return context;
};