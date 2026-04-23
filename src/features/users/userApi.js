import { mainApi } from "../../app/mainApi.js";


const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    getUser: builder.query({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['User']
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['User']
    })


  }),
})

export const { useGetUserQuery, useUpdateUserMutation } = userApi;