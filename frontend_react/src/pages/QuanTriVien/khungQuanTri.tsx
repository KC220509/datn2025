import { Outlet, NavLink } from 'react-router-dom';
import './trangquantri.css'; 

function KhungQuanTri() {
  return (
    <div className="khung-quantri">
      <aside className="thanh-dieu-huong">
        <nav>
          <ul className="danh-sach-menu">
            <li>
              <NavLink to="/quan-tri" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                Tổng Quan
              </NavLink>
            </li>
            <li>
              <NavLink to="/quan-tri/ql-giang-vien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                Quản lý Giảng Viên
              </NavLink>
            </li>
            <li>
              <NavLink to="/quan-tri/ql-sinh-vien" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                Quản lý Sinh Viên
              </NavLink>
            </li>
            
          </ul>
        </nav>
      </aside>

      <main className="khu-vuc-chinh">
        <Outlet />
      </main>
    </div>
  );
}

export default KhungQuanTri;