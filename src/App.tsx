
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Root";
import { AuthProvider } from "./AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
