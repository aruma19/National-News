import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../utils";

const Sidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1100] bg-[#4b6cb7] text-white p-2 rounded-md shadow-lg"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Overlay (saat sidebar terbuka di mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-[900] md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-[1000] transition-transform duration-300"
        style={{
          width: "230px",
          background: "linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
          padding: "1.8rem 1.5rem",
          boxShadow: "3px 0 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "'Inter', sans-serif",
          color: "#f9f9f9",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "0.9rem 0",
              marginBottom: "2rem",
              borderRadius: "14px",
              background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
              color: "#f9f9f9",
              fontWeight: "600",
              fontSize: "1rem",
              boxShadow: "0 6px 15px rgba(75, 108, 183, 0.4)",
              userSelect: "none",
            }}
          >
            <i className="fas fa-newspaper" style={{ fontSize: "18px" }}></i>
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
                    onClick={() => setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      fontWeight: isActive ? "700" : "500",
                      backgroundColor: isActive ? "#4b6cb7" : "transparent",
                      color: isActive ? "#f9f9f9" : "#cbd5e1",
                      textDecoration: "none",
                      boxShadow: isActive
                        ? "0 3px 8px rgba(75, 108, 183, 0.5)"
                        : "none",
                      transition: "all 0.2s ease-in-out",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    })}
                    end
                  >
                    <i
                      className={icon}
                      style={{
                        width: "20px",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    />
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
              padding: "0.8rem 0",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
              color: "#f9f9f9",
              fontWeight: "600",
              fontSize: "0.9rem",
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
