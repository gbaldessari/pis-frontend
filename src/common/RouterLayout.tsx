import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';
import { Chat } from './chat';
import MenuBar from './MenuBar';
import { useAuth } from '../AuthContext'; 

export const RouterLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && <NavBar />}
      <Outlet />
      {isAuthenticated && (
        <>
          <Chat /> 
          <MenuBar />
        </>
      )}
    </>
  );
}