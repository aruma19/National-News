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
    <div
      className="container mt-5"
      style={{
        maxWidth: 600,
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      <h2 className="title is-3 mb-4" style={{ color: "#1a2a6c" }}>
        Edit Kategori
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label
            className="label"
            style={{ fontWeight: "600", color: "#1a2a6c" }}
          >
            Nama Kategori
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                borderRadius: 8,
                borderColor: "#1a2a6c",
                fontSize: "1rem",
                padding: "10px 12px",
              }}
            />
          </div>
        </div>

        <div className="field mt-5 is-flex is-justify-content-space-between">
          <button
            type="button"
            className="button is-light"
            onClick={() => navigate("/categorylist")}
            style={{ color: "#1a2a6c", fontWeight: 600 }}
          >
            Back
          </button>

          <button
            className="button"
            type="submit"
            style={{
              backgroundColor: "white",
              color: "#1a2a6c",
              border: "2px solid #1a2a6c",
              fontWeight: "600",
              padding: "10px 20px",
              borderRadius: 6,
            }}
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
