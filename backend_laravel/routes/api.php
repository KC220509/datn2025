<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DuLieuController;
use App\Http\Controllers\Api\GiangVienController;
use App\Http\Controllers\Api\SinhVienController;
use App\Http\Controllers\Api\TaiKhoanController;
use App\Http\Controllers\Api\TruongBoMonController;
use Illuminate\Support\Facades\Route;






Route::post('dang-nhap', [TaiKhoanController::class, 'dangNhap'])->name('dangNhap');
Route::post('/cap-lai-mat-khau', [TaiKhoanController::class, 'capLaiMatKhau']);
Route::middleware('auth:sanctum')->get('/nguoi-dung', [TaiKhoanController::class, 'layNguoiDung']);


//Admin 
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:AD'])->prefix('admin')->group(function () {
   
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('ad_dsHocKy');
    Route::get('/ds-nguoidung', [DuLieuController::class, 'dsNguoiDung'])->name('ad_dsNguoiDung');
    Route::get('/ds-khoanganhlop', [DuLieuController::class, 'dsKhoaNganhLop'])->name('ad_dsKhoaNganhLop');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('ad_dsSinhVien');
    Route::get('/ds-giangvien', [DuLieuController::class, 'dsGiangVien'])->name('ad_dsGiangVien');

    Route::post('/tao-ds-taikhoan-sv', [AdminController::class, 'taoDsTaiKhoanSv'])->name('ad_taoDsTaiKhoanSv');
    Route::post('/tao-ds-taikhoan-gv', [AdminController::class, 'taoDsTaiKhoanGv'])->name('ad_taoDsTaiKhoanGv');
});

//PDT
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:PDT'])->prefix('pdt')->group(function () {
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('pdt_dsHocKy');
    Route::post('/dssv-tailen', [DuLieuController::class, 'importDsSinhVien'])->name('pdt_importDsSinhVien');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('pdt_dsSinhVien');
    Route::post('/dsgv-tailen', [DuLieuController::class, 'importDsGiangVien'])->name('pdt_importDsGiangVien'); 
    Route::get('/ds-giangvien', [DuLieuController::class, 'dsGiangVien'])->name('pdt_dsGiangVien');
});



Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:TBM'])->prefix('tbm')->group(function () {
    Route::get('/nganh', [TruongBoMonController::class, 'layNganhCuaTBM'])->name('tbm_layNganhCuaTBM');
    Route::get('/ds-giangvien/{maNganh}', [DuLieuController::class, 'layDsGiangVienTheoNganh'])->name('tbm_dsGiangVienTheoNganh');
    Route::get('/ds-sinhvien/{maNganh}', [DuLieuController::class, 'layDsSinhVienTheoNganh'])->name('tbm_dsSinhVienTheoNganh');
    
    Route::post('/phan-cong-ngau-nhien', [TruongBoMonController::class, 'phanCongNgauNhien'])->name('tbm_phanCongNgauNhien');
    Route::get('/ds-phancong', [TruongBoMonController::class, 'layDsPhanCongTheoTBM'])->name('tbm_layDsPhanCongTheoTBM');

});
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:GV'])->prefix('gv')->group(function () {
    Route::get('/ds-nhom/{id_giangvien}', [GiangVienController::class, 'layDanhSachNhom'])->name('gv_layDsNhom');
    Route::get('/ds-sinhvien-pc', [GiangVienController::class, 'layDanhSachSinhVienPc'])->name('gv_layDsSinhVienPc');
   
});
Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:SV'])->prefix('sv')->group(function () {
    Route::get('/thong-tin-sv', [SinhVienController::class, 'layThongTinSV'])->name('sv_layThongTinSV');
    Route::get('/ds-giangvien-hd', [SinhVienController::class, 'layDanhSachGiangVienHd'])->name('sv_layDsGiangVienHd');
});



