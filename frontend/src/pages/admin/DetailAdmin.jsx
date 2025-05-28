import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const DetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
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
        navigate("/");
        return;
      }

      const timer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        navigate("/");
      }, timeLeft * 1000);

      fetchNewsDetail();
      fetchComments();

      return () => clearTimeout(timer);
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  }, [id, navigate, token]);

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

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      fontSize: '1.1rem',
      color: '#42548b'
    }}>
      Memuat...
    </div>
  );

  if (!news) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      fontSize: '1.1rem',
      color: '#42548b'
    }}>
      Berita tidak ditemukan.
    </div>
  );

  const formattedDate = new Date(news.iso_date || news.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const containerStyle = {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f5f8fc",
    padding: "1rem",
    minHeight: "100vh",
    color: "#0a1f44",
    '@media (min-width: 768px)': {
      padding: "2rem",
    }
  };

  const boxStyle = {
    background: "linear-gradient(to bottom right, #ffffff, #f7fbff)",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 12px 30px rgba(13, 30, 74, 0.12)",
    maxWidth: "900px",
    margin: "0 auto",
    '@media (min-width: 768px)': {
      padding: "28px",
    }
  };

  const titleStyle = {
    fontWeight: 700,
    fontSize: "1.5rem",
    color: "#0b1a40",
    textShadow: "0 1px 3px rgba(11, 26, 64, 0.15)",
    letterSpacing: "0.02em",
    textAlign: "center",
    marginBottom: "1.5rem",
    lineHeight: "1.3",
    '@media (min-width: 768px)': {
      fontSize: "2rem",
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
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(56, 97, 255, 0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    '@media (min-width: 768px)': {
      padding: "10px 22px",
      fontSize: "0.95rem",
      marginBottom: 24,
    }
  };

  const imageWrapperStyle = {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(11, 26, 64, 0.1)",
    marginBottom: "1.5rem",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "12px",
    maxHeight: "400px",
    objectFit: "cover",
    '@media (min-width: 768px)': {
      maxHeight: "500px",
    }
  };

  const metaStyle = {
    fontSize: "0.85rem",
    color: "#42548b",
    fontWeight: 500,
    marginBottom: "0.75rem",
    '@media (min-width: 768px)': {
      fontSize: "0.95rem",
    }
  };

  const contentSectionStyle = {
    backgroundColor: "#f9fbff",
    padding: "1.2rem",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(11, 26, 64, 0.07)",
    marginBottom: "2rem",
    color: "#273861",
    fontSize: "0.95rem",
    textAlign: "justify",
    lineHeight: "1.6",
    '@media (min-width: 768px)': {
      padding: "1.8rem 2rem",
      fontSize: "1.05rem",
      marginBottom: "2.3rem",
    }
  };

  const contentTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#1a2a6c",
    '@media (min-width: 768px)': {
      fontSize: "1.25rem",
    }
  };

  const textareaStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
    resize: "vertical",
    minHeight: "80px",
    boxSizing: "border-box",
    '@media (min-width: 768px)': {
      fontSize: "1rem",
      minHeight: "100px",
    }
  };

  const buttonPrimaryStyle = {
    backgroundColor: "#3861ff",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginBottom: "1.25rem",
    fontSize: "0.9rem",
    '@media (min-width: 768px)': {
      padding: "0.7rem 1.5rem",
      fontSize: "1rem",
    }
  };

  const commentCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(11, 26, 64, 0.06)",
    padding: "0.8rem",
    marginBottom: "1rem",
    '@media (min-width: 768px)': {
      padding: "1rem",
    }
  };

  const buttonSmallStyle = {
    fontSize: "0.75rem",
    marginRight: "0.5rem",
    marginBottom: "0.25rem",
    padding: "0.3rem 0.6rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    '@media (min-width: 768px)': {
      fontSize: "0.85rem",
      marginBottom: "0",
      padding: "0.35rem 0.75rem",
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <button
          style={backButtonStyle}
          onClick={() => navigate("/dashboardAdmin")}
        >
          ← Kembali ke Dashboard
        </button>

        <h1 style={titleStyle}>{news.title}</h1>

        {news.image_large && (
          <div style={imageWrapperStyle}>
            <img
              src={news.image_large.startsWith("http") ? news.image_large : `${BASE_URL}${news.image_large}`}
              alt={news.title}
              style={imageStyle}
            />
          </div>
        )}

        <p style={metaStyle}>
          Ditulis oleh <strong style={{ color: "#1b2c60" }}>{news.author || "Admin"}</strong> | Kategori:{" "}
          <strong style={{ color: "#1b2c60" }}>{news.category?.category || "Umum"}</strong>
        </p>
        <p style={metaStyle}>Tanggal: {formattedDate}</p>

        {news.url && (
          <p style={metaStyle}>
            <strong style={{ color: "#1b2c60" }}>URL:</strong>{" "}
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: "#3861ff", 
                wordBreak: "break-all",
                textDecoration: "underline"
              }}
            >
              {news.url}
            </a>
          </p>
        )}

        <div style={contentSectionStyle}>
          <h2 style={contentTitleStyle}>Deskripsi</h2>
          <p style={{ margin: 0 }}>{news.description}</p>
        </div>

        {news.content && (
          <div style={contentSectionStyle}>
            <h2 style={contentTitleStyle}>Konten Lengkap</h2>
            <p style={{ margin: 0 }}>{news.content}</p>
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <h3 style={contentTitleStyle}>Komentar</h3>
          <textarea
            style={textareaStyle}
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button style={buttonPrimaryStyle} onClick={handleAddComment}>
            Kirim
          </button>

          <div>
            {comments.length === 0 && (
              <p style={metaStyle}>Belum ada komentar.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} style={commentCardStyle}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
                  {comment.user?.username || comment.admin?.username || "Anonim"}:
                </p>
                <p style={{ margin: "0 0 0.75rem 0", lineHeight: "1.5" }}>
                  {comment.content}
                </p>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "0.25rem",
                  marginTop: "0.5rem" 
                }}>
                  {((comment.userId && comment.userId === userId && role === "user") ||
                    (comment.adminId && comment.adminId === adminId && role === "admin")) && (
                    <button
                      style={{
                        ...buttonSmallStyle,
                        backgroundColor: "#f6ad55",
                        color: "#fff",
                      }}
                      onClick={() => handleEditComment(comment.id, comment.content)}
                    >
                      Edit
                    </button>
                  )}
                  {(role === "admin" ||
                    (comment.userId && comment.userId === userId && role === "user")) && (
                    <button
                      style={{
                        ...buttonSmallStyle,
                        backgroundColor: "#e53e3e",
                        color: "#fff",
                      }}
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