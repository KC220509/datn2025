

import './App.css';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
import KhungTrangDaoTao from './pages/PhongDaoTao/khungTrangDaoTao';
import QlSinhVien from './pages/PhongDaoTao/qlSinhVien';
import QlGiangVien from './pages/PhongDaoTao/qlGiangVien';

// Trưởng bộ môn
import PhanCongGvSv from './pages/TruongBoMon/phanCongGvSv';
import QuanLyPhanCong from './pages/TruongBoMon/quanLyPhanCong';
import DanhSachPhanCong from './pages/TruongBoMon/danhSachPhanCong';

// Giảng viên
import GiangVien from './pages/GiangVien/giangVien';
import KhungGiangVien from './pages/GiangVien/khungTrangGiangVien';
import QuanLySinhVien from './pages/GiangVien/quanLySinhVien';
import DanhSachNhom from './pages/GiangVien/danhSachNhom';
import DanhSachSinhVienPc from './pages/GiangVien/danhSachSinhVienPc';
import KhungNhomChat from './pages/NhomChat/khungNhomChat';

// Sinh viên
import KhungTrangSinhVien from './pages/SinhVien/khungTrangSinhVien';
import SinhVien from './pages/SinhVien/sinhVien';
import NhomDoAn from './pages/SinhVien/nhomDoAn';
import NhomChat from './pages/NhomChat/nhomChat';
import QuanLyThongBao from './pages/PhongDaoTao/qlThongBao';
import DanhSachThongBao from './pages/PhongDaoTao/danhSachThongBao';
import DangThongBao from './pages/PhongDaoTao/dangThongBao';
import QuanLyBaiTap from './pages/NhomChat/baiTapNhom';


function App() {
  return (
    <Routes>
      <Route element={<Khung trangcon={<Outlet />} />}> 

          {/* Không yêu cầu xác thực */}
          <Route index element={<TrangChuyenHuongMacDinh />} />
          <Route path='/trang-chu/thong-bao' element={<TrangChu />} />
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
              <Route index element={<Navigate to="ql-sinhvien" replace />} />

              <Route  path='ql-sinhvien' element={<QlSinhVien />} />
              <Route path='ql-giangvien' element={<QlGiangVien />} />
              <Route path='ql-thongbao' element={<QuanLyThongBao />} 
              >
                <Route index element={<DanhSachThongBao />} />
                <Route path='dang-bai' element={<DangThongBao />} />
              </Route>
          </Route>
          
          {/* Giảng viên */}
          <Route path='/giang-vien' element={
              <VaiTroNguoiDung trangcon={<KhungGiangVien />} vaitros={['GV']} />
            }>
              <Route index element={<GiangVien />} />
              <Route path='sinh-vien-phan-cong' element={<QuanLySinhVien />} >
                <Route index element={<DanhSachSinhVienPc />} />
                <Route path='danhsach-nhom' element={<DanhSachNhom />} />
              </Route>

              <Route path='quan-ly-phan-cong' element={<QuanLyPhanCong />} >
                <Route index element={<PhanCongGvSv />} />
                <Route path='danh-sach' element={<DanhSachPhanCong />} />
              </Route>
          </Route>


          {/* Sinh viên */}
          <Route path='/sinh-vien' element={
              <VaiTroNguoiDung trangcon={<KhungTrangSinhVien />} vaitros={['SV']} />
            }>
              <Route index element={<SinhVien />} />
              <Route path='ds-nhom-doan' element={<Outlet />} >
                <Route index element={<NhomDoAn />} />
              </Route>
          </Route>

             {/* Chi tiết nhóm - Trang riêng không có khung chung */}
          <Route path='nhom-chat/chi-tiet-nhom/:id_nhom' element={
              <VaiTroNguoiDung trangcon={<KhungNhomChat />} vaitros={['GV', 'SV']} />
          } >
            
            <Route index element={<NhomChat />} />
            <Route path='bai-tap' element={<QuanLyBaiTap />} />

            
          </Route>
      </Route>

      {/* CÁC ROUTE NGOẠI LỆ */}
      <Route path="/khong-co-quyen" element={<div>Bạn không có quyền truy cập.</div>} />
      <Route path="*" element={<div>Không tìm thấy trang.</div>} />
    </Routes>
  )
}

export default App;
