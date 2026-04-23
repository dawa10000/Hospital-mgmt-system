import { NavLink, useNavigate } from "react-router";
import DropDownMenuButton from "./DropDownMenuButton.jsx";
import { Button } from "./ui/button.jsx";
import { useSelector } from "react-redux";



export default function Header() {
  const { user } = useSelector((state) => state.userSlice);
  const nav = useNavigate();
  return (
    <div className="flex items-center justify-between bg-[#1f2b6c] px-10 py-3">
      <div>
        <h1 className="text-white">Hospital Management System</h1>
      </div>
      <div className="flex gap-5">
        <Button className="bg-[#bfd2f8] text-xl text-blue-900 rounded-4xl" disabled={!user} onClick={() => nav('/appointment')}>Appointment</Button>
        {user ? <DropDownMenuButton user={user} /> : <div className="flex gap-3">
          <NavLink to="/login"><Button>Login</Button></NavLink>
          <NavLink to="/register"><Button>Sign Up</Button></NavLink>
        </div>
        }
      </div>


    </div>
  )
}
