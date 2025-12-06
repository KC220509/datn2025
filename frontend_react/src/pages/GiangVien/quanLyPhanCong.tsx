
import './trangGiangVien.css';

import { NavLink, Outlet } from "react-router-dom";


const QuanLyPhanCong = () => {
    return (
        <div className="khung-ql-phancong flex-row">
            <div className="menu-ql-phancong flex-col">
                <h3 className="tieude-menu">Trưởng Bộ Môn</h3>
                <ul className='flex-col'>
                    <li>
                        <NavLink to="/giang-vien/quan-ly-phan-cong" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Phân Công Giảng Viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/giang-vien/quan-ly-phan-cong/uy-quyen-giang-vien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                            Ủy Quyền Giảng Viên
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="noidung-ql-phancong flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default QuanLyPhanCong;