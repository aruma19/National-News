import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from "../utils";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsOpen(window.innerWidth > 768);
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

        navigate("/");
      }
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
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

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : isMobile ? '-280px' : '-230px',
          height: "100vh",
          width: isMobile ? "280px" : "230px",
          background: "linear-gradient(180deg, #1c1c1c 0%, #2c3e50 100%)",
          padding: isMobile ? "1.5rem 1rem" : "1.8rem 1.5rem",
          boxShadow: "3px 0 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#f9f9f9",
          zIndex: 1000,
          transition: "left 0.3s ease",
          overflowY: "auto",
        }}
      >
        <div>
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              borderRadius: "12px",
              background: "#4b6cb7",
              fontWeight: "bold",
              marginBottom: "2rem",
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(75,108,183,0.3)",
            }}
          >
            PANEL ADMIN
          </div>

          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { to: "/admin/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
                { to: "/admin/users", label: "Kelola Pengguna", icon: "fas fa-users" },
                { to: "/admin/news", label: "Kelola Berita", icon: "fas fa-newspaper" },
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
                      boxShadow: isActive ? "0 3px 8px rgba(75, 108, 183, 0.5)" : "none",
                      transition: "all 0.2s ease-in-out",
                      fontSize: isMobile ? "1rem" : "0.95rem",
                    })}
                    end
                  >
                    <i className={icon} style={{ width: "20px", textAlign: "center" }} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
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
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: "6px" }}></i>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
