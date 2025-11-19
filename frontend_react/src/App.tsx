

import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import Khung from './pages/Dungchungs/khung';
import DangNhap from './pages/DangNhap/dangNhap';
import VaiTroNguoiDung from './pages/Xacthuc/vaiTroNguoidung';
import TrangChuyenHuongMacDinh from './pages/Xacthuc/chuyenHuongMacdinh';
import TrangChu from './pages/TrangChu/trangChu';

// Quản trị viên
import KhungQuanTri from './pages/QuanTriVien/khungQuanTri';
import TrangQuanTriVien from './pages/QuanTriVien/trangQuanTriVien';

// Phòng đào tạo
import PhongDaoTao from './pages/PhongDaoTao/phongDaoTao';
import KhungTrangDaoTao from './pages/PhongDaoTao/khungTrangDaoTao';
import QlSinhVien from './pages/PhongDaoTao/qlSinhVien';



function App() {
  return (
   <Routes>
      {/* ROUTE CHA CHUNG LAYOUT KHUNG */}
      <Route element={<Khung trangcon={<Outlet />} />}> 

          {/* Không yêu cầu xác thực */}
          <Route index element={<TrangChuyenHuongMacDinh />} />
          <Route path='/trang-chu' element={<TrangChu />} />
          <Route path="/dang-nhap" element={<DangNhap />} />

          {/* Yêu cầu xác thực vai trò */}
        
          {/* Quản trị viên */}
          <Route path='/quan-tri' element={
              <VaiTroNguoiDung trangcon={<KhungQuanTri />}  vaitros={['AD']} />
            }>
              <Route index element={<TrangQuanTriVien />} />
          </Route>

          {/* Phòng đào tạo */}
          <Route path='/dao-tao' element={
              <VaiTroNguoiDung trangcon={<KhungTrangDaoTao />} vaitros={['PDT']} />
            }>
              <Route index element={<PhongDaoTao />} />
              <Route path='ql-sinhvien' element={<QlSinhVien />} />
          </Route>
      </Route>

      {/* CÁC ROUTE NGOẠI LỆ */}
      <Route path="/khong-co-quyen" element={<div>Bạn không có quyền truy cập.</div>} />
      <Route path="*" element={<div>Không tìm thấy trang.</div>} />
    </Routes>
  )
}

export default App;
