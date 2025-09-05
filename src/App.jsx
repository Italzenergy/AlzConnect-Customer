import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import ChangePasswordPage from "../src/pages/ChangePasswordPage";
import Dashboard from "../src/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Cambiar contraseña */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Ruta por defecto: redirige al login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
