import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import jwtDecode from "jwt-decode";

const Dashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return;
      }

      const logoutTimer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }, timeLeft * 1000);

      fetchNews(token);
      fetchCategories(token);

      return () => clearTimeout(logoutTimer);
    } catch (err) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  }, []);

  const fetchNews = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/news`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsList(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Berita",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data berita. Silakan coba lagi.",
      });
    }
    setLoading(false);
  };

  fetchNewsDetail();
  const fetchNewsDetail = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(res.data);
      setLikeCount(res.data.likeCount || 0); // default ke 0 jika null
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Gagal mengambil kategori berita", error);
    }
  };

  const filteredNews = newsList.filter((news) => {
    const searchLower = searchTerm.toLowerCase();

    const formattedDate = new Date(news.iso_date)
      .toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .toLowerCase();

    const matchesSearch =
      news.title?.toLowerCase().includes(searchLower) ||
      news.author?.toLowerCase().includes(searchLower) ||
      news.category?.category?.toLowerCase().includes(searchLower) ||
      news.description?.toLowerCase().includes(searchLower) ||
      formattedDate.includes(searchLower);

    const matchesCategory =
      selectedCategory === "All" || news.category?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      style={{
        minHeight: "400vh",
        backgroundColor: "#f4f6fb", // Warna latar yang lembut modern
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        maxWidth: "100%",
        marginLeft: "100px",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1.5rem 3rem 1.5rem 2rem",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.1)", // Shadow biru lembut untuk kesan modern
          boxSizing: "border-box",
          paddingRight: "4rem",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            color: "#1e40af", // Biru tua, serasi dengan navbar modern
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          📰 Berita Terbaru
        </h2>

        {/* Filter Bar */}
        <div
          className="columns is-variable is-4 is-vcentered mb-6"
          style={{ marginBottom: "1.8rem" }}
        >
          <div className="column is-8">
            <input
              className="input"
              type="text"
              placeholder="🔍 Cari Berita berdasarkan judul, deskripsi, tanggal "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "25px",
                border: "1.5px solid #a5b4fc", // warna biru muda untuk border
                padding: "0.65rem 1.25rem",
                fontSize: "1rem",
                boxShadow: "0 3px 8px rgba(30, 64, 175, 0.1)",
                transition: "border-color 0.3s ease",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1e40af")}
              onBlur={(e) => (e.target.style.borderColor = "#a5b4fc")}
            />
          </div>
          <div className="column is-4">
            <div
              className="select is-fullwidth"
              style={{
                borderRadius: "25px",
                overflow: "visibke",
                boxShadow: "0 4px 12px rgba(30, 64, 175, 0.15)",
                height: "50px",
                backgroundColor: "#e0e7ff",
                padding: "0 0.5rem",
              }}
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  borderRadius: "25px",
                  padding: "0.65rem 1.65rem",
                  fontSize: "1rem",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  backgroundColor: "white",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  color: "#1e40af",
                  fontWeight: "600",
                  height: "50px",         // sesuaikan tinggi select agar teks terlihat penuh
                  lineHeight: "1.5",      // untuk memastikan teks tidak terpotong vertikal
                  whiteSpace: "normal",
                  width: "100%",
                  appearance: "none",
                }}
              >
                <option value="All">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading or Empty State */}
        {loading && (
          <div className="has-text-centered mt-6">
            <button
              className="button is-loading is-info"
              style={{
                borderRadius: "25px",
                padding: "0.6rem 2.5rem",
                fontWeight: "700",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Memuat data berita...
            </button>
          </div>
        )}
        {!loading && filteredNews.length === 0 && (
          <p
            className="has-text-centered has-text-grey-light is-italic"
            style={{
              fontSize: "1.1rem",
              marginTop: "3.5rem",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Tidak ditemukan berita yang sesuai dengan kriteria pencarian Anda.
          </p>
        )}

        {/* News Cards */}
        <div className="columns is-multiline" style={{ marginTop: "1.25rem" }}>
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="column is-12-mobile is-6-tablet is-4-desktop"
              style={{ marginBottom: "1.25rem" }}
            >
              <a
                href={`/detail/${news.id}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 8px 16px rgba(30, 64, 175, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 32px rgba(30, 64, 175, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(30, 64, 175, 0.1)";
                }}
              >
                {news.image_small && (
                  <div className="card-image" style={{ flexShrink: 0 }}>
                    <figure className="image is-4by3" style={{ marginBottom: 0 }}>
                      <img
                        src={news.image_small}
                        alt={news.title}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "150px",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      />
                    </figure>
                  </div>
                )}
                <div className="card-content" style={{ flexGrow: 1, padding: "1rem" }}>
                  <p
                    className="title is-5 has-text-weight-semibold"
                    style={{
                      color: "#1e40af",
                      fontSize: "1.15rem",
                      marginBottom: "0.8rem",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      textAlign: "justify",
                    }}
                  >
                    {news.title}
                  </p>
                  <p
                    className="subtitle is-6"
                    style={{
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {news.author || "Admin"} &nbsp;&bull;&nbsp;{" "}
                    {news.category?.category || "Umum"}
                  </p>
                  <p
                    className="is-size-7"
                    style={{
                      color: "#6b7280",
                      marginTop: "0.6rem",
                      fontSize: "0.85rem",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {new Date(news.iso_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
