
import { useEffect, useState } from 'react';
import './trangGiangVien.css'
import ketNoiAxios from '../../tienichs/ketnoiAxios';
import { useNguoiDung } from '../../hooks/useNguoiDung';


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

interface NhomDoAn{
    id_nhom: string;
    ma_nguoitao: string;
    ma_sinhvien: string;
    ten_nhom: string;
}



const DanhSachNhom = () => {
    const { nguoiDung } = useNguoiDung();

    const [danhSachNhom, setDanhSachNhom] = useState<NhomDoAn[]>([]);

    useEffect(() => {
        if (nguoiDung?.id_nguoidung) {
            layDanhSachNhom(String(nguoiDung.id_nguoidung));
        }
    }, [nguoiDung]);

    const layDanhSachNhom = async (id_giangvien: string) => {
        try {
            const phanhoi = await ketNoiAxios.get(`/gv/ds-nhom/${id_giangvien}`);
            
            if(phanhoi.data.trangthai){

                setDanhSachNhom(phanhoi.data.ds_nhom);
            }
        }catch(error){
            console.error('Lỗi khi lấy danh sách nhóm:', error);
        }
    }


    return (
        
        <div className="khung-ds-nhom-doan flex-col">
            <div className="khung-chucnang-top flex-row">
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiemNhom">Tìm kiếm</label>
                    <input type="text" id="timKiemNhom" placeholder="Nhập tên nhóm muốn tìm..." />
                </div>
                <span className="nut-tao-nhom">Thêm Nhóm Mới</span>
            </div>

            <div className="danhsach-nhom-doan">
                <table className="bang-ds-nhom">
                    <thead>
                        <tr>
                            <th className='cot-stt'>STT</th>
                            <th className='cot-tennhom'>Tên Nhóm</th>
                            <th className='cot-soluong'>SL Thành Viên</th>
                            <th className='cot-chucnang'>Chức Năng</th>
                        </tr>
                    </thead>
                    {danhSachNhom.length > 0 ? (
                    <tbody>
                        {danhSachNhom.map((nhom, index) => (
                            <tr>
                                <td className='cot-stt'>{index + 1}</td>
                                <td className='cot-tennhom'>{nhom.ten_nhom}</td>
                                <td className='cot-soluong'>{nhom.ma_sinhvien.length}</td>
                                <td className='cot-chucnang chuc-nang-nhom flex-row'>
                                    <span className="nut-chuc-nang xem-nhom">Xem</span>
                                    <span className="nut-chuc-nang sua-nhom">Sửa</span>
                                    <span className="nut-chuc-nang xoa-nhom">Xóa</span>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '10px' }}>
                                    Hiện tại giảng viên chưa tạo nhóm nào.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}

export default DanhSachNhom;