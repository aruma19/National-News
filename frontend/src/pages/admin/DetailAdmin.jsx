import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const styles = {
  container: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f5f8fc",
    padding: "1rem",
    minHeight: "100vh",
    color: "#0a1f44",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    // Responsive padding
    "@media (min-width: 768px)": {
      padding: "2rem",
    },
  },
  box: {
    background: "linear-gradient(to bottom right, #ffffff, #f7fbff)",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 8px 20px rgba(13, 30, 74, 0.08)",
    width: "100%",
    maxWidth: "800px", // Membatasi lebar maksimal
    margin: "0 auto",
    // Responsive styling
    "@media (min-width: 768px)": {
      borderRadius: "16px",
      padding: "28px",
      boxShadow: "0 12px 30px rgba(13, 30, 74, 0.12)",
      maxWidth: "900px", // Sedikit lebih lebar untuk desktop
    },
  },
  backButton: {
    backgroundColor: "#ffffff",
    color: "#1a2a6c",
    fontWeight: 600,
    border: "2px solid #3861ff",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: "0.85rem",
    cursor: "pointer",
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(56, 97, 255, 0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    width: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    // Responsive styling
    "@media (min-width: 768px)": {
      padding: "10px 22px",
      borderRadius: 10,
      fontSize: "0.95rem",
      marginBottom: 24,
    },
  },
  title: {
    fontWeight: 700,
    fontSize: "1.5rem",
    color: "#0b1a40",
    textShadow: "0 1px 3px rgba(11, 26, 64, 0.15)",
    letterSpacing: "0.02em",
    textAlign: "center",
    marginBottom: "1rem",
    lineHeight: "1.3",
    // Responsive font size
    "@media (min-width: 768px)": {
      fontSize: "2rem",
      marginBottom: "1.5rem",
      lineHeight: "1.2",
    },
  },
  imageWrapper: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(11, 26, 64, 0.08)",
    marginBottom: "1rem",
    // Responsive styling
    "@media (min-width: 768px)": {
      borderRadius: "12px",
      boxShadow: "0 6px 18px rgba(11, 26, 64, 0.1)",
      marginBottom: "1.5rem",
    },
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "8px",
    // Responsive styling
    "@media (min-width: 768px)": {
      borderRadius: "12px",
    },
  },
  meta: {
    fontSize: "0.85rem",
    color: "#42548b",
    fontWeight: 500,
    marginBottom: "0.5rem",
    lineHeight: "1.4",
    // Responsive font size
    "@media (min-width: 768px)": {
      fontSize: "0.95rem",
      marginBottom: "0.75rem",
    },
  },
  strong: {
    color: "#1b2c60",
  },
  contentSection: {
    backgroundColor: "#f9fbff",
    padding: "1.2rem 1rem",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(11, 26, 64, 0.05)",
    marginBottom: "1.5rem",
    color: "#273861",
    fontSize: "0.95rem",
    textAlign: "justify",
    lineHeight: "1.6",
    // Responsive styling
    "@media (min-width: 768px)": {
      padding: "1.8rem 2rem",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(11, 26, 64, 0.07)",
      marginBottom: "2.3rem",
      fontSize: "1.05rem",
    },
  },
  contentTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#1a2a6c",
    // Responsive font size
    "@media (min-width: 768px)": {
      fontSize: "1.25rem",
      marginBottom: "0.75rem",
    },
  },
  commentBox: {
    marginTop: "1.5rem",
    // Responsive margin
    "@media (min-width: 768px)": {
      marginTop: "2rem",
    },
  },
  textarea: {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "0.9rem",
    marginBottom: "0.6rem",
    resize: "vertical",
    minHeight: "80px",
    boxSizing: "border-box",
    // Responsive styling
    "@media (min-width: 768px)": {
      padding: "0.75rem",
      borderRadius: "8px",
      fontSize: "1rem",
      marginBottom: "0.75rem",
      minHeight: "100px",
    },
  },
  buttonPrimary: {
    backgroundColor: "#3861ff",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    width: "100%",
    // Responsive styling
    "@media (min-width: 768px)": {
      padding: "0.5rem 1rem",
      marginBottom: "1.25rem",
      fontSize: "1rem",
      width: "auto",
    },
  },
  commentCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(11, 26, 64, 0.04)",
    padding: "0.8rem",
    marginBottom: "0.8rem",
    // Responsive styling
    "@media (min-width: 768px)": {
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(11, 26, 64, 0.06)",
      padding: "1rem",
      marginBottom: "1rem",
    },
  },
  commentContent: {
    fontSize: "0.9rem",
    lineHeight: "1.5",
    marginBottom: "0.5rem",
    // Responsive font size
    "@media (min-width: 768px)": {
      fontSize: "1rem",
    },
  },
  commentActions: {
    marginTop: "0.5rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  buttonSmall: {
    fontSize: "0.8rem",
    padding: "0.3rem 0.6rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    minWidth: "60px",
    // Responsive styling
    "@media (min-width: 768px)": {
      fontSize: "0.85rem",
      padding: "0.35rem 0.75rem",
      borderRadius: "6px",
    },
  },
  buttonWarning: {
    backgroundColor: "#f6ad55",
    color: "#fff",
  },
  buttonDanger: {
    backgroundColor: "#e53e3e",
    color: "#fff",
  },
  loadingText: {
    textAlign: "center",
    marginTop: "2rem",
    fontSize: "1rem",
    color: "#42548b",
  },
};

// CSS-in-JS media queries helper
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

const DetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  // Media query hooks
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Untuk cek user login dan adminId untuk kontrol edit/delete komentar
  const [adminId, setAdminId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/dashboardAdmin");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);

      if (decoded.role === "admin") {
        setAdminId(decoded.id);
        setUserId(null);
      } else {
        setUserId(decoded.id);
        setAdminId(null);
      }

      const now = Date.now() / 1000;
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        localStorage.removeItem("accessToken");
        navigate("/login");
        return;
      }

      const timer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }, timeLeft * 1000);

      fetchNewsDetail();
      fetchComments();

      return () => clearTimeout(timer);
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [id, navigate, token]);

  // Ambil detail berita
  const fetchNewsDetail = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(res.data);
      setLikeCount(res.data.likeCount || 0);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  // Ambil komentar
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/comments/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  // Tambah komentar baru
  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      Swal.fire("Perhatian", "Komentar tidak boleh kosong", "warning");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/comments`,
        { newsId: Number(id), content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Berhasil", "Komentar ditambahkan", "success");
      setNewComment("");
      fetchComments();
    } catch (err) {
      Swal.fire("Error", "Gagal menambahkan komentar", "error");
    }
  };

  // Edit komentar
  const handleEditComment = async (commentId, oldContent) => {
    const updatedContent = prompt("Edit komentar:", oldContent);
    if (updatedContent === null) return;
    if (updatedContent.trim() === "") {
      Swal.fire("Perhatian", "Komentar tidak boleh kosong", "warning");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/comments/${commentId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Berhasil", "Komentar diperbarui", "success");
      fetchComments();
    } catch (err) {
      Swal.fire("Error", "Gagal mengedit komentar", "error");
    }
  };

  // Hapus komentar
  const handleDeleteComment = async (commentId) => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Komentar akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil", "Komentar dihapus", "success");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus komentar", "error");
    }
  };

  if (loading) return <div style={styles.loadingText}>Memuat...</div>;
  if (!news) return <div style={styles.loadingText}>Berita tidak ditemukan.</div>;

  const formattedDate = new Date(news.iso_date || news.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        {/* Tombol Back */}
        <button
          style={styles.backButton}
          onClick={() => navigate("/dashboardAdmin")}
        >
          ← Kembali {isDesktop && "ke Dashboard"}
        </button>
        
        <h1 style={styles.title}>{news.title}</h1>

        {news.image_large && (
          <div style={styles.imageWrapper}>
            <img
              src={news.image_large.startsWith("http") ? news.image_large : `${BASE_URL}${news.image_large}`}
              alt={news.title}
              style={styles.image}
            />
          </div>
        )}

        <div style={styles.meta}>
          Ditulis oleh <strong style={styles.strong}>{news.author || "Admin"}</strong>
          {isDesktop && " | "}
          {!isDesktop && <br />}
          Kategori: <strong style={styles.strong}>{news.category?.category || "Umum"}</strong>
        </div>
        <div style={styles.meta}>Tanggal: {formattedDate}</div>

        {news.url && (
          <div style={styles.meta}>
            <strong style={styles.strong}>URL:</strong>{" "}
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                wordBreak: "break-all",
                color: "#3861ff",
                textDecoration: "underline"
              }}
            >
              {news.url}
            </a>
          </div>
        )}

        <div style={styles.contentSection}>
          <h2 style={styles.contentTitle}>Deskripsi</h2>
          <div style={styles.commentContent}>{news.description}</div>
        </div>

        {news.content && (
          <div style={styles.contentSection}>
            <h2 style={styles.contentTitle}>Konten Lengkap</h2>
            <div style={styles.commentContent}>{news.content}</div>
          </div>
        )}

        {/* Komentar Section */}
        <div style={styles.commentBox}>
          <h3 style={styles.contentTitle}>Komentar</h3>
          <textarea
            style={styles.textarea}
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button style={styles.buttonPrimary} onClick={handleAddComment}>
            Kirim Komentar
          </button>

          <div>
            {comments.length === 0 && (
              <div style={styles.meta}>Belum ada komentar.</div>
            )}
            {comments.map((comment) => (
              <div key={comment.id} style={styles.commentCard}>
                <div style={styles.commentContent}>
                  <strong>{comment.user?.username || comment.admin?.username || "Anonim"}</strong>:
                </div>
                <div style={styles.commentContent}>{comment.content}</div>
                <div style={styles.commentActions}>
                  {((comment.userId && comment.userId === userId && role === "user") ||
                    (comment.adminId && comment.adminId === adminId && role === "admin")) && (
                    <button
                      style={{ ...styles.buttonSmall, ...styles.buttonWarning }}
                      onClick={() => handleEditComment(comment.id, comment.content)}
                    >
                      Edit
                    </button>
                  )}
                  {(role === "admin" ||
                    (comment.userId && comment.userId === userId && role === "user")) && (
                    <button
                      style={{ ...styles.buttonSmall, ...styles.buttonDanger }}
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAdmin;