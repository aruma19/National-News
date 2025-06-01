# National News API Documentation

API untuk sistem berita nasional dengan fitur manajemen user, admin, berita, kategori, komentar, dan like.

## Base URL
```
http://localhost:5003
```

## Authentication
API menggunakan JWT Bearer Token untuk autentikasi. Token diperoleh setelah login dan harus disertakan dalam header Authorization.

```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
- [User Features](#-user-features)
- [Admin Features](#-admin-features)
- [News Features](#-news-features)
- [Comment Features](#-comment-features)
- [Like Features](#-like-features)
- [Category Features](#-category-features)

---

## 👤 User Features

### Register User
```http
POST /register
Content-Type: application/json
```

**Request Body:**
```json
{
    "username": "farskuy",
    "email": "farskuy@gmail.com",
    "gender": "Male",
    "password": "farskuy"
}
```

### Login User
```http
POST /login
Content-Type: application/json
```

**Request Body:**
```json
{
    "email": "farskuy@gmail.com",
    "password": "farskuy"
}
```

### Logout User
```http
POST /logout
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /user/update
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "username": "farskuyy",
    "email": "farskuy@gmail.com",
    "gender": "Male",
    "password": "farskuy"
}
```

---

## 👨‍💼 Admin Features

### Register Admin
```http
POST /register/admin
Content-Type: application/json
```

**Request Body:**
```json
{
    "username": "admin4",
    "email": "admin4@gmail.com",
    "password": "admin4"
}
```

### Login Admin
```http
POST /login
Content-Type: application/json
```

**Request Body:**
```json
{
    "email": "admin@gmail.com",
    "password": "admin"
}
```

### Logout Admin
```http
POST /logout
Authorization: Bearer <admin_token>
```

---

## 📰 News Features

### Get All News
```http
GET /news
Authorization: Bearer <token>
```

### Get News Detail
```http
GET /news/{id}
Authorization: Bearer <token>
```

### Create News (Admin Only)
```http
POST /news
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "author": "UIA Channel",
    "title": "Anggota TNI AL Pembunuh Sales Mobil di Aceh Divonis Bui Seumur Hidup",
    "url": "https://www.cnnindonesia.com/nasional/20250527194454-12-1233885/anggota-tni-al-pembunuh-sales-mobil-di-aceh-divonis-bui-seumur-hidup",
    "description": "Anggota TNI AL Dede Irawan divonis seumur hidup atas pembunuhan sales mobil di Aceh.",
    "iso_date": "2025-05-21T15:35:24.000Z",
    "image_small": "https://akcdn.detik.net.id/visual/2020/06/22/ilustrasi-penusukan-4_169.jpeg?w=360&q=90",
    "image_large": "https://akcdn.detik.net.id/visual/2020/06/22/ilustrasi-penusukan-4_169.jpeg?w=360&q=100",
    "categoryId": 3
}
```

### Update News (Admin Only)
```http
PUT /news/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### Delete News (Admin Only)
```http
DELETE /news/{id}
Authorization: Bearer <admin_token>
```

---

## 💬 Comment Features

### Get All Comments
```http
GET /comments
Authorization: Bearer <token>
```

### Get Comments by News ID
```http
GET /comments/news/{newsId}
Authorization: Bearer <token>
```

### Get Comment by ID
```http
GET /comments/{id}
Authorization: Bearer <token>
```

### Create Comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "newsId": 13,
    "content": "Great article!"
}
```

### Update Comment
```http
PUT /comments/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "newsId": 1,
    "content": "Updated comment"
}
```

### Delete Comment
```http
DELETE /comments/{id}
Authorization: Bearer <token>
```

---

## ❤️ Like Features

### Like News
```http
POST /news/liked
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "newsId": 6
}
```

### Get User's Liked News
```http
GET /news/liked/{userId}
Authorization: Bearer <token>
```

### Check Like Status
```http
GET /news/liked/check/{newsId}
Authorization: Bearer <token>
```

### Get Likes Count for News
```http
GET /news/likesCount/{newsId}
Authorization: Bearer <token>
```

### Unlike News
```http
DELETE /news/liked/{newsId}
Authorization: Bearer <token>
```

---

## 📂 Category Features

### Get All Categories
```http
GET /categories
```

### Get Category by ID
```http
GET /categories/{id}
```

### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "category": "Isu Global"
}
```

### Update Category (Admin Only)
```http
PUT /categories/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "category": "Lingkungan"
}
```

### Delete Category (Admin Only)
```http
DELETE /categories/{id}
Authorization: Bearer <admin_token>
```

---

## 🔐 Authorization Levels

| Feature | User | Admin |
|---------|------|-------|
| Register/Login/Logout | ✅ | ✅ |
| View News | ✅ | ✅ |
| Create/Edit/Delete News | ❌ | ✅ |
| Comment on News | ✅ | ✅ |
| Like News | ✅ | ✅ |
| Manage Categories | ❌ | ✅ |
| Delete Any Comment | ❌ | ✅ |

---

## 📝 Notes

1. Semua endpoint yang memerlukan autentikasi harus menyertakan JWT token dalam header Authorization
2. Admin memiliki akses penuh untuk mengelola berita, kategori, dan komentar
3. User biasa hanya dapat mengelola komentar mereka sendiri
4. Format tanggal menggunakan ISO 8601 format
5. Gender field harus berupa "Male" atau "Female"

---

## 🚀 Getting Started

1. Clone repository
2. Install dependencies
3. Setup database
4. Run server pada port 5003
5. API siap digunakan di `http://localhost:5003`

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim developer.