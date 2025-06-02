import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const AddNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    author: "",
    title: "",
    url: "",
    description: "",
    iso_date: "",
    image_small: "",
    image_large: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    axios
      .get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Gagal ambil kategori:", err));

    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(`${BASE_URL}/news`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Berhasil!", "Berita berhasil ditambahkan", "success");
      navigate("/dashboardAdmin");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#f5f8fc",
    padding: isMobile ? "20px" : "30px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box",
  };

  const formBoxStyle = {
    maxWidth: "800px",
    width: "100%",
    background: "linear-gradient(145deg, #f0f4ff, #d9e2ff)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(24, 43, 99, 0.2)",
    color: "#0a1a3a",
    padding: isMobile ? "20px" : "30px",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 24,
    flexDirection: isMobile ? "column" : "row",
  };

  const titleStyle = {
    fontSize: isMobile ? "1.6rem" : "1.8rem",
    fontWeight: 700,
    color: "#1a2a6c",
    textShadow: "1px 1px 3px rgba(26, 42, 108, 0.3)",
    margin: 0,
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: isMobile ? "12px 14px" : "10px 12px",
    borderRadius: 8,
    border: "2px solid #1a2a6c",
    fontSize: isMobile ? "1rem" : "0.95rem",
    backgroundColor: "white",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    padding: isMobile ? "14px 16px" : "12px 14px",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    resize: "vertical",
    minHeight: isMobile ? "120px" : "100px",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
    color: "white",
    fontWeight: 700,
    border: "none",
    borderRadius: 10,
    padding: isMobile ? "14px 32px" : "12px 30px",
    fontSize: isMobile ? "1.1rem" : "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(56, 97, 255, 0.6)",
    transition: "all 0.3s ease",
    width: isMobile ? "100%" : "auto",
    minWidth: isMobile ? "none" : "140px",
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Tambah Berita
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Author", name: "author", type: "text" },
            { label: "Judul", name: "title", type: "text" },
            { label: "URL", name: "url", type: "text" },
            { label: "Tanggal & Waktu (ISO)", name: "iso_date", type: "datetime-local" },
            { label: "Gambar Kecil (URL)", name: "image_small", type: "text" },
            { label: "Gambar Besar (URL)", name: "image_large", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} style={{ marginBottom: isMobile ? 18 : 16 }}>
              <label
                htmlFor={name}
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: isMobile ? 8 : 6,
                  color: "#1a2a6c",
                  fontSize: isMobile ? "1rem" : "0.95rem",
                }}
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3861ff";
                  e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#1a2a6c";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: isMobile ? 18 : 16 }}>
            <label
              htmlFor="description"
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom: isMobile ? 8 : 6,
                color: "#1a2a6c",
                fontSize: isMobile ? "1rem" : "0.95rem",
              }}
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={isMobile ? 6 : 5}
              style={textareaStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3861ff";
                e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: isMobile ? 20 : 18 }}>
            <label
              htmlFor="categoryId"
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom: isMobile ? 8 : 6,
                color: "#1a2a6c",
                fontSize: isMobile ? "1rem" : "0.95rem",
              }}
            >
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={{
                ...inputStyle,
                cursor: "pointer",
                padding: isMobile ? "14px 16px" : "12px 14px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3861ff";
                e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            textAlign: "center", 
            marginTop: isMobile ? 32 : 28,
            paddingBottom: isMobile ? "20px" : "0"
          }}>
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #1a2a6c, #3861ff)";
                e.target.style.boxShadow = "0 8px 24px rgba(26, 42, 108, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #3861ff, #1a2a6c)";
                e.target.style.boxShadow = "0 6px 18px rgba(56, 97, 255, 0.6)";
              }}
            >
              Simpan Berita
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNews;