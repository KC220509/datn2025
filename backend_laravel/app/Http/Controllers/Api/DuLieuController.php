<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HocKyDk;
use App\Services\KhoaNganhLopService;
use App\Services\NguoiDungService;
use Illuminate\Http\Request;

class DuLieuController extends Controller
{
    protected $nguoiDungService;
    protected $khoaNganhLopService;

    public function __construct(NguoiDungService $nguoiDungService, KhoaNganhLopService $khoaNganhLopService)
    {
        $this->nguoiDungService = $nguoiDungService;
        $this->khoaNganhLopService = $khoaNganhLopService;
    }

    public function dsHocKy()
    {
        $dsHocKy = HocKyDk::all();

        return response()->json([
            'trangthai' => true,
            'ds_hocky' => $dsHocKy,
        ]);
    }

    public function dsNguoiDung()
    {
        $dsNguoiDung = $this->nguoiDungService->layDanhSachNguoiDung();

        if (!$dsNguoiDung) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy người dùng nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_nguoidung' => $dsNguoiDung,
        ]);
    }

    public function dsKhoaNganhLop()
    {
        $dsKhoa = $this->khoaNganhLopService->layDanhSachKhoa();
        $dsNganh = $this->khoaNganhLopService->layDanhSachNganh();
        $dsLop = $this->khoaNganhLopService->layDanhSachLop();

        return response()->json([
            'trangthai' => true,
            'ds_khoa' => $dsKhoa,
            'ds_nganh' => $dsNganh,
            'ds_lop' => $dsLop,
        ]);
    }


    public function dsSinhVien()
    {
        $dsSinhVien = $this->nguoiDungService->layDanhSachSinhVien();

        if (!$dsSinhVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy sinh viên nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_sinhvien' => $dsSinhVien,
        ]);
    }
}
