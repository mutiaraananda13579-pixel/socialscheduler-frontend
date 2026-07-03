// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDarkMode } from "../context/DarkModeContext";
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  PencilSquareIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

export default function Dashboard() {
  const { darkMode } = useDarkMode();
  
  const [stats, setStats] = useState({
    total_posts: 0,
    scheduled_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    failed_posts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDatePosts, setSelectedDatePosts] = useState(0);
  const [user, setUser] = useState(null);
  const [postsByDate, setPostsByDate] = useState({});

  // ✅ FUNGSI FORMAT TANGGAL YANG SAMA UNTUK SEMUA
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // AMBIL DATA USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ GENERATE ULANG KETIKA DATA ATAU BULAN BERUBAH
  useEffect(() => {
    if (!loading && Object.keys(postsByDate).length > 0) {
      generateWeeklyData();
      generateCalendar(currentDate);
    }
  }, [postsByDate, loading, currentDate]);

  useEffect(() => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const count = postsByDate[dateKey] || 0;
      setSelectedDatePosts(count);
    }
  }, [selectedDate, postsByDate]);

  const updateTime = () => {
    const now = new Date();
    const options = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    };
    setCurrentTime(now.toLocaleTimeString('id-ID', options));
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchStats(), fetchPostsByDate()]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      console.log("📊 Stats response:", res.data);
      
      const data = res.data;
      
      setStats({
        total_posts: Number(data.total_posts || data.total || 0),
        scheduled_posts: Number(data.scheduled_posts || data.scheduled || 0),
        published_posts: Number(data.published_posts || data.published || 0),
        draft_posts: Number(data.draft_posts || data.draft || 0),
        failed_posts: Number(data.failed_posts || data.failed || 0),
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({
        total_posts: 0,
        scheduled_posts: 0,
        published_posts: 0,
        draft_posts: 0,
        failed_posts: 0,
      });
    }
  };

  const fetchPostsByDate = async () => {
    try {
      const res = await api.get("/dashboard/posts-by-date");
      console.log("📊 Data posts by date from DB:", res.data);
      setPostsByDate(res.data || {});
    } catch (err) {
      console.error("Error fetching posts by date:", err);
      setPostsByDate({});
    }
  };

  // ✅ GENERATE WEEKLY DATA - PAKAI FORMAT TANGGAL YANG SAMA
  const generateWeeklyData = () => {
    const today = new Date();
    const weekDays = [];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    // Cari hari Senin minggu ini
    const monday = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      // ✅ PAKAI FORMAT YANG SAMA
      const dateKey = formatDateKey(date);
      const postsCount = postsByDate[dateKey] || 0;
      
      weekDays.push({
        dateLabel: `${date.getDate()} ${monthNames[date.getMonth()]}`,
        dayName: dayNames[date.getDay()],
        fullDate: date,
        posts: postsCount,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    console.log("📊 Weekly data from DB:", weekDays);
    setWeeklyData(weekDays);
  };

  // ✅ GENERATE CALENDAR - PAKAI FORMAT TANGGAL YANG SAMA
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    const today = new Date();
    
    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, daysInPrevMonth - i);
      dayDate.setHours(0, 0, 0, 0);
      const dateKey = formatDateKey(dayDate);
      
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: dayDate,
        hasPost: (postsByDate[dateKey] || 0) > 0,
        postCount: postsByDate[dateKey] || 0
      });
    }
    
    // Hari di bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      dayDate.setHours(0, 0, 0, 0);
      const dateKey = formatDateKey(dayDate);
      
      const isToday = i === today.getDate() && 
                     month === today.getMonth() && 
                     year === today.getFullYear();
      
      const hasPost = (postsByDate[dateKey] || 0) > 0;
      const postCount = postsByDate[dateKey] || 0;
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date: dayDate,
        isToday: isToday,
        hasPost: hasPost,
        postCount: postCount
      });
    }
    
    // Hari dari bulan depan
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const dayDate = new Date(year, month + 1, i);
      dayDate.setHours(0, 0, 0, 0);
      const dateKey = formatDateKey(dayDate);
      
      days.push({
        day: i,
        isCurrentMonth: false,
        date: dayDate,
        hasPost: (postsByDate[dateKey] || 0) > 0,
        postCount: postsByDate[dateKey] || 0
      });
    }
    
    setCalendarDays(days);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const chartData = [
    { name: "Published", value: Number(stats.published_posts) || 0, color: "#34D399" },
    { name: "Scheduled", value: Number(stats.scheduled_posts) || 0, color: "#FBBF24" },
    { name: "Draft", value: Number(stats.draft_posts) || 0, color: "#8B5CF6" },
    { name: "Failed", value: Number(stats.failed_posts) || 0, color: "#EF4444" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-3 shadow-xl`}>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {data.dayName}, {data.fullDate?.toLocaleDateString('id-ID')}
          </p>
          <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📝 {data.posts} Post{data.posts > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const maxPosts = Math.max(...weeklyData.map(d => d.posts), 1);

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`text-center py-20 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          Memuat Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const isDark = darkMode;

  const bgCard = isDark ? 'bg-slate-800/90' : 'bg-white';
  const borderCard = isDark ? 'border-slate-700/60' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
  const bgHover = isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100';
  const gridColor = isDark ? "#334155" : "#F1F5F9";
  const axisColor = isDark ? "#94A3B8" : "#475569";
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';

  const totalCard = {
    bg: isDark ? 'bg-slate-800/90' : 'bg-white',
    border: isDark ? 'border-slate-700/60' : 'border-gray-200',
    hover: isDark ? 'hover:border-slate-600' : 'hover:border-blue-300 hover:shadow-md',
    iconBg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
    textColor: isDark ? 'text-white' : 'text-gray-900',
    labelColor: isDark ? 'text-slate-400' : 'text-gray-500',
    mutedColor: isDark ? 'text-slate-500' : 'text-gray-400',
  };

  const scheduledCard = {
    bg: isDark ? 'bg-yellow-500/5' : 'bg-white',
    border: isDark ? 'border-yellow-500/20' : 'border-gray-200',
    hover: isDark ? 'hover:border-yellow-500/40' : 'hover:border-yellow-300 hover:shadow-md',
    iconBg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
    iconColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
    textColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
    labelColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
    mutedColor: isDark ? 'text-slate-500' : 'text-gray-400',
  };

  const publishedCard = {
    bg: isDark ? 'bg-green-500/5' : 'bg-white',
    border: isDark ? 'border-green-500/20' : 'border-gray-200',
    hover: isDark ? 'hover:border-green-500/40' : 'hover:border-green-300 hover:shadow-md',
    iconBg: isDark ? 'bg-green-500/10' : 'bg-green-50',
    iconColor: isDark ? 'text-green-400' : 'text-green-600',
    textColor: isDark ? 'text-green-400' : 'text-green-600',
    labelColor: isDark ? 'text-green-400' : 'text-green-600',
    mutedColor: isDark ? 'text-slate-500' : 'text-gray-400',
  };

  const draftCard = {
    bg: isDark ? 'bg-purple-500/5' : 'bg-white',
    border: isDark ? 'border-purple-500/20' : 'border-gray-200',
    hover: isDark ? 'hover:border-purple-500/40' : 'hover:border-purple-300 hover:shadow-md',
    iconBg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
    iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
    textColor: isDark ? 'text-purple-400' : 'text-purple-600',
    labelColor: isDark ? 'text-purple-400' : 'text-purple-600',
    mutedColor: isDark ? 'text-slate-500' : 'text-gray-400',
  };

  const failedCard = {
    bg: isDark ? 'bg-red-500/5' : 'bg-white',
    border: isDark ? 'border-red-500/20' : 'border-gray-200',
    hover: isDark ? 'hover:border-red-500/40' : 'hover:border-red-300 hover:shadow-md',
    iconBg: isDark ? 'bg-red-500/10' : 'bg-red-50',
    iconColor: isDark ? 'text-red-400' : 'text-red-600',
    textColor: isDark ? 'text-red-400' : 'text-red-600',
    labelColor: isDark ? 'text-red-400' : 'text-red-600',
    mutedColor: isDark ? 'text-slate-500' : 'text-gray-400',
  };

  const hasPosts = stats.total_posts > 0;

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-4xl font-bold ${textPrimary}`}>
              Dashboard
            </h1>
            <span className={`text-sm font-normal ${isDark ? 'text-slate-300 bg-slate-800/80 border-slate-700' : 'text-purple-700 bg-purple-50 border-purple-200'} px-3 py-1 rounded-full border`}>
              {stats.total_posts} Total Posts
            </span>
          </div>
          <p className={`${textSecondary} mt-2 flex items-center gap-2`}>
            <UserCircleIcon className="w-4 h-4" />
            {user?.name || "User"} • Pantau performa dan aktivitas posting kamu secara realtime.
          </p>
        </div>
        <div className={`text-right text-sm ${textMuted}`}>
          <p>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-mono">{currentTime}</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <div className={`${totalCard.bg} ${totalCard.border} rounded-2xl p-6 border ${totalCard.hover} transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-between">
            <p className={`${totalCard.labelColor} text-sm font-medium`}>Total Posts</p>
            <div className={`w-8 h-8 rounded-lg ${totalCard.iconBg} flex items-center justify-center`}>
              <span className={`${totalCard.iconColor} text-lg font-bold`}>📊</span>
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${totalCard.textColor} mt-2`}>{stats.total_posts}</h2>
          <p className={`text-xs ${totalCard.mutedColor} mt-1`}>Semua konten yang dibuat</p>
        </div>

        <div className={`${scheduledCard.bg} ${scheduledCard.border} rounded-2xl p-6 border ${scheduledCard.hover} transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-between">
            <p className={`${scheduledCard.labelColor} text-sm font-medium`}>Scheduled</p>
            <div className={`w-8 h-8 rounded-lg ${scheduledCard.iconBg} flex items-center justify-center`}>
              <ClockIcon className={`w-4 h-4 ${scheduledCard.iconColor}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${scheduledCard.textColor} mt-2`}>{stats.scheduled_posts}</h2>
          <p className={`text-xs ${scheduledCard.mutedColor} mt-1`}>Menunggu waktu tayang</p>
        </div>

        <div className={`${publishedCard.bg} ${publishedCard.border} rounded-2xl p-6 border ${publishedCard.hover} transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-between">
            <p className={`${publishedCard.labelColor} text-sm font-medium`}>Published</p>
            <div className={`w-8 h-8 rounded-lg ${publishedCard.iconBg} flex items-center justify-center`}>
              <CheckCircleIcon className={`w-4 h-4 ${publishedCard.iconColor}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${publishedCard.textColor} mt-2`}>{stats.published_posts}</h2>
          <p className={`text-xs ${publishedCard.mutedColor} mt-1`}>Sudah tayang</p>
        </div>

        <div className={`${draftCard.bg} ${draftCard.border} rounded-2xl p-6 border ${draftCard.hover} transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-between">
            <p className={`${draftCard.labelColor} text-sm font-medium`}>Draft</p>
            <div className={`w-8 h-8 rounded-lg ${draftCard.iconBg} flex items-center justify-center`}>
              <PencilSquareIcon className={`w-4 h-4 ${draftCard.iconColor}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${draftCard.textColor} mt-2`}>{stats.draft_posts}</h2>
          <p className={`text-xs ${draftCard.mutedColor} mt-1`}>Masih dalam pengerjaan</p>
        </div>

        <div className={`${failedCard.bg} ${failedCard.border} rounded-2xl p-6 border ${failedCard.hover} transition-all duration-300 shadow-sm`}>
          <div className="flex items-center justify-between">
            <p className={`${failedCard.labelColor} text-sm font-medium`}>Failed</p>
            <div className={`w-8 h-8 rounded-lg ${failedCard.iconBg} flex items-center justify-center`}>
              <XCircleIcon className={`w-4 h-4 ${failedCard.iconColor}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${failedCard.textColor} mt-2`}>{stats.failed_posts || 0}</h2>
          <p className={`text-xs ${failedCard.mutedColor} mt-1`}>Gagal terunggah</p>
        </div>
      </div>

      {/* Warning jika ada failed posts */}
      {stats.failed_posts > 0 && (
        <div className={`mb-6 p-4 ${isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'} border rounded-xl flex items-center gap-3`}>
          <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            Terdapat {stats.failed_posts} post yang gagal terunggah. Silakan periksa kembali.
          </span>
        </div>
      )}

      {/* Empty State jika tidak ada data */}
      {!hasPosts && (
        <div className={`mb-6 p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border rounded-2xl text-center`}>
          <p className={`text-lg font-medium ${textPrimary}`}>📭 Belum ada post</p>
          <p className={`text-sm ${textSecondary} mt-1`}>Mulai buat post pertamamu sekarang!</p>
        </div>
      )}

      {/* CHARTS + CALENDAR - Hanya tampil jika ada data */}
      {hasPosts && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            {/* Bar Chart */}
            <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500" />
                Statistik Post
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} domain={[0, 'auto']} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      borderColor: tooltipBorder,
                      borderRadius: '12px',
                      color: isDark ? '#F1F5F9' : '#111827'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pie Chart */}
              <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm`}>
                <h2 className={`text-sm font-semibold ${textPrimary} mb-4 text-center`}>
                  Distribusi Post
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: tooltipBg, 
                        borderColor: tooltipBorder,
                        borderRadius: '12px',
                        color: isDark ? '#F1F5F9' : '#111827'
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span className={isDark ? 'text-slate-300' : 'text-gray-700 font-medium'}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart Mingguan */}
              <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm`}>
                <h2 className={`text-sm font-semibold ${textPrimary} mb-4 text-center`}>
                  Aktivitas Mingguan
                </h2>
                {weeklyData.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis 
                        dataKey="dateLabel"
                        stroke={axisColor}
                        fontSize={10}
                        tick={{ fill: axisColor }}
                        interval={0}
                      />
                      <YAxis 
                        stroke={axisColor} 
                        fontSize={11}
                        domain={[0, maxPosts + 1]}
                        allowDecimals={false}
                        tick={{ fill: axisColor }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="posts" 
                        stroke="#8B5CF6" 
                        strokeWidth={2.5}
                        isAnimationActive={false}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          const isToday = payload.isToday;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isToday ? 7 : 4}
                              fill="#8B5CF6"
                              stroke={isToday ? "#C084FC" : "none"}
                              strokeWidth={isToday ? 3 : 0}
                            />
                          );
                        }}
                        activeDot={{ r: 7, fill: "#8B5CF6", stroke: "#C084FC", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                
                <div className={`flex items-center justify-center gap-6 mt-2 text-xs ${textSecondary}`}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-purple-500 rounded-full"></span>
                    <span>Post</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-300/50"></span>
                    <span>Hari Ini</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CALENDAR */}
          <div className={`${bgCard} ${borderCard} rounded-2xl p-6 border shadow-sm flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${textPrimary} flex items-center gap-2`}>
                <CalendarIcon className="w-5 h-5 text-purple-500" />
                Kalender
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className={`p-1.5 rounded-lg ${bgHover} transition-colors`}
                >
                  <ChevronLeftIcon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                </button>
                <span className={`text-sm font-semibold ${textPrimary} min-w-[100px] text-center`}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className={`p-1.5 rounded-lg ${bgHover} transition-colors`}
                >
                  <ChevronRightIcon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className={`text-center text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} font-semibold py-1`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    text-center py-2 rounded-lg text-sm transition-all font-medium relative
                    ${day.isCurrentMonth ? (isDark ? 'text-white' : 'text-gray-800') : (isDark ? 'text-slate-600' : 'text-gray-300')}
                    ${day.isToday ? (isDark ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400' : 'bg-purple-100 border border-purple-300 text-purple-700 font-bold') : ''}
                    ${selectedDate && day.date.toDateString() === selectedDate.toDateString() ? (isDark ? 'bg-purple-500/30 border border-purple-500' : 'bg-purple-200 border border-purple-400 text-purple-900') : ''}
                    ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'}
                  `}
                >
                  {day.day}
                  {day.hasPost && day.isCurrentMonth && (
                    <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  )}
                  {day.hasPost && day.isCurrentMonth && day.postCount > 1 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] flex items-center justify-center bg-purple-500 text-white rounded-full font-bold">
                      {day.postCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* LEGENDA KALENDER */}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Ada Post</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 text-[8px] flex items-center justify-center bg-purple-500 text-white rounded-full font-bold">2</span>
                <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Jumlah Post</span>
              </span>
            </div>

            {/* DETAIL TANGGAL DIPILIH */}
            {selectedDate && (
              <div className={`mt-4 p-3 ${isDark ? 'bg-slate-700/30 border-slate-700/50' : 'bg-purple-50/50 border-purple-100'} rounded-xl border`}>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tanggal dipilih</p>
                <p className={`text-sm font-semibold ${textPrimary}`}>
                  {selectedDate.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'} rounded-full border font-medium`}>
                    📝 {selectedDatePosts} Post{selectedDatePosts > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* WAKTU SAAT INI */}
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
              <div className={`${isDark ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-100'} rounded-xl p-4 border`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <ClockIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Waktu Saat Ini</p>
                      <p className={`text-2xl font-bold ${textPrimary} font-mono tracking-wider`}>
                        {currentTime}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'} font-medium`}>
                    {new Date().toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center gap-1 font-medium`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}