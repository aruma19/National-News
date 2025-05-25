import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    const confirm = await Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Dihapus!", "Kategori berhasil dihapus.", "success");
        fetchCategories();
      } catch (err) {
        Swal.fire("Gagal!", "Kategori gagal dihapus.", "error");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/categories`,
        { category: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory("");
      Swal.fire("Sukses", "Kategori berhasil ditambahkan", "success");
      fetchCategories();
    } catch (err) {
      Swal.fire("Error", "Gagal menambahkan kategori", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="title is-3">Daftar Kategori</h2>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.id}>
              <td>{index + 1}</td>
              <td>{cat.category}</td>
              <td>
                <button
                  className="button is-small is-info mr-2"
                  onClick={() => navigate(`/editcategory/${cat.id}`)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {/* Baris Form Tambah Kategori */}
          <tr>
            <td colSpan={3}>
              <form onSubmit={handleAddCategory} className="is-flex">
                <input
                  className="input mr-2"
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Tambah kategori baru"
                  required
                />
                <button
                  className={`button is-success ${loading ? "is-loading" : ""}`}
                  type="submit"
                >
                  Tambah
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
