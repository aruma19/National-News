import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../utils";

const LandingPage = () => {
  const navigate = useNavigate();
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
    fetchPublicNews();
    fetchPublicCategories();
  }, []);

  const fetchPublicNews = async () => {
    setLoading(true);
    try {
      // Coba beberapa endpoint yang mungkin tersedia
      let response;
      
      try {
        // Coba endpoint publik tanpa token
        response = await axios.get(`${BASE_URL}/news/public`);
      } catch (error) {
        // Jika gagal, coba endpoint biasa tanpa authorization
        try {
          response = await axios.get(`${BASE_URL}/news`);
        } catch (error2) {
          // Jika masih gagal, coba dengan axios config default
          response = await axios.get(`${BASE_URL}/news`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
        }
      }
      
      console.log('Response data:', response.data); // Debug log
      
      // Handle jika response.data adalah array langsung atau wrapped dalam object
      const newsData = Array.isArray(response.data) ? response.data : 
                      (response.data.data ? response.data.data : 
                       response.data.news ? response.data.news : []);
      
      setNewsList(newsData);
      
      if (newsData.length === 0) {
        console.warn('No news data received from API');
      }
      
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Tampilkan error yang lebih spesifik
      const errorMessage = error.response?.data?.message || 
                          error.response?.statusText || 
                          error.message || 
                          "Terjadi kesalahan saat mengambil data berita.";
      
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Berita",
        text: errorMessage,
        footer: error.response?.status ? `Status: ${error.response.status}` : ''
      });
    }
    setLoading(false);
  };

  const fetchPublicCategories = async () => {
    try {
      let response;
      
      try {
        // Coba endpoint publik untuk kategori
        response = await axios.get(`${BASE_URL}/categories/public`);
      } catch (error) {
        try {
          response = await axios.get(`${BASE_URL}/categories`);
        } catch (error2) {
          response = await axios.get(`${BASE_URL}/categories`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
        }
      }
      
      console.log('Categories response:', response.data); // Debug log
      
      // Handle struktur data yang berbeda
      const categoriesData = Array.isArray(response.data) ? response.data : 
                            (response.data.data ? response.data.data : 
                             response.data.categories ? response.data.categories : []);
      
      setCategories(categoriesData);
      
    } catch (error) {
      console.error("Gagal mengambil kategori berita", error);
      // Tidak perlu alert untuk kategori, biarkan kosong saja
    }
  };

  const filteredNews = newsList.filter((news) => {
    const searchLower = searchTerm.toLowerCase();

    // Pastikan news object memiliki properti yang diperlukan
    if (!news) return false;

    let formattedDate = '';
    try {
      if (news.iso_date || news.created_at || news.date) {
        const dateToFormat = news.iso_date || news.created_at || news.date;
        formattedDate = new Date(dateToFormat)
          .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .toLowerCase();
      }
    } catch (dateError) {
      console.warn('Error formatting date for news:', news.id, dateError);
    }

    const matchesSearch =
      (news.title && news.title.toLowerCase().includes(searchLower)) ||
      (news.author && news.author.toLowerCase().includes(searchLower)) ||
      (news.category?.category && news.category.category.toLowerCase().includes(searchLower)) ||
      (news.description && news.description.toLowerCase().includes(searchLower)) ||
      (news.content && news.content.toLowerCase().includes(searchLower)) ||
      formattedDate.includes(searchLower);

    const matchesCategory =
      selectedCategory === "All" || 
      (news.category?.category === selectedCategory) ||
      (news.category_name === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleNewsClick = (newsId) => {
    navigate(`/detail-landing/${newsId}`);  
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
        padding: isMobile ? "1rem" : "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header dengan tombol login */}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: isMobile ? "1rem" : "0",
        }}
      >
        <h1
          style={{
            fontWeight: "700",
            color: "#1e40af",
            margin: 0,
            fontSize: isMobile ? "1.8rem" : "2.2rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Portal Berita
        </h1>
        <button
          onClick={handleLoginClick}
          style={{
            backgroundColor: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: isMobile ? "0.7rem 1.5rem" : "0.8rem 2rem",
            fontSize: isMobile ? "0.9rem" : "1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)",
            transition: "all 0.3s ease",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1d4ed8";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#1e40af";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Login
        </button>
      </div>

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

        {/* Debug info - hapus setelah berhasil */}
        {!loading && (
          <div style={{ 
            fontSize: "0.8rem", 
            color: "#666", 
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            Total berita: {newsList.length} | Berita yang ditampilkan: {filteredNews.length}
          </div>
        )}

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
                <option key={cat.id} value={cat.category || cat.name}>
                  {cat.category || cat.name}
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
        
        {!loading && newsList.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <p
              style={{
                color: "#ef4444",
                fontWeight: "600",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                marginBottom: "1rem",
              }}
            >
              Tidak dapat memuat data berita dari server.
            </p>
            <button
              onClick={() => {
                fetchPublicNews();
                fetchPublicCategories();
              }}
              style={{
                backgroundColor: "#1e40af",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "0.6rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}
        
        {!loading && newsList.length > 0 && filteredNews.length === 0 && (
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
            <div
              key={news.id}
              onClick={() => handleNewsClick(news.id)}
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
              {(news.image_small || news.image || news.thumbnail) && (
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={news.image_small || news.image || news.thumbnail}
                    alt={news.title}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: isMobile ? "180px" : "150px",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
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
                  {news.title || "Judul tidak tersedia"}
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
                  {news.category?.category || news.category_name || "Umum"}
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    margin: 0,
                  }}
                >
                  {(() => {
                    try {
                      const dateToFormat = news.iso_date || news.created_at || news.date;
                      return dateToFormat ? new Date(dateToFormat).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "Tanggal tidak tersedia";
                    } catch {
                      return "Tanggal tidak tersedia";
                    }
                  })()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;