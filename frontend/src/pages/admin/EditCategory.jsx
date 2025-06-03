import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import strictInstance from "../../utils/axiosInstance";

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setFetchLoading(true);
      try {
        // PERBAIKAN: Langsung gunakan strictInstance tanpa manual token
        const response = await strictInstance.get(`/categories/${id}`);
        setCategory(response.data.category);
      } catch (err) {
        console.error("Error fetching category:", err);
        // PERBAIKAN: Better error handling
        if (err.response?.status === 404) {
          Swal.fire("Gagal", "Kategori tidak ditemukan", "error").then(() => {
            navigate("/categorylist");
          });
        } else if (err.response?.status === 401) {
          // Token issue will be handled by interceptor
          console.log("Token expired, interceptor will handle refresh");
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data kategori", "error");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category.trim()) {
      Swal.fire("Peringatan", "Nama kategori tidak boleh kosong", "warning");
      return;
    }

    setLoading(true);
    try {
      // PERBAIKAN: Langsung gunakan strictInstance tanpa manual token
      await strictInstance.put(`/categories/${id}`, { 
        category: category.trim() 
      });
      
      Swal.fire("Sukses", "Kategori berhasil diperbarui", "success").then(() =>
        navigate("/categorylist")
      );
    } catch (err) {
      console.error("Error updating category:", err);
      // PERBAIKAN: Better error handling
      if (err.response?.status === 400) {
        Swal.fire("Gagal", "Data kategori tidak valid", "error");
      } else if (err.response?.status === 401) {
        // Token issue will be handled by interceptor
        Swal.fire("Gagal", "Sesi telah berakhir, silakan login kembali", "error");
      } else if (err.response?.status === 404) {
        Swal.fire("Gagal", "Kategori tidak ditemukan", "error").then(() => {
          navigate("/categorylist");
        });
      } else if (err.response?.status === 409) {
        Swal.fire("Gagal", "Kategori dengan nama tersebut sudah ada", "error");
      } else {
        Swal.fire("Gagal", "Kategori gagal diperbarui", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: isMobile ? "calc(100vw - 40px)" : 600,
    width: isMobile ? "calc(100vw - 40px)" : "auto",
    marginLeft: isMobile ? "20px" : "auto",
    marginRight: isMobile ? "20px" : "auto",
    marginTop: isMobile ? "20px" : "2rem",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: isMobile ? 16 : 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const titleStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    fontWeight: 700,
    color: "#1a2a6c",
    marginBottom: isMobile ? 16 : 24,
    textAlign: isMobile ? "center" : "left",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#1a2a6c",
    display: "block",
    marginBottom: "8px",
    fontSize: isMobile ? "0.9rem" : "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: isMobile ? "12px" : "12px 14px",
    border: "2px solid #1a2a6c",
    borderRadius: 8,
    fontSize: isMobile ? "0.9rem" : "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    backgroundColor: loading ? "#f5f5f5" : "white",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: isMobile ? "center" : "space-between",
    alignItems: "center",
    marginTop: isMobile ? 20 : 24,
    gap: isMobile ? "12px" : "16px",
    flexDirection: isMobile ? "column" : "row",
  };

  const backButtonStyle = {
    backgroundColor: "#f8f9fa",
    color: "#1a2a6c",
    border: "2px solid #1a2a6c",
    fontWeight: 600,
    padding: isMobile ? "12px 24px" : "10px 20px",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: isMobile ? "0.9rem" : "1rem",
    width: isMobile ? "100%" : "auto",
    transition: "all 0.3s ease",
    opacity: loading ? 0.7 : 1,
  };

  const submitButtonStyle = {
    backgroundColor: loading ? "#6b7280" : "#1a2a6c",
    color: "white",
    border: `2px solid ${loading ? "#6b7280" : "#1a2a6c"}`,
    fontWeight: 600,
    padding: isMobile ? "12px 24px" : "10px 20px",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: isMobile ? "0.9rem" : "1rem",
    width: isMobile ? "100%" : "auto",
    transition: "all 0.3s ease",
    opacity: loading ? 0.7 : 1,
  };

  if (fetchLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.8rem 2rem",
              backgroundColor: "#1a2a6c",
              color: "white",
              borderRadius: "25px",
              fontWeight: "600",
              fontSize: "1rem",
            }}
          >
            Memuat data kategori...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Edit Kategori</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: isMobile ? 16 : 20 }}>
          <label style={labelStyle}>Nama Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
            placeholder="Masukkan nama kategori"
            onFocus={(e) => {
              if (!loading) {
                e.target.style.borderColor = "#3861ff";
                e.target.style.boxShadow = "0 0 0 3px rgba(56, 97, 255, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1a2a6c";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => navigate("/categorylist")}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#1a2a6c";
                e.target.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.color = "#1a2a6c";
              }
            }}
          >
            Kembali
          </button>

          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#3861ff";
                e.target.style.borderColor = "#3861ff";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#1a2a6c";
                e.target.style.borderColor = "#1a2a6c";
              }
            }}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;