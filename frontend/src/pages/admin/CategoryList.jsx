import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const containerStyle = {
    maxWidth: "900px",
    width: isMobile ? "calc(100vw - 40px)" : "calc(100vw - 260px)",
    marginLeft: isMobile ? "20px" : "350px",
    marginRight: isMobile ? "20px" : "auto",
    marginTop: "30px",
    padding: isMobile ? 15 : 20,
    background: "linear-gradient(145deg, #f0f4ff, #d9e2ff)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(24, 43, 99, 0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#0a1a3a",
  };

  const titleStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    fontWeight: 700,
    color: "#1a2a6c",
    textAlign: "center",
    marginBottom: 24,
    textShadow: "1px 1px 3px rgba(26, 42, 108, 0.2)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: isMobile ? "0.85rem" : "0.95rem",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  };

  // Render untuk Mobile (Card Layout)
  if (isMobile) {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>Daftar Kategori</h2>
        
        {/* Form Tambah Kategori */}
        <div style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <form onSubmit={handleAddCategory} style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Tambah kategori baru"
              required
              style={{
                padding: "12px",
                border: "2px solid #1a2a6c",
                borderRadius: 8,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Menyimpan..." : "Tambah Kategori"}
            </button>
          </form>
        </div>

        {/* Card Layout untuk Categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid #e0e6ed"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
              }}>
                <span style={{ fontWeight: "600", color: "#1a2a6c" }}>
                  #{index + 1}
                </span>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#0a1a3a"
                }}>
                  {cat.category}
                </h3>
              </div>
              
              <div style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap"
              }}>
                <button
                  style={{
                    backgroundColor: "#3861ff",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    flex: "1",
                    minWidth: "70px"
                  }}
                  onClick={() => navigate(`/editcategory/${cat.id}`)}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: "#e63946",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    flex: "1",
                    minWidth: "70px"
                  }}
                  onClick={() => handleDelete(cat.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render untuk Desktop (Table Layout)
  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Daftar Kategori</h2>

      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: "#1a2a6c"}}>
            <th style={{ padding: 12, textAlign: "left", color: "white" }}>No</th>
            <th style={{ padding: 12, textAlign: "left", color: "white" }}>Nama Kategori</th>
            <th style={{ padding: 12, textAlign: "left", color: "white" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr
              key={cat.id}
              style={{
                borderBottom: "1px solid #ddd",
                backgroundColor: index % 2 === 0 ? "#f9fafe" : "white",
              }}
            >
              <td style={{ padding: 12 }}>{index + 1}</td>
              <td style={{ padding: 12 }}>{cat.category}</td>
              <td style={{ padding: 12 }}>
                <button
                  style={{
                    backgroundColor: "#3861ff",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    marginRight: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate(`/editcategory/${cat.id}`)}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: "#e63946",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => handleDelete(cat.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {/* Form tambah kategori */}
          <tr>
            <td colSpan={3} style={{ padding: 12 }}>
              <form
                onSubmit={handleAddCategory}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Tambah kategori baru"
                  required
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "2px solid #1a2a6c",
                    borderRadius: 8,
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Menyimpan..." : "Tambah"}
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