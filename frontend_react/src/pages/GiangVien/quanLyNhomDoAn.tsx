
import { NavLink, Outlet } from "react-router-dom";


const QuanLyNhomDoAn = () => {
    return (
        <div className="khung-ql-nhom-doan flex-row">
            <div className="menu-ql-nhom-doan flex-col">
                <h3 className="tieude-menu">Quản Lý Nhóm</h3>
                <ul className='flex-col'>
                    <li>
                        <NavLink to="/giang-vien/quan-ly-nhom-do-an" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Danh Sách Sinh Viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/giang-vien/quan-ly-nhom-do-an/danhsach-nhom" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Danh Sách Nhóm
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/giang-vien/quan-ly-nhom-do-an/yeu-cau-chuyen-gvhd" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
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

export default QuanLyNhomDoAn;