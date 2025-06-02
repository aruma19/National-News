import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import jwtDecode from "jwt-decode";
import strictInstance from "../../utils/axiosInstance";

const Dashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

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
      fetchNews();
      fetchCategories();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/news");
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

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
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
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
        padding: isMobile ? "80px 1rem 2rem 1rem" : "2rem 1rem 2rem 250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        transition: "padding 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "900px",
          backgroundColor: "#fff",
          borderRadius: isMobile ? "8px" : "12px",
          padding: isMobile ? "1rem" : "1.5rem 3rem 1.5rem 2rem",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            color: "#1e40af",
            marginBottom: "1.5rem",
            fontSize: isMobile ? "1.5rem" : "1.75rem",
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          📰 Berita Terbaru
        </h2>

        {/* Filter Bar - Responsive */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1rem" : "1.5rem",
            marginBottom: "1.8rem",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <div style={{ flex: isMobile ? "1" : "2" }}>
            <input
              type="text"
              placeholder="🔍 Cari Berita berdasarkan judul, deskripsi, tanggal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "25px",
                border: "1.5px solid #a5b4fc",
                padding: isMobile ? "0.8rem 1.25rem" : "0.65rem 1.25rem",
                fontSize: isMobile ? "1rem" : "1rem",
                boxShadow: "0 3px 8px rgba(30, 64, 175, 0.1)",
                transition: "border-color 0.3s ease",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                boxSizing: "border-box",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1e40af")}
              onBlur={(e) => (e.target.style.borderColor = "#a5b4fc")}
            />
          </div>
          <div style={{ flex: isMobile ? "1" : "1" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "25px",
                padding: isMobile ? "0.8rem 1.25rem" : "0.65rem 1.25rem",
                fontSize: isMobile ? "1rem" : "1rem",
                border: "1.5px solid #a5b4fc",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "white",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#1e40af",
                fontWeight: "600",
                boxShadow: "0 3px 8px rgba(30, 64, 175, 0.1)",
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
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

        {/* Loading or Empty State */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <div
              style={{
                display: "inline-block",
                padding: "0.8rem 2rem",
                backgroundColor: "#1e40af",
                color: "white",
                borderRadius: "25px",
                fontWeight: "600",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              Memuat data berita...
            </div>
          </div>
        )}
        {!loading && filteredNews.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontStyle: "italic",
              fontSize: isMobile ? "1rem" : "1.1rem",
              marginTop: "3rem",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Tidak ditemukan berita yang sesuai dengan kriteria pencarian Anda.
          </p>
        )}

        {/* News Cards - Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : "repeat(3, 1fr)",
            gap: isMobile ? "1rem" : "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          {filteredNews.map((news) => (
            <a
              key={news.id}
              href={`/detail/${news.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
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
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 16px 32px rgba(30, 64, 175, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(30, 64, 175, 0.1)";
                }
              }}
            >
              {news.image_small && (
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={news.image_small}
                    alt={news.title}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: isMobile ? "180px" : "150px",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  />
                </div>
              )}
              <div style={{ flexGrow: 1, padding: isMobile ? "1.2rem" : "1rem" }}>
                <h3
                  style={{
                    color: "#1e40af",
                    fontSize: isMobile ? "1.1rem" : "1.15rem",
                    marginBottom: "0.8rem",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontWeight: "600",
                    lineHeight: "1.4",
                    margin: "0 0 0.8rem 0",
                  }}
                >
                  {news.title}
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: isMobile ? "0.85rem" : "0.9rem",
                    fontWeight: "600",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    marginBottom: "0.6rem",
                  }}
                >
                  {news.author || "Admin"} &nbsp;&bull;&nbsp;{" "}
                  {news.category?.category || "Umum"}
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    margin: 0,
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;