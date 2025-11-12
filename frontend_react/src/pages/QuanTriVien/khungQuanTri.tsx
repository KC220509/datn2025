import { Outlet, NavLink } from 'react-router-dom';
import './trangquantri.css'; 

function KhungQuanTri() {
  return (
    <div className="quan_tri_container">
      <aside className="thanh_dieu_huong">
        {/* <h2 className="ten_ung_dung">Admin Panel</h2> */}
        <nav>
          <ul className="danh_sach_menu">
            <li>
              <NavLink to="/trang-quan-tri" end className={({ isActive }) => isActive ? 'muc_menu_active' : 'muc_menu'}>
                Tổng Quan
              </NavLink>
            </li>
            <li>
              <NavLink to="/trang-quan-tri/ql-giang-vien" className={({ isActive }) => isActive ? 'muc_menu_active' : 'muc_menu'}>
                Quản lý Giảng Viên
              </NavLink>
            </li>
            <li>
              <NavLink to="/trang-quan-tri/ql-sinh-vien" className={({ isActive }) => isActive ? 'muc_menu_active' : 'muc_menu'}>
                Quản lý Sinh Viên
              </NavLink>
            </li>
            
          </ul>
        </nav>
      </aside>

      <main className="khu_vuc_chinh">
        <Outlet />
      </main>
    </div>
  );
}

export default KhungQuanTri;