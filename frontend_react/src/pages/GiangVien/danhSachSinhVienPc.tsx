
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
}

interface PhanCong {
    id_phancong: string;
    giang_vien: GiangVien;
    sinh_vien: SinhVien;
    hoc_ky: HocKy;
    nguoi_dung_sinh_vien: NguoiDung;
}




const DanhSachSinhVienPc = () => {

    const { nguoiDung } = useNguoiDung();

    const [danhSachSvPc, setDanhSachSvPc] = useState<PhanCong[]>([]);

    useEffect(() => {
        if(nguoiDung){
            layDanhSachSvPc();
        }
    }, [nguoiDung]);

    const layDanhSachSvPc = async () => {
        try {
            const phanhoi = await ketNoiAxios.get('/gv/ds-sinhvien-pc');
            
            if(phanhoi.data.trangthai){

                setDanhSachSvPc(phanhoi.data.ds_sinhvien_pc);
            }
        }catch(error){
            console.error('Lỗi khi lấy danh sách nhóm:', error);
        }
    }


    return (
        
        <div className="khung-ds-nhom-doan flex-col">
            <div className="khung-chucnang-top flex-row">
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiemSv">Tìm kiếm</label>
                    <input type="text" id="timKiemSv" placeholder="Nhập từ khóa muốn tìm..." />
                </div>
                {/* <span className="nut-tao-nhom">Thêm Nhóm Mới</span> */}
            </div>

            <div className="danhsach-nhom-doan">
                <table className="bang-ds-nhom">
                    <thead>
                        <tr>
                            <th className='cot-stt'>STT</th>
                            <th className='cot-tennhom'>Họ Tên</th>
                            <th className="cot-detai">Đề Tài Đồ Án</th>
                            <th className='cot-soluong'>Mã Sinh Viên</th>
                            <th className="cot-hocky">Học Kỳ</th>
                            <th className='cot-chucnang'>Chức Năng</th>
                        </tr>
                    </thead>
                    {danhSachSvPc.length > 0 ? (
                    <tbody>
                        {danhSachSvPc.map((dspc, index) => (
                            <tr key={dspc.id_phancong}>
                                <td className='cot-stt'>{index + 1}</td>
                                <td className='cot-hoten'>{dspc.nguoi_dung_sinh_vien.ho_ten}</td>
                                <td className='cot-detai'>*Chưa có đề tài*</td>

                                <td className='cot-msv' style={{textAlign: 'center'}}>{dspc.sinh_vien.msv}</td>
                                <td className='cot-hocky' style={{textAlign: 'center'}}>{dspc.hoc_ky.ten_hoc_ky}</td>
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
                                <td colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>
                                    Hiện chưa có sinh viên nào được phân công.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}

export default DanhSachSinhVienPc;