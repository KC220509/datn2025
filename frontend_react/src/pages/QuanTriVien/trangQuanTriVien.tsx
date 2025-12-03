import { useCallback, useEffect, useMemo, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";

const TrangQuanTriVien = () => {
    interface Khoa {
        id_khoa: string;
        ten_khoa: string;
    }

    interface Nganh {
        id_nganh: string;
        ma_khoa: string;
        ten_nganh: string;
        ky_hieu: string;
    }

    interface Lop {
        id_lop: string;
        ma_nganh: string;
        ten_lop: string;
    }

    interface HocKy {
        id_hocky: string;
        ten_hoc_ky: string;
    }

    interface VaiTro{
        id_vaitro: string;
        ten_hien_thi: string;
        mo_ta: string;
    }

    interface NguoiDung{
        id_nguoidung: string;
        email: string;
        ho_ten: string;
        nganh: Nganh;
        id_hocky: string; 
        ten_hoc_ky: string; 
        vai_tros: VaiTro[];
        hoc_kys?: HocKy[];
        sinh_vien: SinhVien;
    }

    interface SinhVien{
        id_sinhvien: string;
        msv: string;
        nguoidung: NguoiDung;
        lop: Lop;
    }



    const [dsKhoas, setDsKhoas] = useState<Khoa[]>([]);
    const [dsNganhs, setDsNganhs] = useState<Nganh[]>([]);
    const [dsLops, setDsLops] = useState<Lop[]>([]);
    const [dsHocKys, setDsHocKys] = useState<HocKy[]>([]);
    const [dsNguoiDungs, setDsNguoiDungs] = useState<NguoiDung[]>([]);

    const [locHocKy, setLocHocKy] = useState<string | number>('');
    const [locKhoa, setLocKhoa] = useState<string | number>('');
    const [locNganh, setLocNganh] = useState<string | number>('');
    const [locLop, setLocLop] = useState<string | number>('');

    const fecthDataDanhSachNguoiDung = useCallback(async () => {
        // Gọi API để lấy dữ liệu người dùng
        const nguoidungData = await ketNoiAxios.get('/admin/ds-nguoidung');
        if (!nguoidungData.data.trangthai) {
            console.error('Lỗi khi lấy dữ liệu người dùng');
            return;
        }
        const dsGoc = nguoidungData.data.ds_nguoidung;

        const phanTach = dsGoc.flatMap((nguoiDung: NguoiDung) => {
            const hocKys = nguoiDung.hoc_kys && nguoiDung.hoc_kys.length > 0 ? nguoiDung.hoc_kys : [{ id_hocky: '', ten_hoc_ky: '-' }];

            return hocKys.map((hk: HocKy) => ({
                ...nguoiDung,
                id_hocky: hk.id_hocky,
                ten_hoc_ky: hk.ten_hoc_ky,
            }));
        });
        setDsNguoiDungs(phanTach);
    }, []);

    const fecthDataHocKy = useCallback(async () => {
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
    }, []);

    const fecthDataKhoaNganhLop = useCallback(async () => {
        
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
    }, []);


    useEffect(() => {
        fecthDataDanhSachNguoiDung();
        fecthDataHocKy();
        fecthDataKhoaNganhLop();
    }, [fecthDataDanhSachNguoiDung, fecthDataHocKy, fecthDataKhoaNganhLop]);


    // ---  LỌC PHỤ THUỘC ---
    const danhSachLopHienThi = useMemo(() => {
        if (!locNganh) {
             
             if (locKhoa && !locNganh) {
                const cacNganhCuaKhoa = dsNganhs.filter(n => n.ma_khoa === locKhoa).map(n => n.id_nganh);
                return dsLops.filter(lop => cacNganhCuaKhoa.includes(lop.ma_nganh));
             }
             return dsLops;
        }
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


    // --- LỌC DANH SÁCH NGƯỜI DÙNG ---
    const dsNguoiDungDaLoc = useMemo(() => {
        return dsNguoiDungs.filter(nd => {
            const dieuKienHocKy = !locHocKy || nd.id_hocky == locHocKy;
            const dieuKienKhoa = !locKhoa || (nd.nganh && nd.nganh.ma_khoa === locKhoa);
            const dieuKienNganh = !locNganh || (nd.nganh && nd.nganh.id_nganh === locNganh);
            const dieuKienLop = !locLop || (nd.sinh_vien && nd.sinh_vien.lop && nd.sinh_vien.lop.id_lop === locLop);

            return dieuKienHocKy && dieuKienKhoa && dieuKienNganh && dieuKienLop;
        });
    }, [dsNguoiDungs, locHocKy, locKhoa, locNganh, locLop]);


    useEffect(() => {
        setTrangHienTai(1);
    }, [locHocKy, locKhoa, locNganh, locLop]);

    // Xử lý phân trang 
    const [trangHienTai, setTrangHienTai] = useState(1);
    const phanTuMoiTrang = 10;

    const indexCuoiCung = trangHienTai * phanTuMoiTrang;
    const indexDauTien = indexCuoiCung - phanTuMoiTrang;
    const dsNguoiDungHienThi = dsNguoiDungDaLoc.slice(indexDauTien, indexCuoiCung);
    const tongSoTrang = Math.ceil(dsNguoiDungDaLoc.length / phanTuMoiTrang);
    const xyLyChuyenTrang = (soTrang: number) => {
        setTrangHienTai(soTrang);
    };

    const phanTrang = () => {
        const trangSos = [];
        for (let i = 1; i <= tongSoTrang; i++) {
            trangSos.push(i);
        }

        return trangSos.map((trang) => (
            <button
                key={trang}
                className={`nut-phantrang ${trangHienTai === trang ? 'active' : ''}`}
                onClick={() => xyLyChuyenTrang(trang)}
            > 
                {trang}
            </button>
        ));
    };

    return (
        <>
            <div className="trang-quantri flex-col">

                <h1 className="tieude-trang">Thống kê tổng quan</h1>
                <div className="khungs-thongke flex-row">
                    <div className="thongke-item">
                        <h3>Người dùng</h3>
                        <p>{new Set(dsNguoiDungs.map(u => u.email)).size}</p>
                    </div>
                    <div className="thongke-item">
                        <h3>Sinh viên</h3>
                        <p>
                            {new Set(
                                dsNguoiDungs
                                    .filter(u => u.vai_tros.some(vt => vt.id_vaitro === 'SV'))
                                    .map(u => u.email)
                                ).size
                            }
                        </p>
                    </div>
                    <div className="thongke-item">
                        <h3>Giảng viên</h3>
                        <p>
                            {new Set(
                                dsNguoiDungs
                                    .filter(u => u.vai_tros.some(vt => vt.id_vaitro === 'GV'))
                                    .map(u => u.email)
                                ).size
                            }
                        </p>
                    </div>
                    <div className="thongke-item">
                        <h3>Trưởng Bộ Môn</h3>
                        <p>
                            {new Set(
                                dsNguoiDungs
                                    .filter(u => u.vai_tros.some(vt => vt.id_vaitro === 'TBM'))
                                    .map(u => u.email)
                                ).size
                            }
                        </p>
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

                <div className="bang-ds-nguoidung flex-col">
                    <h2 className="tieude-bang">Danh sách người dùng</h2>
                    <table className="bang-ds-nguoidung-chitiet">
                        <thead>
                            <tr>
                                <th className="col-stt">STT</th>
                                <th className="col-hoten">Họ tên</th>
                                <th className="col-email">Email</th>
                                <th className="col-nganh">Chuyên Ngành</th>
                                <th className="col-lop">Lớp</th>
                                <th className="col-hocky">Học Kỳ</th>
                                <th className="col-vaitro">Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsNguoiDungHienThi && dsNguoiDungHienThi.length > 0 ? (
                                dsNguoiDungHienThi.map((nd, index) => (
                                    <tr key={nd.id_nguoidung + index}>
                                        <td className="col-stt">{index + 1}</td>
                                        <td className="col-hoten" title={nd.ho_ten}>{nd.ho_ten}</td>
                                        <td className="col-email" title={nd.email}>{nd.email}</td>
                                        <td className="col-nganh">{nd.nganh?.ten_nganh}</td>
                                        <td className="col-lop">{nd.sinh_vien?.lop?.ten_lop}</td>
                                        <td className="col-hocky">{nd.ten_hoc_ky}</td>
                                        <td className="col-vaitro">
                                            {
                                                (nd.vai_tros && nd.vai_tros.length > 0) 
                                                ? nd.vai_tros.map((vaiTroItem) => vaiTroItem.id_vaitro).join(', ') 
                                                : '-'
                                            }
                                        </td>
                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>Không có người dùng nào được tìm thấy.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {dsNguoiDungHienThi && dsNguoiDungHienThi.length > 0 ? (
                        <div className="khung-phantrang flex-row">
                        <button className={`nut-phantrang truoc ${trangHienTai === 1 ? "disabled" : ""}`}
                            onClick={() => xyLyChuyenTrang(trangHienTai > 1 ? trangHienTai - 1 : 1)}
                            disabled={trangHienTai === 1}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        {phanTrang()}
                        <button className={`nut-phantrang sau ${trangHienTai === tongSoTrang ? "disabled" : ""}`}
                            onClick={() => xyLyChuyenTrang(trangHienTai + 1)}
                            disabled={trangHienTai === tongSoTrang}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}   
export default TrangQuanTriVien;