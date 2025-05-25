import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils"; // Ganti dengan URL backend kamu

const RegisterUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/register`, {
                name,
                email,
                gender,
                password,
            });
            Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil",
                text: "Silakan login untuk melanjutkan.",
            });
            navigate("/"); // Redirect ke halaman login
        } catch (error) {
            console.log(error.response);
            Swal.fire({
                icon: "error",
                title: "Registrasi Gagal",
                text: error.response?.data?.message || "Terjadi kesalahan.",
            });
        }
    };

    return (
        <div className="columns is-centered mt-6">
            <div className="column is-half">
                <div className="box p-5" style={{ borderRadius: "12px" }}>
                    <h2 className="title is-4 has-text-centered has-text-primary">Daftar Akun Baru</h2>
                    <form onSubmit={handleRegister}>
                        <div className="field">
                            <label className="label">Nama</label>
                            <div className="control">
                                <input
                                    type="text"
                                    className="input is-rounded"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    type="email"
                                    className="input is-rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Jenis Kelamin</label>
                            <div className="control">
                                <div className="select is-rounded is-fullwidth">
                                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="" disabled>--Pilih Jenis Kelamin--</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Kata Sandi</label>
                            <div className="control">
                                <input
                                    type="password"
                                    className="input is-rounded"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field mt-4 is-flex is-justify-content-space-between">
                            <button
                                type="button"
                                className="button is-light is-rounded is-flex-grow-1 mx-1"
                                onClick={() => navigate("/")} // Pindah langsung ke halaman login
                            >
                                Kembali
                            </button>

                            <button
                                type="submit"
                                className="button is-primary is-rounded is-flex-grow-1 mx-1"
                            >
                                Daftar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;
