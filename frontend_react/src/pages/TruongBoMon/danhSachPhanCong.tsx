
import { useState, useEffect, useMemo } from "react";

import './trangTruongBoMon.css';

import ketNoiAxios from "../../tienichs/ketnoiAxios";
import { useNguoiDung } from "../../hooks/useNguoiDung";
import { xuatTepCSV } from "../../tienichs/xuatExcel";


interface HocKy {
    id_hocky: string;
    ten_hoc_ky: string;
}

interface NguoiDung {
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    trang_thai: boolean;
}

interface GiangVien {
    id_giangvien: string;
    nguoi_dung: NguoiDung;
    hoc_ham_hoc_vi: string;
}

interface SinhVien {
    id_sinhvien: string;
    msv: string;
    nguoi_dung: NguoiDung;
}

interface PhanCong {
    id_phancong: string;
    giang_vien: GiangVien;
    sinh_vien: SinhVien;
    hoc_ky: HocKy;
    nguoi_dung_giang_vien: NguoiDung;
    nguoi_dung_sinh_vien: NguoiDung;
}

const DanhSachPhanCong = () => {
    const { nguoiDung } = useNguoiDung();

    const [dsPhanCong, setDsPhanCong] = useState<PhanCong[]>([]);
    const [hocKyLoc, setHocKyLoc] = useState<string>('');
    const [timKiem, setTimKiem] = useState<string>('');

    const [trangHienTai, setTrangHienTai] = useState<number>(1);
    const phanTuMoiTrang = 10;
    const [dsHocKy, setDsHocKy] = useState<HocKy[]>([]);

    useEffect(() => {
        if (nguoiDung?.id_nguoidung) {
            layDsPhanCong(String(nguoiDung.id_nguoidung));
            if (nguoiDung.hoc_kys) {
                setDsHocKy(nguoiDung.hoc_kys);
            }
        }
    }, [nguoiDung]);

    const layDsPhanCong = async (id_tbm: string) => {
        try {
            const response = await ketNoiAxios.get(`/tbm/ds-phancong/${id_tbm}`);
            if (response.data.ds_phancong) {
                setDsPhanCong(response.data.ds_phancong);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân công:", error);
        }
    };

    const phanCongDaLoc = useMemo(() => {
        let ketQua = [...dsPhanCong];

        if (hocKyLoc) {
            ketQua = ketQua.filter(pc => pc.hoc_ky.id_hocky === hocKyLoc);
            setTrangHienTai(1);
        }

        if (timKiem) {
            const tk = new RegExp(timKiem, 'i');
            ketQua = ketQua.filter(pc =>
                tk.test(pc.nguoi_dung_giang_vien?.ho_ten) ||
                tk.test(pc.nguoi_dung_sinh_vien?.ho_ten) ||
                tk.test(pc.sinh_vien?.msv)
            );
        }

        return ketQua;
    }, [dsPhanCong, hocKyLoc, timKiem]);

    const soTrang = Math.ceil(phanCongDaLoc.length / phanTuMoiTrang);
    const phanCongTrangHienTai = useMemo(() => {
        const startIndex = (trangHienTai - 1) * phanTuMoiTrang;
        const endIndex = startIndex + phanTuMoiTrang;
        return phanCongDaLoc.slice(startIndex, endIndex);
    }, [phanCongDaLoc, trangHienTai, phanTuMoiTrang]);

    const chuyenTrang = (trang: number) => {
        setTrangHienTai(trang);
    };

    const xuatDanhSach = () => {
        const data = phanCongDaLoc.map(pc => ({
            STT: '', 
            GiangVien: pc.nguoi_dung_giang_vien.ho_ten,
            SinhVien: pc.nguoi_dung_sinh_vien.ho_ten,
            MSV: pc.sinh_vien.msv,
            HocKy: pc.hoc_ky.ten_hoc_ky
        }));

        // Điền STT
        data.forEach((item, index) => {
            item.STT = (index + 1).toString();
        });

        xuatTepCSV(data, 'danh_sach_phan_cong.csv');
    };

    return (
        <div className="danh-sach-phan-cong flex-col">
            <div className="khung-chucnang flex-row">
                <div className="khung-chon-hocky flex-row">
                    <label htmlFor="hocKyLoc">Chọn Học Kỳ:</label>
                    <select
                        id="hocKyLoc"
                        value={hocKyLoc}
                        onChange={(e) => setHocKyLoc(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        {dsHocKy.map(hk => (
                            <option key={hk.id_hocky} value={hk.id_hocky}>{hk.ten_hoc_ky}</option>
                        ))}
                    </select>
                </div>
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiem">Tìm kiếm:</label>
                    <input
                        type="text"
                        id="timKiem"
                        placeholder="Tìm kiếm giảng viên, sinh viên, ..."
                        value={timKiem}
                        onChange={(e) => setTimKiem(e.target.value)}
                    />
                </div>
            </div>

            <div className="khung-danhsach">
                <table className="bang-ds">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Giảng Viên</th>
                            <th>Sinh Viên</th>
                            <th>Mã SV</th>
                            <th>Học Kỳ</th>
                        </tr>
                    </thead>
                    {phanCongTrangHienTai.length > 0 ? (
                        <tbody>
                            {phanCongTrangHienTai.map((pc, index) => (
                                <tr key={pc.id_phancong}>
                                    <td>{(trangHienTai - 1) * phanTuMoiTrang + index + 1}</td>
                                    <td style={{textAlign: 'left'}}>{pc.nguoi_dung_giang_vien.ho_ten}</td>
                                    <td style={{textAlign: 'left'}}>{pc.nguoi_dung_sinh_vien.ho_ten}</td>
                                    <td>{pc.sinh_vien.msv}</td>
                                    <td>{pc.hoc_ky.ten_hoc_ky}</td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={5} style={{textAlign: 'center'}}>Hiện không có phân công nào.</td>
                            </tr>
                        </tbody>
                    )}

                </table>
            </div>

            <div className="khung-dieukhien flex-row">
                <div className="khung-phantrang flex-row">
                    {Array.from({ length: soTrang }, (_, i) => i + 1).map(trang => (
                        <button
                            key={trang}
                            onClick={() => chuyenTrang(trang)}
                            className={trangHienTai === trang ? 'active' : ''}
                        >
                            {trang}
                        </button>
                    ))}
                </div>

                <button className="nut-xuat-excel" onClick={xuatDanhSach}>Xuất Excel</button>
            </div>
        </div>
    );
}
 
 export default DanhSachPhanCong;

