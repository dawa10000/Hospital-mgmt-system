import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Formik } from "formik"
import { useNavigate } from 'react-router'
import * as Yup from "yup"
import { Spinner } from '../../components/ui/spinner.jsx'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useGetUserQuery, useUpdateUserMutation } from './userApi.js'
import { base } from '../../app/mainApi.js'


const registerSchema = Yup.object({
  username: Yup.string().min(4).max(50).required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  image: Yup.mixed().test(
    'fileType',
    'Unsupported File Format',
    (value) => {
      if (value) {
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type)
      }
      return true
    }
  ),
})

const UserProfile = () => {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const { isLoading, data, error } = useGetUserQuery(user.token);
  const [updateProfile, { isLoading: isLoad }] = useUpdateUserMutation();

  if (isLoading) return 'Loading...'

  if (error) return <p className='text-red-500'>{error.data?.message}</p>
  return (
    <div>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Update your account</CardTitle>
          <CardDescription>Enter your details below to update to your account</CardDescription>
        </CardHeader>
        <CardContent>

          <Formik
            initialValues={{
              username: data.username,
              email: data.email,
              image: '',
              imagePreview: data.image
            }}

            onSubmit={async (val) => {
              const formData = new FormData();
              formData.append('username', val.username);
              formData.append('email', val.email);
              if (val.image) formData.append('image', val.image);


              try {
                await updateProfile({
                  body: formData,
                  token: user.token
                }).unwrap();
                toast.success("Profile updated Successfully");
                nav(-1);
              } catch (err) {
                toast.error(
                  err?.data?.message ||
                  err?.error ||
                  "Update failed"
                );
              }
            }}
            validationSchema={registerSchema}
          >
            {({ handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-6'>
                  <div className='grid gap-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Input
                      name='username'
                      onChange={handleChange}
                      value={values.username}
                      id='username' type='text' placeholder='John Doe' />
                    {touched.username && errors.username && <p className='text-red-500'>{errors.username}</p>}
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      name='email'
                      onChange={handleChange}
                      value={values.email}
                      id='email' type='email' placeholder='m@example.com' />
                    {touched.email && errors.email && <p className='text-red-500'>{errors.email}</p>}
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
                    {values.imagePreview && !errors.image && <img src={values.image ? values.imagePreview : `${base}/${values.imagePreview}`} alt="" />}
                  </div>
                </div>
                <Button
                  disabled={isLoad}
                  type='submit' className='w-full mt-6'>
                  {isLoad ? <Spinner /> : 'Submit'}
                </Button>
              </form>
            )}
          </Formik>

        </CardContent>
      </Card>
    </div>
  )
}

export default UserProfile



