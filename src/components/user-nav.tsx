import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import Cookies from 'js-cookie';
import UserProfileIcon from './Icons/UserProfileIcon';
import Logout from './Icons/Logout';
import { Button as ShadButton } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';

export function UserNav() {
  const [position, setPosition] = React.useState('bottom');
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const isRtl = useDirection();
  const userId = Cookies.get('userId');
  const { data } = createCrudService<any>(`/auth/users/${userId}`).useGetAll();
  console.log('Data made by Abdelrahman: ', data?.data?.image);
  const userImage = data?.data?.image;
  console.log('User Id made by Abdelrahman: ', { userId });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ShadButton variant="ghost" className="relative h-8 w-8 rounded-full">
          {/* <img src={userImage} alt='user image' className='h-[8px] w-[8px] rounded-full'/> */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt="@shadcn" />
            <AvatarFallback>{'SN'}</AvatarFallback>
          </Avatar>
        </ShadButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          left: !isRtl ? '-180px' : '-50px',
        }}
        className="fixed w-[230px]"
      >
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer  flex justify-center text-[#868686] focus:text-[#FFFFFF] focus:bg-[#7272F6]"
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => navigate('/zood-dashboard/profile')}
        >
          <span className="w-[50%]">{t('PROFILE')}</span>
          <div className="ml-2 flex w-[12%] justify-center">
            <UserProfileIcon
              fill={hoveredItem === 'profile' ? 'white' : '#868686'}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex justify-center text-[#868686] focus:text-[#FFFFFF] focus:bg-[#7272F6]"
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => logout()}
        >
          <span className="w-[50%]">{t('LOGOUT')}</span>
          <div className="ml-2 flex w-[12%] justify-center">
            <Logout fill={hoveredItem === 'logout' ? 'white' : '#868686'} />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>satnaing</p>
            <p className='text-xs leading-none text-muted-foreground'>
              satnaingdev@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          logout();
        }}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
