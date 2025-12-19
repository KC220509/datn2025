<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HocKyDk;
use App\Models\NhomDoAn;
use App\Services\KhoaNganhLopService;
use App\Services\NguoiDungService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

// use Excel;

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
        $dsHocKy = HocKyDk::orderBy('created_at', 'desc')->get();

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

        $dsSinhVien = $dsSinhVien->map(function($sinhVien) {
            if($sinhVien->nguoiDung) {
                $sinhVien->nguoiDung->makeVisible(['mat_khau']);
            }
            return $sinhVien;
        });

        return response()->json([
            'trangthai' => true,
            'ds_sinhvien' => $dsSinhVien,
        ]);
    }

    public function dsGiangVien(){
        $dsGiangVien = $this->nguoiDungService->layDanhSachGiangVien();

        if (!$dsGiangVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy giảng viên nào.'
            ], 404);
        }

        $dsGiangVien = $dsGiangVien->map(function($giangVien) {
            if($giangVien->nguoiDung) {
                $giangVien->nguoiDung->makeVisible(['mat_khau']);
            }
            return $giangVien;
        });

        return response()->json([
            'trangthai' => true,
            'ds_giangvien' => $dsGiangVien,
        ]);
    }


    public function layDsGiangVienTheoNganh($maNganh)
    {
        $dsGiangVien = $this->nguoiDungService->layDsGiangVienTheoNganh($maNganh);

        if (!$dsGiangVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy giảng viên nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_giangvien' => $dsGiangVien,
        ]);
    }

    public function layDsSinhVienTheoNganh($maNganh)
    {
        $dsSinhVien = $this->nguoiDungService->layDsSinhVienTheoNganh($maNganh);

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


    public function layChiTietNhom($id_nhom)
    {
        $nguoidung_id = Auth::id();

        $nhom = NhomDoAn::where('id_nhom', $id_nhom)
                        ->where(function($query) use ($nguoidung_id) {
                            $query->where('ma_nguoitao', $nguoidung_id) 
                                ->orWhereHas('sinhViens', function($q) use ($nguoidung_id) {
                                    $q->where('id_sinhvien', $nguoidung_id);
                                });
                        })
                        ->with(['nguoiTao.nguoiDung', 'sinhViens.nguoiDung'])
                        ->first();

        if (!$nhom) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Bạn không có quyền truy cập nhóm này hoặc nhóm không tồn tại.'
            ], 403);
        }

        return response()->json([
            'trangthai' => true,
            'nhom' => $nhom,
        ]);
    }


    public function layDsThongBao()
    {

        $dsThongBao = DB::table('bai_dang')
            ->orderBy('created_at', 'desc')
            ->get();

        // // lấy tên tệp từ đường dẫn cloudinary
        foreach ($dsThongBao as $thongBao) {
            if ($thongBao->duong_dan_tep) {
                $thongBao->ten_tep = urldecode(basename($thongBao->duong_dan_tep));
            } else {
                $thongBao->ten_tep = null;
            }
        }

        

        return response()->json([
            'trangthai' => true,
            'ds_thongbao' => $dsThongBao
        ]);
    }

    public function layChiTietThongBao($id_baidang)
    {
        $thongBao = DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->first();

        if (!$thongBao) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy thông báo.'
            ], 404);
        }
        // lấy tên tệp từ đường dẫn cloudinary
        if ($thongBao->duong_dan_tep) {
            $thongBao->ten_tep = urldecode(basename($thongBao->duong_dan_tep));
        } else {
            $thongBao->ten_tep = null;
        }

        return response()->json([
            'trangthai' => true,
            'thongbao' => $thongBao
        ]);
    }
}
