import { useContext } from "react";
import { NguoiDungContext } from "../context/nguoidungContext.tsx";


export const useNguoiDung = () => {
    const context = useContext(NguoiDungContext);
    if (!context) {
        throw new Error("useNguoiDung phải được dùng trong NguoiDungProvider");
    }
    return context; 
};