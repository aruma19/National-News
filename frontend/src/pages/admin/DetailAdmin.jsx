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
        setUserId(null);  // tidak login sebagai user
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


  // Ambil detail berita
  const fetchNewsDetail = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(res.data);
      setLikeCount(res.data.likeCount || 0); // default ke 0 jika null
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
    if (updatedContent === null) return; // batal edit
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

  if (loading) return <p className="has-text-centered mt-6">Memuat...</p>;
  if (!news) return <p className="has-text-centered mt-6">Berita tidak ditemukan.</p>;

  const formattedDate = new Date(news.iso_date || news.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="container mt-5 mb-6">
      <div className="box">
        <h1 className="title is-3 has-text-centered">{news.title}</h1>

        {news.image_large && (
          <figure className="image is-3by1 mb-4" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <img
              src={news.image_large.startsWith("http") ? news.image_large : `${BASE_URL}${news.image_large}`}
              alt={news.title}
              style={{ objectFit: "cover", width: "100%" }}
            />
          </figure>
        )}

        <p className="has-text-grey is-size-6 mb-1">
          Ditulis oleh <strong>{news.author || "Admin"}</strong> | Kategori: <strong>{news.category?.category || "Umum"}</strong>
        </p>
        <p className="has-text-grey is-size-7 mb-3">Tanggal: {formattedDate}</p>

        {news.url && (
          <p><strong>URL:</strong> <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a></p>
        )}

        <div className="content mb-4">
          <p><strong>Deskripsi:</strong> {news.description}</p>
        </div>

        {news.content && (
          <div className="content mt-5">
            <h2 className="title is-5">Konten Lengkap</h2>
            <p>{news.content}</p>
          </div>
        )}

        {/* Komentar Section */}
        <div className="mt-5">
          <h3 className="title is-5">Komentar</h3>
          <textarea
            className="textarea mb-2"
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="button is-primary mb-4" onClick={handleAddComment}>Kirim</button>

          <div>
            {comments.length === 0 && <p className="has-text-grey">Belum ada komentar.</p>}
            {comments.map((comment) => (
              <div key={comment.id} className="box">
                <p><strong>{comment.user?.username || comment.admin?.username || "Anonim"}</strong>:</p>
                <p>{comment.content}</p>

                {/* Tombol edit/hapus hanya untuk komentar user yg login */}
                <div className="buttons mt-2">
                  {/* Tombol edit hanya untuk komentar sendiri */}
                  {((comment.userId && comment.userId === userId && role === "user") ||
                    (comment.adminId && comment.adminId === adminId && role === "admin")) && (
                      <button
                        className="button is-small is-warning"
                        onClick={() => handleEditComment(comment.id, comment.content)}
                      >
                        Edit
                      </button>
                    )}

                  {/* Tombol hapus:
                  - Jika admin login: bisa hapus semua komentar
                  - Jika user login: hanya hapus komentar sendiri */}
                  {(role === "admin" ||
                    (comment.userId && comment.userId === userId && role === "user")) && (
                      <button
                        className="button is-small is-danger"
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
