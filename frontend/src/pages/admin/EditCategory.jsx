import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategory(res.data.category);
      } catch (err) {
        Swal.fire("Gagal", "Kategori tidak ditemukan", "error");
      }
    };

    fetchCategory();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(
        `${BASE_URL}/categories/${id}`,
        { category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Sukses", "Kategori berhasil diperbarui", "success").then(() =>
        navigate("/categorylist")
      );
    } catch (err) {
      Swal.fire("Gagal", "Kategori gagal diperbarui", "error");
    }
  };

  const containerStyle = {
    maxWidth: isMobile ? "calc(100vw - 40px)" : 600,
    width: isMobile ? "calc(100vw - 40px)" : "auto",
    marginLeft: isMobile ? "20px" : "auto",
    marginRight: isMobile ? "20px" : "auto",
    marginTop: isMobile ? "20px" : "2rem",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: isMobile ? 16 : 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const titleStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    fontWeight: 700,
    color: "#1a2a6c",
    marginBottom: isMobile ? 16 : 24,
    textAlign: isMobile ? "center" : "left",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#1a2a6c",
    display: "block",
    marginBottom: "8px",
    fontSize: isMobile ? "0.9rem" : "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: isMobile ? "12px" : "12px 14px",
    border: "2px solid #1a2a6c",
    borderRadius: 8,
    fontSize: isMobile ? "0.9rem" : "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: isMobile ? "center" : "space-between",
    alignItems: "center",
    marginTop: isMobile ? 20 : 24,
    gap: isMobile ? "12px" : "16px",
    flexDirection: isMobile ? "column" : "row",
  };

  const backButtonStyle = {
    backgroundColor: "#f8f9fa",
    color: "#1a2a6c",
    border: "2px solid #1a2a6c",
    fontWeight: 600,
    padding: isMobile ? "12px 24px" : "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: isMobile ? "0.9rem" : "1rem",
    width: isMobile ? "100%" : "auto",
    transition: "all 0.3s ease",
  };

  const submitButtonStyle = {
    backgroundColor: "#1a2a6c",
    color: "white",
    border: "2px solid #1a2a6c",
    fontWeight: 600,
    padding: isMobile ? "12px 24px" : "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: isMobile ? "0.9rem" : "1rem",
    width: isMobile ? "100%" : "auto",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        Edit Kategori
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: isMobile ? 16 : 20 }}>
          <label style={labelStyle}>
            Nama Kategori
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#3861ff";
              e.target.style.boxShadow = "0 0 0 3px rgba(56, 97, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1a2a6c";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => navigate("/categorylist")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1a2a6c";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f8f9fa";
              e.target.style.color = "#1a2a6c";
            }}
          >
            Kembali
          </button>

          <button
            type="submit"
            style={submitButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#3861ff";
              e.target.style.borderColor = "#3861ff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#1a2a6c";
              e.target.style.borderColor = "#1a2a6c";
            }}
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;