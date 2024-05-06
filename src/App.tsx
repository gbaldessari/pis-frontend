
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Root";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <AppRoutes></AppRoutes>
    </BrowserRouter>
  );
}

export default App;
