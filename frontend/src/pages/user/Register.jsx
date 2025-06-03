import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const RegisterUser = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/register`, {
        username,
        email,
        gender,
        password,
      });
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Silakan login untuk melanjutkan.",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "16px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "360px",
          padding: "2rem",
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            color: "#1a1a2e",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          Register
        </h2>

        <form
          onSubmit={handleRegister}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              htmlFor="username"
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "#333",
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
              Nama
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nama lengkap..."
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #ccc",
                fontSize: "0.9rem",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4b6cb7";
                e.target.style.boxShadow = "0 0 0 3px rgba(75, 108, 183, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "#333",
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #ccc",
                fontSize: "0.9rem",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4b6cb7";
                e.target.style.boxShadow = "0 0 0 3px rgba(75, 108, 183, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "#333",
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
              Jenis Kelamin
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #ccc",
                fontSize: "0.9rem",
                outline: "none",
                backgroundColor: "white",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4b6cb7";
                e.target.style.boxShadow = "0 0 0 3px rgba(75, 108, 183, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="" disabled>
                --Pilih Jenis Kelamin--
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "#333",
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #ccc",
                fontSize: "0.9rem",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4b6cb7";
                e.target.style.boxShadow = "0 0 0 3px rgba(75, 108, 183, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              borderRadius: "12px",
              padding: "0.8rem 0",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 6px 15px rgba(75, 108, 183, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Daftar
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#444",
              fontWeight: "500",
              marginTop: "0.5rem",
            }}
          >
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#4b6cb7",
                fontWeight: "600",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Masuk di sini
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
