import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';
import { Chat } from './chat';
import MenuBar from './MenuBar';
import { useAuth } from '../AuthContext'; 
import Cookies from 'js-cookie';
export const RouterLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const user = Cookies.get('token');
  return (
    <>
      {!user && <NavBar />}
      <Outlet />
      {user && (
        <>
          <Chat /> 
          <MenuBar />
        </>
      )}
    </>
  );
}