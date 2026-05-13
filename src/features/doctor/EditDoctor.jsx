
import React from 'react'
import { useGetDoctorQuery, useUpdateDoctorMutation } from './doctorApi.js';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import * as Yup from "yup";
import { Formik } from 'formik';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { Spinner } from '../../components/ui/spinner.jsx';
import { base } from '../../app/mainApi.js';

const doctorSchema = Yup.object({
  name: Yup.string().min(4).max(50).required('Doctor name is required'),
  age: Yup.number().required('Age is required'),
  department: Yup.string().required('Department is required'),
  qualification: Yup.string().required('Qualification is required'),
  availability: Yup.string().required('Availability is required'),
  image: Yup.mixed().test(
    'fileType',
    'Unsupported File Format',
    value => !value || ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'].includes(value.type)
  ).nullable()
})

const EditDoctor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, error, isLoading: isLoad } = useGetDoctorQuery(id);
  const [updateDoctor, { isLoading }] = useUpdateDoctorMutation();
  if (isLoad) {
    return <Spinner />
  }
  if (error) return <p>{error.data?.message}</p>
  return (
    <div className="flex justify-center items-center p-9">
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Edit Doctor</CardTitle>
          <CardDescription>Enter doctor details below</CardDescription>
        </CardHeader>
        <CardContent>

          <Formik
            initialValues={{
              name: data?.name || '',
              age: data?.age || '',
              department: data?.department || '',
              qualification: data?.qualification || '',
              availability: data?.availability || '',
              image: '',
              imagePreview: data?.image ? `${base}/${data.image}` : ''
            }}

            onSubmit={async (val) => {
              const formData = new FormData();
              formData.append('name', val.name);
              formData.append('age', val.age);
              formData.append('department', val.department);
              formData.append('qualification', val.qualification);
              formData.append('availability', val.availability);
              formData.append('image', val.image);
              try {
                await updateDoctor({ id, body: formData }).unwrap();
                toast.success('Doctor details added successfully');
                nav('/doctor');
              } catch (err) {
                toast.error(err?.data?.message || 'Something went wrong');
              }
            }}
            validationSchema={doctorSchema}
          >
            {({ handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-6'>
                  <div className='grid gap-2'>
                    <Label htmlFor='name'>Doctor's Name</Label>
                    <Input
                      name='name'
                      onChange={handleChange}
                      value={values.name}
                      id='username' type='text' placeholder='John Doe' />
                    {touched.name && errors.name && <p className='text-red-500'>{errors.name}</p>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='age'>Age</Label>
                    <Input
                      name='age'
                      onChange={handleChange}
                      value={values.age}
                      id='age'
                      type='number'
                      placeholder='0'
                    />
                    {touched.age && errors.age && <p className='text-red-500'>{errors.age}</p>}
                  </div>

                  <div>
                    <Select value={values.department} onValueChange={(e) => setFieldValue('department', e)}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Oncology">Oncology</SelectItem>
                          <SelectItem value="Dermatology">Dermatology</SelectItem>
                          <SelectItem value="Gynecology">Gynecology</SelectItem>
                          <SelectItem value="Urology">Urology</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {touched.department && errors.department && <p className="text-red-500">{errors.department}</p>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='name'>Qualification</Label>
                    <Input
                      name='qualification'
                      onChange={handleChange}
                      value={values.qualification}
                      id='username' type='text' placeholder='MBBS' />
                    {touched.qualification && errors.qualification && <p className='text-red-500'>{errors.qualification}</p>}
                  </div>

                  <div>
                    <Select value={values.availability} onValueChange={(e) => setFieldValue('availability', e)}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="not_available">Not Available</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {touched.availability && errors.availability && <p className="text-red-500">{errors.availability}</p>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='image'>Upload an image</Label>
                    <Input
                      name='image'
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValue('image', file);
                        setFieldValue('imagePreview', URL.createObjectURL(file));
                      }}
                      id='image' type='file' />
                    {touched.image && errors.image && <p className='text-red-500'>{errors.image}</p>}
                    {values.imagePreview && !errors.image && <img src={values.imagePreview} alt="" />}
                  </div>
                </div>
                <Button
                  disabled={isLoading}
                  type='submit' className='w-full mt-6'>
                  {isLoading ? <Spinner /> : 'Update'}
                </Button>
              </form>
            )}
          </Formik>

        </CardContent>
      </Card>
    </div>
  )
}

export default EditDoctor