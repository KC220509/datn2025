import React, { useState, useEffect, useCallback } from "react";
import ketNoiAxios from "../tienichs/ketnoiAxios";

import { NguoiDungContext, type NguoiDungContextKieu } from "./nguoidungContext";

interface NguoiDung {
    id_nguoidung: number;
    ho_ten: string;
    email: string;
    vai_tro: string[];

}



export const NguoiDungProvider: React.FC<{ noiDungCon: React.ReactNode }> = ({ noiDungCon }) => {
    const [nguoiDung, setNguoiDung] = useState<NguoiDung | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [dangTai, setDangTai] = useState<boolean>(true);


    // Hàm đăng nhập
    const dangNhap = async (email: string, matKhau: string, ghiNho: boolean): Promise<NguoiDung> => {
        try {
            const res = await ketNoiAxios.post("/dang-nhap", { email, mat_khau: matKhau });

            if (!res.data.trangthai) {
                throw new Error(res.data.thongbao || "Đăng nhập thất bại");
            }

            const tokenMoi = res.data.token;
            const nguoiDungApi: NguoiDung = {
                ...res.data.nguoi_dung,
                vai_tro: res.data.nguoi_dung.vai_tro 
            };

            if (ghiNho) {
                localStorage.setItem("token", tokenMoi);
            } else {
                sessionStorage.setItem("token", tokenMoi);
            }

            setToken(tokenMoi);
            setNguoiDung(nguoiDungApi);

            return nguoiDungApi;
            // return chuyenHuongMacDinh(nguoiDungApi.vai_tro);
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(err.message);
            } else {
                throw new Error("Đăng nhập thất bại");
            }
        }
    };


    // Hàm đăng xuất
    const dangXuat = useCallback(() => {
        localStorage.removeItem('token'); 
        sessionStorage.removeItem('token'); 
        setToken(null);
        setNguoiDung(null);
        window.location.replace('/dang-nhap');
    }, []);

    useEffect(() => {
        const kiemTraTrangThaiDangNhap = async () => {
            const tokenLuu = localStorage.getItem("token") || sessionStorage.getItem("token");

            let nguoiDungDaKhoiPhuc: NguoiDung | null = null;

            if (tokenLuu) {
                setToken(tokenLuu); 
                ketNoiAxios.defaults.headers.common['Authorization'] = `Bearer ${tokenLuu}`;

                try {
                    const res = await ketNoiAxios.get("/nguoi-dung");
                    nguoiDungDaKhoiPhuc = {
                        ...res.data.nguoi_dung,
                        vai_tro: res.data.nguoi_dung.vai_tro 
                    } as NguoiDung;
                    // setNguoiDung(nguoiDungDaKhoiPhuc);
                } catch (error) {
                    console.error("Lỗi khi xác thực lại người dùng:", error);
                    localStorage.removeItem('token'); 
                    sessionStorage.removeItem('token');
                    setToken(null);
                    setNguoiDung(null);
                }
            }
            setNguoiDung(nguoiDungDaKhoiPhuc);
            setToken(tokenLuu);
            setDangTai(false);
        };

        kiemTraTrangThaiDangNhap(); 
    }, [dangXuat]);
    
    const contextValue: NguoiDungContextKieu = {
        nguoiDung,
        token,
        dangNhap,
        dangXuat,
        dangTai,
    };
    
    return (
        <NguoiDungContext.Provider value={contextValue}>
            {noiDungCon}
        </NguoiDungContext.Provider>
    );
};


