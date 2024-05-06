import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { RouterLayout } from "./common/RouterLayout";
import {Users} from "./pages/users";
import {RegisterPage} from "./pages/register";
export const AppRoutes: React.FC<{}> = () => {
  return (
   <Routes>
      <Route path="/" element={<RouterLayout />}>
      <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/users" element={<Users/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
   </Routes>
  );
};

