import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../utils";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-open sidebar on desktop, auto-close on mobile
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "<div style='font-size:18px;'>Yakin ingin logout?</div>",
      html: "<div style='font-size:14px;'>Anda akan keluar dari sistem.</div>",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4b6cb7",
      cancelButtonColor: "#ccc",
      confirmButtonText: "<span style='font-size:13px;'>Ya, logout</span>",
      cancelButtonText: "<span style='font-size:13px;'>Batal</span>",
      background: "#16213e",
      color: "#f9f9f9",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("accessToken");

      try {
        await axios.delete(`${BASE_URL}/logout`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } catch (error) {
        console.warn(error?.response?.data || error.message);
      } finally {
        localStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];

        Swal.fire({
          icon: "success",
          title: "<span style='font-size:16px;'>Logout Berhasil</span>",
          timer: 1500,
          showConfirmButton: false,
          background: "#16213e",
          color: "#f9f9f9",
        });

        navigate("/login");
      }
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "20px",
          left: isOpen && !isMobile ? "240px" : "20px",
          background: "#4b6cb7",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 1001,
          transition: "left 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : isMobile ? '-280px' : '-230px',
          height: "100vh",
          width: isMobile ? "280px" : "230px",
          background: "linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
          padding: isMobile ? "1.5rem 1rem" : "1.8rem 1.5rem",
          boxShadow: "3px 0 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "'Inter', sans-serif",
          color: "#f9f9f9",
          zIndex: 1000,
          transition: "left 0.3s ease",
          overflowY: "auto",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: isMobile ? "0.7rem 0" : "0.9rem 0",
              marginBottom: "2rem",
              marginTop: isMobile ? "3rem" : "0",
              borderRadius: "14px",
              background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
              color: "#f9f9f9",
              fontWeight: "600",
              fontSize: isMobile ? "0.9rem" : "1rem",
              boxShadow: "0 6px 15px rgba(75, 108, 183, 0.4)",
              userSelect: "none",
            }}
          >
            <i className="fas fa-newspaper" style={{ fontSize: isMobile ? "16px" : "18px" }}></i>
            BERITA NASIONAL
          </div>

          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {[
                { to: "/dashboard", label: "Home", icon: "fas fa-home" },
                { to: "/liked-news", label: "History Like", icon: "fas fa-heart" },
                { to: "/profile-user", label: "Profile User", icon: "fas fa-user" },
              ].map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={handleLinkClick}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: isMobile ? "12px 16px" : "10px 18px",
                      borderRadius: "12px",
                      fontWeight: isActive ? "700" : "500",
                      backgroundColor: isActive ? "#4b6cb7" : "transparent",
                      color: isActive ? "#f9f9f9" : "#cbd5e1",
                      textDecoration: "none",
                      boxShadow: isActive
                        ? "0 3px 8px rgba(75, 108, 183, 0.5)"
                        : "none",
                      transition: "all 0.2s ease-in-out",
                      fontSize: isMobile ? "1rem" : "0.95rem",
                      cursor: "pointer",
                    })}
                    end
                  >
                    <i
                      className={icon}
                      style={{
                        width: "20px",
                        textAlign: "center",
                        fontSize: isMobile ? "16px" : "15px",
                      }}
                    />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div style={{ paddingBottom: isMobile ? "1rem" : "0" }}>
          <button
            onClick={handleLogout}
            type="button"
            style={{
              width: "100%",
              padding: isMobile ? "1rem 0" : "0.8rem 0",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
              color: "#f9f9f9",
              fontWeight: "600",
              fontSize: isMobile ? "1rem" : "0.9rem",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(75, 108, 183, 0.4)",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: "6px" }}></i>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;