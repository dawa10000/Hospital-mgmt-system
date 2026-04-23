import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Formik } from "formik"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import * as Yup from "yup"
import { useRegisterUserMutation } from './authApi.js'
import { Spinner } from '../../components/ui/spinner.jsx'
import { toast } from 'sonner'


const registerSchema = Yup.object({
  username: Yup.string().min(4).max(50).required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(8).max(50).required("Password is required"),
  image: Yup.mixed().test(
    'fileType',
    'Unsupported File Format',
    (value) => value && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type)
  ).required("Image is required"),
})

const Register = () => {
  const nav = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);
  return (
    <div className="flex justify-center items-center p-9">
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>Enter your email below to register to your account</CardDescription>
          <CardAction>
            <Button onClick={() => nav(-1)} variant="link">Login</Button>
          </CardAction>
        </CardHeader>
        <CardContent>

          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              image: '',
              imagePreview: ''
            }}

            onSubmit={async (val) => {
              const formData = new FormData();
              formData.append('username', val.username);
              formData.append('email', val.email);
              formData.append('password', val.password);
              formData.append('image', val.image);
              try {
                await registerUser(formData).unwrap();
                toast.success('User registered successfully');
                nav('/login');
              } catch (err) {
                toast.error(err.data.message || err.data);
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
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                    </div>
                    <div className='relative'>
                      <Input
                        name='password'
                        onChange={handleChange}
                        value={values.password}
                        id='password' type={show ? 'text' : 'password'} placeholder="********" />
                      {touched.password && errors.password && <p className='text-red-500'>{errors.password}</p>}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={handleShow}
                        className=" absolute inset-y-0 right-0">
                        {show ? <EyeOffIcon /> : <EyeIcon />}

                      </Button>
                    </div>
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
                  {isLoading ? <Spinner /> : 'Submit'}
                </Button>
              </form>
            )}
          </Formik>

        </CardContent>
      </Card>
    </div>
  )
}

export default Register



