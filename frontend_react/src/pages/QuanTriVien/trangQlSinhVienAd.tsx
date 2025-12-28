import { useCallback, useEffect, useMemo, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import axios from "axios";

interface HocKy{
    id_hocky: string;
    ten_hoc_ky: string;
}

interface Nganh{
    id_nganh: string;
    ten_nganh: string;
    ky_hieu: string;
}

interface Lop{
    id_lop: string;
    ten_lop: string;
    nganh: Nganh;
}

interface NguoiDung{
    id_nguoidung: string;
    email: string;
    mat_khau: string;
    ho_ten: string;
    trang_thai: boolean;
    hoc_kys: HocKy[];
    
}

interface SinhVien{
    id_sinhvien: string;
    msv: string;
    lop: Lop;
    nguoi_dung: NguoiDung;
}

const TrangQlSinhVienAd = () => {
    
    const [dsSinhVien, setDsSinhVien] = useState<SinhVien[]>([]);

    const layDsTkSinhVien = useCallback(async () => {
        try{
            const dsTaiKhoan = await ketNoiAxios.get('/admin/ds-sinhvien');

            if (!dsTaiKhoan.data.trangthai){
                console.log('Lấy danh sách tài khoản sinh viên không thành công');
                return;
            }

            setDsSinhVien(dsTaiKhoan.data.ds_sinhvien);
        }
        catch (error){
            console.error('Lỗi khi lấy danh sách sinh viên:', error);
        }
    }, []);


    const [dsHocKy, setDsHocKy] = useState<HocKy[]>([]);
    const [id_hocky, setIdHocKy] = useState<string>("");
    const [dsLop, setDsLop] = useState<Lop[]>([]);

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

    const layDanhSachLop = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('/admin/ds-khoanganhlop');

            if (!phanhoi){
                console.log('Lấy danh sách lớp không thành công');
                return;
            }
            setDsLop(phanhoi.data.ds_lop);
        }catch(error){
            console.error('Lỗi khi lấy danh sách lớp:', error);
        }
        
    }

    useEffect(() => {
        layDsTkSinhVien();
        layDsHocKy();
        layDanhSachLop();
    }, [layDsTkSinhVien, layDsHocKy]);



    const [moKhungTaoDsTk, setMoKhungTaoDsTk] = useState<boolean>(false);

    const moKhungTaoDsTkSinhVien = () => {
        setMoKhungTaoDsTk(true);
    };

    const dongKhungTaoDsTkSinhVien = () => {
        setMoKhungTaoDsTk(false);
        setIdHocKy("");
        setTrangHienTaiLoc(1);
    };


    // Phân trang
    
    const [trangHienTai, setTrangHienTai] = useState(1);
    const phanTuMoiTrang = 10;
    
    const indexCuoiCung = trangHienTai * phanTuMoiTrang;
    const indexDauTien = indexCuoiCung - phanTuMoiTrang;
    const dsSinhVienHienThi = dsSinhVien.slice(indexDauTien, indexCuoiCung);
    const tongSoTrang = Math.ceil(dsSinhVien.length / phanTuMoiTrang);
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

    const dsSinhVienDaLoc = useMemo(() => {
        return dsSinhVien.filter(sv=> {
            const dieuKienHocKy = id_hocky ? sv.nguoi_dung.hoc_kys && sv.nguoi_dung.hoc_kys.some(hk => hk.id_hocky === id_hocky) : true;
            return dieuKienHocKy;
        });
    }, [dsSinhVien, id_hocky]);


    
    // Phân trang khi lọc
    const [trangHienTaiLoc, setTrangHienTaiLoc] = useState(1);
    const phanTuMoiTrangLoc = 5;
    
    const indexCuoi = trangHienTaiLoc * phanTuMoiTrangLoc;
    const indexDau = indexCuoi - phanTuMoiTrangLoc;
    const dsSinhVienDaLocHienThi = dsSinhVienDaLoc.slice(indexDau, indexCuoi);
    const tongSoTrangDaLoc = Math.ceil(dsSinhVienDaLoc.length / phanTuMoiTrangLoc);
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
    }, [id_hocky, dsSinhVien]);


    const [thongBao, setThongBao] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [dangTai, setDangTai] = useState<boolean>(false);

    // Xử lý tạo danh sách tài khoản sinh viên
    const xuLyTaoDsTkSinhVien = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setDangTai(true);
        try {
            const  dataTaoTk = await ketNoiAxios.post('/admin/tao-ds-taikhoan-sv', {
                id_hocky: id_hocky,
            });

            if (!dataTaoTk.data.trangthai){
                setThongBao({ message: dataTaoTk.data.thongbao || 'Tạo tài khoản sinh viên không thành công', type: 'error' });
                return;
            }

            setThongBao({ message: dataTaoTk.data.thongbao || 'Tạo tài khoản sinh viên thành công!', type: 'success' });
            layDsTkSinhVien();

            setTimeout(() => {
                dongKhungTaoDsTkSinhVien();
                setThongBao(null);
            }, 3000);

        } catch (error) {
            console.error('Lỗi khi tạo tài khoản sinh viên:', error);
            setThongBao({ message: 'Lỗi khi tạo tài khoản sinh viên.', type: 'error' });
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
    const [masv, setMsv] = useState<string>("");
    const [soDienThoai, setSoDienThoai] = useState<string>("");
    const [diaChi, setDiaChi] = useState<string>("");
    const [id_lop, setIdLop] = useState<string>("");
    const [gioiTinh, setGioiTinh] = useState<string>("1");

    

    const moKhungTaoTkSinhVien = () => {
        setMoKhungTaoTk(true);
    };
    const dongKhungTaoTkSinhVien = () => {
        setMoKhungTaoTk(false);
        setEmail("");
        setHoTen("");
        setMsv("");
        setSoDienThoai("");
        setDiaChi("");
        setIdHocKy("");
        setIdLop("");
        setGioiTinh("1");
    }

    const xuLyTaoTkSinhVien = async (e: React.FormEvent) => {
        e.preventDefault();

        setDangTai(true);
        try {
            const phanhoi = await ketNoiAxios.post('/admin/tao-taikhoan-sv', {
                email: email,
                ho_ten: hoTen,
                msv: masv,
                so_dien_thoai: soDienThoai,
                dia_chi: diaChi,
                ma_hocky: id_hocky,
                ma_lop: id_lop,
                gioi_tinh: gioiTinh,
            });

            if(phanhoi.data.trangthai){
                alert(phanhoi.data.thongbao);
                layDsTkSinhVien();
            }

            setTimeout(() => {
                dongKhungTaoTkSinhVien();
            }, 3000);
        } catch (error) {
            console.error('Lỗi khi tạo tài khoản sinh viên:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.thongbao || "Lỗi hệ thống");
            }
        } finally {
            setDangTai(false);
        }
    }

    // Xử lý xóa tài khoản sinh viên
    const xuLyXoaTkSinhVien = async (id_sinhvien: string) => {

        if(!window.confirm('Bạn có chắc chắn muốn xóa tài khoản sinh viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.delete(`/admin/xoa-taikhoan-sv/${id_sinhvien}`);
            if (!phanhoi.data.trangthai){
                alert('Xóa tài khoản sinh viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkSinhVien();
            }

        } catch (error) {
            console.error('Lỗi khi xóa tài khoản sinh viên:', error);
        }
    }

    // Xử lý khóa tài khoản
    const xuLyKhoaTkSinhVien = async (id_nguoidung: string) => {

        if(!window.confirm('Bạn có chắc chắn muốn khóa tài khoản sinh viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.put(`/admin/khoa-taikhoan/${id_nguoidung}`);
            if (!phanhoi.data.trangthai){
                alert('Khóa tài khoản sinh viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkSinhVien();
            }

        }
        catch (error) {
            console.error('Lỗi khi khóa tài khoản sinh viên:', error);
        }
    }

    //Xử lý mở khóa tài khoản
    const xuLyMoKhoaTkSinhVien = async (id_nguoidung: string) => {

        if(!window.confirm('Bạn muốn mở khóa tài khoản cho sinh viên này không?')){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.put(`/admin/mo-khoa-taikhoan/${id_nguoidung}`);
            if (!phanhoi.data.trangthai){
                alert('Mở khóa tài khoản sinh viên không thành công');
                return;
            }else{
                alert(phanhoi.data.thongbao);
                layDsTkSinhVien();
            }

        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.thongbao || "Lỗi hệ thống");
            }
            console.error('Lỗi khi mở khóa tài khoản sinh viên:', error);
        }
    }


    return (
        <>
            <div className="trang-qlsinhvien-ad flex-col">
                <h1 className="tieude-trang">Quản lý tài khoản sinh viên</h1>
                <div className="khung-ql-chucnang flex-row">
                    <div className="khung-tao-taikhoan flex-row">
                        <div className="mokhung tao-dstaikhoan" onClick={moKhungTaoDsTkSinhVien}>
                            Tạo tài khoản sinh viên
                        </div>
                        <div className="mokhung them-taikhoan" onClick={moKhungTaoTkSinhVien}>
                            Thêm mới sinh viên
                        </div>
                    </div>
                    <div className="khung-timkiem">
                        <input
                            id="timkiem-sv"
                            name="timkiem-sv"
                            type="text"
                            className="nhap-timkiem"
                            placeholder="Tìm kiếm sinh viên..."
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
                                <th className="col-msv">Mã Sinh Viên</th>
                                <th className="col-email">Email</th>
                                <th className="col-matkhau">Mật khẩu</th>
                                <th className="col-lop">Lớp</th>
                                <th className="col-nganh">Ngành</th>
                                <th className="col-chucnang">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsSinhVienHienThi && dsSinhVienHienThi.length > 0 ? (
                                dsSinhVienHienThi.map((sv, index) => (
                                    <tr key={sv.id_sinhvien}>
                                        <td className="col-stt">{index + 1}</td>
                                        <td className="col-hoten">{sv.nguoi_dung.ho_ten}</td>
                                        <td className="col-msv">{sv.msv}</td>
                                        <td className="col-email">{sv.nguoi_dung.email}</td>
                                        <td className="col-matkhau">{sv.nguoi_dung.mat_khau || "Null"}</td>
                                        <td className="col-lop">{sv.lop.ten_lop}</td>
                                        <td className="col-nganh">{sv.lop.nganh.ky_hieu}</td>
                                        <td className="col-chucnang">
                                            <div className="khung-chucnang">
                                                {sv.nguoi_dung.trang_thai ? (
                                                    <button onClick={() => xuLyKhoaTkSinhVien(sv.id_sinhvien)} className="nut-chucnang khoa-tk">
                                                        <i className="bi bi-person-lock"></i>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => xuLyMoKhoaTkSinhVien(sv.id_sinhvien)} className="nut-chucnang mo-khoa-tk">
                                                        <i className="bi bi-person-slash"></i>
                                                    </button>
                                                )}
                                                <button className="nut-chucnang sua"><i className="bi bi-pencil-square"></i></button>
                                                <button onClick={() => xuLyXoaTkSinhVien(sv.id_sinhvien)} className="nut-chucnang xoa"><i className="bi bi-x-square"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                        Không có sinh viên để hiển thị.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {dsSinhVienHienThi && dsSinhVienHienThi.length > 0 ? (
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
                        <form onSubmit={xuLyTaoDsTkSinhVien} method="post" className="khung-tao-tk flex-col">
                            <h2 className="tieude-khungtao">Tạo danh sách tài khoản</h2>
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
                                            <th className="col-msv">Mã Sinh Viên</th>
                                            <th className="col-email">Email</th>
                                            <th className="col-lop">Lớp</th>
                                            <th className="col-nganh">Ngành</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dsSinhVienDaLoc && dsSinhVienDaLoc.length > 0 ? (
                                            dsSinhVienDaLocHienThi.map((sv, index) => (
                                                <tr key={sv.id_sinhvien}>
                                                    <td className="col-stt">{indexDau + index + 1}</td>
                                                    <td className="col-hoten">{sv.nguoi_dung.ho_ten}</td>
                                                    <td className="col-msv">{sv.msv}</td>
                                                    <td className="col-email">{sv.nguoi_dung.email}</td>
                                                    <td className="col-lop">{sv.lop.ten_lop}</td>
                                                    <td className="col-nganh">{sv.lop.nganh.ky_hieu}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: "center" }}>Không có sinh viên để hiển thị.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>  
                            {dsSinhVienDaLocHienThi && dsSinhVienDaLocHienThi.length > 0 ? (
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
                                <button type="button" className="nut-dongkhung" onClick={dongKhungTaoDsTkSinhVien}>Đóng</button>
                                <button type="submit" className={`nut-taotaikhoan ${trangThaiLoc && !dangTai ? '' : 'disabled'}`} disabled={!trangThaiLoc || dangTai}>
                                    {dangTai ? 'Đang xử lý...' : 'Tạo tài khoản'}
                                </button>
                            </div>         
                        </form>
                    </div>
                }


                {moKhungTaoTk && (
                    <div className="mokhung-tao-tk">
                        <form method="post" className="khung-tao-tk flex-col" onSubmit={xuLyTaoTkSinhVien}>
                            <h2 className="tieude-khungtao">Tạo tài khoản sinh viên</h2>
                            <div className="khung-nhap-thong-tin flex-col">
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="email">Email <span style={{color: 'red'}}>*</span></label>
                                    <input className="thong-tin-nhap"
                                        type="email" id="email" name="email"
                                        placeholder="Nhập email sinh viên"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required />
                                </div>
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="hoTen">Họ và Tên <span style={{color: 'red'}}>*</span></label>
                                    <input className="thong-tin-nhap"
                                        type="text" id="hoTen" name="hoTen"
                                        placeholder="Nhập họ tên sinh viên"
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="msv">Mã sinh viên <span style={{color: 'red'}}>*</span></label>
                                    <input  className="thong-tin-nhap"
                                        type="text" id="msv" name="msv"
                                        placeholder="Nhập mã sinh viên"
                                        value={masv}
                                        onChange={(e) => setMsv(e.target.value)}
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
                                <div className="thong-tin-item flex-col">
                                    <label htmlFor="diaChi">Địa chỉ</label>
                                    <input className="thong-tin-nhap"
                                        type="text" id="diaChi" name="diaChi" 
                                        placeholder="Nhập địa chỉ (Nếu có)"
                                        value={diaChi}
                                        onChange={(e) => setDiaChi(e.target.value)}
                                    />
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
                                        <label htmlFor="lop">Lớp <span style={{color: 'red'}}>*</span></label>
                                        <select id="lop" name="lop" className="chon-thong-tin"
                                            value={id_lop}
                                            onChange={(e) => setIdLop(e.target.value)}
                                            required
                                        >
                                            <option value="">Tất cả</option>
                                            {dsLop.map((lop) => (
                                                <option key={lop.id_lop} value={lop.id_lop}>{lop.ten_lop}</option>
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
                                <button type="button" className="nut-dongkhung" onClick={dongKhungTaoTkSinhVien}>Đóng</button>
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

export default TrangQlSinhVienAd;