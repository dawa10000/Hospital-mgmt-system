import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { Spinner } from "../../components/ui/spinner.jsx";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react";
import { ChevronDownIcon, PhoneCall, User, Mail, Phone, Hash, Clock, CalendarDays, Building2, Stethoscope, ImageIcon, MessageSquare, ArrowLeft } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateAppointmentMutation } from "./appointmentApi.js";

const appointmentSchema = Yup.object({
  name: Yup.string().min(4).max(50).required('Name is required'),
  gender: Yup.string().required('Gender is required'),
  age: Yup.number().required('Age is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  department: Yup.string().required('Department is required'),
  doctor: Yup.string().required('Doctor is required'),
  message: Yup.string().max(500),
  image: Yup.mixed().test('fileType', 'Unsupported File Format',
    (value) => value && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type)
  ).required("Image is required"),
})

function Field({ label, icon: Icon, error, touched, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[#1f2b6c]/70 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-[#1f2b6c]/50" />}
        {label}
      </Label>
      {children}
      {touched && error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = "bg-white border border-gray-200 text-[#1f2b6c] placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-[#1f2b6c]/30 focus-visible:border-[#1f2b6c] rounded-xl h-11 shadow-sm transition-all"
const selectTriggerCls = "bg-white border border-gray-200 text-[#1f2b6c] focus:ring-2 focus:ring-[#1f2b6c]/30 focus:border-[#1f2b6c] rounded-xl h-11 w-full shadow-sm"

const DOCTORS = [
  "Dr. Hari Prasad Sharma - General",
  "Dr. Anupama Shrestha - Cardiology",
  "Dr. Binod Karki - Neurology",
  "Dr. Aayush Aryal - Orthopedics",
  "Dr. Chandra Prasad Adhikari - Pediatrics",
  "Dr. Deepa Shrestha - Oncology",
  "Dr. Esha Shrestha - Dermatology",
  "Dr. Firoz Khan - Gynecology",
  "Dr. Gopal Sharma - Urology",
]

const DEPARTMENTS = ["General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Gynecology", "Urology"]

const SCHEDULE = [
  { day: 'Monday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Tuesday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Wednesday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Thursday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Friday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Saturday', hours: '09:00 AM – 07:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

export default function AddAppointment() {
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(undefined)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="min-h-screen bg-[#f4f7ff]">

      {/* ── Hero Header ── */}
      <div className="bg-[#1f2b6c] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #bfd2f8 0%, transparent 60%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <button onClick={() => nav(-1)}
              className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-medium mb-4 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Book an Appointment
            </h1>
            <p className="text-white/50 mt-2 text-sm">
              Fill in your details below and we'll confirm your visit
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
            <PhoneCall className="h-5 w-5 text-red-300" />
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Emergency</p>
              <p className="text-white font-bold text-sm">(237) 681-812-255</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

        {/* ── Form ── */}
        <Formik
          initialValues={{
            name: '', gender: '', age: '', email: '', phone: '',
            date: '', time: '09:00', department: '', doctor: '',
            message: '', image: '', imagePreview: ''
          }}
          validationSchema={appointmentSchema}
          onSubmit={async (val) => {
            const formData = new FormData();
            Object.entries(val).forEach(([key, value]) => {
              if (key !== 'imagePreview') formData.append(key, value);
            });
            try {
              await createAppointment(formData).unwrap();
              toast.success('Appointment booked successfully');
              nav(-1);
            } catch (err) {
              toast.error(err?.data?.message || 'Something went wrong');
            }
          }}
        >
          {({ handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">

              {/* Section 1: Personal */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#1f2b6c] font-bold text-base">Personal Information</h2>
                    <p className="text-gray-400 text-xs">Your basic contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Field label="Full Name" icon={User} error={errors.name} touched={touched.name}>
                      <Input name="name" onChange={handleChange} value={values.name}
                        type="text" placeholder="Enter your full name" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Gender" error={errors.gender} touched={touched.gender}>
                    <Select onValueChange={(e) => setFieldValue('gender', e)}>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Age" icon={Hash} error={errors.age} touched={touched.age}>
                    <Input type="number" onChange={handleChange} value={values.age}
                      name="age" placeholder="Your age" className={inputCls} />
                  </Field>

                  <Field label="Email Address" icon={Mail} error={errors.email} touched={touched.email}>
                    <Input type="email" onChange={handleChange} value={values.email}
                      name="email" placeholder="you@example.com" className={inputCls} />
                  </Field>

                  <Field label="Phone Number" icon={Phone} error={errors.phone} touched={touched.phone}>
                    <Input type="text" onChange={handleChange} value={values.phone}
                      name="phone" placeholder="+1 234 567 890" className={inputCls} />
                  </Field>
                </div>
              </section>

              {/* Section 2: Appointment */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#1f2b6c] font-bold text-base">Appointment Details</h2>
                    <p className="text-gray-400 text-xs">Choose your preferred time and doctor</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Date" icon={CalendarDays} error={errors.date} touched={touched.date}>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant='outline'
                          className={`${selectTriggerCls} justify-between font-normal hover:bg-gray-50`}>
                          <span className={date ? "text-[#1f2b6c]" : "text-gray-300"}>
                            {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pick a date'}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                        <Calendar mode='single'
                          selected={date instanceof Date ? date : undefined}
                          onSelect={(d) => { setDate(d); setFieldValue('date', d); setOpen(false) }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>

                  <Field label="Time" icon={Clock} error={errors.time} touched={touched.time}>
                    <Input type='time' value={values.time}
                      onChange={(e) => setFieldValue('time', e.target.value)}
                      className={`${inputCls} [&::-webkit-calendar-picker-indicator]:hidden`}
                    />
                  </Field>

                  <Field label="Department" icon={Building2} error={errors.department} touched={touched.department}>
                    <Select onValueChange={(e) => setFieldValue('department', e)}>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Doctor" icon={Stethoscope} error={errors.doctor} touched={touched.doctor}>
                    <Select onValueChange={(e) => setFieldValue('doctor', e)}>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Doctor</SelectLabel>
                          {DOCTORS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </section>

              {/* Section 3: Extra */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-[#1f2b6c] flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#1f2b6c] font-bold text-base">Additional Information</h2>
                    <p className="text-gray-400 text-xs">Upload a photo and leave a note if needed</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <Field label="Upload Image" icon={ImageIcon} error={errors.image} touched={touched.image}>
                    <div className="flex items-center gap-4">
                      <label htmlFor="image"
                        className="flex items-center gap-2 px-4 h-11 bg-[#f4f7ff] border-2 border-dashed border-[#1f2b6c]/20
                                   hover:border-[#1f2b6c]/50 hover:bg-[#eef2ff] text-[#1f2b6c]/60 hover:text-[#1f2b6c]
                                   text-sm font-medium rounded-xl cursor-pointer transition-all">
                        <ImageIcon className="h-4 w-4" />
                        Choose file
                      </label>
                      <input id="image" name="image" type="file" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue('image', file);
                          setFieldValue('imagePreview', URL.createObjectURL(file));
                        }}
                      />
                      {values.imagePreview && !errors.image && (
                        <img src={values.imagePreview} alt="preview"
                          className="h-11 w-11 rounded-xl object-cover border-2 border-[#1f2b6c]/20 shadow-sm" />
                      )}
                      {!values.imagePreview && (
                        <span className="text-gray-300 text-xs">No file chosen</span>
                      )}
                    </div>
                  </Field>

                  <Field label="Message (Optional)" icon={MessageSquare} error={errors.message} touched={touched.message}>
                    <textarea name="message" value={values.message} onChange={handleChange}
                      rows={4} placeholder="Any notes or additional details for your doctor..."
                      className="w-full bg-white border border-gray-200 text-[#1f2b6c] placeholder:text-gray-300
                                 focus:outline-none focus:ring-2 focus:ring-[#1f2b6c]/30 focus:border-[#1f2b6c]
                                 rounded-xl px-4 py-3 text-sm resize-none transition-all shadow-sm"
                    />
                  </Field>
                </div>
              </section>

              {/* Submit */}
              <Button disabled={isLoading} type="submit"
                className="w-full h-14 bg-[#1f2b6c] hover:bg-[#2d3f9e] text-white font-bold text-base
                           rounded-2xl shadow-xl shadow-[#1f2b6c]/30 transition-all duration-200 mb-2">
                {isLoading ? <Spinner /> : (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Confirm Appointment
                  </span>
                )}
              </Button>

            </form>
          )}
        </Formik>

        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-6 self-start">

          {/* Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#1f2b6c] px-5 py-4 flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#bfd2f8]" />
              <div>
                <p className="text-white font-bold text-sm">Schedule Hours</p>
                <p className="text-white/40 text-[10px]">Weekly availability</p>
              </div>
            </div>
            <div className="p-3">
              {SCHEDULE.map(({ day, hours }) => {
                const isClosed = hours === 'Closed'
                const isToday = today === day
                return (
                  <div key={day}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl
                      ${isToday ? 'bg-[#f4f7ff] border border-[#1f2b6c]/10' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      {isToday && <span className="h-1.5 w-1.5 rounded-full bg-[#1f2b6c] animate-pulse" />}
                      <span className={`text-sm ${isToday ? 'text-[#1f2b6c] font-bold' : 'text-gray-600 font-medium'}`}>
                        {day}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${isClosed ? 'text-red-400' : isToday ? 'text-[#1f2b6c]' : 'text-gray-400'}`}>
                      {hours}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-red-900 font-bold text-sm">Emergency Line</p>
              <p className="text-red-500 font-bold">(237) 681-812-255</p>
              <p className="text-red-400 text-[10px] mt-0.5 uppercase tracking-widest">Available 24 / 7</p>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}