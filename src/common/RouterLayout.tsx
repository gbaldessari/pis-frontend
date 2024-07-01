import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';
import { Chat } from './chat';
import MenuBar from './MenuBar'; 
import Cookies from 'js-cookie';

export const RouterLayout: React.FC = () => {
  const user = Cookies.get('token');
  return (
    <>
      {!user && <NavBar />}
      {user && <Chat />} 
      {user && <MenuBar />}
      <Outlet />
    </>
  );
}