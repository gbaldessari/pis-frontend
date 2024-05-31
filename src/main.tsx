import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeConfig } from "./config/theme.config.tsx";
import ErrorPage from "./screens/error";
import { AppRoutes } from "./Root.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql"
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});


const router = createBrowserRouter([
  {
    path: "/",
    element:<AppRoutes/>,
    errorElement: <ErrorPage />,
  }
]);

<RouterProvider router={router} />
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <ThemeConfig>
      <App />
      </ThemeConfig>
    </React.StrictMode>
  </ApolloProvider> 
);
