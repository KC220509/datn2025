// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import thư viện Auth
import { getDatabase } from "firebase/database"; // Import thư viện Realtime Database
// import { getAnalytics } from "firebase/analytics"; // Tùy chọn: Bỏ qua Analytics nếu không cần

const firebaseConfig = {
    apiKey: "AIzaSyDMYHlUwdgfziEoSqaCSYzkDlvhfNzb4nA",
    authDomain: "he-thong-ho-tro-datn2025.firebaseapp.com",
    databaseURL: "https://he-thong-ho-tro-datn2025-default-rtdb.firebaseio.com",
    projectId: "he-thong-ho-tro-datn2025",
    storageBucket: "he-thong-ho-tro-datn2025.firebasestorage.app",
    messagingSenderId: "740748841858",
    appId: "1:740748841858:web:a0badaad106cd9fac3f59b",
    measurementId: "G-GSYH99PEVP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
