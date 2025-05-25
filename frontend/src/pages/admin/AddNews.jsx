import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const AddNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

    axios
      .get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Gagal ambil kategori:", err));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(`${BASE_URL}/news`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Berhasil!", "Berita berhasil ditambahkan", "success");
      navigate("/dashboardAdmin");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="title is-4 mb-4">Tambah Berita</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Author</label>
          <div className="control">
            <input className="input" type="text" name="author" value={formData.author} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">Judul</label>
          <div className="control">
            <input className="input" type="text" name="title" value={formData.title} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">URL</label>
          <div className="control">
            <input className="input" type="text" name="url" value={formData.url} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">Deskripsi</label>
          <div className="control">
            <textarea className="textarea" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="field">
          <label className="label">Tanggal & Waktu (ISO)</label>
          <div className="control">
            <input className="input" type="datetime-local" name="iso_date" value={formData.iso_date} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">Gambar Kecil (URL)</label>
          <div className="control">
            <input className="input" type="text" name="image_small" value={formData.image_small} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">Gambar Besar (URL)</label>
          <div className="control">
            <input className="input" type="text" name="image_large" value={formData.image_large} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label className="label">Kategori</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
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
          <button className="button is-primary" type="submit">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
