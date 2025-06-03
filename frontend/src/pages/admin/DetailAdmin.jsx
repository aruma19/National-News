import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import strictInstance from "../../utils/axiosInstance";

const DetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  // Untuk cek user login dan adminId untuk kontrol edit/delete komentar
  const [adminId, setAdminId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
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

      fetchNewsDetail();
      fetchComments();
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [id, navigate, token]);

  // Ambil detail berita
  const fetchNewsDetail = async () => {
    try {
      const response = await strictInstance.get(`/news/${id}`);
      setNews(response.data);
      setLikeCount(response.data.likeCount || 0);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  // Ambil komentar
  const fetchComments = async () => {
    try {
      const res = await strictInstance.get(`/comments/news/${id}`);
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
      await strictInstance.post(`/comments`, {
        newsId: Number(id),
        content: newComment,
      });
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
      await strictInstance.put(`/comments/${commentId}`, { content: updatedContent });
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
      await strictInstance.delete(`/comments/${commentId}`);
      Swal.fire("Berhasil", "Komentar dihapus", "success");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus komentar", "error");
    }
  };

  // Fungsi untuk format waktu komentar
  const formatCommentDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) return <p className="loading-text">Memuat...</p>;
  if (!news) return <p className="loading-text">Berita tidak ditemukan.</p>;

  const formattedDate = new Date(news.iso_date || news.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', sans-serif;
            background: transparent;
            color: #0a1f44;
            margin: 0;
            padding: 32px 0;
          }
          .container {
            width: 90%;
            min-width: 520px;
            max-width: 600px;
            margin: 0 auto;
            overflow-y: auto;
            background: linear-gradient(to bottom right, #ffffff, #f8faff);
            border-radius: 16px;
            padding: 20px 28px;
            box-shadow: 0 12px 30px rgba(13, 30, 74, 0.12);
            color: #1a2a6c;
            line-height: 1.65;
          }
          h1.title {
            font-weight: 700;
            font-size: 2rem;
            margin-bottom: 1.25rem;
            text-align: center;
            color: #0b1a40;
            text-shadow: 0 1px 3px rgba(11, 26, 64, 0.15);
            letter-spacing: 0.02em;
          }
          .image-container {
            width: 100%;
            max-height: 360px;
            overflow: hidden;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            box-shadow: 0 6px 18px rgba(11, 26, 64, 0.1);
          }
          .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
            transition: transform 0.35s ease;
          }
          .image-container img:hover {
            transform: scale(1.03);
          }
          .meta-info {
            font-size: 0.9rem;
            color: #42548b;
            margin-bottom: 0.75rem;
            text-align: center;
            font-weight: 500;
          }
          .meta-info strong {
            color: #1b2c60;
          }
          .content-section {
            background: #f9fbff;
            padding: 1.8rem 2rem;
            border-radius: 14px;
            box-shadow: 0 4px 14px rgba(11, 26, 64, 0.07);
            margin-bottom: 2.3rem;
            color: #273861;
            font-size: 1.05rem;
            text-align: justify;
          }
          .content-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #1a2a6c;
          }
          a {
            color: #3861ff;
            font-weight: 600;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .comments-section {
            margin-top: 2rem;
          }
          .comment-input {
            width: 100%;
            min-height: 80px;
            padding: 14px 18px;
            border-radius: 12px;
            border: 1.8px solid #d3d9f8;
            font-size: 1rem;
            resize: vertical;
            font-family: 'Inter', sans-serif;
            color: #1a2a6c;
            box-shadow: inset 0 2px 6px rgb(13 30 74 / 0.05);
            transition: border-color 0.3s ease;
            margin-bottom: 12px;
          }
          .comment-input:focus {
            border-color: #3861ff;
            outline: none;
            box-shadow: 0 0 8px rgba(56, 97, 255, 0.3);
          }
          .btn-submit-comment {
            background: linear-gradient(to right, #1a2a6c, #3861ff);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 12px 28px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(56, 97, 255, 0.35);
            transition: all 0.3s ease;
          }
          .btn-submit-comment:hover {
            background: linear-gradient(to right, #0b1a40, #2543c1);
            box-shadow: 0 12px 30px rgb(37 67 193 / 0.5);
          }
          .comments-list {
            margin-top: 2rem;
          }
          .comment-item {
            background: #e8f0ff;
            padding: 14px 18px;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 4px 12px rgb(11 26 64 / 0.1);
            position: relative;
          }
          .comment-content {
            font-size: 1rem;
            color: #0b1a40;
            margin-bottom: 6px;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .comment-meta {
            font-size: 0.8rem;
            color: #42548b;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .comment-author {
            font-weight: 600;
          }
          .comment-date {
            font-style: italic;
          }
          .comment-actions button {
            background: transparent;
            border: none;
            color: #3861ff;
            cursor: pointer;
            font-weight: 600;
            margin-left: 12px;
            transition: color 0.2s ease;
            font-size: 0.85rem;
          }
          .comment-actions button:hover {
            color: #0b1a40;
            text-decoration: underline;
          }
          .loading-text {
            font-size: 1.3rem;
            color: #42548b;
            text-align: center;
            margin-top: 120px;
          }
          .btn-back {
            background-color: #ffffff;
            color: #1a2a6c;
            font-weight: 600;
            border: 2px solid #3861ff;
            padding: 10px 22px;
            border-radius: 10px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(56, 97, 255, 0.2);
          }

          .btn-back:hover {
            background-color: #3861ff;
            color: #ffffff;
            box-shadow: 0 10px 24px rgba(56, 97, 255, 0.35);
          }

          @media (min-width: 1200px) {
            .container {
              max-width: 540px;
            }
          }

          @media (max-width: 480px) {
            .container {
              padding: 16px 20px;
            }
            h1.title {
              font-size: 1.65rem;
            }
            .btn-back {
              padding: 8px 16px;
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      <div className="container" role="main" aria-labelledby="news-title">
        <button
          onClick={() => navigate("/dashboardAdmin")}
          className="btn-back"
          aria-label="Kembali ke Dashboard Admin"
        >
          ← Kembali ke Dashboard
        </button>

        <h1 className="title" id="news-title">{news.title}</h1>

        {news.image_large && (
          <div className="image-container" aria-label={`Gambar berita: ${news.title}`}>
            <img
              src={news.image_large.startsWith("http") ? news.image_large : `${BASE_URL}${news.image_large}`}
              alt={news.title}
              loading="lazy"
              style={{ width: '100%', height: 'auto', maxHeight: 'auto', objectFit: 'contain' }}
            />
          </div>
        )}

        <p className="meta-info">
          Ditulis oleh <strong>{news.author || "Admin"}</strong> | Kategori:{" "}
          <strong>{news.category?.category || "Umum"}</strong>
        </p>
        <p className="meta-info">Tanggal: {formattedDate}</p>

        {news.url && (
          <p className="meta-info">
            <strong>URL:</strong>{" "}
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              {news.url}
            </a>
          </p>
        )}

        <section className="content-section" aria-label="Deskripsi berita">
          <h2 className="content-title">Deskripsi</h2>
          <p>{news.description}</p>
        </section>

        {news.content && (
          <section className="content-section" aria-label="Konten lengkap berita">
            <h2 className="content-title">Konten Lengkap</h2>
            <p>{news.content}</p>
          </section>
        )}

        <section className="comments-section" aria-label="Bagian komentar">
          <h2 className="content-title">Komentar</h2>
          <textarea
            className="comment-input"
            aria-label="Tulis komentar"
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <button
            className="btn-submit-comment"
            onClick={handleAddComment}
            aria-disabled={newComment.trim() === ""}
          >
            Kirim Komentar
          </button>

          <div className="comments-list" role="list" aria-live="polite" aria-relevant="additions removals">
            {comments.length === 0 && <p>Belum ada komentar.</p>}
            // Ganti bagian ini di dalam comments.map():
            {comments.map((comment) => {
              // Tentukan username dan ID berdasarkan apakah komentar dari user atau admin
              const commentAuthor = comment.user?.username || comment.admin?.username || "Anonim";
              const commentAuthorId = comment.userId || comment.adminId;

              // PERBAIKAN: Cek ownership berdasarkan role dan ID yang sesuai
              let isOwner = false;
              if (role === "admin" && comment.adminId) {
                // Jika login sebagai admin, hanya bisa edit komentar admin dengan ID yang sama
                isOwner = comment.adminId === adminId;
              } else if (role === "user" && comment.userId) {
                // Jika login sebagai user, hanya bisa edit komentar user dengan ID yang sama
                isOwner = comment.userId === userId;
              }

              return (
                <article
                  className="comment-item"
                  key={comment.id}
                  role="listitem"
                  aria-label={`Komentar dari ${commentAuthor}`}
                >
                  <p className="comment-content">{comment.content}</p>
                  <div className="comment-meta">
                    <span className="comment-author">{commentAuthor}</span>
                    <span className="comment-date">
                      {formatCommentDate(comment.updatedAt)}
                      {comment.updatedAt !== comment.createdAt && " (diedit)"}
                    </span>
                    <span className="comment-actions">
                      {/* Admin hanya bisa edit komentar admin mereka sendiri */}
                      {isOwner && (
                        <button
                          onClick={() => handleEditComment(comment.id, comment.content)}
                          aria-label={`Edit komentar dari ${commentAuthor}`}
                        >
                          Edit
                        </button>
                      )}
                      {/* Admin bisa hapus semua komentar, user hanya komentar sendiri */}
                      {(role === "admin" || isOwner) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          aria-label={`Hapus komentar dari ${commentAuthor}`}
                        >
                          Hapus
                        </button>
                      )}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default DetailAdmin;