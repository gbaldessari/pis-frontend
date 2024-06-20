
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Root";
import { AuthProvider } from "./AuthContext";
import "./App.css";

function App() {
  return (
     
       <BrowserRouter>
        <AppRoutes />
        </BrowserRouter>
    
  );
}
export default App;
