<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NhomDoAn;
use App\Models\PhanCong;
use Illuminate\Http\Request;

class GiangVienController extends Controller
{
    public function layDanhSachNhom($id_giangvien)
    {
        $danhSachNhom = NhomDoAn::where('ma_nguoitao', $id_giangvien)->get();


        if ($danhSachNhom->isEmpty()) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Giảng viên chưa tạo nhóm nào.'
            ]);
        }
        return response()->json([
            'trangthai' => true,
            'ds_nhom' => $danhSachNhom
        ]);
    }


    public function layDanhSachSinhVienPc($id_giangvien)
    {
        $danhSachSvPc = PhanCong::with(['sinhVien', 'nguoiDungSinhVien', 'hocKy'])
            ->where('ma_giangvien', $id_giangvien)
            ->get();

        if ($danhSachSvPc->isEmpty()) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Chưa có sinh viên nào được phân công cho giảng viên này.'
            ]);
        }

        return response()->json([
            'trangthai' => true,
            'ds_sinhvien_pc' => $danhSachSvPc
        ]);
    }
}
