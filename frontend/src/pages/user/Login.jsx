import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang, ${response.data.safeUserData?.username}!`,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      if (response.data.safeUserData.role === "admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboard");
      }
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
          borderRadius: "20px",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          padding: "2.5rem 3rem",
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h2
          style={{
            color: "#1a1a2e",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
          }}
        >
          Login
        </h2>

        {msg && (
          <div
            style={{
              backgroundColor: "#ffe6e6",
              padding: "0.9rem 1.2rem",
              borderRadius: "10px",
              color: "#b00020",
              textAlign: "center",
              fontWeight: "500",
              border: "1px solid #ffb3b3",
              fontSize: "0.95rem",
            }}
          >
            {msg}
          </div>
        )}

        <form
          onSubmit={loginHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                fontWeight: "bold",
                fontSize: "0.95rem",
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
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: "1.5px solid #ccc",
                fontSize: "0.95rem",
                outline: "none",
                transition: "0.3s",
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
              htmlFor="password"
              style={{
                fontWeight: "bold",
                fontSize: "0.95rem",
                color: "#333",
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: "1.5px solid #ccc",
                fontSize: "0.95rem",
                outline: "none",
                transition: "0.3s",
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
              borderRadius: "14px",
              padding: "0.9rem 0",
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
            Masuk
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#444",
            fontWeight: "500",
            marginTop: "1rem",
          }}
        >
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#4b6cb7",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
