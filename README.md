# National News API Documentation

API untuk sistem berita nasional dengan fitur manajemen user, admin, berita, kategori, komentar, dan like.

## Base URL
Karena saya menggunakan http di bawah maka, setiap menjalankan request.rest nya menggunakan url berikut (Menyesuaikan dengan kebutuhan)
```
http://localhost:5003
```

## Authentication
API menggunakan JWT Bearer Token untuk autentikasi. Token diperoleh setelah login dan harus disertakan dalam header Authorization.

```
Authorization: Bearer <token>
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
Mendaftarkan akun sesuai dengan variabel data nya

```http
POST http://localhost:5003/register
Content-Type: application/json
```

```json
{
    "username": "farskuy",
    "email": "farskuy@gmail.com",
    "gender": "Male",
    "password": "farskuy"
}
```

### Login User
Melakukan Login berdasarkan data "User" yang sudah pernah didaftarkan di Register

```http
POST http://localhost:5003/login
Content-Type: application/json
```

```json
{
    "email": "farskuy@gmail.com",
    "password": "farskuy"
}
```

### Logout User
Melakukan Logout pada menu sidebar baik dari sisi User. Mengambil token dari login User sebelumnya

```http
POST http://localhost:5003/logout
Authorization: Bearer <token>
```

### Update User Profile
Melakukan Edit data User ketika ingin melakukan perbaikan data
```http
PUT http://localhost:5003/user/update
Authorization: Bearer <token>
Content-Type: application/json
```

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
Mendaftarkan akun sesuai dengan variabel data nya, tetapi pada request API ini hanya bisa dilakukan di backend karena pada frontend tidak ada fitur untuk register akun admin

```http
POST http://localhost:5003/register/admin
Content-Type: application/json
```

```json
{
    "username": "admin4",
    "email": "admin4@gmail.com",
    "password": "admin4"
}
```

### Login Admin
Melakukan Login berdasarkan data "Admin" yang sudah pernah didaftarkan di Register. Karena halaman login ini berfungsi untuk Admin dan User. yang dibedakan di sini Adalah role, jika yang login Adalah akun User maka akan masuk ke halaman User, dan jika yang login Adalah akun Admin maka akan masuk ke halaman Admin

```http
POST http://localhost:5003/login
Content-Type: application/json
```

```json
{
    "email": "admin@gmail.com",
    "password": "admin"
}
```

### Logout Admin
Melakukan Logout pada menu sidebar baik dari sisi Admin. Mengambil token dari hasil login admin sebelumnya.

```http
POST http://localhost:5003/logout
Authorization: Bearer <token>
```

---

## 📰 News Features

### Get All News
Menampilkan seluruh data berita yang ada pada database

```http
GET http://localhost:5003/news
Authorization: Bearer <token>
```

### Get News Detail
Menampilkan data berita berdasarkan id news, tanda {id} diganti dengan nomor id langsung
```http
GET http://localhost:5003/news/{id}
Authorization: Bearer <token>
```

### Create News (Admin Only)
Membuat data berita baru yang hanya bisa dilakukan oleh admin, dengan ketentuan variabel di bawah
```http
POST http://localhost:5003/news
Authorization: Bearer <token>
Content-Type: application/json
```

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
Melakukan edit data berita yang hanya bisa diakses oleh admin.tanda {id} diganti dengan nomor id langsung
```http
PUT http://localhost:5003/news/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete News (Admin Only)
Admin melakukan hapus data berita. tanda {id} diganti dengan nomor id langsung
```http
DELETE http://localhost:5003/news/{id}
Authorization: Bearer <token>
```

---

## 💬 Comment Features

### Get All Comments
Menampilkan seluruh data komentar baik dari user maupun admin
```http
GET http://localhost:5003/comments
Authorization: Bearer <token>
```

### Get Comments by News ID
Menampilkan komentar berdasarkan id berita. misalnya pada berita A terdapat beberapa komentar, nah yang diambil itu banyak komentarnya di berita tersebut. tanda {id} diganti dengan nomor id langsung
```http
GET http://localhost:5003/comments/news/{newsId}
Authorization: Bearer <token>
```

### Get Comment by ID
Menampilkan data komentar berdasarkan id komentar. tanda {id} diganti dengan nomor id langsung

```http
GET http://localhost:5003/comments/{id}
Authorization: Bearer <token>
```

### Create Comment
Membuat komentar pada suatu berita. newsId menunjukkan pada id berita berapa komentar tersebut ditambahkan

```http
POST http://localhost:5003/comments
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "newsId": 13,
    "content": "Great article!"
}
```

### Update Comment
Melakukan edit data komentar yang ditambahkan. tanda {id} diganti dengan nomor id komentar langsung. newsId itu pada berita dengan id berapa mau dilakukan update komentarnya

```http
PUT http://localhost:5003/comments/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "newsId": 1,
    "content": "Updated comment"
}
```

### Delete Comment
melakukan penghapusan komentar. tanda {id} diganti dengan nomor id komentar langsung
```http
DELETE http://localhost:5003/comments/{id}
Authorization: Bearer <token>
```

---

## ❤️ Like Features

### Like News
Melakukan like pada suatu berita. newsId adalah id beerita yang ingin di like oleh User

```http
POST http://localhost:5003/news/liked
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "newsId": 6
}
```

### Get User's Liked News
Menampilkan data like yang dilakukan oleh user. tanda {userId} diganti dengan nomor id user. api ini berfungsi untuk menampilkan history like pada menu history user

```http
GET http://localhost:5003/news/liked/{userId}
Authorization: Bearer <token>
```

### Check Like Status
Menampilkan daftar cek status like, apakah berita dengan newsId di like oleh user tertentu atau tidak

```http
GET http://localhost:5003/news/liked/check/{newsId}
Authorization: Bearer <token>
```

### Get Likes Count for News
Menampilkan jumlah like dalam suatu berita, dengan newsId adalah id berita

```http
GET http://localhost:5003/news/likesCount/{newsId}
Authorization: Bearer <token>
```

### Unlike News
Menghapus like pada berita tertentu. newsId adalah id berita yang ingin dihapus like nya

```http
DELETE http://localhost:5003/news/liked/{newsId}
Authorization: Bearer <token>
```

---

## 📂 Category Features

### Get All Categories
Menampilkan data kategori yang ditambahkan oleh Admin

```http
GET http://localhost:5003/categories
```

### Get Category by ID
Menampilkan data nama kategori berdasarkan id kategori

```http
GET http://localhost:5003/categories/{id}
```

### Create Category (Admin Only)
Membuat kategori baru dengan inputan category : nama kategorinya
```http
POST http://localhost:5003/categories
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "category": "Isu Global"
}
```

### Update Category (Admin Only)
Melakukan edit data nama kategori, dengan mencocokkan id kategori

```http
PUT http://localhost:5003/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
    "category": "Lingkungan"
}
```

### Delete Category (Admin Only)
Menghapus data kategori berdasatkan id kategori
```http
DELETE http://localhost:5003/categories/{id}
Authorization: Bearer <token>
```

---

## 🔐 Authorization Levels

| Feature | User | Admin |
|---------|------|-------|
| Register/Login/Logout | ✅ | ✅ |
| View News | ✅ | ✅ |
| Create/Edit/Delete News | ❌ | ✅ |
| Comment on News | ✅ | ✅ |
| Like News | ✅ | ❌ |
| Manage Categories | ❌ | ✅ |
| Delete Comment | ✅ | ✅ |

---

## 📝 Notes

1. Hampir semua endpoint yang memerlukan autentikasi harus menyertakan JWT token dalam header Authorization
2. Admin memiliki akses penuh untuk mengelola berita, kategori, dan komentar
3. User hanya bisa dapat mengelola komentar mereka sendiri
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