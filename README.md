# User Management API

Aplikasi backend sederhana berbasis **Node.js + Express + PostgreSQL** yang mengelola data pengguna (User Management).Proyek ini mengimplementasikan autentikasi, validasi, upload avatar, dan dokumentasi API.

🧩 Teknologi yang Digunakan
- Node.js + Express.js  
- PostgreSQL  
- bcrypt.js (untuk hash password)  
- jsonwebtoken (JWT)  
- Cloudinary  
- dotenv (untuk environment variables)  
- Postman (untuk dokumentasi API)

⚙️ Instalasi & Run Project 
- git clone https://github.com/radityarezaf/user_management_api.git
- cd user_management_api
- npm install
- config .env
- npm start

📄 Dokumentasi API (with Postman)
- Post  api/auth/register   -> register new user
- Post  api/auth/login      -> login user
- Get   api/users           -> get all users
- Put   api/users/profile   -> update profile
- Post  api/users/avatar    -> upload avatar
