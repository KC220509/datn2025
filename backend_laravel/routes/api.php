<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DaoTaoController;
use App\Http\Controllers\Api\DuLieuController;
use App\Http\Controllers\Api\GiangVienController;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\Api\TaiKhoanController;
use App\Http\Controllers\Api\TruongBoMonController;
use Illuminate\Support\Facades\Route;






Route::post('dang-nhap', [TaiKhoanController::class, 'dangNhap'])->name('dangNhap');

Route::post('/cap-lai-mat-khau', [TaiKhoanController::class, 'capLaiMatKhau']);
Route::middleware('auth:sanctum')->get('/nguoi-dung', [TaiKhoanController::class, 'layNguoiDung']);
Route::middleware('auth:sanctum')->post('/nguoi-dung/doi-mat-khau', [TaiKhoanController::class, 'doiMatKhau']);

//Admin 
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:AD'])->prefix('admin')->group(function () {
   
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('ad_dsHocKy');
    Route::get('/ds-nguoidung', [DuLieuController::class, 'dsNguoiDung'])->name('ad_dsNguoiDung');
    Route::get('/ds-khoanganhlop', [DuLieuController::class, 'dsKhoaNganhLop'])->name('ad_dsKhoaNganhLop');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('ad_dsSinhVien');
    Route::get('/ds-giangvien', [DuLieuController::class, 'dsGiangVien'])->name('ad_dsGiangVien');

    Route::post('/tao-ds-taikhoan-sv', [AdminController::class, 'taoDsTaiKhoanSv'])->name('ad_taoDsTaiKhoanSv');
    Route::post('/tao-ds-taikhoan-gv', [AdminController::class, 'taoDsTaiKhoanGv'])->name('ad_taoDsTaiKhoanGv');

    Route::delete('/xoa-taikhoan-gv/{id_giangvien}', [AdminController::class, 'xoaTkGiangVien'])->name('ad_xoaTaiKhoanGv');


    Route::put('/khoa-taikhoan/{id_nguoidung}', [AdminController::class, 'khoaTaiKhoan'])->name('ad_khoaTaiKhoan');
    Route::put('/mo-khoa-taikhoan/{id_nguoidung}', [AdminController::class, 'moKhoaTaiKhoan'])->name('ad_moKhoaTaiKhoan');
});

//PDT
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:PDT'])->prefix('pdt')->group(function () {
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('pdt_dsHocKy');
    Route::post('/dssv-tailen', [DaoTaoController::class, 'importDsSinhVien'])->name('pdt_importDsSinhVien');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('pdt_dsSinhVien');
    Route::post('/dsgv-tailen', [DaoTaoController::class, 'importDsGiangVien'])->name('pdt_importDsGiangVien'); 
    Route::get('/ds-giangvien', [DuLieuController::class, 'dsGiangVien'])->name('pdt_dsGiangVien');

    Route::post('/dang-bai', [DaoTaoController::class, 'dangBai'])->name('pdt_dangBai');
    Route::delete('/xoa-bai/{id_baidang}', [DaoTaoController::class, 'xoaBaiDang'])->name('pdt_xoaBai');
    Route::post('/sua-bai/{id_baidang}', [DaoTaoController::class, 'capNhatBaiDang'])->name('pdt_suaBai');
});



Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:TBM'])->prefix('tbm')->group(function () {
    Route::get('/nganh', [TruongBoMonController::class, 'layNganhCuaTBM'])->name('tbm_layNganhCuaTBM');
    Route::get('/ds-giangvien/{maNganh}', [DuLieuController::class, 'layDsGiangVienTheoNganh'])->name('tbm_dsGiangVienTheoNganh');
    Route::get('/ds-sinhvien/{maNganh}', [DuLieuController::class, 'layDsSinhVienTheoNganh'])->name('tbm_dsSinhVienTheoNganh');
    
    Route::post('/phan-cong-ngau-nhien', [TruongBoMonController::class, 'phanCongNgauNhien'])->name('tbm_phanCongNgauNhien');
    Route::get('/ds-phancong', [TruongBoMonController::class, 'layDsPhanCongTheoTBM'])->name('tbm_layDsPhanCongTheoTBM');

});


Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:GV'])->prefix('gv')->group(function () {
    Route::get('/ds-nhom', [GiangVienController::class, 'layDanhSachNhom'])->name('gv_layDsNhom');
    Route::get('/ds-sinhvien-pc', [GiangVienController::class, 'layDanhSachSinhVienPc'])->name('gv_layDsSinhVienPc');
   
    Route::post('/tao-nhom', [GiangVienController::class, 'taoNhomDoAn'])->name('gv_taoNhomDoAn');
    Route::post('/nhom/them-thanh-vien/{idNhom}', [GiangVienController::class, 'themSinhVienVaoNhom'])->name('gv_themSinhVienVaoNhom');
    Route::delete('/nhom/xoa-thanh-vien/{id_nhom}/{id_sinhvien}', [GiangVienController::class, 'xoaThanhVienKhoiNhom'])->name('gv_xoaThanhVienKhoiNhom');
    Route::delete('/xoa-nhom/{id_nhom}', [GiangVienController::class, 'xoaNhomDoAn'])->name('gv_xoaNhomDoAn');

    // Route::get('/ds-nhiemvu/{id_nhom}', [GiangVienController::class, 'layDsNhiemVu'])->name('gv_layDsNhiemVu');
});



Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:SV'])->prefix('sv')->group(function () {
    Route::get('/thong-tin-sv', [SinhVienController::class, 'layThongTinSV'])->name('sv_layThongTinSV');
    Route::get('/ds-giangvien-hd', [SinhVienController::class, 'layDanhSachGiangVienHd'])->name('sv_layDsGiangVienHd');
    Route::get('/ds-nhom', [SinhVienController::class, 'layDanhSachNhom'])->name('sv_layDsNhom');
});



Route::middleware(['auth:sanctum'])->prefix('nhom')->group(function () {
    Route::get('/chi-tiet/{idNhom}', [DuLieuController::class, 'layChiTietNhom'])->name('layChiTietNhom');
    
    // Nhóm - Tin nhắn
    Route::get('/chi-tiet/tinnhan/{idNhom}', [DuLieuController::class, 'layTinNhanNhom'])->name('layTinNhanNhom');
    Route::post('/chi-tiet/tinnhan/gui', [DuLieuController::class, 'guiTinNhan'])->name('guiTinNhanNhom');
    
    // Nhóm - Nhiệm vụ - Chung
    Route::get('/chi-tiet/{idNhom}/nhiem-vu', [DuLieuController::class, 'layDsNhiemVu'])->name('layDsNhiemVu');
    Route::get('/chi-tiet/nhiem-vu/{idNhiemVu}', [DuLieuController::class, 'layChiTietNhiemVu'])->name('layChiTietNhiemVu');
    
    // Nhóm - Nhiệm vụ - GV
    Route::middleware(['kiem_tra_dang_nhap:GV'])->group(function () {
        Route::post('/chi-tiet/{idNhom}/tao-nhiem-vu', [GiangVienController::class, 'taoNhiemVu'])->name('gv_taoNhiemVu');
    });

    // Nhóm - Nhiệm vụ - SV
    Route::middleware(['kiem_tra_dang_nhap:SV'])->group(function () {
        // Route::get('/chi-tiet/{idNhom}/nhiem-vu', [SinhVienController::class, 'layDsNhiemVu'])->name('sv_layDsNhiemVu');
    });

});


Route::get('/ds-thongbao', [DuLieuController::class, 'layDsThongBao'])->name('layDsThongBao');
Route::get('/ds-thongbao/chi-tiet/{id_baidang}', [DuLieuController::class, 'layChiTietThongBao'])->name('layChiTietThongBao');