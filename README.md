# 📚 EduVault – Study Material Sharing App

EduVault is a full-stack mobile application that enables students to upload, share, and access study materials like PDFs, images, and documents — all in one place.

Built with a modern tech stack, EduVault focuses on simplicity, collaboration, and accessibility for students.

---

## ✨ Features

* 🔐 Secure Authentication (Google & Email)
* 📤 Upload Notes (PDF, Images, Docs)
* 📂 Structured Categorization (Class, Semester, Subject)
* 🔍 Search & Filter Notes
* 📥 Download & View Files
* 🗑 Delete Your Uploads
* 🏆 Reward System (Badges for contributors)
* 🌙 Dark & Light Mode UI
* 🔄 Real-time Refresh & Dynamic UI

---

## 🧠 Problem It Solves

Students often struggle with scattered notes across WhatsApp, Google Drive, and random PDFs.

EduVault provides:

* A **centralized platform**
* Easy **access to study resources**
* A system to **encourage sharing**

---

## 🛠 Tech Stack

### 📱 Frontend

* React Native (Expo)

### 🌐 Backend

* Node.js
* Express.js

### 🗄 Database

* MongoDB

### 🔐 Authentication

* Firebase Authentication

### ☁️ File Storage

* Supabase Storage

---

## 🏗 Architecture

```
React Native App
↓
Firebase (Authentication)
↓
Supabase (File Storage)
↓
Node.js / Express Backend
↓
MongoDB (Metadata Storage)
```

---

## ⚙️ How It Works

1. User logs in using Firebase Authentication
2. Uploads a file (PDF/Image/Doc)
3. File is stored in Supabase Storage
4. Metadata is saved in MongoDB
5. Other users can browse, search, and download notes

---

## 📦 API Endpoints

### Notes

* POST /api/notes → Upload note metadata
* GET /api/notes → Fetch all notes
* DELETE /api/notes/:id → Delete a note

### Users

* POST /api/users → Save user data
* GET /api/users/:uid → Get user details

---

## 📱 Screens

* 🔑 Login Screen
* 📝 Register Screen
* 🏠 Home (Feed + Search + Filters)
* 📤 Upload Screen

---

## 🔐 Security Features

* Firebase-based authentication
* User-based access control (only owner can delete notes)
* Secure file handling via Supabase

---
## ⚙️ Installation & Setup

Follow these steps to run EduVault locally on your system.

---

### 📌 Prerequisites

Make sure you have installed:

* Node.js (v16 or above)
* npm or yarn
* Expo CLI
  ```bash
  npm install -g expo-cli
  ```
* MongoDB (local or Atlas)
* Firebase Project
* Supabase Account

---

### 📥 Clone the Repository

```bash
git clone https://github.com/your-username/eduvault.git
cd eduvault
```

---

## 📱 Frontend Setup (React Native + Expo)

```bash
cd frontend
npm install
```

### ▶️ Start the App

```bash
npx expo start
```

* Scan QR code using Expo Go (Android)
* Or run on emulator

---

## 🌐 Backend Setup (Node + Express)

```bash
cd backend
npm install
```

### ▶️ Start Server

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

### 🔥 Firebase Configuration (Frontend)

Create a config file:

```js
// src/config/firebaseConfig.js
export const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
appId: "YOUR_APP_ID"
};
```

---

### ☁️ Supabase Configuration

Add your Supabase credentials:

```js
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📂 Folder Structure

```
eduvault/
│
├── frontend/        # React Native App
├── backend/         # Node.js API
├── README.md
```

---

## 🚀 Running the App

1. Start backend server
2. Start Expo frontend
3. Login using Firebase
4. Upload & access notes 🎉

---

## ⚠️ Common Issues

* App not connecting to backend
  → Check BASE_URL (use local IP instead of localhost)

* Expo app crashing
  → Clear cache
  ```bash
  npx expo start -c
  ```

* Firebase auth not working
  → Check API keys & enabled providers

---

## 📦 Build APK (Optional)

```bash
npx expo build:android
```

Or use:

```bash
npx expo prebuild
npx expo run:android
```

    

---

## 🚀 Future Enhancements

* 📊 Advanced analytics (most downloaded notes)
* 💬 Comments & discussions
* ⭐ Rating system for notes
* 🔔 Notifications
* 📚 Offline downloads

---

## 👨‍💻 Author

Gaurav
B.Tech Electronics & Computer Engineering

---

## 📌 Conclusion

EduVault is a scalable and modular study-sharing platform that demonstrates real-world full-stack development using modern tools and services.

It combines authentication, cloud storage, and database management into a seamless mobile experience.

---



## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](http://gaurav-portfolio-jy3u.onrender.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](http://linkedin.com/in/gauravmehan)



## Authors

- [Gaurav Mehan](http://github.com/goxrav)


## Feedback

If you have any feedback, please reach out to me at gauravjh0827@gmail.com

