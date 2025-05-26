import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../utils";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/dashboard");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);

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
      fetchLikesAndStatus();
      fetchComments();

      return () => clearTimeout(timer);
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  }, [id, location.key, navigate, token]);

  const fetchNewsDetail = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(res.data);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikesAndStatus = async () => {
    try {
      const resCount = await axios.get(`${BASE_URL}/news/likesCount/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(resCount.data.count || 0);

      const resStatus = await axios.get(`${BASE_URL}/news/liked/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasLiked(resStatus.data.liked);
    } catch (err) {
      console.error("Error fetching like data", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await axios.delete(`${BASE_URL}/news/liked/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikes((prev) => (prev > 0 ? prev - 1 : 0));
        setHasLiked(false);
        Swal.fire("Berhasil", "Berita dihapus dari suka", "success");
      } else {
        await axios.post(
          `${BASE_URL}/news/liked`,
          { newsId: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikes((prev) => prev + 1);
        setHasLiked(true);
        Swal.fire("Berhasil", "Berita disukai!", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Gagal memproses like/unlike", "error");
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

  if (loading) return <p className="loading-text">Memuat...</p>;
  if (!news) return <p className="loading-text">Berita tidak ditemukan.</p>;

  const formattedDate = new Date(news.iso_date || news.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // Fungsi untuk format waktu komentar
  const formatCommentDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

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
          a {
            color: #3861ff;
            font-weight: 600;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .like-button {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            font-size: 1rem;
            background: linear-gradient(135deg, #1a2a6c, #3861ff);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            box-shadow: 0 8px 20px rgba(26, 42, 108, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 20px;
          }
          .like-button:hover {
            background: linear-gradient(135deg, #0b1a40, #2543c1);
            box-shadow: 0 12px 30px rgba(11, 26, 64, 0.4);
          }
          .like-button span {
            margin-left: 12px;
            font-weight: 600;
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
            .like-button {
              padding: 8px 16px;
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      <div className="container" role="main" aria-labelledby="news-title">
        <button
        onClick={() => navigate("/dashboard")}
        className="btn-back"
        aria-label="Kembali ke Dashboard"
      >
        ← Kembali ke Dashboard
      </button>
  <h1 className="title" id="news-title">{news.title}</h1>
  {news.image_large && (
    <div className="image-container" aria-label={`Gambar berita: ${news.title}`}>
      <img 
        src={news.image_large.startsWith("http")
          ? news.image_large
          : `${BASE_URL}${news.image_large}`
        } 
        alt={news.title} 
        loading="lazy"
        style={{ width: '100%', height: 'auto', maxHeight: 'auto', objectFit: 'contain' }}
      />
    </div>
        )}
        
        <p className="meta-info">
          Ditulis oleh <strong>{news.author || "User"}</strong> | Kategori:{" "}
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
          <p>
            <strong>Deskripsi:</strong> {news.description}
          </p>
        </section>

        {news.content && (
          <section className="content-section" aria-label="Konten lengkap berita">
            <h2 className="title" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Konten Lengkap
            </h2>
            <p>{news.content}</p>
          </section>
        )}


        <button
          className="like-button"
          onClick={handleLikeToggle}
          aria-pressed={hasLiked}
          aria-label={hasLiked ? "Batalkan suka berita ini" : "Sukai berita ini"}
        >
          {hasLiked ? "👎 Unlike" : "❤️ Like"}
          <span>{likes}</span>
        </button>

        <section
          className="comments-section"
          aria-label="Bagian komentar"
        >
          <h2>Komentar</h2>
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
            {comments.map((comment) => {
              if (!comment.user) return null;
  console.log('userId:', userId, 'comment.user.id:', comment.user.id, 'comment:', comment);

  return (
    <article
      className="comment-item"
      key={comment.id}
      role="listitem"
      aria-label={`Komentar dari ${comment.user.username}`}
    >
      <p className="comment-content">{comment.content}</p>
      <div className="comment-meta">
        <span className="comment-author">{comment.user.username}</span>
        <span className="comment-date">
          {formatCommentDate(comment.updatedAt)}
          {comment.updatedAt !== comment.createdAt && " (diedit)"}
        </span>
        {comment.userId === userId && (
          <span className="comment-actions">
            <button
              onClick={() => handleEditComment(comment.id, comment.content)}
              aria-label={`Edit komentar dari ${comment.user.username}`}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              aria-label={`Hapus komentar dari ${comment.user.username}`}
            >
              Hapus
            </button>
          </span>
        )}
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

export default Detail;
