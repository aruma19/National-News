import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import strictInstance from "../../utils/axiosInstance";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await strictInstance.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await strictInstance.delete(`/categories/${id}`);
        Swal.fire("Dihapus!", "Kategori berhasil dihapus.", "success");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        Swal.fire("Gagal!", "Kategori gagal dihapus.", "error");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      await strictInstance.post("/categories", { category: newCategory });
      setNewCategory("");
      Swal.fire("Sukses", "Kategori berhasil ditambahkan", "success");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      Swal.fire("Error", "Gagal menambahkan kategori", "error");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: "1rem",
    minHeight: "100vh",
    backgroundColor: "#f5f8fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '@media (min-width: 768px)': {
      padding: "2rem",
    }
  };

  const formContainerStyle = {
    width: "100%",
    maxWidth: "900px",
    padding: "1.5rem",
    background: "linear-gradient(145deg, #f0f4ff, #d9e2ff)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(24, 43, 99, 0.2)",
    color: "#0a1a3a",
    '@media (min-width: 768px)': {
      padding: "2rem",
    }
  };

  const headerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
    '@media (min-width: 768px)': {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0",
      marginBottom: "2rem",
    }
  };

  const backButtonStyle = {
    backgroundColor: "#ffffff",
    color: "#1a2a6c",
    fontWeight: 600,
    border: "2px solid #3861ff",
    padding: "8px 16px",
    borderRadius: 10,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(56, 97, 255, 0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    alignSelf: "flex-start",
    '@media (min-width: 768px)': {
      padding: "8px 18px",
      fontSize: "0.9rem",
    }
  };

  const titleStyle = {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#1a2a6c",
    textShadow: "1px 1px 3px rgba(26, 42, 108, 0.3)",
    margin: 0,
    textAlign: "center",
    '@media (min-width: 768px)': {
      fontSize: "1.6rem",
      textAlign: "left",
    }
  };

  const addFormStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: 12,
    marginBottom: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    '@media (min-width: 768px)': {
      padding: "1.25rem",
      marginBottom: "2rem",
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #1a2a6c",
    borderRadius: 8,
    fontSize: "0.9rem",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
    '@media (min-width: 768px)': {
      fontSize: "0.95rem",
      padding: "12px 14px",
    }
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #3861ff, #1a2a6c)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      padding: "12px 24px",
    }
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    '@media (min-width: 768px)': {
      fontSize: "0.95rem",
    }
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e0e6ed",
    marginBottom: "0.75rem",
    '@media (min-width: 768px)': {
      padding: "1.25rem",
      marginBottom: "1rem",
    }
  };

  // Mobile Layout (Cards)
  const renderMobileLayout = () => (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <button
            onClick={() => navigate("/dashboardAdmin")}
            style={backButtonStyle}
          >
            ← Kembali
          </button>

          <h2 style={titleStyle}>Daftar Kategori</h2>

          <div style={{ width: "100px", display: window.innerWidth > 768 ? "block" : "none" }} />
        </div>
        
        {/* Form Tambah Kategori */}
        <div style={addFormStyle}>
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
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3861ff";
                e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Menyimpan..." : "Tambah Kategori"}
            </button>
          </form>
        </div>

        {/* Card Layout untuk Categories */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {categories.map((cat, index) => (
            <div key={cat.id} style={cardStyle}>
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
    </div>
  );

  // Desktop Layout (Table)
  const renderDesktopLayout = () => (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <button
            onClick={() => navigate("/dashboardAdmin")}
            style={backButtonStyle}
          >
            ← Kembali
          </button>

          <h2 style={titleStyle}>Daftar Kategori</h2>

          <div style={{ width: "100px" }} />
        </div>

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
    </div>
  );

  // Check screen size and render appropriate layout
  return window.innerWidth <= 768 ? renderMobileLayout() : renderDesktopLayout();
};

export default CategoryList;