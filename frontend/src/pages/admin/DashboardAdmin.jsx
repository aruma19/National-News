import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";

const DashboardAdmin = () => {
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
      console.log(jwtDecode(token));

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
    .sort((a, b) => new Date(b.iso_date) - new Date(a.iso_date)) // Terbaru ke atas
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

        // Update news list setelah berhasil hapus
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

   return (
    <div
      style={{
         minHeight: "100vh",
         maxWidth: "1180px",
        backgroundColor: "#f4f6fb",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100vw - 250px)",
        boxSizing: "border-box",
        maxWidth: "100%",
        marginLeft: "230px",
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
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.1)",
          boxSizing: "border-box",
          paddingRight: "4rem",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            color: "#1e40af",
            fontSize: "1.5rem",
            marginBottom: "1.9rem",
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          🛠️ Dashboard Admin Berita
        </h2>

        {/* Filter Bar */}
        <div className="columns is-vcentered mb-5">
          <div className="column is-8">
            <input
              className="input"
              type="text"
              placeholder="🔍 Cari berita berdasarkan judul, deskripsi, atau tanggal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "25px",
                border: "1.5px solid #a5b4fc",
                padding: "0.65rem 1.25rem",
                fontSize: "1rem",
                boxShadow: "0 3px 8px rgba(30, 64, 175, 0.1)",
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
                  padding: "0.65rem 1.25rem",
                  fontSize: "1rem",
                  border: "none",
                  outline: "none",
                  backgroundColor: "white",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  color: "#1e40af",
                  fontWeight: "600",
                  height: "50px",
                  lineHeight: "1.5",
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

        {/* Loading & Empty */}
        {loading && (
          <div className="has-text-centered mt-6">
            <button className="button is-loading is-info is-rounded">Memuat berita...</button>
          </div>
        )}
        {!loading && filteredNews.length === 0 && (
          <p className="has-text-centered has-text-grey mt-6 is-italic">
            Tidak ada berita yang cocok dengan pencarian atau kategori.
          </p>
        )}

        {/* News Cards */}
        <div className="columns is-multiline mt-4">
          {filteredNews.map((news) => (
            <div key={news.id} className="column is-12-mobile is-6-tablet is-4-desktop">
              <div
                className="card"
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 8px 16px rgba(30, 64, 175, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                <Link
                  to={`/detailAdmin/${news.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {news.image_small && (
                    <div className="card-image">
                      <figure className="image is-4by3">
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
                </Link>
                <div className="card-content" style={{ padding: "1rem" }}>
                  <p className="title is-6" style={{ color: "#1e40af", fontWeight: "600", textAlign: "justify" }}>
                    {news.title}
                  </p>
                  <p className="subtitle is-7" style={{ color: "#4b5563" }}>
                    {news.author || "Admin"} &nbsp;|&nbsp;{" "}
                    {news.category?.category || "Umum"}
                  </p>
                  <p className="is-size-7 has-text-grey">
                    {new Date(news.iso_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="buttons mt-3">
                    <Link
                      to={`/editnews/${news.id}`}
                      className="button is-warning is-light is-small"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      className="button is-danger is-light is-small"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(news.id);
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
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
