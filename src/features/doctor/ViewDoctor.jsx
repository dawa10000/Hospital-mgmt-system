import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx';
import { Button } from '../../components/ui/button.jsx';
import { base } from '../../app/mainApi.js';
import { EditIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useGetAllDoctorsQuery } from './doctorApi.js';

export default function ViewDoctor() {
  const nav = useNavigate();
  const { isLoading, error, data } = useGetAllDoctorsQuery();

  const doctors = data || [];

  if (isLoading) return <p className='mt-2'>Loading...</p>;
  if (error) return <p>{error.data?.message || 'Something went wrong'}</p>;

  return (
    <div className='w-full p-3'>
      <div className='mb-3'>
        <Button className="bg-[#bfd2f8] text-xl text-blue-900 rounded-4xl" onClick={() => nav('/doctor/add-doctor')}>Add Doctor</Button>
      </div>
      <div className='[&>div]:rounded-sm [&>div]:border'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No doctors found in the database
                </TableCell>
              </TableRow>
            ) : (
              doctors.map(({ _id, name, age, department, qualification, availability, image }, index) => (
                <TableRow key={_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className="w-14 h-14 rounded-full overflow-hidden">
                        <AvatarImage className="object-cover w-full h-full" src={`${base}/${image}`} alt='AV' />
                        <AvatarFallback className='text-xs'>AV</AvatarFallback>
                      </Avatar>
                      <div className='font-medium'>{name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{age}</TableCell>
                  <TableCell>{department}</TableCell>
                  <TableCell>{qualification}</TableCell>
                  <TableCell>{availability}</TableCell>
                  <TableCell className="flex mt-2 gap-2">
                    <Button onClick={() => nav(`/doctor/${_id}`)} variant="ghost">
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}