import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from "../utils";

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Yakin ingin logout?",
            text: "Anda akan keluar dari sistem.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, logout",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {
            const token = localStorage.getItem("accessToken");

            try {
                await axios.delete(`${BASE_URL}/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            } catch (error) {
                console.warn("Logout error:", error?.response?.data || error.message);
            } finally {
                localStorage.removeItem("accessToken");
                delete axios.defaults.headers.common["Authorization"];

                Swal.fire({
                    icon: "success",
                    title: "Logout Berhasil",
                    text: "Anda telah keluar dari sistem.",
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/");
            }
        }
    };

    return (
        <aside
            className="menu has-background-primary"
            style={{
                height: '100vh',
                width: '240px',
                position: 'fixed',
                top: 0,
                left: 0,
                padding: '1.5rem',
                boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <div>
                <div className="menu-label" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
                    <i className="fas fa-book-open mr-2"></i>
                    National News
                </div>

                <ul className="menu-list">
                    <li>
                        <NavLink
                            to="/dashboardAdmin"
                            className={({ isActive }) => isActive ? 'is-active has-text-weight-semibold' : ''}
                            style={({ isActive }) => ({
                                color: 'white',
                                backgroundColor: isActive ? '#3273dc' : 'transparent',
                                borderRadius: '8px',
                                padding: '10px 15px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'background 0.2s ease'
                            })}
                        >
                            <i className="fas fa-home mr-2"></i> Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/addnews`}
                            className={({ isActive }) => isActive ? 'is-active has-text-weight-semibold' : ''}
                            style={({ isActive }) => ({
                                color: 'white',
                                backgroundColor: isActive ? '#3273dc' : 'transparent',
                                borderRadius: '8px',
                                padding: '10px 15px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'background 0.2s ease'
                            })}
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Catatan
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/categorylist`}
                            className={({ isActive }) => isActive ? 'is-active has-text-weight-semibold' : ''}
                            style={({ isActive }) => ({
                                color: 'white',
                                backgroundColor: isActive ? '#3273dc' : 'transparent',
                                borderRadius: '8px',
                                padding: '10px 15px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'background 0.2s ease'
                            })}
                        >
                            <i className="fas fa-plus mr-2"></i> Daftar Kategori
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div>
                <button
                    onClick={handleLogout}
                    className="button is-danger is-light is-fullwidth"
                    style={{
                        borderRadius: '20px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                >
                    <i className="fas fa-sign-out-alt"></i>
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
