

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
import TrangQlSinhVienAd from './pages/QuanTriVien/trangQlSinhVienAd';
import TrangQlGiangVienAd from './pages/QuanTriVien/trangQlGiangVienAd';

// Phòng đào tạo
import PhongDaoTao from './pages/PhongDaoTao/phongDaoTao';
import KhungTrangDaoTao from './pages/PhongDaoTao/khungTrangDaoTao';
import QlSinhVien from './pages/PhongDaoTao/qlSinhVien';
import QlGiangVien from './pages/PhongDaoTao/qlGiangVien';

// Sinh viên
import KhungTrangSinhVien from './pages/SinhVien/khungTrangSinhVien';
import SinhVien from './pages/SinhVien/sinhVien';
import KhungGiangVien from './pages/GiangVien/khungTrangGiangVien';
import GiangVien from './pages/GiangVien/giangVien';
import PhanCongGvSv from './pages/GiangVien/phanCongGvSv';
import QuanLyPhanCong from './pages/GiangVien/quanLyPhanCong';


// Giảng viên

// Trưởng bộ môn


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
              <Route path='ql-sinh-vien' element={<TrangQlSinhVienAd />} />
              <Route path='ql-giang-vien' element={<TrangQlGiangVienAd />} />
          </Route>

          {/* Phòng đào tạo */}
          <Route path='/dao-tao' element={
              <VaiTroNguoiDung trangcon={<KhungTrangDaoTao />} vaitros={['PDT']} />
            }>
              <Route index element={<PhongDaoTao />} />
              <Route path='ql-sinhvien' element={<QlSinhVien />} />
              <Route path='ql-giangvien' element={<QlGiangVien />} />
          </Route>
          
          {/* Giảng viên */}
          <Route path='/giang-vien' element={
              <VaiTroNguoiDung trangcon={<KhungGiangVien />} vaitros={['GV']} />
            }>
              <Route index element={<GiangVien />} />
              <Route path='quan-ly-phan-cong' element={<QuanLyPhanCong />} >
                <Route index element={<PhanCongGvSv />} />
              </Route>
          </Route>

          {/* Sinh viên */}
          <Route path='/sinh-vien' element={
              <VaiTroNguoiDung trangcon={<KhungTrangSinhVien />} vaitros={['SV']} />
            }>
              <Route index element={<SinhVien />} />
          </Route>
      </Route>

      {/* CÁC ROUTE NGOẠI LỆ */}
      <Route path="/khong-co-quyen" element={<div>Bạn không có quyền truy cập.</div>} />
      <Route path="*" element={<div>Không tìm thấy trang.</div>} />
    </Routes>
  )
}

export default App;
