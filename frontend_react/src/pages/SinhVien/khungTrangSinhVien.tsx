import { NavLink, Outlet } from 'react-router-dom';
import './trangSinhVien.css';

const KhungTrangSinhVien: React.FC = () => {
    return (
        <div className="khung-trangsinhvien flex-col">
            <div className="khung-dieuhuong flex-row">
                <aside className="thanh-dieuhuong flex-row">
                    <nav>
                        <ul className="danhsach-menu flex-row">
                            <li>
                                <NavLink to="/sinh-vien" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Tổng Quan
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/sinh-vien/ql-sinhvien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Danh Sách Sinh Viên
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/sinh-vien/ql-giangvien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Danh Sách Giảng Viên
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>
            <div className="khung-noidung-trangsinhvien flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default KhungTrangSinhVien;