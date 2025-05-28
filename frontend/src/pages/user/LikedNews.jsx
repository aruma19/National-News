import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";

const LikedNews = () => {
  const [likedNews, setLikedNews] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return;
      }

      fetchLikedNews(token, decoded.id);
    } catch (error) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  }, []);

  const fetchLikedNews = async (token, id) => {
    try {
      const response = await axios.get(`${BASE_URL}/news/liked/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikedNews(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil berita yang disukai",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (newsId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.delete(`${BASE_URL}/news/liked/${newsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLikedNews((prev) => prev.filter((news) => news.id !== newsId));

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berita berhasil dihapus dari daftar yang kamu sukai.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus like",
      });
    }
  };

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
          maxWidth: isMobile ? "100%" : "1180px",
          backgroundColor: "#fff",
          borderRadius: isMobile ? "8px" : "12px",
          padding: isMobile ? "1.5rem 1rem" : "2rem",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: "#1e40af",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? "1.5rem" : "2rem",
            textAlign: "center",
            marginBottom: "2rem",
            letterSpacing: "0.03em",
            lineHeight: 1.2,
          }}
        >
          💖 History Like
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <div
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                backgroundColor: "#1e40af",
                color: "white",
                borderRadius: "25px",
                fontWeight: "600",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              Memuat berita favorit...
            </div>
          </div>
        ) : likedNews.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💔</div>
            <p
              style={{
                color: "#6b7280",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontStyle: "italic",
              }}
            >
              Kamu belum menyukai berita apapun.{" "}
              <br />
              <span style={{ fontSize: "0.9rem" }}>
                Mulai eksplorasi dan temukan berita menarik!
              </span>
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                textAlign: "center",
                color: "#4b5563",
                marginBottom: "2rem",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {likedNews.length} berita yang kamu sukai
            </p>
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile 
                  ? "1fr" 
                  : window.innerWidth <= 1024 
                    ? "repeat(auto-fit, minmax(300px, 1fr))"
                    : "repeat(auto-fit, minmax(350px, 1fr))",
                gap: isMobile ? "1.5rem" : "2rem",
                marginTop: "1rem",
              }}
            >
              {likedNews.map((news) => (
                <div
                  key={news.id}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(30, 64, 175, 0.12)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(30, 64, 175, 0.18)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(30, 64, 175, 0.12)";
                    }
                  }}
                >
                  {news.image_small && (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={news.image_small}
                        alt={news.title}
                        style={{
                          width: "100%",
                          height: isMobile ? "200px" : "180px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "rgba(239, 68, 68, 0.9)",
                          color: "white",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "15px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ❤️ Liked
                      </div>
                    </div>
                  )}
                  
                  <div
                    style={{
                      padding: isMobile ? "1.25rem" : "1.5rem",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3
                      style={{
                        color: "#1e40af",
                        fontSize: isMobile ? "1.1rem" : "1.2rem",
                        fontWeight: "700",
                        marginBottom: "1rem",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {news.title}
                    </h3>
                    
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.8rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#e0e7ff",
                          color: "#1e40af",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {news.category?.category || "Umum"}
                      </span>
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "0.8rem",
                          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                      >
                        {new Date(news.iso_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                        lineHeight: "1.5",
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: "1.5rem",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {news.content
                        ?.substring(0, 150)
                        .replace(/<\/?[^>]+(>|$)/g, "")}
                      ...
                    </p>
                    
                    <div
                      style={{
                        display: "flex",
                        gap: "0.8rem",
                        marginTop: "auto",
                      }}
                    >
                      <button
                        onClick={() => window.open(`/detail/${news.id}`, '_blank')}
                        style={{
                          flex: 1,
                          backgroundColor: "#1e40af",
                          color: "#ffffff",
                          border: "none",
                          padding: isMobile ? "0.8rem 1rem" : "0.7rem 1rem",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: isMobile ? "0.9rem" : "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1e3a8a";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#1e40af";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        📖 Baca
                      </button>
                      
                      <button
                        onClick={() => handleUnlike(news.id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          border: "none",
                          padding: isMobile ? "0.8rem 1rem" : "0.7rem 1rem",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: isMobile ? "0.9rem" : "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ef4444";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        💔 Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LikedNews;