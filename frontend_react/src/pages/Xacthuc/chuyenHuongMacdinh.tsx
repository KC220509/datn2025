// src/pages/TrangChuyenHuongMacDinh/trangChuyenHuongMacDinh.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNguoiDung } from '../../hooks/useNguoiDung';
import TrangChu from '../TrangChu/trangChu'; 

const layDuongDanMacDinhTheoVaiTro = (vaiTros: string[]): string => {
    if (vaiTros.includes('AD')) {
        return '/quan-tri';
    }
    if (vaiTros.includes('PDT')) {
        return '/dao-tao';
    }
    return '/trang-chu'; 
};

const TrangChuyenHuongMacDinh: React.FC = () => {
    const { nguoiDung, dangTai } = useNguoiDung();
    const chuyenhuong = useNavigate();

    useEffect(() => {
        if (!dangTai) {
            if (nguoiDung) {
                const duongDanDich = layDuongDanMacDinhTheoVaiTro(nguoiDung.vai_tro);
                chuyenhuong(duongDanDich, { replace: true }); 
            }
        }
    }, [nguoiDung, dangTai, chuyenhuong]);

    if (dangTai) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Đang tải dữ liệu người dùng...</p>
            </div>
        );
    }
    return <TrangChu />;
};

export default TrangChuyenHuongMacDinh;