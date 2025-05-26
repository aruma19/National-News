import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";

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
    if (!token) return navigate("/admin/login");

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

  return (
  <div
    style={{
      maxWidth: "800px",
      width: "calc(100vw - 360px)",
      marginLeft: "400px",
      marginRight: "250px",
      marginTop: 40,
      padding: 20,
      background: "linear-gradient(145deg, #f0f4ff, #d9e2ff)",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(24, 43, 99, 0.2)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#0a1a3a",
      boxSizing: "border-box",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <button
        onClick={() => navigate("/dashboardAdmin")}
        style={{
          backgroundColor: "#ffffff",
          color: "#1a2a6c",
          fontWeight: 600,
          border: "2px solid #3861ff",
          padding: "8px 18px",
          borderRadius: 10,
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(56, 97, 255, 0.2)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        ← Kembali
      </button>

      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#1a2a6c",
          textShadow: "1px 1px 3px rgba(26, 42, 108, 0.3)",
          margin: 0,
        }}
      >
        Edit Berita
      </h2>

      <div style={{ width: 100 }} /> {/* Spacer untuk menyamakan layout */}
    </div>

    <form onSubmit={handleSubmit}>
      {[
        { label: "Judul", name: "title", type: "text" },
        { label: "Author", name: "author", type: "text" },
        { label: "URL", name: "url", type: "text" },
        { label: "Deskripsi", name: "description", type: "text" },
        { label: "Tanggal (ISO)", name: "iso_date", type: "date" },
        { label: "Gambar Kecil (URL)", name: "image_small", type: "text" },
        { label: "Gambar Besar (URL)", name: "image_large", type: "text" },
      ].map(({ label, name, type }) => (
        <div key={name} style={{ marginBottom: 14 }}>
          <label
            htmlFor={name}
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: 4,
              color: "#1a2a6c",
            }}
          >
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
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "2px solid #1a2a6c",
              fontSize: "0.95rem",
              backgroundColor: "white",
              outline: "none",
              transition: "0.3s",
            }}
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

      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="categoryId"
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: 4,
            color: "#1a2a6c",
          }}
        >
          Kategori
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={news.categoryId}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "2px solid #1a2a6c",
            fontSize: "0.95rem",
            backgroundColor: "white",
            cursor: "pointer",
            transition: "0.3s",
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

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
            color: "white",
            fontWeight: 700,
            border: "none",
            borderRadius: 10,
            padding: "12px 30px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(56, 97, 255, 0.6)",
            transition: "all 0.3s ease",
          }}
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
);
};

export default EditNews;
