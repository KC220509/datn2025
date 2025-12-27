
import { useEffect, useState } from "react";
import "./dangnhap.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useNguoiDung } from "../../hooks/useNguoiDung";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


interface BaiDang{
    id_baidang: string;
    tieu_de: string;
    noi_dung: string;
    duong_dan_tep: string;
    created_at: Date;
    updated_at: Date;
}

const DangNhap: React.FC = () => {

  const [dsThongBao, setDsThongBao] = useState<BaiDang[]>([]);

  useEffect(() => {
    const layDsThongBao = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('ds-thongbao');
            if(phanhoi.data.trangthai){
                setDsThongBao(phanhoi.data.ds_thongbao);
            }
        }
        catch(error){
            console.log('Lỗi kết nối API lấy danh sách thông báo: ' + error);
        }
    };

    layDsThongBao();
  }, []);

  const navigate = useNavigate();
  const xuLyXemThongBao = (id_baidang: string) => {
    navigate("/trang-chu/thong-bao", { state: { id_baidang } });
  }

  const DANH_SACH_LIEN_KET = [
    { ten: "Bộ Giáo dục và Đào tạo", link: "http://moet.gov.vn/", anh: "v1761665186/bo_gd_dt.png" },
    { ten: "Trường Đại học Bách Khoa - ĐHĐN", link: "https://dut.udn.vn/", anh: "v1761665369/logo-dh-bk_yjbwal.png" },
    { ten: "Trường Đại học Kinh tế - ĐHĐN", link: "http://due.udn.vn/", anh: "v1761665551/logo-dh-kt_c29xsr.png" },
    { ten: "Trường Đại học Sư phạm - ĐHĐN", link: "http://ued.udn.vn/", anh: "v1761665554/logo-dh-sp_fdbeon.png" },
    { ten: "Trường Đại học Ngoại ngữ - ĐHĐN", link: "http://ufl.udn.vn/", anh: "v1761665552/logo-dh-nn_bpim2c.png" },
  ];


  const [xemMatKhau, setXemMatKhau] = useState(false);
  const toggleXemMatKhau = () => {
    setXemMatKhau(!xemMatKhau);
  };


  const chuyenhuong = useNavigate();
  const duongdan = useLocation();

  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [ghiNho, setGhiNho] = useState(false); 
  const [loi, setLoi] = useState("");
  const [dangChay, setDangChay] = useState(false);

  const chuyenHuongMacDinh = (vaiTros: string[]): string => {
    if (vaiTros.includes('AD')) return '/quan-tri';
    if (vaiTros.includes('PDT')) return '/dao-tao';
    if (vaiTros.includes('SV')) return '/sinh-vien';
    if (vaiTros.includes('GV')) return '/giang-vien';
    return '/trang-chu';
  };

  const { nguoiDung, dangTai, dangNhap } = useNguoiDung();
  useEffect(() => {
    if (!dangTai && nguoiDung) {
        // Xác định trang đích mặc định của người dùng
        const duongDanMacDinh = chuyenHuongMacDinh(nguoiDung.vai_tros.map(vt => vt.id_vaitro));
        const tuDuongDanCu = duongdan.state?.from?.pathname || duongDanMacDinh;
        
        if (duongdan.pathname !== tuDuongDanCu) {
          chuyenhuong(tuDuongDanCu, { replace: true });
        }
    }
  }, [nguoiDung, dangTai, chuyenhuong, duongdan.state, duongdan.pathname]);

  const xulyDangNhap = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangChay(true);
    try {
      const nguoiDungApi = await dangNhap(email, matKhau, ghiNho);

      const duongDanChuyenHuong = chuyenHuongMacDinh(nguoiDungApi.vai_tros.map(vt => vt.id_vaitro));
      window.location.replace(duongDanChuyenHuong);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoi(error.message); 
      } else {
        setLoi("Đã xảy ra lỗi không xác định.");
      }

      setTimeout(() => {
        setLoi("");
      }, 5000);
    }
    finally {
      setDangChay(false);
    }
  }


  const [moKhungLayMatKhau, setMoKhungLayMatKhau] = useState(false);
  const xuLyMoKhungLayMatKhau = () => {
    setMoKhungLayMatKhau(true);
  };
  const xuLyDongKhungLayMatKhau = () => {
    setMoKhungLayMatKhau(false);
  };

  const [thongBao, setThongBao] = useState("");

  const xuLyGuiEmailLayLaiMatKhau = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const dulieu = await ketNoiAxios.post('/cap-lai-mat-khau', {
        email: email,
      });

      if(dulieu.data.trangthai){
        setThongBao("Đã gửi thành công. Vui lòng kiểm tra hộp thư của bạn.");
        setTimeout(() => {
          setThongBao("");
          setMoKhungLayMatKhau(false);
        }, 5000);
      }else{
        setLoi("Email không tồn tại trong hệ thống.");

        setTimeout(() => {
          setLoi("");
        }, 5000);
      }

    } catch (error) {
      console.error("Lỗi gửi email cấp lại mật khẩu:", error);
      setLoi("Tài khoản không tồn tại hoặc đã bị khóa.");

        setTimeout(() => {
          setLoi("");
        }, 5000);
    }
  }

  return (
    <div className="trang-dang-nhap flex-row">
        <div className="khung-noidung trai flex-col">
          <p className="tieude-khung">Thông tin - Thông báo</p>
          <div className="noi-dung-trai flex-col">
            {dsThongBao.length > 0 ? (
              dsThongBao.map((tb) => (
                <div className="khung-thong-bao flex-row" key={tb.id_baidang}>
                  <div className="thoigian-thongbao flex-col">
                    <p className="ngay-tao">{new Date(tb.created_at).getDate()}/{new Date(tb.created_at).getMonth() + 1}</p>
                    <p className="nam-tao">{new Date(tb.created_at).getFullYear()}</p>
                  </div>
                  <div className="noidung-thongbao flex-col">
                    <p className="tieude-thongbao" onClick={() => xuLyXemThongBao(tb.id_baidang)}>{tb.tieu_de}</p>
                    <p className="mota-thongbao">{tb.noi_dung}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: "center"}}>Không có thông báo nào.</p>
            )}
          </div>
        </div>

        <div className="khung-noidung giua flex-col">
          {!moKhungLayMatKhau ? (
            <>
              <p className="tieude-khung">Đăng nhập hệ thống</p>
              <form onSubmit={xulyDangNhap} className="form-dang-nhap flex-col" method="post">
                <div className="khung-nhap flex-row">
                  <label htmlFor="email">
                    <i className="bi bi-envelope-fill"></i>
                  </label>
                  <input className="nhap dang-nhap-email" 
                    type="email" name="email" id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Tài khoản Email"
                    required
                  />
                </div>
                <div className="khung-nhap flex-row">
                  <label htmlFor="matkhau">
                    <i className="bi bi-person-fill-lock"></i>
                  </label>
                  <input className="nhap dang-nhap-matkhau"
                    type={xemMatKhau ? "text" : "password"} name="matkhau" id="matkhau" 
                    value={matKhau}
                    onChange={e => setMatKhau(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                  />
                  {xemMatKhau ? (
                    <i className="bi bi-eye-slash-fill" onClick={toggleXemMatKhau}></i>
                  ) : (
                    <i className="bi bi-eye-fill" onClick={toggleXemMatKhau}></i>
                  )}
                </div>
                <div className="khung-nho-tai-khoan flex-row">
                  <input className="nho-tai-khoan"
                    type="checkbox" name="nhotk" id="nhotk"
                    checked={ghiNho}
                    onChange={e => setGhiNho(e.target.checked)}
                  />
                  <label htmlFor="nhotk">Ghi nhớ tài khoản</label>
                </div>
                <div className="khung-chucnang flex-col">
                  <button className="nut-dang-nhap" type="submit" disabled={dangChay}>{dangChay ? "Đăng nhập..." : "Đăng Nhập"}</button>
                  <p className="lienket-quenmk" onClick={xuLyMoKhungLayMatKhau}>Quên mật khẩu ?</p>
                </div>
                {loi && <p className="loi-dang-nhap text-red-500 mt-2">{loi}</p>}
              </form>
            </>
          ) : (
            <>
              <p className="tieude-khung">Lấy lại mật khẩu</p>
              <form onSubmit={xuLyGuiEmailLayLaiMatKhau} className="form-dang-nhap flex-col" method="post">
                <div className="khung-nhap flex-row">
                  <label htmlFor="email-reset">
                    <i className="bi bi-envelope-fill"></i>
                  </label>
                  <input className="nhap dang-nhap-email" 
                        type="email" name="email" id="email-reset"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập Email để lấy lại mật khẩu"
                        required />
                </div>
                <div className="khung-chucnang flex-col">
                  <button className="nut-gui-email" type="submit">Gửi Email</button>
                  <p className="lienket-dangnhap" onClick={xuLyDongKhungLayMatKhau}>Quay lại đăng nhập</p>
                </div>
                {loi && <p className="loi-cap-matkhau text-red-500 mt-2">{loi}</p>}
                {thongBao && <p className="thong-bao-cap-matkhau text-green-500 mt-2">{thongBao}</p>}
              </form>
            </>
          )}
        </div>
        <div className="khung-noidung phai flex-col">
          <p className="tieude-khung">Liên Kết</p>
          <div className="noi-dung-phai flex-col">
            {DANH_SACH_LIEN_KET.map((lk, index) => (
              <div key={index} className="lien-ket flex-row">
                <img className="lien-ket-anh" src={`https://res.cloudinary.com/dpkysexsr/image/upload/${lk.anh}`} alt={lk.ten} />
                <a className="lien-ket-ten" href={lk.link} target="_blank" rel="noreferrer">{lk.ten}</a>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}

export default DangNhap;