import { createBrowserRouter, RouterProvider } from "react-router"
import RootLayout from "./components/RootLayout.jsx";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import UserProfile from "./features/users/UserProfile.jsx";
import AddAppointment from "./features/appointment/AddAppointment.jsx";
import MyAppointments from "./features/appointment/MyAppointments.jsx";
import AllAppointments from "./features/appointment/AllAppointments.jsx";
import IsLogin from "./components/IsLogin.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";
import RequireUserAuth from "./components/RequireUserAuth.jsx";
import AdminDashboard from "./features/appointment/AdminDashboard.jsx";
import AddDoctor from "./features/doctor/AddDoctor.jsx";
import ViewDoctor from "./features/doctor/ViewDoctor.jsx";
import EditDoctor from "./features/doctor/EditDoctor.jsx";




export default function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          element: <IsLogin />,
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            }
          ]
        },

        {
          element: <RequireAdminAuth />,
          children: [
            {
              path: 'appointment/all-appointments',
              element: <AllAppointments />
            },
            {
              path: 'appointment/stats',
              element: <AdminDashboard />
            },
            {
              path: 'doctor/add-doctor',
              element: <AddDoctor />
            },
            {
              path: 'doctor/:id',
              element: <EditDoctor />
            },
            {
              path: 'doctor',
              element: <ViewDoctor />
            }
          ]
        },
        {
          element: <RequireUserAuth />,
          children: [
            {
              path: 'profile',
              element: <UserProfile />
            },
            {
              path: 'appointment',
              element: <AddAppointment />
            },

            {
              path: 'appointment/my-appointments',
              element: <MyAppointments />
            }
          ]
        },

      ]
    }

  ]);
  return <RouterProvider router={router} />
}
