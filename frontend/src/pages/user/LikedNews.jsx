import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";

const LikedNews = () => {
  const [likedNews, setLikedNews] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="container mt-6 px-4" style={{
      maxWidth: "1180px",
      width: "calc(100vw - 250px)",
      marginLeft: "230px",
      boxSizing: "border-box",
    }}>
      <h2
      className="title is-3 has-text-centered mb-6"
      style={{
      color: "#1e40af",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.03em",
      lineHeight: 1.2,
  }}
>
  History Like
</h2>

      {loading ? (
        <p className="has-text-centered has-text-grey">Memuat berita...</p>
      ) : likedNews.length === 0 ? (
        <p className="has-text-centered has-text-grey-light">
          Kamu belum menyukai berita apapun.
        </p>
      ) : (
        <div className="columns is-multiline is-variable is-4">
          {likedNews.map((news) => (
            <div
              key={news.id}
              className="column is-half-tablet is-one-third-desktop"
            >
              <div
                className="card"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(30, 64, 175, 0.15)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {news.image_small && (
                  <figure className="image is-16by9">
                    <img
                      src={news.image_small}
                      alt={news.title}
                      style={{ objectFit: "cover", width: "100%" }}
                    />
                  </figure>
                )}
                <div
                  className="card-content"
                  style={{ flexGrow: 1, backgroundColor: "#ffffff" }}
                >
                  <p className="title is-5 has-text-weight-semibold"
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
                    className="subtitle is-6 is-italic mb-1"
                    style={{ color: "#111827", fontWeight: 600 }}
                  >
                    {news.category?.category || "Umum"}
                  </p>
                  <p className="is-size-7 has-text-grey mb-2">
                    {new Date(news.iso_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p
                    className="is-size-7 has-text-grey"
                    style={{
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {news.content
                      ?.substring(0, 120)
                      .replace(/<\/?[^>]+(>|$)/g, "")}
                    ...
                  </p>
                </div>
                <button
                  onClick={() => handleUnlike(news.id)}
                  style={{
                    backgroundColor: "#1e40af",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.6rem 1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderTop: "1px solid #1e3a8a",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e3a8a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e40af")
                  }
                >
                  💔 Hapus dari Favorit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedNews;
