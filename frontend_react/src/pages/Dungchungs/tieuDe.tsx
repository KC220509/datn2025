import { NavLink } from "react-router-dom";
import { useNguoiDung } from "../../hooks/useNguoiDung";

function TieuDe() {

    const { nguoiDung, dangXuat } = useNguoiDung();


    const TieuDeDuoi = () => (
        <div className="tieu-de-duoi flex-row">
            <div className="tieu-de-trai flex-row">
                <i className="tieu-de-xacminh bi bi-check-circle-fill"></i>
                <h4 className="tieu-de-ten">{nguoiDung?.ho_ten} ({nguoiDung?.vai_tro})</h4>
            </div>
            <div className="tieu-de-phai flex-row">
                <button className="dang-xuat" onClick={dangXuat} type="button">Đăng xuất</button>
            </div>
        </div>
    );

    return (
        <header className="tieu-de-cha flex-col">
            <div className="tieu-de-tren flex-row">
                <div className="tieu-de-trai flex-row">
                    <img className="tieu-de-anh" src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588789/logo_UTE_eyd2d4.png" alt="Logo trường ĐHSPKT" />
                    
                    <NavLink to="/trang-chu" className="tieu-de-hethong">Hệ thống hỗ trợ thực hiện Đồ án tốt nghiệp Trường ĐHSPKT</NavLink>
                </div>
                <div className="tieu-de-phai flex-row">
                    <div className="khung-thongbao flex-row">
                        <i className="icon-thongbao bi bi-bell-fill"></i>
                        <span className="tieu-de-thongbao">Thông báo</span>
                    </div>
                    {nguoiDung ? (null) : <NavLink to="/dang-nhap" className="lienket-dang-nhap">Đăng Nhập</NavLink>}
                </div>
            </div>

            {nguoiDung ? <TieuDeDuoi /> : null}
        </header>
    );
}

export default TieuDe;
