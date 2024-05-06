import React from "react";
import {Routes, Route} from "react-router-dom";
import {MainPage} from "./screens/main";
import {LoginPage} from "./screens/login";
import {RouterLayout} from "./common/RouterLayout";
import {HomePage} from "./screens/home";
import {ForgottenPasswordPage} from "./screens/forgotten";
import {RegisterPage} from "./screens/register";
export const AppRoutes: React.FC<{}> = () => {
  return (
   <Routes>
      <Route path="/" element={<RouterLayout />}>
      <Route path="/" element={<MainPage />} />
      </Route>
      <Route path="/home" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/forgotten" element={<ForgottenPasswordPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
   </Routes>
  );
};

