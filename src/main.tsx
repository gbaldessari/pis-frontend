import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeConfig } from "./config/theme.config.tsx";
import ErrorPage from "./screens/error";
import { AppRoutes } from "./Root.tsx";
import { HomePage } from "./screens/home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element:<AppRoutes/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/users",
    element: <HomePage />,
  },
]);


<RouterProvider router={router} />
ReactDOM.createRoot(document.getElementById("root")!).render(

  <React.StrictMode>
    <ThemeConfig>
    <App />
    </ThemeConfig>
   
  </React.StrictMode>
);
