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
    <div className="container mt-5">
      <h2 className="title is-3">Edit Berita</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Judul", name: "title" },
          { label: "Author", name: "author" },
          { label: "URL", name: "url" },
          { label: "Deskripsi", name: "description" },
          { label: "Tanggal (ISO)", name: "iso_date" },
          { label: "Gambar Kecil (URL)", name: "image_small" },
          { label: "Gambar Besar (URL)", name: "image_large" },
        ].map(({ label, name }) => (
          <div className="field" key={name}>
            <label className="label">{label}</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name={name}
                value={news[name]}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}

        <div className="field">
          <label className="label">Kategori</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select name="categoryId" value={news.categoryId} onChange={handleChange}>
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field mt-4">
          <div className="control">
            <button className="button is-primary" type="submit">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditNews;
