import { mainApi } from "../../app/mainApi.js";


const doctorApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    addDoctor: builder.mutation({
      query: (formData) => ({
        url: '/doctor/add-doctor',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Doctors']
    }),

    getAllDoctors: builder.query({
      query: () => ({
        url: '/doctor',
        method: 'GET',
      }),
      providesTags: ['Doctors']
    }),

    getDoctor: builder.query({
      query: (id) => ({
        url: `/doctor/${id}`,
        method: 'GET',
      }),
      providesTags: ['Doctors']
    }),

    updateDoctor: builder.mutation({
      query: (data) => ({
        url: `/doctor/${data.id}`,
        method: 'PATCH',
        body: data.body,
      }),
      invalidatesTags: ['Doctors']
    }),

    removeDoctor: builder.mutation({
      query: (data) => ({
        url: `/doctor/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctors']
    })
  })
})

export const { useAddDoctorMutation, useGetDoctorQuery, useGetAllDoctorsQuery, useUpdateDoctorMutation, useRemoveDoctorMutation } = doctorApi;