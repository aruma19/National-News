// src/pages/ProfileUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/6522516.png";

const ProfileUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    password: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/");

    fetchProfile(token);
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { username, email, gender } = res.data;
      setFormData({ username, email, gender, password: "" });
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data profil", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(`${BASE_URL}/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Data berhasil diperbarui",
        background: "#16213e",
        color: "#f9f9f9",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal memperbarui data",
        background: "#16213e",
        color: "#f9f9f9",
      });
    }
  };

  return (
    <div
      style={{
        marginLeft: isMobile ? "0" : "230px",
        padding: isMobile ? "80px 1rem 2rem 1rem" : "2rem",
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "'Inter', sans-serif",
        color: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "margin-left 0.3s ease, padding 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#16213e",
          padding: isMobile ? "1.5rem 1rem" : "1.2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "420px",
          boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <img
            src={profileIcon}
            alt="profile"
            style={{
              width: isMobile ? "70px" : "80px",
              height: isMobile ? "70px" : "80px",
              borderRadius: "50%",
              backgroundColor: "white",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        <h2 
          style={{ 
            fontSize: isMobile ? "1.5rem" : "1.8rem", 
            fontWeight: "600", 
            marginBottom: "1.5rem" 
          }}
        >
          Profil Saya
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "1rem" : "0.8rem",
            textAlign: "left",
          }}
        >
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password Baru (Opsional)", name: "password", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label 
                style={{ 
                  fontSize: isMobile ? "15px" : "14px", 
                  marginBottom: "0.3rem", 
                  display: "block",
                  fontWeight: "500"
                }}
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: isMobile ? "12px 16px" : "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #2c5364",
                  backgroundColor: "#203a43",
                  color: "#f9f9f9",
                  fontSize: isMobile ? "16px" : "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4b6cb7")}
                onBlur={(e) => (e.target.style.borderColor = "#2c5364")}
              />
            </div>
          ))}

          <div>
            <label 
              style={{ 
                fontSize: isMobile ? "15px" : "14px", 
                marginBottom: "0.3rem", 
                display: "block",
                fontWeight: "500"
              }}
            >
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: isMobile ? "12px 16px" : "8px 12px",
                borderRadius: "8px",
                border: "1px solid #2c5364",
                backgroundColor: "#203a43",
                color: "#f9f9f9",
                fontSize: isMobile ? "16px" : "14px",
                boxSizing: "border-box",
                outline: "none",
                cursor: "pointer",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4b6cb7")}
              onBlur={(e) => (e.target.style.borderColor = "#2c5364")}
            >
              <option value="">Pilih Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: isMobile ? "1.5rem" : "1rem",
              background: "linear-gradient(90deg, #4b6cb7, #182848)",
              border: "none",
              padding: isMobile ? "14px" : "10px",
              borderRadius: "12px",
              color: "#f9f9f9",
              fontWeight: "600",
              fontSize: isMobile ? "1.1rem" : "0.95rem",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(75, 108, 183, 0.4)",
              transition: "opacity 0.3s ease, transform 0.2s ease",
              width: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUser;