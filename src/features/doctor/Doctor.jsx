import React from 'react';
import { useGetAllDoctorsQuery } from './doctorApi.js';
import { base } from '../../app/mainApi.js';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx';
import { Badge } from '../../components/ui/badge.jsx';

const availabilityConfig = {
  available: { label: 'Available', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  not_available: { label: 'Not Available', class: 'bg-red-100 text-red-700 border-red-200' },
  on_leave: { label: 'On Leave', class: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function Doctor() {
  const { data, isLoading, error } = useGetAllDoctorsQuery();
  const doctors = data || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Doctors</h1>
        <p className="text-gray-500 mt-1">Meet our team of experienced medical professionals</p>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex justify-center items-center h-48 text-gray-400">
          Loading doctors...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-10">
          {error?.data?.message || 'Failed to load doctors'}
        </div>
      )}

      {!isLoading && !error && doctors.length === 0 && (
        <div className="text-center text-gray-400 py-16 text-lg">
          No doctors found.
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map(({ _id, name, age, department, qualification, availability, image }) => {
          const status = availabilityConfig[availability] || availabilityConfig['not_available'];
          return (
            <Card key={_id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Doctor Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                  <AvatarImage
                    src={`${base}/${image}`}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-blue-200 text-blue-800">
                    {name?.charAt(0) ?? 'D'}
                  </AvatarFallback>
                </Avatar>

                {/* Availability badge */}
                <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full border ${status.class}`}>
                  {status.label}
                </span>
              </div>

              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{name}</h2>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {department}
                  </Badge>
                </div>

                <div className="text-sm text-gray-500 space-y-1 pt-1">
                  <p><span className="font-medium text-gray-700">Qualification:</span> {qualification}</p>
                  <p><span className="font-medium text-gray-700">Age:</span> {age}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}