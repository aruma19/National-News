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

      fetchLikedNews(token);
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

  // Fungsi untuk unlike berita
  const handleUnlike = async (newsId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      // Panggil API untuk unlike berita
      await axios.delete(`${BASE_URL}/news/liked/${newsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state: hapus berita yang sudah di unlike dari list
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
    <div className="container mt-6">
      <h2 className="title is-3 has-text-centered mb-6">Berita yang Kamu Suka ❤️</h2>

      {loading ? (
        <p className="has-text-centered">Memuat berita...</p>
      ) : likedNews.length === 0 ? (
        <p className="has-text-centered has-text-grey">
          Kamu belum menyukai berita apapun.
        </p>
      ) : (
        <div className="columns is-multiline is-variable is-4">
          {likedNews.map((news) => (
            <div
              key={news.id}
              className="column is-half-tablet is-one-third-desktop"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className="card"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {news.image_small && (
                  <figure className="image is-16by9">
                    <img
                      src={news.image_small}
                      alt={news.title}
                      style={{ objectFit: "cover", height: "200px", width: "100%" }}
                    />
                  </figure>
                )}
                <div className="card-content" style={{ flexGrow: 1 }}>
                  <p
                    className="title is-5 has-text-weight-semibold mb-2"
                    style={{ lineHeight: 1.2 }}
                  >
                    {news.title}
                  </p>
                  <p
                    className="subtitle is-6 has-text-primary is-italic"
                    style={{ marginBottom: "0.3rem" }}
                  >
                    {news.category?.category || "Umum"}
                  </p>
                  <p className="is-size-7 has-text-grey mb-3">
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
                    {news.content?.substring(0, 120).replace(/<\/?[^>]+(>|$)/g, "")}...
                  </p>
                </div>

                {/* Tombol Unlike di pojok kanan bawah */}
                <button
                  onClick={() => handleUnlike(news.id)}
                  style={{
                    backgroundColor: "#d6336c",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: 0,
                    borderTop: "1px solid #b02a56",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b02a56")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d6336c")}
                  type="button"
                >
                  ❤️ Unlike
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
