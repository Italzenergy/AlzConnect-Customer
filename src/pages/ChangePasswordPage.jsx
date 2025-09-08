import React, { useState } from "react";
import axios from "axios";
import "../styles/ChangePasswordPage.css";
import { useNavigate } from "react-router-dom";
export default function ChangePasswordPage() {
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const tempUserId = localStorage.getItem("tempUserId");
 const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await axios.post("https://alzconnect-server.onrender.com/api/customers/change-password", {
      id: tempUserId,
      newPassword: password,
    });

    alert("Contraseña cambiada con éxito. Ahora puedes ingresar.");
    localStorage.removeItem("tempUserId");
    navigate("/login"); 
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    alert("Hubo un error al cambiar la contraseña");
  }
};


  return (
    <div className="change-password-container">

      <div className="password-card">
        <h2 className="password-title">
          <span className="paw-icon"></span> Restablecer contraseña
        </h2>
        
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-container">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <div className="input-container">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="password-input"
            />
            <span className="input-icon">✅</span>
          </div>
          
          <button type="submit" className="submit-btn">
            <span>Cambiar contraseña</span>
            
          </button>
        </form>
        
        
      </div>
    </div>
  );
}