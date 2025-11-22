<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DuLieuController;
use App\Http\Controllers\Api\TaiKhoanController;
use Illuminate\Support\Facades\Route;






// Route::post('trang-chu', [TaiKhoanController::class, 'trangChuChuaDN'])->name('trangchuNo');
Route::post('dang-nhap', [TaiKhoanController::class, 'dangNhap'])->name('dangNhap');
Route::middleware('auth:sanctum')->get('/nguoi-dung', [TaiKhoanController::class, 'layNguoiDung']);

//Admin 

Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:AD'])->prefix('admin')->group(function () {
   
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('ad_dsHocKy');
    Route::get('/ds-nguoidung', [DuLieuController::class, 'dsNguoiDung'])->name('ad_dsNguoiDung');
    Route::get('/ds-khoanganhlop', [DuLieuController::class, 'dsKhoaNganhLop'])->name('ad_dsKhoaNganhLop');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('ad_dsSinhVien');

});

// Route::group(['prefix' => 'admin'], function () {
//     Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('dsHocKy');
//     Route::get('/ds-nguoidung', [DuLieuController::class, 'dsNguoiDung'])->name('dsNguoiDung');
//     Route::get('/ds-khoanganhlop', [DuLieuController::class, 'dsKhoaNganhLop'])->name('dsKhoaNganhLop');
//     Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('dsSinhVien');
// });


Route::middleware(['auth:sanctum', 'kiem_tra_dang_nhap:PDT'])->prefix('pdt')->group(function () {
    Route::get('/ds-hocky', [DuLieuController::class, 'dsHocKy'])->name('pdt_dsHocKy');
    Route::post('/dssv-tailen', [DuLieuController::class, 'importDsSinhVien'])->name('pdt_importDsSinhVien');
    Route::get('/ds-sinhvien', [DuLieuController::class, 'dsSinhVien'])->name('pdt_dsSinhVien');
    Route::post('/dsgv-tailen', [DuLieuController::class, 'importDsGiangVien'])->name('pdt_importDsGiangVien'); 
    Route::get('/ds-giangvien', [DuLieuController::class, 'dsGiangVien'])->name('pdt_dsGiangVien');
});



