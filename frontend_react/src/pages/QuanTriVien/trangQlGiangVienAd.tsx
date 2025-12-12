import { useCallback, useEffect, useMemo, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


interface HocKy{
    id_hocky: string;
    ten_hoc_ky: string;
}

interface Nganh{
    id_nganh: string;
    ten_nganh: string;
    ky_hieu: string;
}

interface NguoiDung{
    id_nguoidung: string;
    email: string;
    mat_khau: string;
    ho_ten: string;
    trang_thai: boolean;
    hoc_kys: HocKy[];
    
}

interface GiangVien{
    id_giangvien: string;
    hoc_ham_hoc_vi: string;
    nganh: Nganh;
    nguoi_dung: NguoiDung;
}

const TrangQlGiangVienAd = () => {

    const [dsGiangVien, setDsGiangVien] = useState<GiangVien[]>([]);


    const layDsTkGiangVien = useCallback(async () => {
        try{
            const dsTaiKhoan = await ketNoiAxios.get('/admin/ds-giangvien');

            if (!dsTaiKhoan.data.trangthai){
                console.log('Lấy danh sách tài khoản giảng viên không thành công');
                return;
            }

            setDsGiangVien(dsTaiKhoan.data.ds_giangvien);
        }
        catch (error){
            console.error('Lỗi khi lấy danh sách giảng viên:', error);
        }
    }, []);


    const [dsHocKy, setDsHocKy] = useState<HocKy[]>([]);
    const [id_hocky, setIdHocKy] = useState<string>("");

    const layDsHocKy = useCallback(async () => {
        try{
            const dsHocKys = await ketNoiAxios.get('/admin/ds-hocky');
            if (!dsHocKys.data.trangthai){
                console.log('Lấy danh sách học kỳ không thành công');
                return;
            }
            setDsHocKy(dsHocKys.data.ds_hocky);
        }
        catch (error){
            console.error('Lỗi khi lấy danh sách học kỳ:', error);
        }
    }, []);

    useEffect(() => {
        layDsTkGiangVien();
        layDsHocKy();
    }, [layDsTkGiangVien, layDsHocKy]);



    const [moKhungTaoTk, setMoKhungTaoTk] = useState<boolean>(false);

    const moKhungTaoTkGiangVien = () => {
        setMoKhungTaoTk(true);
    };

    const dongKhungTaoTkGiangVien = () => {
        setMoKhungTaoTk(false);
        setIdHocKy("");
    };



    // Phân trang
    
    const [trangHienTai, setTrangHienTai] = useState(1);
    const phanTuMoiTrang = 10;
    
    const indexCuoiCung = trangHienTai * phanTuMoiTrang;
    const indexDauTien = indexCuoiCung - phanTuMoiTrang;
    const dsGiangVienHienThi = dsGiangVien.slice(indexDauTien, indexCuoiCung);
    const tongSoTrang = Math.ceil(dsGiangVien.length / phanTuMoiTrang);
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

    
    const [trangThaiLoc, setTrangThaiLoc] = useState<boolean>(false);

    const dsGiangVienDaLoc = useMemo(() => {
        return dsGiangVien.filter(sv=> {
            const dieuKienHocKy = id_hocky ? sv.nguoi_dung.hoc_kys && sv.nguoi_dung.hoc_kys.some(hk => hk.id_hocky === id_hocky) : true;
            return dieuKienHocKy;
        });
    }, [dsGiangVien, id_hocky]);

    // Phân trang khi lọc
    const [trangHienTaiLoc, setTrangHienTaiLoc] = useState(1);
    const phanTuMoiTrangLoc = 8;
    
    const indexCuoi = trangHienTaiLoc * phanTuMoiTrangLoc;
    const indexDau = indexCuoi - phanTuMoiTrangLoc;
    const dsGiangVienDaLocHienThi = dsGiangVienDaLoc.slice(indexDau, indexCuoi);
    const tongSoTrangDaLoc = Math.ceil(dsGiangVienDaLoc.length / phanTuMoiTrangLoc);
    const xyLyChuyenTrangLoc = (soTrangLoc: number) => {
        setTrangHienTaiLoc(soTrangLoc);
    };
     const phanTrangDaLoc = () => {
        const trangSos = [];
        for (let i = 1; i <= tongSoTrangDaLoc; i++) {
          trangSos.push(i);
        }

        return trangSos.map((trang) => (
            <button
              key={trang}
              type="button"
              className={`nut-phantrang ${trangHienTaiLoc === trang ? 'active' : ''}`}
              onClick={() => xyLyChuyenTrangLoc(trang)}
            > 
              {trang}
            </button>
        ));
    };
    useEffect(() => {
        if(id_hocky){
            setTrangThaiLoc(true);
        }else{
            setTrangThaiLoc(false);
        }
        setTrangHienTaiLoc(1);
    }, [id_hocky, dsGiangVien]);


    const [thongBao, setThongBao] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [dangTai, setDangTai] = useState<boolean>(false);

    const submitTaoTkGiangVien = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Xử lý tạo tài khoản giảng viên ở đây
        try {
            const  dataTaoTk = await ketNoiAxios.post('/admin/tao-ds-taikhoan-gv', {
                id_hocky: id_hocky,
            });

            if (!dataTaoTk.data.trangthai){
                setThongBao({ message: dataTaoTk.data.thongbao || 'Tạo tài khoản giảng viên không thành công', type: 'error' });
                return;
            }

            setThongBao({ message: dataTaoTk.data.thongbao || 'Tạo tài khoản giảng viên thành công!', type: 'success' });
            layDsTkGiangVien();

            setTimeout(() => {
                dongKhungTaoTkGiangVien();
                setThongBao(null);
            }, 3000);

        } catch (error) {
            console.error('Lỗi khi tạo tài khoản giảng viên:', error);
            setThongBao({ message: 'Lỗi khi tạo tài khoản giảng viên.', type: 'error' });
            setTimeout(() => {
                setThongBao(null);
            }, 3000);
        } finally {
            setDangTai(false);
        }
    }


    return (
        <>
            <div className="trang-qlgiangvien-ad flex-col">
                <h1 className="tieude-trang">Danh Sách Giảng Viên</h1>
                <div className="khung-ql-chucnang flex-row">
                    <div className="khung-tao-taikhoan flex-row">
                        <div className="mokhung tao-dstaikhoan" onClick={moKhungTaoTkGiangVien}>
                            Tạo tài khoản giảng viên
                        </div>
                        <div className="mokhung them-taikhoan">
                            Thêm mới giảng viên
                        </div>
                    </div>
                    <div className="khung-timkiem">
                        <input
                            id="timkiem-gv"
                            name="timkiem-gv"
                            type="text"
                            className="nhap-timkiem"
                            placeholder="Tìm kiếm giảng viên..."
                        />
                        <button className="nut-timkiem">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div className="khung-ds-taikhoan flex-col">
                    <table className="bang-ds-nguoidung-chitiet">
                        <thead>
                            <tr>
                                <th className="col-stt">STT</th>
                                <th className="col-hoten">Họ Tên</th>
                                <th className="col-email">Email</th>
                                <th className="col-matkhau">Mật khẩu</th>
                                <th className="col-hhhv">Học Hàm Học Vị</th>
                                <th className="col-nganh">Ngành</th>
                                <th className="col-chucnang">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsGiangVienHienThi && dsGiangVienHienThi.length > 0 ? (
                                dsGiangVienHienThi.map((gv, index) => (
                                    <tr key={gv.id_giangvien}>
                                        <td className="col-stt">{index + 1}</td>
                                        <td className="col-hoten">{gv.nguoi_dung.ho_ten}</td>
                                        <td className="col-email">{gv.nguoi_dung.email}</td>
                                        <td className="col-matkhau">{gv.nguoi_dung.mat_khau || "Null"}</td>
                                        <td className="col-hhhv">{gv.hoc_ham_hoc_vi}</td>
                                        <td className="col-nganh">{gv.nganh.ky_hieu}</td>
                                        <td className="col-chucnang">
                                            <div className="khung-chucnang">
                                                <button className="nut-chucnang khoa-tk"><i className="bi bi-person-lock"></i></button>
                                                <button className="nut-chucnang sua"><i className="bi bi-pencil-square"></i></button>
                                                <button className="nut-chucnang xoa"><i className="bi bi-x-square"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                        Không có giảng viên để hiển thị.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {dsGiangVienHienThi && dsGiangVienHienThi.length > 0 ? (
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
                {moKhungTaoTk &&
                    <div className="mokhung-tao-tksinhvien">
                        <form onSubmit={submitTaoTkGiangVien} method="post" className="khung-tao-tksinhvien flex-col">
                            <h2 className="tieude-khungtao">Tạo tài khoản giảng viên</h2>
                            {thongBao && (
                                <div className={`thongbao ${thongBao.type === 'success' ? 'thongbao-thanhcong' : 'thongbao-thatbai'}`}>
                                    {thongBao.message}
                                </div>
                            )}
                            <div className="khung-chon-hocky flex-row">
                                <label htmlFor="hockys" className="nhan-chon-hocky">Chọn Học kỳ áp dụng</label>
                                <select id="hockys" name="id_hocky" className="chon-hocky"
                                    value={id_hocky}
                                    onChange={(e) => setIdHocKy(e.target.value)}
                                >
                                <option value="">Tất cả</option>
                                {dsHocKy.map((hocKy) => (
                                    <option key={hocKy.id_hocky} value={hocKy.id_hocky}>{hocKy.ten_hoc_ky}</option>
                                ))}
                                </select>
                            </div>  
                            <div className="khung-ds-sinhvien-hocky">
                                <table className="bang-ds-svhk-chitiet">
                                    <thead>
                                        <tr>
                                            <th className="col-stt">STT</th>
                                            <th className="col-hoten">Họ Tên</th>
                                            <th className="col-email">Email</th>
                                            <th className="col-hhhv">Học Hàm Học Vị</th>
                                            <th className="col-nganh">Ngành</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dsGiangVienDaLoc && dsGiangVienDaLoc.length > 0 ? (
                                            dsGiangVienDaLocHienThi.map((gv, index) => (
                                                <tr key={gv.id_giangvien}>
                                                    <td className="col-stt">{index + 1}</td>
                                                    <td className="col-hoten">{gv.nguoi_dung.ho_ten}</td>
                                                    <td className="col-email">{gv.nguoi_dung.email}</td>
                                                    <td className="col-hhhv">{gv.hoc_ham_hoc_vi}</td>
                                                    <td className="col-nganh">{gv.nganh.ky_hieu}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: "center" }}>Không có giảng viên để hiển thị.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div> 
                            {dsGiangVienDaLocHienThi && dsGiangVienDaLocHienThi.length > 0 ? (
                                <div className="khung-phantrang flex-row">
                                <button className={`nut-phantrang truoc ${trangHienTaiLoc === 1 ? "disabled" : ""}`}
                                    type="button"
                                    onClick={() => xyLyChuyenTrangLoc(trangHienTaiLoc > 1 ? trangHienTaiLoc - 1 : 1)}
                                    disabled={trangHienTaiLoc === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                {phanTrangDaLoc()}
                                <button className={`nut-phantrang sau ${trangHienTaiLoc === tongSoTrangDaLoc ? "disabled" : ""}`}
                                    type="button"
                                    onClick={() => xyLyChuyenTrangLoc(trangHienTaiLoc < tongSoTrangDaLoc ? trangHienTaiLoc + 1 : tongSoTrangDaLoc)}
                                    disabled={trangHienTaiLoc === tongSoTrangDaLoc}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                                </div>
                            ) : null}
                             
                            <div className="khung-hanhdong flex-row">
                                <button className="nut-dongkhung" onClick={dongKhungTaoTkGiangVien}>Đóng</button>
                                <button type="submit" className={`nut-taotaikhoan ${trangThaiLoc && !dangTai ? '' : 'disabled'}`} disabled={!trangThaiLoc || dangTai}>
                                    {dangTai ? 'Đang xử lý...' : 'Tạo tài khoản'}
                                </button>
                            </div>         
                        </form>
                    </div>
                }
            </div>
        </>
    );
}

export default TrangQlGiangVienAd;