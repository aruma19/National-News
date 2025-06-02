import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import strictInstance from "../../utils/axiosInstance";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    fetchNewsById(token);
    fetchCategories(token);
  }, [id]);

  const fetchNewsById = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(res.data);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    }
  };

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Gagal mengambil kategori", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(`${BASE_URL}/news/${id}`, news, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Sukses", "Berita berhasil diperbarui", "success").then(() =>
        navigate("/dashboardAdmin")
      );
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Gagal mengedit berita", "error");
    }
  };

  const containerStyle = {
    padding: "1rem",
    minHeight: "100vh",
    backgroundColor: "#f5f8fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '@media (min-width: 768px)': {
      padding: "2rem",
    }
  };

  const formContainerStyle = {
    width: "100%",
    maxWidth: "800px",
    padding: "1.5rem",
    background: "linear-gradient(145deg, #f0f4ff, #d9e2ff)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(24, 43, 99, 0.2)",
    color: "#0a1a3a",
    '@media (min-width: 768px)': {
      padding: "2rem",
    }
  };

  const headerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
    '@media (min-width: 768px)': {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0",
      marginBottom: "2rem",
    }
  };

  const backButtonStyle = {
    backgroundColor: "#ffffff",
    color: "#1a2a6c",
    fontWeight: 600,
    border: "2px solid #3861ff",
    padding: "8px 16px",
    borderRadius: 10,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(56, 97, 255, 0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    alignSelf: "flex-start",
    '@media (min-width: 768px)': {
      padding: "8px 18px",
      fontSize: "0.9rem",
    }
  };

  const titleStyle = {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#1a2a6c",
    textShadow: "1px 1px 3px rgba(26, 42, 108, 0.3)",
    margin: 0,
    textAlign: "center",
    '@media (min-width: 768px)': {
      fontSize: "1.6rem",
      textAlign: "left",
    }
  };

  const fieldStyle = {
    marginBottom: "1rem",
    '@media (min-width: 768px)': {
      marginBottom: "1.25rem",
    }
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#1a2a6c",
    fontSize: "0.9rem",
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      marginBottom: "0.75rem",
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "2px solid #1a2a6c",
    fontSize: "0.9rem",
    backgroundColor: "white",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
    '@media (min-width: 768px)': {
      fontSize: "0.95rem",
      padding: "12px 14px",
    }
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
    paddingRight: "40px",
  };

  const submitButtonStyle = {
    background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
    color: "white",
    fontWeight: 700,
    border: "none",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(56, 97, 255, 0.6)",
    transition: "all 0.3s ease",
    width: "100%",
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      padding: "12px 30px",
      width: "auto",
    }
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
    '@media (min-width: 768px)': {
      marginTop: "2rem",
    }
  };

  const formFields = [
    { label: "Judul", name: "title", type: "text" },
    { label: "Author", name: "author", type: "text" },
    { label: "URL", name: "url", type: "text" },
    { label: "Deskripsi", name: "description", type: "text" },
    { label: "Tanggal (ISO)", name: "iso_date", type: "date" },
    { label: "Gambar Kecil (URL)", name: "image_small", type: "text" },
    { label: "Gambar Besar (URL)", name: "image_large", type: "text" },
  ];

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <button
            onClick={() => navigate("/dashboardAdmin")}
            style={backButtonStyle}
          >
            ← Kembali
          </button>

          <h2 style={titleStyle}>Edit Berita</h2>

          {/* Spacer for desktop layout */}
          <div style={{ width: "100px", display: window.innerWidth > 768 ? "block" : "none" }} />
        </div>

        <form onSubmit={handleSubmit}>
          {formFields.map(({ label, name, type }) => (
            <div key={name} style={fieldStyle}>
              <label htmlFor={name} style={labelStyle}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={
                  name === "iso_date" && news[name]
                    ? news[name].substring(0, 10)
                    : news[name] || ""
                }
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

          <div style={fieldStyle}>
            <label htmlFor="categoryId" style={labelStyle}>
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={news.categoryId}
              onChange={handleChange}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3861ff";
                e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="submit"
              style={submitButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #1a2a6c, #3861ff)";
                e.target.style.boxShadow = "0 8px 24px rgba(26, 42, 108, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #3861ff, #1a2a6c)";
                e.target.style.boxShadow = "0 6px 18px rgba(56, 97, 255, 0.6)";
              }}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNews;