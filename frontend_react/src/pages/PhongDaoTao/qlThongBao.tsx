
import { NavLink, Outlet } from "react-router-dom";


const QuanLyThongBao = () => {
    return (
        <div className="khung-ql-thongbao flex-row">
            <div className="menu-ql-thongbao flex-col">
                <h3 className="tieude-menu">Quản Lý Thông Báo</h3>
                <ul className='flex-col'>
                    <li>
                        <NavLink to="/dao-tao/ql-thongbao" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Danh Sách Thông Báo
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dao-tao/ql-thongbao/dang-bai" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Đăng Thông Báo Mới
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="noidung-ql-thongbao flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default QuanLyThongBao;