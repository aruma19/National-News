import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const loginAdmin = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            const response = await axios.post(
                `${BASE_URL}/admin/login`,
                { email, password },
                { withCredentials: true }
            );

            Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: `Selamat datang, ${response.data.safeUserData?.name || "Admin"}!`,
            });
            
            localStorage.setItem("accessToken", response.data.accessToken);
            navigate("/dashboardAdmin"); // atau ke route khusus admin jika ada
        } catch (error) {
            setMsg(error.response?.data?.message || "Terjadi kesalahan saat login.");
            Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: error.response?.data?.message || "Terjadi kesalahan.",
            });
        }
    };


    return (
        <div className="columns is-centered mt-6">
            <div className="column is-half">
                <div className="box has-shadow p-5" style={{ borderRadius: "12px" }}>
                    <h2 className="title is-4 has-text-centered has-text-primary">Login Admin</h2>

                    {msg && (
                        <p className="has-text-centered has-text-danger" style={{ marginBottom: "1rem" }}>
                            {msg}
                        </p>
                    )}

                    <form onSubmit={loginAdmin}>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    type="email"
                                    className="input is-rounded"
                                    placeholder="Masukkan email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input
                                    type="password"
                                    className="input is-rounded"
                                    placeholder="Masukkan password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field mt-4">
                            <button type="submit" className="button is-primary is-rounded is-fullwidth">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Tambah tombol untuk pindah ke halaman Register */}
                    <div className="has-text-centered mt-4">
                        <button
                            className="button is-link is-light is-rounded"
                            onClick={() => navigate("/register")}
                        >
                            Daftar Akun Admin Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
