import { useGetAppointmentStatsQuery } from "../appointment/appointmentApi.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";
import { CalendarDays, CheckCircle, Clock, XCircle, Users, TrendingUp } from "lucide-react";

const DEPT_COLORS = [
  "#1f2b6c", "#3b4faa", "#bfd2f8", "#6c8edc",
  "#2d5fc4", "#93b4f0", "#4a7de8", "#7ca3f4", "#d6e4ff"
];

const STATUS_COLORS = {
  confirmed: "#10b981",
  pending: "#f59e0b",
  cancelled: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1f2b6c] border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">{payload[0].value} appointments</p>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{label}</p>
        <p className="text-[#1f2b6c] text-3xl font-extrabold tracking-tight">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useGetAppointmentStatsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#f4f7ff] p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-80 rounded-2xl bg-white animate-pulse" />)}
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center">
      <p className="text-red-500">Failed to load dashboard stats.</p>
    </div>
  );

  const { byDepartment = [], byStatus = [], total = 0, recent = [] } = data;


  const deptData = byDepartment.map(d => ({ name: d._id, value: d.count }));

  const statusMap = Object.fromEntries(byStatus.map(s => [s._id, s.count]));
  const confirmed = statusMap.confirmed || 0;
  const pending = statusMap.pending || 0;
  const cancelled = statusMap.cancelled || 0;

  const statusData = [
    { name: "Confirmed", value: confirmed },
    { name: "Pending", value: pending },
    { name: "Cancelled", value: cancelled },
  ];


  const trendMap = Object.fromEntries(recent.map(r => [r._id, r.count]));
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: trendMap[key] || 0
    };
  });

  return (
    <div className="min-h-screen bg-[#f4f7ff]">

      {/* Header */}
      <div className="bg-[#1f2b6c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #bfd2f8 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-8 py-10">
          <p className="text-[#bfd2f8] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Overview of all appointment activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-8">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Users} label="Total" value={total} color="bg-[#1f2b6c]" sub="All time appointments" />
          <StatCard icon={CheckCircle} label="Confirmed" value={confirmed} color="bg-emerald-500" sub="Successfully confirmed" />
          <StatCard icon={Clock} label="Pending" value={pending} color="bg-amber-500" sub="Awaiting confirmation" />
          <StatCard icon={XCircle} label="Cancelled" value={cancelled} color="bg-red-500" sub="Cancelled by patient" />
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar chart — by department */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-[#1f2b6c] font-bold text-base">Appointments by Department</h2>
                <p className="text-gray-400 text-xs">Total bookings per department</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} barSize={32} margin={{ top: 0, right: 0, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }}
                  angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f7ff' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — by status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-[#1f2b6c] font-bold text-base">Appointments by Status</h2>
                <p className="text-gray-400 text-xs">Breakdown of current statuses</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="45%" innerRadius={70} outerRadius={110}
                  paddingAngle={4} dataKey="value" label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#cbd5e1' }}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(val) => <span className="text-gray-500 text-xs">{val}</span>} />
                <Tooltip formatter={(val) => [`${val} appointments`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Line chart — 7-day trend ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-[#1f2b6c] font-bold text-base">7-Day Booking Trend</h2>
              <p className="text-gray-400 text-xs">New appointments over the past week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke="#1f2b6c" strokeWidth={3}
                dot={{ r: 5, fill: '#1f2b6c', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#bfd2f8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}