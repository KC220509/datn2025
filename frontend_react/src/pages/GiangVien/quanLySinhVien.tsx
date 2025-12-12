
import { NavLink, Outlet } from "react-router-dom";


const QuanLySinhVien = () => {
    return (
        <div className="khung-ql-nhom-doan flex-row">
            <div className="menu-ql-nhom-doan flex-col">
                <h3 className="tieude-menu">Quản Lý Nhóm</h3>
                <ul className='flex-col'>
                    <li>
                        <NavLink to="/giang-vien/sinh-vien-phan-cong" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Danh Sách Sinh Viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/giang-vien/sinh-vien-phan-cong/danhsach-nhom" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Danh Sách Nhóm
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/giang-vien/sinh-vien-phan-cong/yeu-cau-chuyen-gvhd" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Yêu Cầu Chuyển GVHD
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="noidung-ql-nhom-doan flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default QuanLySinhVien;