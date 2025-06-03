import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import strictInstance from "../../utils/axiosInstance";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // PERBAIKAN: Hapus manual token check, langsung call function
    const fetchCategories = async () => {
      try {
        // PERBAIKAN: Langsung gunakan strictInstance tanpa manual token
        const res = await strictInstance.get(`/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // PERBAIKAN: Better error handling
        if (err.response?.status === 401) {
          // Token issue will be handled by interceptor
          console.log("Token expired, interceptor will handle refresh");
        } else {
          Swal.fire("Error", "Gagal mengambil data kategori", "error");
        }
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // PERBAIKAN: Validation sebelum submit
    if (!formData.title.trim()) {
      Swal.fire("Peringatan", "Judul berita tidak boleh kosong", "warning");
      return;
    }
    
    if (!formData.categoryId) {
      Swal.fire("Peringatan", "Silakan pilih kategori", "warning");
      return;
    }

    setLoading(true);
    try {
      // PERBAIKAN: Hapus manual token retrieval, langsung gunakan strictInstance
      await strictInstance.post(`/news`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire("Berhasil!", "Berita berhasil ditambahkan", "success");
      navigate("/dashboardAdmin");
    } catch (error) {
      console.error("Error adding news:", error);
      // PERBAIKAN: Better error handling
      if (error.response?.status === 401) {
        // Token issue will be handled by interceptor
        Swal.fire("Gagal", "Sesi telah berakhir, silakan login kembali", "error");
      } else if (error.response?.status === 400) {
        Swal.fire("Gagal", "Data tidak valid, periksa kembali input Anda", "error");
      } else {
        Swal.fire(
          "Gagal",
          error.response?.data?.message || "Terjadi kesalahan saat menambah berita",
          "error"
        );
      }
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
    maxWidth: "800px",
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

  const fieldStyle = {
    marginBottom: "1rem",
    '@media (min-width: 768px)': {
      marginBottom: "1.25rem",
    }
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#1a2a6c",
    fontSize: "0.9rem",
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      marginBottom: "0.75rem",
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "2px solid #1a2a6c",
    fontSize: "0.9rem",
    backgroundColor: loading ? "#f5f5f5" : "white",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
    '@media (min-width: 768px)': {
      fontSize: "0.95rem",
      padding: "12px 14px",
    }
  };

  const textareaStyle = {
    ...inputStyle,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    resize: "vertical",
    minHeight: "100px",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: loading ? "not-allowed" : "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
    paddingRight: "40px",
  };

  const submitButtonStyle = {
    background: loading ? "#6b7280" : "linear-gradient(135deg, #3861ff, #1a2a6c)",
    color: "white",
    fontWeight: 700,
    border: "none",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: "0.9rem",
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading ? "none" : "0 6px 18px rgba(56, 97, 255, 0.6)",
    transition: "all 0.3s ease",
    width: "100%",
    opacity: loading ? 0.7 : 1,
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      padding: "12px 30px",
      width: "auto",
    }
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
    '@media (min-width: 768px)': {
      marginTop: "2rem",
    }
  };

  const formFields = [
    { label: "Author", name: "author", type: "text", required: false },
    { label: "Judul *", name: "title", type: "text", required: true },
    { label: "URL", name: "url", type: "text", required: false },
    { label: "Tanggal & Waktu (ISO)", name: "iso_date", type: "datetime-local", required: false },
    { label: "Gambar Kecil (URL)", name: "image_small", type: "text", required: false },
    { label: "Gambar Besar (URL)", name: "image_large", type: "text", required: false },
  ];

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <button
            onClick={() => navigate("/dashboardAdmin")}
            style={backButtonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(56, 97, 255, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(56, 97, 255, 0.2)";
              }
            }}
          >
            ← Kembali
          </button>

          <h2 style={titleStyle}>Tambah Berita</h2>

          {/* Spacer for desktop layout */}
          <div style={{ width: "100px", display: window.innerWidth > 768 ? "block" : "none" }} />
        </div>

        <form onSubmit={handleSubmit}>
          {formFields.map(({ label, name, type, required }) => (
            <div key={name} style={fieldStyle}>
              <label htmlFor={name} style={labelStyle}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                disabled={loading}
                style={inputStyle}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = "#3861ff";
                    e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#1a2a6c";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}

          <div style={fieldStyle}>
            <label htmlFor="description" style={labelStyle}>
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              style={textareaStyle}
              placeholder="Masukkan deskripsi berita..."
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = "#3861ff";
                  e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="categoryId" style={labelStyle}>
              Kategori *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={loading}
              style={selectStyle}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = "#3861ff";
                  e.target.style.boxShadow = "0 0 6px rgba(56, 97, 255, 0.3)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a2a6c";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = "linear-gradient(135deg, #1a2a6c, #3861ff)";
                  e.target.style.boxShadow = "0 8px 24px rgba(26, 42, 108, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = "linear-gradient(135deg, #3861ff, #1a2a6c)";
                  e.target.style.boxShadow = "0 6px 18px rgba(56, 97, 255, 0.6)";
                }
              }}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNews;