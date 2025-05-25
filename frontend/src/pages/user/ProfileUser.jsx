// src/pages/ProfileUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

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

      Swal.fire("Sukses", "Data berhasil diperbarui", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Gagal memperbarui data", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="title is-3">Profil Saya</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Username</label>
          <input className="input" type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label">Gender</label>
          <div className="select is-fullwidth">
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Pilih Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label className="label">Password Baru (Opsional)</label>
          <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        <div className="field mt-4">
          <button className="button is-primary" type="submit">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUser;
