import React from "react";
import {Routes, Route} from "react-router-dom";
import {MainPage} from "./screens/mainPage";
import {LoginPage} from "./screens/login";
import {RouterLayout} from "./common/RouterLayout";
import {HomePage} from "./screens/home";
import {ForgottenPasswordPage} from "./screens/forgotten";
import {RegisterPage} from "./screens/register";
import  ProtectedRoute  from "./ProtectdeRoutes";
import CreateJobForm from "./screens/createJob";
import ServicesExample from "./screens/services";


export const AppRoutes: React.FC<{}> = () => {
  return (
   <Routes>
      <Route path="/" element={<RouterLayout />}>
      <Route path="/" element={<MainPage />} />
      {/**RUTAS PROTEGIDAS */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/create-job" element={<ProtectedRoute><CreateJobForm/></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><ServicesExample/></ProtectedRoute>} />
      </Route>
      {/**RUTAS NO PROTEGIDAS */}
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/forgotten" element={<ForgottenPasswordPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
   </Routes>
  );
};

