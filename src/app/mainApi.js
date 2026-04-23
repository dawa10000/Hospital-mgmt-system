import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseUrl = import.meta.env.PROD
  ? 'https://hospital-mgmt-system-coa8.onrender.com/api'
  : 'http://localhost:5000/api';
export const base = import.meta.env.PROD
  ? 'https://hospital-mgmt-system-coa8.onrender.com'
  : 'http://localhost:5000';

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