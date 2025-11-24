import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/ALZ2.jpg";

// Importa tus imágenes para el carrusel
import image1 from "../assets/carousel/image1.jpg";
import image2 from "../assets/carousel/image2.png";
import image3 from "../assets/carousel/image3.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationType, setAnimationType] = useState("fade"); // Tipo de animación por defecto
  const navigate = useNavigate();

  // Datos del carrusel - imágenes y sus enlaces
  const carouselData = [
    {
      image: image1,
      link: "https://www.alzenergy.com.co/event/jueves-de-conocimiento-incentivos-upme-55/register",
      isExternal: true
    },
    {
      image: image2,
      link: "/novedades",
      isExternal: false
    }
  ];

  // Efecto para cambiar automáticamente las imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselData.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [carouselData.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://alzconnect-server.onrender.com/api/customers/login", {
        email,
        password,
      });

      if (res.data.ok) {
        if (res.data.firstLogin) {
          localStorage.setItem("tempUserId", res.data.id);
          navigate("/change-password");
        } else {
          localStorage.setItem("userId", res.data.user.id);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Error en el login");
    }
  };

  const handleImageClick = (item) => {
    if (item.isExternal) {
      window.open(item.link, '_blank');
    } else {
      navigate(item.link);
    }
  };

  // Función para cambiar el tipo de animación (puedes agregar un selector si lo deseas)
  const changeAnimation = (type) => {
    setAnimationType(type);
  };

  return (
    <div className="login-wrapper">
      <div className="login-carousel-panel">
        <div className="carousel-container">
          {carouselData.map((item, index) => (
            <div
              key={index}
              className={`carousel-slide-container ${index === currentSlide ? 'active' : ''} carousel-slide-${animationType}`}
              onClick={() => handleImageClick(item)}
            >
              <img src={item.image} alt={`Promoción ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {carouselData.map((_, index) => (
            <span
              key={index}
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
        
       
      </div>
<div className="Panel-Login">
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-logo-container">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>
          
          <h1 className="login-title">ALZ CONNECT</h1>
          <h2 className="login-subtitle">Iniciar Sesión</h2>
         
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">
              Acceder
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}