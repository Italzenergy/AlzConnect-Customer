// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const customer = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [technicalSheets, setTechnicalSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  // estados de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [docType, setDocType] = useState("");

  // === Colores para eventos ===
  const eventOptions = [
    { value: "Alistando pedido", label: "Alistando pedido", color: "#1976d2" },
    { value: "Se despacho el pedido", label: "Se despachó el pedido", color: "#2e7d32" },
    { value: "En transito", label: "En tránsito", color: "#ef6c00" },
    { value: "En transito con novedad", label: "En tránsito con novedad", color: "#d84315" },
    { value: "El vehículo llega a la ciudad de destino", label: "El vehículo llega a la ciudad de destino", color: "#6a1b9a" },
    { value: "En reparto", label: "En reparto", color: "#0288d1" },
    { value: "En reparto con novedad", label: "En reparto con novedad", color: "#c62828" },
    { value: "Entregado", label: "Entregado", color: "#388e3c" },
  ];

  const TZ = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "America/Bogota";

  const formatEventDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "medium",
        hour12: true,
        timeZone: TZ,
      }).format(new Date(dateString));
    } catch {
      return new Date(dateString).toLocaleString("es-ES");
    }
  };

  const statusClass = (s) => (!s ? "pending" : String(s).replace(/\s+/g, "_"));

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // === Carga de datos ===
  useEffect(() => {
    (async () => {
      try {
        if (!customer?.id) return setLoading(false);
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        // Pedidos
        try {
          const { data } = await api.get(`/orders/${customer.id}/orders`, { headers });
          const normalizedOrders =
            Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
          setOrders(normalizedOrders);
        } catch (err) {
          setOrders([]);
        }

        // Rutas
        try {
          const { data } = await api.get(`/router/customer/${customer.id}`, { headers });
          const normalizedRoutes =
            Array.isArray(data?.routes) ? data.routes : Array.isArray(data) ? data : [];
          setRoutes(normalizedRoutes);
        } catch (err) {
          setRoutes([]);
        }

        // Documentos
        try {
          const { data } = await api.get(`/customersheets/${customer.id}`, { headers });
          const normalizedSheets =
            Array.isArray(data?.sheets) ? data.sheets : Array.isArray(data) ? data : [];
          setTechnicalSheets(normalizedSheets);
        } catch (err) {
          setTechnicalSheets([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [customer?.id]);

  // === Filtrados ===
  const filteredOrders = orders.filter((o) =>
    (o.tracking_code || o.order_code || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (o.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoutes = routes.filter((r) =>
    (r.order_tracking_code || r.order_code || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (r.destination_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.source_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.carrier_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSheets = technicalSheets.filter(
    (s) =>
      ((s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.description || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (docType ? s.type === docType : true)
  );

  if (loading)
    return (
      <div className="dashboard-wrapper">
        <div className="container">Cargando…</div>
      </div>
    );

  return (
    <div className="dashboard-wrapper">
     {/* Botón flotante de WhatsApp */}
<a
  href="https://wa.me/573171928395?text=Hola%20equipo%20de%20logística%2C%20necesito%20ayuda%20con%20mi%20pedido"
  className="whatsapp-float"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    className="whatsapp-icon"
  />
  <span className="tooltip">Contáctate con el área de logística</span>
</a>

      <div className="container">
        <header className="dashboard-header">
          <div className="customer-info">
            <h1 className="dashboard-title">Bienvenido, {customer?.name}</h1>
            <p className="customer-email">{customer?.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar sesión
          </button>
        </header>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Buscar en ${activeTab === "orders"
              ? "pedidos"
              : activeTab === "routes"
              ? "rutas"
              : "documentos"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {activeTab === "sheets" && (
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="search-select"
            >
              <option value="">Todos</option>
              <option value="Documento">Factura</option>
              <option value="guia">Guía</option>
              <option value="Ficha">Ficha Tecnica</option>
            </select>
          )}
        </div>

        {/* 🔹 Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Tus pedidos
          </button>
          <button
            className={`tab-button ${activeTab === "routes" ? "active" : ""}`}
            onClick={() => setActiveTab("routes")}
          >
            🛣️ Rutas de envío
          </button>
          <button
            className={`tab-button ${activeTab === "sheets" ? "active" : ""}`}
            onClick={() => setActiveTab("sheets")}
          >
            📄 Documentos
          </button>
        </div>

        {/* 📦 PEDIDOS */}
        {activeTab === "orders" && (
          <>
            {filteredOrders.length === 0 ? (
              <div className="no-data">
                <h3>No tienes pedidos registrados</h3>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => {
                  const events = Array.isArray(order?.events) ? order.events : [];
                  return (
                    <article key={order.order_id || order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Pedido #{order.tracking_code || order.order_code}</h3>
                          <p className="order-customer">{order.customer_name || ""}</p>
                        </div>
                        <div className={`order-status ${statusClass(order.order_state)}`}>
                          {order.order_state || "Pendiente"}
                        </div>
                      </div>
                      <p className="order-description">{order.description || "Sin descripción"}</p>
                      <div className="events">
                        <h4>Historial de Eventos</h4>
                        <div className="events-list">
                          {events.length === 0 ? (
                            <p className="event-note">Sin eventos aún.</p>
                          ) : (
                            events.map((ev, idx) => {
                              const eventLabel =
                                ev.state || ev.event_type || ev.type || "Evento";
                              const normalized = (s) =>
                                String(s || "").toLowerCase().trim();
                              const option = eventOptions.find(
                                (opt) => normalized(opt.value) === normalized(eventLabel)
                              );
                              const chipStyle = {
                                backgroundColor: option ? option.color + "20" : "#eef2f7",
                                color: option ? option.color : "#1f2937",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontWeight: 600,
                                display: "inline-block",
                                minWidth: 140,
                                textAlign: "center",
                              };
                              const when = formatEventDate(ev.date || ev.created_at);
                              return (
                                <div key={ev.id || idx} className="event-item">
                                  <p className="event-time">{when}</p>
                                  <span style={chipStyle}>{eventLabel}</span>
                                  {ev.note && <p className="event-note">{ev.note}</p>}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* 🛣️ RUTAS */}
        {activeTab === "routes" && (
          <>
            {filteredRoutes.length === 0 ? (
              <div className="no-data">
                <h3>No hay rutas registradas</h3>
              </div>
            ) : (
              <div className="routes-grid">
                {filteredRoutes.map((route) => (
                  <div key={route.id} className="route-card">
                    <div className="route-header">
                      <h3>
                        Ruta para Pedido #{route.order_tracking_code || route.order_code}
                      </h3>
                      <span className="route-status">{route.status || "Pendiente"}</span>
                    </div>
                    <div className="route-details">
                      <div><strong>Origen:</strong> {route.source_address || "N/A"}</div>
                      <div><strong>Destino:</strong> {route.destination_address || "N/A"}</div>
                      <div><strong>Transportista:</strong> {route.carrier_name || "N/A"}</div>
                      <div><strong>Salida:</strong> {formatDate(route.departure_date)}</div>
                      <div><strong>Entrega Apróximada:</strong> {formatDate(route.estimated_delivery_date)}</div>
                    </div>
                    {route.comment && (
                      <div className="route-comment">
                        <strong>Comentarios:</strong>
                        <p>{route.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 📄 DOCUMENTOS */}
        {activeTab === "sheets" && (
          <>
            {filteredSheets.length === 0 ? (
              <div className="no-data">
                <h3>No hay Documentos disponibles</h3>
              </div>
            ) : (
              <div className="sheets-grid">
                {filteredSheets
                 .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at)) 
                .map((sheet) => (
                  <div key={sheet.id} className="sheet-card">
                    <div className="sheet-header">
                      <h3>{sheet.name || "Documento"}</h3>
                      <span className="sheet-date">
                        Asignada: {formatDate(sheet.assigned_at)}
                      </span>
                    </div>
                    <p className="sheet-description">
                      {sheet.description || "Documento"}
                    </p>
                    <div className="sheet-actions">
                      {sheet.url && (
                        <a
                          href={sheet.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-btn"
                        >
                          📥 Descargar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
