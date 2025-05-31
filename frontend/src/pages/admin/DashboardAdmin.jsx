import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";

const DashboardAdmin = ({ sidebarOpen, toggleSidebar }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      const logoutTimer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }, timeLeft * 1000);

      fetchNews(token);
      fetchCategories(token);
      console.log(jwtDecode(token));

      return () => clearTimeout(logoutTimer);
    } catch (err) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  }, []);

  const fetchNews = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/news`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewsList(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil data berita",
        text: error.response?.data?.message || "Terjadi kesalahan saat mengambil data.",
      });
    }
    setLoading(false);
  };

  const fetchCategories = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Gagal mengambil kategori", error);
    }
  };

  const filteredNews = newsList
    .sort((a, b) => new Date(b.iso_date) - new Date(a.iso_date))
    .filter((news) => {
      const searchLower = searchTerm.toLowerCase();

      const formattedDate = new Date(news.iso_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).toLowerCase();

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");

    const confirmed = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNewsList(newsList.filter((item) => item.id !== id));
        Swal.fire("Berhasil!", "Berita telah dihapus.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal menghapus",
          text: error.response?.data?.message || "Terjadi kesalahan saat menghapus.",
        });
      }
    }
  };

  const getMainContentStyle = () => {
    const baseStyle = {
      minHeight: "100vh",
      backgroundColor: "#f4f6fb",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box",
      transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
    };

    if (window.innerWidth <= 768) {
      // Mobile: full width
      return {
        ...baseStyle,
        width: "100%",
        marginLeft: 0,
        padding: "1rem 0.5rem",
      };
    } else {
      // Desktop: adjust based on sidebar
      return {
        ...baseStyle,
        width: sidebarOpen ? "calc(100vw - 280px)" : "100vw",
        marginLeft: sidebarOpen ? "280px" : "0",
        padding: "1.5rem 1rem",
      };
    }
  };

  return (
    <div style={getMainContentStyle()}>
      {/* Header dengan tombol hamburger */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          padding: "0 1rem",
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
            border: "none",
            color: "#f9f9f9",
            padding: "0.75rem",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(75, 108, 183, 0.3)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <h2
          style={{
            fontWeight: "700",
            color: "#1e40af",
            fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.5rem",
            margin: 0,
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          🛠️ Dashboard Admin
        </h2>
        
        <div style={{ width: "48px" }}></div> {/* Spacer untuk center title */}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: window.innerWidth <= 768 ? "1rem" : "1.5rem 2rem",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.1)",
          boxSizing: "border-box",
        }}
      >
        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ flex: window.innerWidth <= 768 ? "none" : "2" }}>
            <input
              type="text"
              placeholder="🔍 Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "25px",
                border: "1.5px solid #a5b4fc",
                padding: "0.65rem 1.25rem",
                fontSize: "1rem",
                boxShadow: "0 3px 8px rgba(30, 64, 175, 0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1e40af")}
              onBlur={(e) => (e.target.style.borderColor = "#a5b4fc")}
            />
          </div>
          
          <div style={{ flex: window.innerWidth <= 768 ? "none" : "1" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "25px",
                border: "1.5px solid #a5b4fc",
                padding: "0.65rem 1.25rem",
                fontSize: "1rem",
                backgroundColor: "white",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#1e40af",
                fontWeight: "600",
                boxSizing: "border-box",
                cursor: "pointer",
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

        {/* Loading & Empty */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p>Memuat berita...</p>
          </div>
        )}
        
        {!loading && filteredNews.length === 0 && (
          <p style={{ textAlign: "center", color: "#6b7280", marginTop: "2rem", fontStyle: "italic" }}>
            Tidak ada berita yang cocok dengan pencarian atau kategori.
          </p>
        )}

        {/* News Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 768 
              ? "1fr" 
              : window.innerWidth <= 1024 
              ? "repeat(2, 1fr)" 
              : "repeat(3, 1fr)",
            gap: "1.5rem",
            marginTop: "1rem",
          }}
        >
          {filteredNews.map((news) => (
            <div
              key={news.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(30, 64, 175, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(30, 64, 175, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(30, 64, 175, 0.1)";
              }}
            >
              <Link
                to={`/detailAdmin/${news.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {news.image_small && (
                  <div style={{ width: "100%", height: "150px", overflow: "hidden" }}>
                    <img
                      src={news.image_small}
                      alt={news.title}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                )}
              </Link>
              
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    color: "#1e40af",
                    fontWeight: "600",
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    lineHeight: "1.4",
                    textAlign: "justify",
                  }}
                >
                  {news.title}
                </h3>
                
                <p style={{ color: "#4b5563", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                  {news.author || "Admin"} | {news.category?.category || "Umum"}
                </p>
                
                <p style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "1rem" }}>
                  {new Date(news.iso_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "auto",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to={`/editnews/${news.id}`}
                    style={{
                      backgroundColor: "#fbbf24",
                      color: "#fff",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    ✏️ Edit
                  </Link>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(news.id);
                    }}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;