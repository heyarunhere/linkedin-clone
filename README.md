LinkedIn Clone — Full Stack MERN Project
Frontend Live: https://linked-app-arun.netlify.app
Backend API: https://linkedin-clone-wr4q.onrender.com

A full-stack social networking web application inspired by LinkedIn, built using the MERN Stack (MongoDB, Express, React, Node.js).
Users can register, log in, create posts (with or without images), like & comment on others, posts, and view their own profiles — all in real time.

How to Run the Project
1️. Clone the repository
git clone https://github.com/YOURUSERNAME/linkedin-clone.git
cd linkedin-clone

2. Setup Backend (Server)
cd backend
npm install

Create a .env file inside the backend folder:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run the backend:
node server.js

API will start at: http://localhost:5000

3. Setup Frontend
cd frontend
npm install

Create a .env file inside the frontend folder:
REACT_APP_API_URL=http://localhost:5000/api

Run the frontend:
npm start

Frontend will open at: http://localhost:3000

Tech Stack Used:
| Category       | Technology                           |
| -------------- | ------------------------------------ |
| Frontend       | React.js, Axios, CSS                 |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB Atlas                        |
| Authentication | JWT (JSON Web Token)                 |
| Image Upload   | Multer                               |
| Hosting        | Netlify (Frontend), Render (Backend) |

Features Added:
✅ User Authentication — Secure signup & login with JWT.
✅ Create Posts — Users can share text or image posts.
✅ Image Uploads — Uses Multer to handle post images.
✅ Like & Comment System — Users can like or comment on any post.
✅ Profile Page — View your details and your posts.
✅ Responsive UI — Works on both desktop and mobile.
✅ CORS & API Security — Configured for safe cross-origin requests.
✅ Deployed Online — Live frontend & backend hosted for demo.

Folder structure
linkedin-clone/
├── backend/      # Express server + MongoDB + routes + models
└── frontend/       # React frontend + components + pages

Deployment Details
1. Frontend (Netlify)
2. Base Directory: client
3. Build Command: npm run build
4. Publish Directory: client/build
5. Env Variable: REACT_APP_API_URL=https://linkedin-clone-wr4q.onrender.com/api

Backend (Render)
1. Root Directory: backend
2. Build Command: npm install
3. Start Command: node server.js
4. Env Variables:
5. MONGO_URI=your_mongo_uri
   JWT_SECRET=your_secret_key


