import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseUrl = 'http://localhost:5000/api';
export const base = 'http://localhost:5000';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userSlice.user?.token;
      if (token) headers.set('Authorization', token);
      return headers;
    }
  }),
  tagTypes: ['User', 'Appointments'],
  endpoints: (builder) => ({})
})