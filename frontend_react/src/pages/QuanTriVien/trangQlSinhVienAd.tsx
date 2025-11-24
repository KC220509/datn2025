import { useCallback, useEffect, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


const TrangQlSinhVienAd = () => {
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
        hoc_ky: HocKy;
        
    }

    interface SinhVien{
        id_sinhvien: string;
        msv: string;
        lop: Lop;
        nguoi_dung: NguoiDung;
    }


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
        layDsTkSinhVien();
        layDsHocKy();
    }, [layDsTkSinhVien, layDsHocKy]);



    const [moKhungTaoTkSinhVien, setMoKhungTaoTkSinhVien] = useState<boolean>(false);

    const moKhungTaoTkSinhVienHandler = () => {
        setMoKhungTaoTkSinhVien(true);
    };

    const dongKhungTaoTkSinhVienHandler = () => {
        setMoKhungTaoTkSinhVien(false);
        setIdHocKy("");
    };


    const [trangThaiLoc, setTrangThaiLoc] = useState<boolean>(false);

    useEffect(() => {
        if(id_hocky){
            setTrangThaiLoc(true);
        }else{
            setTrangThaiLoc(false);
        }
    }, [id_hocky]);

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


    return (
        <>
            <div className="trang-qlsinhvien-ad flex-col">
                <h1 className="tieude-trang">Quản lý tài khoản sinh viên</h1>
                <div className="khung-ql-chucnang flex-row">
                    <div className="khung-tao-taikhoan flex-row">
                        <div className="mokhung tao-dstaikhoan" onClick={moKhungTaoTkSinhVienHandler}>
                            Tạo tài khoản sinh viên
                        </div>
                        <div className="mokhung them-taikhoan">
                            Thêm mới sinh viên
                        </div>
                    </div>
                    <div className="khung-timkiem">
                        <input
                            type="text"
                            className="input-timkiem"
                            placeholder="Tìm kiếm sinh viên..."
                        />
                        <button className="nut-timkiem">Tìm kiếm</button>
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
                {moKhungTaoTkSinhVien &&
                    <div className="mokhung-tao-tksinhvien">
                        <form method="post" className="khung-tao-tksinhvien flex-col">
                            <h2 className="tieude-khungtao">Tạo tài khoản sinh viên</h2>
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
                                            <th className="col-msv">Mã Sinh Viên</th>
                                            <th className="col-email">Email</th>
                                            <th className="col-lop">Lớp</th>
                                            <th className="col-nganh">Ngành</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dsSinhVien.map((sv, index) => (
                                            <tr key={sv.id_sinhvien}>
                                                <td className="col-stt">{index + 1}</td>
                                                <td className="col-hoten">{sv.nguoi_dung.ho_ten}</td>
                                                <td className="col-msv">{sv.msv}</td>
                                                <td className="col-email">{sv.nguoi_dung.email}</td>
                                                <td className="col-lop">{sv.lop.ten_lop}</td>
                                                <td className="col-nganh">{sv.lop.nganh.ky_hieu}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>  
                            <div className="khung-hanhdong flex-row">
                                <button className="nut-dongkhung" onClick={dongKhungTaoTkSinhVienHandler}>Đóng</button>
                                <button type="submit" className={`nut-taotaikhoan ${trangThaiLoc ? '' : 'disabled'}`} disabled={!trangThaiLoc}>Tạo tài khoản</button>
                            </div>         
                        </form>
                    </div>
                }
            </div>
        </>
    );
}

export default TrangQlSinhVienAd;