import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays, Clock, Stethoscope,
  Mail, Phone, Building2, MessageSquare, User, X
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetMyAppointmentsQuery, useCancelAppointmentMutation } from "./appointmentApi.js";
import { toast } from "sonner";
import { base } from "../../app/mainApi.js";

const statusConfig = {
  confirmed: { dot: "bg-emerald-400", label: "Confirmed", cls: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30" },
  pending: { dot: "bg-amber-400", label: "Pending", cls: "bg-amber-400/20 text-amber-300 border-amber-400/30" },
  cancelled: { dot: "bg-red-400", label: "Cancelled", cls: "bg-red-400/20 text-red-300 border-red-400/30" },
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 shrink-0">
        <Icon className="h-3.5 w-3.5 text-[#bfd2f8]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm text-white/90 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function MyAppointments() {

  const { data: appointments, isLoading, isError, error } = useGetMyAppointmentsQuery();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const handleCancel = async (id) => {
    try {
      await cancelAppointment({ id }).unwrap();
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded mb-10 animate-pulse" />
          <div className="flex flex-wrap gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-96 h-80 rounded-2xl bg-[#1f2b6c]/20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error?.data?.message || "Failed to load appointments."}</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-muted-foreground">
        <CalendarDays className="mb-3 h-12 w-12 opacity-30" />
        <p className="text-lg font-medium">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">


        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1f2b6c] tracking-tight">
            My Appointments
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            You have{" "}
            <span className="font-semibold text-[#1f2b6c]">{appointments.length}</span>{" "}
            appointment{appointments.length > 1 ? "s" : ""} scheduled
          </p>
        </div>


        <div className="flex flex-wrap gap-6">
          {appointments.map((appt) => {
            const status = appt.status?.toLowerCase() || "pending";
            const cfg = statusConfig[status] || statusConfig.pending;
            const isCancelled = status === "cancelled";

            return (
              <Card
                key={appt._id}
                className="w-96 flex flex-col rounded-3xl border-0 overflow-hidden
                           shadow-xl hover:shadow-2xl hover:-translate-y-1.5
                           transition-all duration-300 bg-[#1f2b6c]"
              >

                <div className="h-1 w-full bg-gradient-to-r from-[#bfd2f8] via-white/60 to-[#bfd2f8]" />


                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-white/20 shadow-lg">
                          <AvatarImage src={`${base}/${appt.image}`} alt={appt.name} />
                          <AvatarFallback
                            className="text-xl font-bold text-[#1f2b6c]"
                            style={{ background: "linear-gradient(135deg, #bfd2f8, #e8effd)" }}
                          >
                            {appt.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#1f2b6c] ${cfg.dot}`} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">{appt.name}</p>
                        <p className="text-white/40 text-xs font-mono mt-0.5">
                          #{appt._id.slice(-6).toUpperCase()}
                        </p>
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
                    <InfoRow
                      icon={CalendarDays}
                      label="Date"
                      value={appt.date
                        ? new Date(appt.date).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })
                        : null}
                    />
                    <InfoRow icon={Clock} label="Time" value={appt.time} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={Mail} label="Email" value={appt.email} />
                    <InfoRow icon={Phone} label="Phone" value={appt.phone} />
                  </div>
                  <InfoRow
                    icon={User}
                    label="Age / Gender"
                    value={appt.age && appt.gender ? `${appt.age} yrs · ${appt.gender}` : null}
                  />

                  {appt.message && (
                    <div className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                      <MessageSquare className="h-3.5 w-3.5 text-[#bfd2f8] shrink-0 mt-0.5" />
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                        {appt.message}
                      </p>
                    </div>
                  )}
                </CardContent>


                <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">


                  {!isCancelled ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-red-500/15 hover:bg-red-500/30 border border-red-400/30
                                     text-red-300 hover:text-red-200 text-xs font-semibold
                                     transition-all duration-200 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel the appointment for{" "}
                            <span className="font-semibold text-foreground">{appt.name}</span>{" "}
                            on{" "}
                            <span className="font-semibold text-foreground">
                              {appt.date
                                ? new Date(appt.date).toLocaleDateString("en-US", {
                                  month: "long", day: "numeric", year: "numeric",
                                })
                                : "N/A"}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(appt._id)}
                            disabled={isCancelling}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <span className="text-red-400/60 text-xs font-medium italic">
                      Appointment cancelled
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}