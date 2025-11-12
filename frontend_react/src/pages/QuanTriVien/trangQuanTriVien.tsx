import { useEffect, useMemo, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";

const TrangQuanTriVien = () => {
    interface Khoa {
        id_khoa: number;
        ten_khoa: string;
    }

    interface Nganh {
        id_nganh: number;
        ten_nganh: string;
        ma_khoa: number;
    }

    interface Lop {
        id_lop: number;
        ten_lop: string;
        ma_nganh: number;
    }

    interface HocKy {
        id_hocky: number;
        ten_hoc_ky: string;
    }
    interface NguoiDung{
        id_nguoidung: number;
        email: string;
        ho_ten: string;
        vai_tro: string[];
    }

    interface SinhVien{
        id_sinhvien: number;
        ho_ten: string;
        email: string;
        lop: string;
    }

    // const DangTaiDuLieu = () => (
    //     <div style={{ padding: '20px', textAlign: 'center' }}>
    //         <p>Đang tải dữ liệu...</p>
    //     </div>
    // );


    const [dsKhoas, setDsKhoas] = useState<Khoa[]>([]);
    const [dsNganhs, setDsNganhs] = useState<Nganh[]>([]);
    const [dsLops, setDsLops] = useState<Lop[]>([]);
    const [dsHocKys, setDsHocKys] = useState<HocKy[]>([]);
    const [dsSinhViens, setDsSinhViens] = useState<SinhVien[]>([]);
    const [dsNguoiDungs, setDsNguoiDungs] = useState<NguoiDung[]>([]);

    const [locHocKy, setLocHocKy] = useState<string | number>('');
    const [locKhoa, setLocKhoa] = useState<string | number>('');
    const [locNganh, setLocNganh] = useState<string | number>('');
    const [locLop, setLocLop] = useState<string | number>('');
    // const [dangTaiDuLieuLoc, setDangTaiDuLieuLoc] = useState(true);

    const fecthDataDanhSachNguoiDung = async () => {
        // Gọi API để lấy dữ liệu người dùng
        const nguoidungData = await ketNoiAxios.get('/admin/ds-nguoidung');
        if (!nguoidungData.data.trangthai) {
            console.error('Lỗi khi lấy dữ liệu người dùng');
            return;
        }
        setDsNguoiDungs(nguoidungData.data.ds_nguoidung);
    };

    const fecthDataHocKy = async () => {
        try {
            const hocKyData = await ketNoiAxios.get('/admin/ds-hocky');
            if (!hocKyData.data.trangthai) {
                console.error('Lỗi khi lấy dữ liệu học kỳ');
                return;
            }
            setDsHocKys(hocKyData.data.ds_hocky);
        } catch (error) {
            console.error('Lỗi API Học kỳ:', error);
        }
    };

    const fecthDataKhoaNganhLop = async () => {
        
        try {
            const khoaNganhLopData = await ketNoiAxios.get('/admin/ds-khoanganhlop');
            if (khoaNganhLopData.data.trangthai) {
                setDsKhoas(khoaNganhLopData.data.ds_khoa || []);
                setDsNganhs(khoaNganhLopData.data.ds_nganh || []);
                setDsLops(khoaNganhLopData.data.ds_lop || []);
            } else {
                console.error('Lỗi khi lấy dữ liệu khoa, ngành, lớp:', khoaNganhLopData.data.thongbao);
            }
        } catch (error) {
             console.error('Lỗi API Khoa/Ngành/Lớp:', error);
        } 
    };

    const fecthDataSinhVien = async () => {
        try{
            const sinhvienData = await ketNoiAxios.get('/admin/ds-sinhvien');
            if (!sinhvienData.data.trangthai) {
                console.error('Lỗi khi lấy dữ liệu người dùng');
                return;
            }
            setDsSinhViens(sinhvienData.data.ds_sinhvien);
        } catch (error) {
            console.error('Lỗi API Sinh viên:', error);
        }
    };

    useEffect(() => {
        fecthDataDanhSachNguoiDung();
        fecthDataHocKy();
        fecthDataKhoaNganhLop();
        fecthDataSinhVien();
    }, []);


    // ---  LỌC PHỤ THUỘC ---
    const danhSachLopHienThi = useMemo(() => {
        if (!locNganh) {
             
             if (locKhoa && !locNganh) {
                const cacNganhCuaKhoa = dsNganhs.filter(n => n.ma_khoa === locKhoa).map(n => n.id_nganh);
                return dsLops.filter(lop => cacNganhCuaKhoa.includes(lop.ma_nganh));
             }
             return dsLops;
        }
        // Lọc Lớp theo mã ngành đã chọn
        return dsLops.filter(lop => lop.ma_nganh === locNganh);
    }, [locNganh, locKhoa, dsLops, dsNganhs]);

    const danhSachNganhHienThi = useMemo(() => {
        if (!locKhoa) {
            return dsNganhs; 
        }
        return dsNganhs.filter(nganh => nganh.ma_khoa === locKhoa);
    }, [locKhoa, dsNganhs]);

    const xuLyThayDoiKhoa = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLocKhoa(value);
        
        setLocNganh(''); 
        setLocLop('');
    };

    const xuLyThayDoiNganh = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLocNganh(value);
        
        setLocLop('');
    };

    // if (dangTaiDuLieuLoc) {
    //     return <DangTaiDuLieu />;
    // }

    return (
        <>
            <div className="khung-chinh-quantri flex-col">

                <h1 className="tieude-khung">Thống kê tổng quan</h1>
                <div className="khungs-thongke flex-row">
                    <div className="thongke-item">
                        <h3>Người dùng</h3>
                        <p>{dsNguoiDungs.length}</p>
                    </div>
                    <div className="thongke-item">
                        <h3>Giảng viên</h3>
                        <p>{dsNguoiDungs.filter(u => u.vai_tro.includes('GV')).length}</p>
                    </div>
                    <div className="thongke-item">
                        <h3>Sinh viên</h3>
                        <p>{dsNguoiDungs.filter(u => u.vai_tro.includes('SV')).length}</p>
                    </div>
                    <div className="thongke-item">
                        <h3>Đồ án tốt nghiệp</h3>
                        <p>0</p>
                    </div>
                </div>

                <div className="khungs-boloc flex-row">
                    <div className="boloc-item">
                        <label htmlFor="loc-hocky" className="label-boloc">Học kỳ</label>
                        <select id="loc-hocky" className="select-boloc" value={locHocKy} onChange={(e) => setLocHocKy(e.target.value)}>
                            <option value="">Tất cả</option>
                            {dsHocKys.map((hocky) => (
                                <option key={hocky.id_hocky} value={hocky.id_hocky}>{hocky.ten_hoc_ky}</option>
                            ))}
                        </select>
                    </div>
                    <div className="boloc-item">
                        <label htmlFor="loc-khoa" className="label-boloc">Khoa</label>
                        <select id="loc-khoa" className="select-boloc" value={locKhoa} onChange={xuLyThayDoiKhoa}>
                            <option value="">Tất cả</option>
                            {dsKhoas.map((khoa) => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                    <div className="boloc-item">
                        <label htmlFor="loc-nganh" className="label-boloc">Chuyên ngành</label>
                        <select id="loc-nganh" className="select-boloc" value={locNganh} onChange={xuLyThayDoiNganh}>
                            <option value="">Tất cả</option>
                            {danhSachNganhHienThi.map((nganh) => (
                                <option key={nganh.id_nganh} value={nganh.id_nganh}>{nganh.ten_nganh}</option>
                            ))}
                        </select>
                    </div>
                    <div className="boloc-item">
                        <label htmlFor="loc-lop" className="label-boloc">Lớp sinh hoạt</label>
                        <select id="loc-lop" className="select-boloc" value={locLop} onChange={e => setLocLop(e.target.value)}>
                            <option value="">Tất cả</option>
                            {danhSachLopHienThi.map((lop) => (
                                <option key={lop.id_lop} value={lop.id_lop}>{lop.ten_lop}</option>
                            ))}
                        </select>
                    </div>
                        
                </div>

                <div className="bang-ds-nguoidung">
                    <h2 className="tieude-bang">Danh sách người dùng ({dsNguoiDungs.length} người)</h2>
                    <table className="bang-ds-sinhvien">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsNguoiDungs.map((nd) => (
                                <tr key={nd.id_nguoidung}>
                                    <td>{nd.ho_ten}</td>
                                    <td>{nd.email}</td>
                                    <td>
                                        {
                                            (nd.vai_tro && nd.vai_tro.length > 0) 
                                            ? nd.vai_tro.map((vaiTroItem) => vaiTroItem).join(', ') 
                                            : '-'
                                        }
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                            {dsNguoiDungs.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>Không có người dùng nào được tìm thấy.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}   
export default TrangQuanTriVien;