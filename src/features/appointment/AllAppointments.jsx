import { useState } from "react";
import { useGetAllAppointmentsQuery, useUpdateAppointmentStatusMutation } from "./appointmentApi.js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Stethoscope, Mail, Phone, Building2, MessageSquare, User, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { base } from "../../app/mainApi.js";

const statusConfig = {
  confirmed: { dot: "bg-emerald-400", label: "Confirmed", cls: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30" },
  pending: { dot: "bg-amber-400", label: "Pending", cls: "bg-amber-400/20 text-amber-300 border-amber-400/30" },
  cancelled: { dot: "bg-red-400", label: "Cancelled", cls: "bg-red-400/20 text-red-300 border-red-400/30" },
};

const DEPARTMENTS = ["General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Gynecology", "Urology"];

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 shrink-0">
        <Icon className="h-3.5 w-3.5 text-[#bfd2f8]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium leading-none mb-0.5">{label}</p>
        <p className="text-sm text-white/90 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function AllAppointments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDept] = useState('');


  const { data, isLoading, isError, error } = useGetAllAppointmentsQuery(
    { page, search, department },
    { refetchOnMountOrArgChange: true }
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const appointments = data?.appointments || [];
  const pagination = data?.pagination || {};

  const hasFilters = search || department;

  const clearFilters = () => {
    setSearch('');
    setDept('');
    setPage(1);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2 animate-pulse" />
        <div className="flex flex-wrap gap-6 mt-10">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-96 h-80 rounded-2xl bg-[#1f2b6c]/20 animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error?.data?.message || "Failed to load appointments."}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#1f2b6c] tracking-tight">All Appointments</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Showing{" "}
            <span className="font-semibold text-[#1f2b6c]">{appointments.length}</span> of{" "}
            <span className="font-semibold text-[#1f2b6c]">{pagination.total || 0}</span> appointments
          </p>
        </div>

        {/* ✅ Single search bar + date + department */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">

          {/* Single search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by patient name or doctor..."
              className="pl-9 h-11 rounded-xl border-gray-200"
            />
          </div>



          {/* Department filter */}
          <Select
            value={department || 'all'}
            onValueChange={(val) => { setDept(val === 'all' ? '' : val); setPage(1); }}
          >
            <SelectTrigger className="h-11 rounded-xl border-gray-200 w-full sm:w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 h-11 rounded-xl bg-red-50 border border-red-200
                         text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors shrink-0"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* Cards */}
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <CalendarDays className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">No appointments found.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-[#1f2b6c] text-sm font-semibold underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {appointments.map((appt) => {
              const status = appt.status?.toLowerCase() || "pending";
              const cfg = statusConfig[status] || statusConfig.pending;

              return (
                <Card key={appt._id}
                  className="w-96 flex flex-col rounded-3xl border-0 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-[#1f2b6c]">

                  <div className="h-1 w-full bg-gradient-to-r from-[#bfd2f8] via-white/60 to-[#bfd2f8]" />

                  <CardHeader className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-14 w-14 border-2 border-white/20 shadow-lg">
                            <AvatarImage src={`${base}/${appt.image}`} alt={appt.name} />
                            <AvatarFallback className="text-xl font-bold text-[#1f2b6c]"
                              style={{ background: "linear-gradient(135deg, #bfd2f8, #e8effd)" }}>
                              {appt.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#1f2b6c] ${cfg.dot}`} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg leading-tight">{appt.name}</p>
                          <p className="text-white/40 text-xs font-mono mt-0.5">#{appt._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </CardHeader>

                  <div className="mx-6 h-px bg-white/10" />

                  <CardContent className="px-6 py-5 flex flex-col gap-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={Stethoscope} label="Doctor" value={appt.doctor} />
                      <InfoRow icon={Building2} label="Department" value={appt.department} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={CalendarDays} label="Date"
                        value={appt.date ? new Date(appt.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null} />
                      <InfoRow icon={Clock} label="Time" value={appt.time} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={Mail} label="Email" value={appt.email} />
                      <InfoRow icon={Phone} label="Phone" value={appt.phone} />
                    </div>
                    <InfoRow icon={User} label="Age / Gender"
                      value={appt.age && appt.gender ? `${appt.age} yrs · ${appt.gender}` : null} />
                    {appt.message && (
                      <div className="flex items-start gap-3 border border-white/10 rounded-xl px-4 py-3">
                        <MessageSquare className="h-3.5 w-3.5 text-[#bfd2f8] shrink-0 mt-0.5" />
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{appt.message}</p>
                      </div>
                    )}
                  </CardContent>

                  <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Update Status</span>
                    <select value={status} disabled={isUpdating}
                      onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                      className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-1.5
                                 cursor-pointer outline-none hover:bg-white/20 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="pending" className="bg-[#1f2b6c]">Pending</option>
                      <option value="confirmed" className="bg-[#1f2b6c]">Confirmed</option>
                      <option value="cancelled" className="bg-[#1f2b6c]">Cancelled</option>
                    </select>
                  </div>

                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200
                         text-[#1f2b6c] text-sm font-semibold shadow-sm hover:bg-gray-50
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-bold transition-all
                    ${p === page
                      ? 'bg-[#1f2b6c] text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>

            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNextPage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200
                         text-[#1f2b6c] text-sm font-semibold shadow-sm hover:bg-gray-50
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}