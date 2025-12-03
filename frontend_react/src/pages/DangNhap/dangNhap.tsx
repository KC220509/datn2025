
import { useEffect, useState } from "react";
import "./dangnhap.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useNguoiDung } from "../../hooks/useNguoiDung";
import ketNoiAxios from "../../tienichs/ketnoiAxios";



const DangNhap: React.FC = () => {
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

  const chuyenHuongMacDinh = (vaiTros: string[]): string => {
      if (vaiTros.includes('AD')) {
        return '/quan-tri';
    }
    if (vaiTros.includes('PDT')) {
        return '/dao-tao';
    }
    if (vaiTros.includes('SV')) {
        return '/sinh-vien';
    }
    if (vaiTros.includes('GV')) {
        return '/giang-vien';
    }
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
    try {
      const nguoiDungApi = await dangNhap(email, matKhau, ghiNho);

      const duongDanChuyenHuong = chuyenHuongMacDinh(nguoiDungApi.vai_tros.map(vt => vt.id_vaitro));
      window.location.replace(duongDanChuyenHuong);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setLoi("Thông tin đăng nhập không hợp lệ !");

      setTimeout(() => {
        setLoi("");
      }, 5000);
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
      setLoi("Người dùng không tồn tại trong hệ thống.");

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
            <div className="khung-thong-bao flex-row">
              <div className="thgian-thongbao flex-col">
                <p className="ngay-tao">12/12</p>
                <p className="thoigian-tao">70:20</p>
              </div>
              <div className="noidung-thongbao flex-col">
                <p className="tieude-thongbao">Thông báo lịch nghỉ Tết Dương Lịch 2024</p>
                <p className="mota-thongbao">Căn cứ theo quy định của nhà nước về việc nghỉ lễ, Tết năm 2024, Trường Đại học ...</p>
              </div>
            </div>
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
                  <button className="nut-dang-nhap" type="submit">Đăng Nhập</button>
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
            <div className="lien-ket flex-row">
              <img className="lien-ket-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761665186/bo_gd_dt.png" alt="Bộ Giáo dục và Đào tạo" />
              <a className="lien-ket-ten" href="http://moet.gov.vn/">Bộ Giáo dục và Đào tạo</a>
            </div>
            <div className="lien-ket flex-row">
              <img className="lien-ket-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761665369/logo-dh-bk_yjbwal.png" alt="Trường Đại học Bách Khoa" />
              <a className="lien-ket-ten" href="https://dut.udn.vn/">Trường Đại học Bách Khoa - Đại học Đà Nẵng</a>
            </div>
            <div className="lien-ket flex-row">
              <img className="lien-ket-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761665551/logo-dh-kt_c29xsr.png" alt="Trường Đại học Kinh tế" />
              <a className="lien-ket-ten" href="http://moet.gov.vn/">Trường Đại học Kinh tế - Đại học Đà Nẵng</a>
            </div>
            <div className="lien-ket flex-row">
              <img className="lien-ket-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761665554/logo-dh-sp_fdbeon.png" alt="Trường Đại học Sư phạm" />
              <a className="lien-ket-ten" href="http://moet.gov.vn/">Trường Đại học Sư phạm - Đại học Đà Nẵng</a>
            </div>
            <div className="lien-ket flex-row">
              <img className="lien-ket-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761665552/logo-dh-nn_bpim2c.png" alt="Trường Đại học Ngoại ngữ" />
              <a className="lien-ket-ten" href="http://moet.gov.vn/">Trường Đại học Ngoại ngữ - Đại học Đà Nẵng</a>
            </div>
          </div>
        </div>
    </div>
  );
}

export default DangNhap;