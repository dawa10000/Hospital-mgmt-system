import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import DropDownMenuButton from "./DropDownMenuButton.jsx";
import { Button } from "./ui/button.jsx";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user } = useSelector((state) => state.userSlice);
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#1f2b6c] px-6 py-3">

      <div className="flex items-center justify-between">
        <h1 className="text-white text-lg font-semibold">
          Hospital Management System
        </h1>


        <div className="hidden md:flex gap-5 items-center">
          <Button
            className="bg-[#bfd2f8] text-xl text-blue-900 rounded-4xl"
            disabled={!user}
            onClick={() => nav("/appointment")}
          >
            Appointment
          </Button>
          {user ? (
            <DropDownMenuButton user={user} />
          ) : (
            <div className="flex gap-3">
              <NavLink to="/login">
                <Button>Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button>Sign Up</Button>
              </NavLink>
            </div>
          )}
        </div>


        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>


      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 pb-2">
          <Button
            className="bg-[#bfd2f8] text-blue-900 w-full"
            disabled={!user}
            onClick={() => {
              nav("/appointment");
              setMenuOpen(false);
            }}
          >
            Appointment
          </Button>
          {user ? (
            <div onClick={() => setMenuOpen(false)}>
              <DropDownMenuButton user={user} />
            </div>
          ) : (
            <div className="flex gap-3">
              <NavLink to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Login</Button>
              </NavLink>
              <NavLink to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}