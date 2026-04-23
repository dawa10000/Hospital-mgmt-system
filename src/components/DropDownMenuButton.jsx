import { UserIcon, SettingsIcon, BellIcon, LogOutIcon, CreditCardIcon, ListOrdered, LayoutDashboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useGetUserQuery } from '../features/users/userApi.js'
import { base } from '../app/mainApi.js'
import { useDispatch } from 'react-redux'
import { removeUser } from '../features/users/userSlice.js'
import { useNavigate } from 'react-router'


const userlistItems = [
  { icon: UserIcon, property: "Profile" },
  { icon: ListOrdered, property: "My Appointments" },
  { icon: LogOutIcon, property: "Sign Out" },
];

const adminlistItems = [
  { icon: UserIcon, property: "Profile" },
  { icon: LayoutDashboard, property: "Admin Dashboard" },
  { icon: ListOrdered, property: "All Appointments" },
  { icon: LogOutIcon, property: "Sign Out" },
];

const DropDownMenuButton = ({ user }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, data } = useGetUserQuery(user.token);
  if (isLoading) return 'Loading...';
  if (error) return <p className='text-red-500'>{error.data.message}</p>

  const listItem =
    user?.role === "admin" ? adminlistItems : userlistItems;




  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='overflow-hidden rounded-full'>
          <img src={`${base}/${data.image}`} alt='Hallie Richards' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {listItem.map((item, index) => (
            <DropdownMenuItem
              onClick={() => {
                switch (item.property) {

                  case 'Sign Out':
                    dispatch(removeUser());
                    break;

                  case 'Profile':
                    nav('/profile');
                    break;

                  case 'My Appointments':
                    nav('/appointment/my-appointments');
                    break;

                  case 'Admin Dashboard':
                    nav('/appointment/stats');
                    break;

                  case 'All Appointments':
                    nav('/appointment/all-appointments');
                    break;
                }
              }}
              key={index}>
              <item.icon />
              <span className='text-popover-foreground'>{item.property}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDownMenuButton
