
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Root";
import { AuthProvider } from "./AuthContext";
import "./App.css";

function App() {
  return (
     <AuthProvider>
       <BrowserRouter>
        <AppRoutes />
        </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
