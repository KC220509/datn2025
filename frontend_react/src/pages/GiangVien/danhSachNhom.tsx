import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    hoc_ky: HocKy;
    ten_nhom: string;
    sinh_viens: SinhVien[];
}

// interface ThanhVienNhom{
//     id_thanhviennhom: string;
//     nhom_do_an: NhomDoAn;
//     sinh_vien: SinhVien;
// }


const DanhSachNhom = () => {
    const { nguoiDung } = useNguoiDung();
    const navigate = useNavigate();

    const [dsNhom, setDsNhom] = useState<NhomDoAn[]>([]);
    
    const layDsNhom = async () => {
        try {
            const phanhoi = await ketNoiAxios.get('/gv/ds-nhom');
            
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

    // Việc tạo nhóm
    const [hienThiFormTaoNhom, setHienThiFormTaoNhom] = useState<boolean>(false); 
    
    const [tenNhomMoi, setTenNhomMoi] = useState<string>(''); 
    const [dsHocKyGv, setDsHocKyGv] = useState<HocKy[]>([]);
    const [idHocKyDuocChon, setIdHocKyDuocChon] = useState<string | null>(null); 
    const [danhSachSvPc, setDanhSachSvPc] = useState<PhanCong[]>([]); 
    const [dsIdSinhVienDuocChon, setDsIdSinhVienDuocChon] = useState<Set<string>>(new Set()); 
    
    const [trangHienTai, setTrangHienTai] = useState<number>(1);
    const phanTuMoiTrang: number = 5;
    
    const [dangTaoNhom, setDangTaoNhom] = useState<boolean>(false); 


    

    useEffect(() => {
        if (nguoiDung && nguoiDung.hoc_kys) {
            setDsHocKyGv(nguoiDung?.hoc_kys);
        }else{
            setDsHocKyGv([]);
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


    const danhSachSvPcDaLoc = useMemo(() => {
            let ketQua = [...danhSachSvPc];
    
            if (idHocKyDuocChon) {
                ketQua = ketQua.filter(pc => pc.hoc_ky.id_hocky === idHocKyDuocChon);
                setTrangHienTai(1);
            }
    
            
    
            return ketQua;
    }, [danhSachSvPc, idHocKyDuocChon]);

    const xuLyChonSinhVien = (idSinhVien: string) => { 
        setDsIdSinhVienDuocChon(prev => { 
            const newSet = new Set(prev);
            if (newSet.has(idSinhVien)) {
                newSet.delete(idSinhVien);
            } else {
                newSet.add(idSinhVien);
            }
            return newSet;
        });
    };

     const lamMoiKhungTao = () => {
        setHienThiFormTaoNhom(false);
        setTenNhomMoi('');
        setIdHocKyDuocChon(null);
        setDsIdSinhVienDuocChon(new Set()); 
        setTrangHienTai(1);
    };

    
    const xuLyTaoNhom = async () => { 
        if (!tenNhomMoi.trim() || !idHocKyDuocChon) { 
            alert('Vui lòng điền đủ thông tin.');
            return;
        }

        setDangTaoNhom(true); 
        try {
            const phanhoi = await ketNoiAxios.post('/gv/tao-nhom', {
                ten_nhom: tenNhomMoi, 
                ma_hocky: idHocKyDuocChon, 
                sinh_vien_ids: Array.from(dsIdSinhVienDuocChon)
            });

            if (phanhoi.data.trangthai) {
                alert(phanhoi.data.thongbao);

                lamMoiKhungTao();
                layDsNhom(); 
            } else {
                alert(`Tạo nhóm thất bại: ${phanhoi.data.thongbao || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
            alert('Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại.');
        } finally {
            setDangTaoNhom(false);
        }
    };

    const chuyenTrang = (soTrang: number) => setTrangHienTai(soTrang); 
   

    useEffect(() => {
        layDanhSachSvPc();
    }, []); 


    const chiSoSinhVienCuoi = trangHienTai * phanTuMoiTrang; 
    const chiSoSinhVienDau = chiSoSinhVienCuoi - phanTuMoiTrang; 
    
    const dsPhanCongHienTai = useMemo(() => danhSachSvPcDaLoc.slice(chiSoSinhVienDau, chiSoSinhVienCuoi), [danhSachSvPcDaLoc, chiSoSinhVienDau, chiSoSinhVienCuoi]); 
    
    const tongSoTrang = Math.ceil(danhSachSvPcDaLoc.length / phanTuMoiTrang); 


   

    return (
        
        <div className="khung-ds-nhom-doan flex-col">
            <div className="khung-chucnang-top flex-row">
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiemNhom">Tìm kiếm</label>
                    <input type="text" id="timKiemNhom" placeholder="Nhập tên nhóm muốn tìm..." />
                </div>
                <span className="nut-tao-nhom" onClick={() => {
                    setHienThiFormTaoNhom(true);
                    setTenNhomMoi('');
                    setIdHocKyDuocChon(null);
                    setDsIdSinhVienDuocChon(new Set());
                    setTrangHienTai(1);
                }}>Tạo Nhóm</span>
            </div>

            {hienThiFormTaoNhom && ( 
                <div className="lop-phu-khung">
                    <div className="khung-tao-nhom">
                        <h3 className="tieude-khung">Tạo Nhóm Mới</h3>
                        <div className="khung-nhom">
                            <label htmlFor="tenNhomMoi">Tên Nhóm <span style={{color: 'red'}}>*</span></label>
                            <input
                                type="text"
                                id="tenNhomMoi"
                                value={tenNhomMoi} 
                                onChange={(e) => setTenNhomMoi(e.target.value)} 
                                placeholder="Nhập tên nhóm..."
                            />
                        </div>
                        <div className="khung-nhom">
                            <label htmlFor="chonHocKy">Chọn Học Kỳ <span style={{color: 'red'}}>*</span></label>
                            <select
                                id="chonHocKy"
                                value={idHocKyDuocChon || ''} 
                                onChange={(e) => setIdHocKyDuocChon(e.target.value)} 
                            >
                                <option value="">-- Chọn học kỳ --</option>
                                {dsHocKyGv.map(hk => ( 
                                    <option key={hk.id_hocky} value={hk.id_hocky}>{hk.ten_hoc_ky}</option>
                                ))}
                            </select>
                        </div>

                        {idHocKyDuocChon && ( 
                            <div className="danhsach-sinhvien-phutrach">
                                <h4 className="tieude-sinhvien">Danh sách sinh viên phụ trách trong học kỳ đã chọn:</h4>
                                {danhSachSvPc.length > 0 ? ( 
                                    <>
                                        <table className="bang-ds-sinhvien">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={dsIdSinhVienDuocChon.size === danhSachSvPcDaLoc.length && danhSachSvPcDaLoc.length > 0} 
                                                            onChange={(e => {
                                                                if (e.target.checked) {
                                                                    setDsIdSinhVienDuocChon(new Set(danhSachSvPcDaLoc.map(pc => pc.sinh_vien.id_sinhvien)));
                                                                } else {
                                                                    setDsIdSinhVienDuocChon(new Set());
                                                                }
                                                            })}
                                                        />
                                                    </th>
                                                    <th>STT</th>
                                                    <th>Mã SV</th>
                                                    <th>Họ Tên</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dsPhanCongHienTai.map((pc, index) => ( 
                                                    <tr key={pc.sinh_vien.id_sinhvien}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={dsIdSinhVienDuocChon.has(pc.sinh_vien.id_sinhvien)} 
                                                                onChange={() => xuLyChonSinhVien(pc.sinh_vien.id_sinhvien)} 
                                                            />
                                                        </td>
                                                        <td>{chiSoSinhVienDau + index + 1}</td>
                                                        <td>{pc.sinh_vien.msv}</td>
                                                        <td>{pc.nguoi_dung_sinh_vien.ho_ten}</td>
                                                        <td>{pc.nguoi_dung_sinh_vien.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {tongSoTrang > 1 && (
                                            <div className="phan-trang-svpc">
                                                {Array.from({ length: tongSoTrang }, (_, i) => ( 
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => chuyenTrang(i + 1)} 
                                                        className={trangHienTai === i + 1 ? 'active' : ''}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Hiện không có sinh viên nào được phân công hướng dẫn.</p>
                                )}
                            </div>
                        )}

                        <div className="khung-hanhdong">
                            <button className="nut-tao-nhom" onClick={xuLyTaoNhom} disabled={dangTaoNhom}> 
                                {dangTaoNhom ? 'Đang tạo...' : 'Tạo Nhóm'} 
                            </button>
                            <button className="nut-huy" onClick={() => lamMoiKhungTao()} disabled={dangTaoNhom}>Hủy</button> 
                        </div>
                    </div>
                </div>
            )}

            <div className="danhsach-nhom-doan">
                <table className="bang-ds-nhom">
                    <thead>
                        <tr>
                            <th className='cot-stt'>STT</th>
                            <th className='cot-tennhom'>Tên Nhóm</th>
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
                                    <td className='cot-soluong'>{nhom.sinh_viens.length}</td>
                                    <td className='cot-hocky'>{nhom.hoc_ky.ten_hoc_ky}</td>
                                    <td className='cot-chucnang chuc-nang-nhom flex-row'>
                                        <span 
                                            className="nut-chuc-nang xem-nhom" 
                                            onClick={() => navigate(`/nhom-chat/chi-tiet-nhom/${nhom.id_nhom}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Chi tiết nhóm
                                        </span>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>
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