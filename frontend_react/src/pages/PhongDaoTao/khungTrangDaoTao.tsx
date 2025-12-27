import { NavLink, Outlet } from 'react-router-dom';
import './trangdaotao.css';

const KhungTrangDaoTao: React.FC = () => {
    return (
        <div className="khung-trangdaotao flex-col">
            <div className="khung-dieuhuong flex-row">
                <aside className="thanh-dieuhuong flex-row">
                    <nav>
                        <ul className="danhsach-menu flex-row">
                            <li>
                                <NavLink to="/dao-tao/ql-sinhvien" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Danh Sách Sinh Viên
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dao-tao/ql-giangvien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Danh Sách Giảng Viên
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dao-tao/ql-thongbao" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Quản Lý Thông Báo
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>
            <div className="khung-noidung-trangdaotao flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default KhungTrangDaoTao;