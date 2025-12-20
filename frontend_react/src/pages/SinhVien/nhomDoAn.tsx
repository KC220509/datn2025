import './trangSinhVien.css';
import { useEffect, useState } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';
import { useNguoiDung } from '../../hooks/useNguoiDung';
import { useNavigate } from 'react-router-dom';




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
    hoc_ham_hoc_vi: string;
    nguoi_dung: NguoiDung;
}

interface SinhVien {
    id_sinhvien: string;
    msv: string;
    nguoi_dung: NguoiDung;
}


interface NhomDoAn{
    id_nhom: string;
    ma_nguoitao: string;
    hoc_ky: HocKy;
    ten_nhom: string;
    sinh_viens: SinhVien[];
    nguoi_tao: GiangVien;
}

const NhomDoAn = () => {
    const { nguoiDung } = useNguoiDung();

    
    const navigate = useNavigate();

    const [dsNhom, setDsNhom] = useState<NhomDoAn[]>([]);
    
    const layDsNhom = async () => {
        try {
            const phanhoi = await ketNoiAxios.get('/sv/ds-nhom');
            
            if(phanhoi.data.trangthai){
                setDsNhom(phanhoi.data.ds_nhom); 
            }
        }catch(error){
            console.error('Lỗi khi lấy danh sách nhóm:', error);
        }
    }

    useEffect(() => {
        if (nguoiDung) {
            layDsNhom();
        }else{
            setDsNhom([]);
        }
    }, [nguoiDung]);

    return (
        <div className="trang-nhom-do-an flex-col">
            <div className="khung-chucnang-top flex-row">
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiemNhom">Tìm kiếm</label>
                    <input type="text" id="timKiemNhom" placeholder="Nhập tên nhóm muốn tìm..." />
                </div>
            </div>
            <div className="danhsach-nhom-doan">
                <table className="bang-ds-nhom">
                    <thead>
                        <tr>
                            <th className='cot-stt'>STT</th>
                            <th className='cot-tennhom'>Tên Nhóm</th>
                            <th className='cot-tengvhd'>Tên GVHD</th>
                            <th className='cot-soluong'>Số Lượng</th>     
                            <th className='cot-hocky'>Học Kỳ</th>     
                            <th className='cot-chucnang'>Chức Năng</th>
                        </tr>
                    </thead>
                    {dsNhom.length > 0 ? ( 
                        <tbody>
                            {dsNhom.map((nhom, index) => ( 
                                <tr key={nhom.id_nhom}>
                                    <td className='cot-stt'>{index + 1}</td>
                                    <td className='cot-tennhom'>{nhom.ten_nhom}</td>
                                    <td className='cot-tengvhd'>{nhom.nguoi_tao.nguoi_dung.ho_ten}</td>
                                    <td className='cot-soluong'>{nhom.sinh_viens.length}</td>
                                    <td className='cot-hocky'>{nhom.hoc_ky.ten_hoc_ky}</td>
                                    <td className='cot-chucnang chuc-nang-nhom flex-row'>
                                        <span className="nut-chuc-nang xem-nhom" 
                                            onClick={() => navigate(`/nhom-chat/chi-tiet-nhom/${nhom.id_nhom}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Xem
                                        </span>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>
                                    Hiện tại sinh viên chưa tham gia nhóm nào.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}

export default NhomDoAn;