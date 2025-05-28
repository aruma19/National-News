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

  const navigate = useNavigate();

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
      marginLeft: "230px",
      padding: "2rem",
      minHeight: "100vh",
      background: "transparent",
      fontFamily: "'Inter', sans-serif",
      color: "#f9f9f9",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "#16213e",
        padding: "1.2rem",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "420px", // lebar ditambah agar tidak tinggi ke bawah
        boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <img
          src={profileIcon}
          alt="profile"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "white",
            objectFit: "cover",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1.5rem" }}>
        Profil Saya
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          textAlign: "left",
        }}
      >
        {[
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password Baru (Opsional)", name: "password", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label style={{ fontSize: "14px", marginBottom: "0.3rem", display: "block" }}>
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #2c5364",
                backgroundColor: "#203a43",
                color: "#f9f9f9",
                fontSize: "14px",
              }}
            />
          </div>
        ))}

        <div>
          <label style={{ fontSize: "13px", marginBottom: "0.2rem", display: "block" }}>
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #2c5364",
              backgroundColor: "#203a43",
              color: "#f9f9f9",
              fontSize: "14px",
            }}
          >
            <option value="">Pilih Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            background: "linear-gradient(90deg, #4b6cb7, #182848)",
            border: "none",
            padding: "10px",
            borderRadius: "12px",
            color: "#f9f9f9",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(75, 108, 183, 0.4)",
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
