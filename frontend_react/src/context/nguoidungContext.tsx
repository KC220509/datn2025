import { createContext } from "react";

interface NguoiDung {
    id_nguoidung: number;
    ho_ten: string;
    email: string;
    vai_tro: string[];

}

export interface NguoiDungContextKieu {
    nguoiDung: NguoiDung | null;
    token: string | null;
    dangNhap: (email: string, matKhau: string, ghiNho: boolean) => Promise<NguoiDung>;
    dangXuat: () => void;
    dangTai: boolean; // Trạng thái tải ban đầu
}


export const NguoiDungContext = createContext<NguoiDungContextKieu | undefined>(undefined);