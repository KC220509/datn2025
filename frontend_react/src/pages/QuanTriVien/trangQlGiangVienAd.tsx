import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
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
    const [dsNganh, setDsNganh] = useState<Nganh[]>([]);

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

    const layDanhSachNganh = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('/admin/ds-khoanganhlop');

            if (!phanhoi){
                console.log('Lấy danh sách lớp không thành công');
                return;
            }
            setDsNganh(phanhoi.data.ds_nganh);
        }catch(error){
            console.error('Lỗi khi lấy danh sách ngành:', error);
        }
        
    }

    useEffect(() => {
        layDsTkGiangVien();
        layDsHocKy();
        layDanhSachNganh();
    }, [layDsTkGiangVien, layDsHocKy]);



    const [moKhungTaoDsTk, setMoKhungTaoDsTk] = useState<boolean>(false);

    const moKhungTaoDsTkGiangVien = () => {
        setMoKhungTaoDsTk(true);
    };

    const dongKhungTaoDsTkGiangVien = () => {
        setMoKhungTaoDsTk(false);
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

    const xuLyTaoDsTaiKhoanGv = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setDangTai(true);
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
                dongKhungTaoDsTkGiangVien();
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

    // Xử lý tạo tài khoản sinh viên
    const [moKhungTaoTk, setMoKhungTaoTk] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [hoTen, setHoTen] = useState<string>("");
    const [hhhv, setHhhv] = useState<string>("");
    const [soDienThoai, setSoDienThoai] = useState<string>("");
    const [id_nganh, setIdNganh] = useState<string>("");
    const [gioiTinh, setGioiTinh] = useState<string>("1");
    const [laTruongBoMon, setLaTruongBoMon] = useState<boolean>(false);

    

    const moKhungTaoTkGiangVien = () => {
        setMoKhungTaoTk(true);
    };
    const dongKhungTaoTkGiangVien = () => {
        setMoKhungTaoTk(false);
        setEmail("");
        setHoTen("");
        setHhhv("");
        setSoDienThoai("");
        setIdHocKy("");
        setIdNganh("");
        setGioiTinh("1");
        setLaTruongBoMon(false);
    }

    const xuLyTaoTkGiangVien = async (e: React.FormEvent) => {
        e.preventDefault();

        setDangTai(true);
        try {
            const phanhoi = await ketNoiAxios.post('/admin/tao-taikhoan-gv', {
                email: email,
                ho_ten: hoTen,
                hoc_ham_hoc_vi: hhhv,
                so_dien_thoai: soDienThoai,
                ma_hocky: id_hocky,
                ma_nganh: id_nganh,
                gioi_tinh: gioiTinh,
                la_truong_bomon: laTruongBoMon,
            });

            if(phanhoi.data.trangthai){
                alert(phanhoi.data.thongbao);
                layDsTkGiangVien();
            }

            setTimeout(() => {
                dongKhungTaoTkGiangVien();
            }, 2000);

        } catch (error) {
            console.error('Lỗi khi tạo tài khoản giảng viên:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.thongbao || "Lỗi hệ thống");
            }
        } finally {
            setDangTai(false);
        }
    }

    const xuLyXoaTkGiangVien = async (id_giangvien: string) => {

        if(!window.confirm('Bạn có chắc chắn muốn xóa tài khoản giảng viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.delete(`/admin/xoa-taikhoan-gv/${id_giangvien}`);

            if (!phanhoi.data.trangthai){
                alert('Xóa tài khoản giảng viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkGiangVien();

            }

        } catch (error) {
            console.error('Lỗi khi xóa tài khoản giảng viên:', error);
        }
    }

    // Xử lý khóa tài khoản
    const xuLyKhoaTkGiangVien = async (id_nguoidung: string) => {

        if(!window.confirm('Bạn có chắc chắn muốn khóa tài khoản giảng viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.put(`/admin/khoa-taikhoan/${id_nguoidung}`);
            if (!phanhoi.data.trangthai){
                alert('Khóa tài khoản giảng viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkGiangVien();
            }

        }
        catch (error) {
            console.error('Lỗi khi khóa tài khoản giảng viên:', error);
        }
    }

    
    //Xử lý mở khóa tài khoản
    const xuLyMoKhoaTkGiangVien = async (id_nguoidung: string) => {

        if(!window.confirm('Bạn muốn mở khóa tài khoản cho giảng viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.put(`/admin/mo-khoa-taikhoan/${id_nguoidung}`);
            if (!phanhoi.data.trangthai){
                alert('Mở khóa tài khoản sinh viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkGiangVien();
            }

        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.thongbao || "Lỗi hệ thống");
            }
            console.error('Lỗi khi mở khóa tài khoản giảng viên:', error);
        }
    }



    return (
        <>
            <div className="trang-qlgiangvien-ad flex-col">
                <h1 className="tieude-trang">Danh Sách Giảng Viên</h1>
                <div className="khung-ql-chucnang flex-row">
                    <div className="khung-tao-taikhoan flex-row">
                        <div className="mokhung tao-dstaikhoan" onClick={moKhungTaoDsTkGiangVien}>
                            Tạo tài khoản giảng viên
                        </div>
                        <div className="mokhung them-taikhoan" onClick={moKhungTaoTkGiangVien}>
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
                                                {gv.nguoi_dung.trang_thai ? (
                                                    <button onClick={() => xuLyKhoaTkGiangVien(gv.id_giangvien)} className="nut-chucnang khoa-tk">
                                                        <i className="bi bi-person-lock"></i>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => xuLyMoKhoaTkGiangVien(gv.id_giangvien)} className="nut-chucnang mo-khoa-tk">
                                                        <i className="bi bi-person-slash"></i>
                                                    </button>
                                                )}
                                                <button className="nut-chucnang sua"><i className="bi bi-pencil-square"></i></button>
                                                <button onClick={() => xuLyXoaTkGiangVien(gv.id_giangvien)} className="nut-chucnang xoa"><i className="bi bi-x-square"></i></button>
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

                {moKhungTaoDsTk &&
                    <div className="mokhung-tao-tk">
                        <form onSubmit={xuLyTaoDsTaiKhoanGv} method="post" className="khung-tao-tk flex-col">
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
                            <div className="khung-ds-hocky">
                                <table className="bang-ds-ndhk-chitiet">
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
                                <button className="nut-dongkhung" onClick={dongKhungTaoDsTkGiangVien}>Đóng</button>
                                <button type="submit" className={`nut-taotaikhoan ${trangThaiLoc && !dangTai ? '' : 'disabled'}`} disabled={!trangThaiLoc || dangTai}>
                                    {dangTai ? 'Đang xử lý...' : 'Tạo tài khoản'}
                                </button>
                            </div>         
                        </form>
                    </div>
                }


                {moKhungTaoTk && (
                    <div className="mokhung-tao-tk">
                        <form method="post" className="khung-tao-tk flex-col" onSubmit={xuLyTaoTkGiangVien}>
                            <h2 className="tieude-khungtao">Tạo tài khoản giảng viên</h2>
                            <div className="khung-nhap-thong-tin flex-col">
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="email">Email <span style={{color: 'red'}}>*</span></label>
                                    <input className="thong-tin-nhap"
                                        type="email" id="email" name="email"
                                        placeholder="Nhập email giảng viên"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required />
                                </div>
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="hoTen">Họ và Tên <span style={{color: 'red'}}>*</span></label>
                                    <input className="thong-tin-nhap"
                                        type="text" id="hoTen" name="hoTen"
                                        placeholder="Nhập họ tên giảng viên"
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="msv">Học hàm Học vị <span style={{color: 'red'}}>*</span></label>
                                    <input  className="thong-tin-nhap"
                                        type="text" id="msv" name="msv"
                                        placeholder="Nhập học hàm học vị của giảng viên"
                                        value={hhhv}
                                        onChange={(e) => setHhhv(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="hoTen">Số điện thoại</label>
                                    <input  className="thong-tin-nhap"
                                        type="text" id="soDienThoai" name="soDienThoai"
                                        placeholder="Nhập số điện thoại (Nếu có)"
                                        value={soDienThoai}
                                        onChange={(e) => setSoDienThoai(e.target.value)}
                                    />
                                </div>
                                <div className="thong-tin-tbm flex-row">
                                    <input type="checkbox" name="laTBM" id="laTBM"
                                        checked={laTruongBoMon}
                                        onChange={(e) => setLaTruongBoMon(e.target.checked)} 
                                    />
                                    <label htmlFor="laTBM">
                                        Trưởng Bộ Môn 
                                        <span> (Click nếu là trưởng bộ môn)</span>
                                    </label>
                                </div>
                                <div className="thong-tin-item-sl flex-row">
                                    <div className="thong-tin-select flex-col">
                                        <label htmlFor="hocKy">Học kỳ <span style={{color: 'red'}}>*</span></label>
                                        <select id="hocKy" name="hocKy" className="chon-thong-tin"
                                            value={id_hocky}
                                            onChange={(e) => setIdHocKy(e.target.value)}
                                            required
                                        >
                                            <option value="">Tất cả</option>
                                            {dsHocKy.map((hocKy) => (
                                                <option key={hocKy.id_hocky} value={hocKy.id_hocky}>{hocKy.ten_hoc_ky}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="thong-tin-select flex-col">
                                        <label htmlFor="nganh">Ngành <span style={{color: 'red'}}>*</span></label>
                                        <select id="nganh" name="nganh" className="chon-thong-tin"
                                            value={id_nganh}
                                            onChange={(e) => setIdNganh(e.target.value)}
                                            required
                                        >
                                            <option value="">Tất cả</option>
                                            {dsNganh.map((nganh) => (
                                                <option key={nganh.id_nganh} value={nganh.id_nganh}>{nganh.ten_nganh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="thong-tin-select flex-col">
                                        <label htmlFor="gioiTinh">Giới tính</label>
                                        <select id="gioiTinh" name="gioiTinh" className="chon-thong-tin"
                                            value={gioiTinh}
                                            onChange={(e) => setGioiTinh(e.target.value)}
                                        >
                                            <option value="1">Nam</option>
                                            <option value="0">Nữ</option>
                                        </select>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="khung-hanhdong flex-row">
                                <button type="button" className="nut-dongkhung" onClick={dongKhungTaoTkGiangVien}>Đóng</button>
                                <button type="submit" className={`nut-taotaikhoan ${dangTai ? 'disabled' : ''}`} disabled={dangTai}>
                                    {dangTai ? 'Đang xử lý...' : 'Tạo tài khoản'}
                                </button>
                            </div>      
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default TrangQlGiangVienAd;