import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from "../utils";
import strictInstance from "../utils/strictInstance";

const SidebarAdmin = () => {
    const [isOpen, setIsOpen] = useState(true); // Default open
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
            try {
                await strictInstance.delete("/logout");
            } catch (error) {
                console.warn("Logout error:", error?.response?.data || error.message);
            } finally {
                localStorage.removeItem("accessToken");
                delete strictInstance.defaults.headers.common["Authorization"];

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
                    left: isOpen ? "240px" : "20px",
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
                    left: isOpen ? 0 : '-230px',
                    height: "100vh",
                    width: "230px",
                    background: "linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                    padding: "1.8rem 1.5rem",
                    boxShadow: "3px 0 15px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: "'Inter', sans-serif",
                    color: "#f9f9f9",
                    zIndex: 1000,
                    transition: "left 0.3s ease",
                }}
            >
                <div>
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
                        <i className="fas fa-user-shield" style={{ fontSize: "18px" }}></i>
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
                                { to: "/dashboardAdmin", label: "Home", icon: "fas fa-home" },
                                { to: "/addnews", label: "Tambah Catatan", icon: "fas fa-plus" },
                                { to: "/categorylist", label: "Daftar Kategori", icon: "fas fa-list" },
                            ].map(({ to, label, icon }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
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

export default SidebarAdmin;
