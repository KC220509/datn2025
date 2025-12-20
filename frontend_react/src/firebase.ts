
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth"; 
import { getDatabase } from "firebase/database"; 


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

const auth = getAuth(app);
const db = getDatabase(app);

export const dangNhapFireBase = async (fbtoken: string) => {
    try {
        const thongTinNguoiDung = await signInWithCustomToken(auth, fbtoken);
        console.log("Firebase Auth: Đã kết nối thành công", thongTinNguoiDung.user.uid);
        return thongTinNguoiDung.user;
    } catch (error) {
        console.error("Firebase Auth Error:", error);
        throw error;
    }
};

export const dangXuatFireBase = async () => {
    try {
        await signOut(auth);
        console.log("Firebase Auth: Đã đăng xuất");
    } catch (error) {
        console.error("Firebase Logout Error:", error);
    }
};

export { auth, db};