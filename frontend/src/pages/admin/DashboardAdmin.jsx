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
    <div className="container mt-5">
      <h2 className="title is-3 has-text-centered mb-6">Dashboard Admin Berita</h2>

      {/* Filter Bar */}
      <div className="columns is-vcentered mb-5">
        <div className="column is-8">
          <input
            className="input"
            type="text"
            placeholder="Cari berita berdasarkan judul, deskripsi, tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="column is-4">
          <div className="select is-fullwidth">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

      {loading && <p>Loading berita...</p>}
      {!loading && filteredNews.length === 0 && (
        <p className="has-text-centered mt-5">Berita tidak ditemukan.</p>
      )}

      <div className="columns is-multiline">
        {filteredNews.map((news) => (
          <div key={news.id} className="column is-one-third">
            <Link
              to={`/detailAdmin/${news.id}`}
              className="card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {news.image_small && (
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={news.image_small} alt={news.title} />
                  </figure>
                </div>
              )}
              <div className="card-content">
                <p className="title is-5 has-text-weight-bold">{news.title}</p>
                <p className="subtitle is-6 has-text-grey">
                  {news.author || "Admin"} | {news.category?.category || "Umum"}
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
                  <Link to={`/editnews/${news.id}`} className="button is-warning is-small">
                    Edit
                  </Link>
                  <button
                    className="button is-danger is-small"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(news.id);
                    }}
                  >
                    Hapus
                  </button>
                </div>

              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
