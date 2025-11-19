import { createContext } from "react";

interface VaiTro {
    id_vaitro: string;
    ten_hien_thi: string;
}

interface NguoiDung {
    id_nguoidung: number;
    ho_ten: string;
    email: string;
    vai_tros: VaiTro[];

}

export interface NguoiDungContextKieu {
    nguoiDung: NguoiDung | null;
    token: string | null;
    dangNhap: (email: string, matKhau: string, ghiNho: boolean) => Promise<NguoiDung>;
    dangXuat: () => void;
    dangTai: boolean; // Trạng thái tải ban đầu
}


export const NguoiDungContext = createContext<NguoiDungContextKieu | undefined>(undefined);