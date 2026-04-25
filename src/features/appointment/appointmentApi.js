import { mainApi } from "../../app/mainApi.js";

const appointmentApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    createAppointment: builder.mutation({
      query: (formData) => ({
        url: '/appointment',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Appointments']
    }),

    getAllAppointments: builder.query({
      query: ({ page = 1, search = '', department = '' } = {}) => ({
        url: '/appointment/all-appointments',
        method: 'GET',
        params: {
          page,
          limit: 9,
          ...(search && { search }),
          ...(department && { department }),
        },
      }),
      providesTags: ['Appointments']
    }),

    getMyAppointments: builder.query({
      query: () => ({
        url: '/appointment/my-appointments',
        method: 'GET',
      }),
      providesTags: ['Appointments']
    }),



    cancelAppointment: builder.mutation({
      query: ({ id }) => ({
        url: `/appointment/${id}/cancel`,
        method: 'PATCH',

      }),
      invalidatesTags: ['Appointments']
    }),


    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointment/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Appointments']
    }),

    getAppointmentStats: builder.query({
      query: () => ({
        url: '/appointment/stats',
        method: 'GET'
      }),
      providesTags: ['Appointments']
    }),


  })
})

export const { useCreateAppointmentMutation, useGetAllAppointmentsQuery, useGetMyAppointmentsQuery, useCancelAppointmentMutation, useUpdateAppointmentStatusMutation, useGetAppointmentStatsQuery } = appointmentApi;