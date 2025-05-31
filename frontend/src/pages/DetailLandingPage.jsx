import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import Swal from "sweetalert2";

const DetailLandingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      // Menggunakan endpoint publik tanpa token
      const res = await axios.get(`${BASE_URL}/news/public/${id}`);
      setNews(res.data);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data berita", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/landing");
  };

  const handleLoginClick = () => {
    navigate("/login");
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
          a {
            color: #3861ff;
            font-weight: 600;
            text-decoration: none;
          }
          a:hover {
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
            margin-right: 12px;
          }

          .btn-back:hover {
            background-color: #3861ff;
            color: #ffffff;
            box-shadow: 0 10px 24px rgba(56, 97, 255, 0.35);
          }

          .btn-login {
            background-color: #1e40af;
            color: #ffffff;
            font-weight: 600;
            border: none;
            padding: 10px 22px;
            border-radius: 10px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          }

          .btn-login:hover {
            background-color: #1d4ed8;
            box-shadow: 0 10px 24px rgba(29, 78, 216, 0.4);
            transform: translateY(-2px);
          }

          .login-prompt {
            background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
            padding: 1.5rem 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            text-align: center;
            border: 1px solid #b3e5fc;
            box-shadow: 0 4px 12px rgba(3, 169, 244, 0.1);
          }

          .login-prompt h3 {
            color: #0277bd;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
          }

          .login-prompt p {
            color: #0288d1;
            margin-bottom: 1rem;
            font-size: 0.95rem;
          }

          .login-prompt-btn {
            background: linear-gradient(135deg, #0277bd, #0288d1);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(2, 119, 189, 0.3);
          }

          .login-prompt-btn:hover {
            background: linear-gradient(135deg, #01579b, #0277bd);
            box-shadow: 0 8px 20px rgba(1, 87, 155, 0.4);
            transform: translateY(-2px);
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
            .btn-back, .btn-login {
              padding: 8px 16px;
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      <div className="container" role="main" aria-labelledby="news-title">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handleBackClick}
            className="btn-back"
            aria-label="Kembali ke Landing Page"
          >
            ← Kembali
          </button>
          <button
            onClick={handleLoginClick}
            className="btn-login"
            aria-label="Login untuk fitur lengkap"
          >
            Login
          </button>
        </div>

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

        {/* Login Prompt untuk Like dan Comment */}
        <div className="login-prompt">
          <h3>💬 Ingin Berinteraksi dengan Berita Ini?</h3>
          <p>Login untuk dapat memberikan like dan menambahkan komentar pada berita ini.</p>
          <button
            className="login-prompt-btn"
            onClick={handleLoginClick}
            aria-label="Login untuk fitur like dan komentar"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailLandingPage;