import { NavLink } from "react-router-dom";
import { useNguoiDung } from "../../hooks/useNguoiDung";
import { useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import axios from "axios";

function TieuDe() {

    const { nguoiDung, dangXuat, dangNhap } = useNguoiDung();

    const [moKhungDoiMatKhau, setMoKhungDoiMatKhau] = useState(false);

    const [matKhauCu, setMatKhauCu] = useState('');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState('');
    const [dangTai, setDangTai] = useState(false);


    const xuLyLamMoi = () => {
        setMatKhauCu('');
        setMatKhauMoi('');
        setXacNhanMatKhauMoi('');
        setMoKhungDoiMatKhau(false);
        setDangTai(false);
    }

    const xuLyDoiMatKhau = async (e: React.FormEvent) => {
        e.preventDefault();

        setDangTai(true);
        const formData = new FormData();
        formData.append('matKhauCu', matKhauCu);
        formData.append('matKhauMoi', matKhauMoi);
        formData.append('xacNhanMatKhauMoi', xacNhanMatKhauMoi);
        try{
            const phanHoi = await ketNoiAxios.post('/nguoi-dung/doi-mat-khau', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(phanHoi.data.trangthai){
                alert(phanHoi.data.thongbao);
                xuLyLamMoi();

                await dangNhap(nguoiDung!.email, matKhauMoi, true);

                window.location.reload();
            }

        }catch(error){
            console.error('Lỗi đổi mật khẩu:', error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Đổi mật khẩu không thành công: ${(error.response?.data.thongbao)}`);
            }else{
                alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!');
            }
        } finally {
            setDangTai(false);
        }
    }


    const TieuDeDuoi = () => (
        <div className="tieu-de-duoi flex-row">
            <div className="tieu-de-trai flex-row">
                <i className="tieu-de-xacminh bi bi-check-circle-fill"></i>
                <h4 className="tieu-de-ten">{nguoiDung?.ho_ten} <span style={{color: "#5f85bdcc"}}>({nguoiDung?.vai_tros.map(vt => vt.ten_hien_thi).join(', ')})</span></h4>
            </div>
            <div className="tieu-de-phai flex-row">
                
                <div className="khung-caidat-taikhoan">
                    <button type="button" className="nut-caidat">Thông Tin Tài Khoản</button>
                    <ul className="caidat-chucnang flex-col">
                        <li>Thông tin cá nhân</li>
                        <li onClick={() => setMoKhungDoiMatKhau(true)}>Đổi mật khẩu</li>
                    </ul>
                </div>
                <button className="dang-xuat" onClick={dangXuat} type="button">Đăng xuất</button>
            </div>
        </div>
    );

    return (
        <header className="tieu-de-cha flex-col">
            <div className="tieu-de-tren flex-row">
                <div className="tieu-de-trai flex-row">
                    <img className="tieu-de-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588789/logo_UTE_eyd2d4.png" alt="Logo trường ĐHSPKT" />
                    
                    <NavLink to="/trang-chu/thong-bao" className="tieu-de-hethong">Hệ thống hỗ trợ thực hiện Đồ án tốt nghiệp Trường ĐHSPKT</NavLink>
                </div>
                <div className="tieu-de-phai flex-row">
                    <NavLink to="/trang-chu/thong-bao" className="khung-thongbao flex-row">
                        <i className="icon-thongbao bi bi-bell-fill"></i>
                        <span className="tieu-de-thongbao">Thông báo</span>
                    </NavLink>

                    {nguoiDung ? (null) : <NavLink to="/dang-nhap" className="lienket-dang-nhap">Đăng Nhập</NavLink>}
                </div>
            </div>

            {nguoiDung ? <TieuDeDuoi /> : null}

            {moKhungDoiMatKhau ? (
                <div className="khung-doi-mat-khau">
                    <div className="khung-noi-dung flex-col">
                        <div className="khung-tieu-de flex-row">
                            <h3 className="tieu-de">Đổi Mật Khẩu</h3>
                            <i className="bi bi-x-square" onClick={() => setMoKhungDoiMatKhau(false)}></i>
                        </div>
                        <form className="form-doi-mat-khau flex-col" onSubmit={xuLyDoiMatKhau}>
                            <label htmlFor="matkhau_cu" className="nhan-mat-khau-cu">Mật khẩu cũ <span style={{color: 'red'}}>*</span></label>
                            <input id="matkhau_cu" type="password" className="o-nhap-mat-khau-cu"
                                value={matKhauCu}
                                onChange={(e) => setMatKhauCu(e.target.value)}    
                                required />

                            <label htmlFor="matkhau_moi" className="nhan-mat-khau-moi">Mật khẩu mới <span style={{color: 'red'}}>*</span></label>
                            <input id="matkhau_moi" type="password" className="o-nhap-mat-khau-moi"
                                value={matKhauMoi}
                                onChange={(e) => setMatKhauMoi(e.target.value)}
                                required />

                            <label htmlFor="xac_nhan_matkhau_moi" className="nhan-xac-nhan-mat-khau-moi">Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span></label>
                            <input id="xac_nhan_matkhau_moi" type="password" className="o-nhap-xac-nhan-mat-khau-moi"
                                value={xacNhanMatKhauMoi}
                                onChange={(e) => setXacNhanMatKhauMoi(e.target.value)}
                                required />

                            <button type="submit" className="nut-xac-nhan" disabled={dangTai}>
                                {dangTai ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}
        </header>
    );
}

export default TieuDe;
