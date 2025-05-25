import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/admin/login");

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategory(res.data.category);
      } catch (err) {
        Swal.fire("Gagal", "Kategori tidak ditemukan", "error");
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(
        `${BASE_URL}/categories/${id}`,
        { category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Sukses", "Kategori berhasil diperbarui", "success").then(() =>
        navigate("/categorylist")
      );
    } catch (err) {
      Swal.fire("Gagal", "Kategori gagal diperbarui", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="title is-3">Edit Kategori</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nama Kategori</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
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

export default EditCategory;
