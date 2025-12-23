<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\NhiemVu;
use App\Models\NhomDoAn;
use App\Models\PhanCong;
use App\Models\SinhVien;
use App\Models\ThanhVienNhom;
use Illuminate\Support\Facades\Auth;

class SinhVienController extends Controller
{

    protected $sinhVienModel;
    public function __construct(SinhVien $sinhVienModel)
    {
        $this->sinhVienModel = $sinhVienModel;
    }
    public function layThongTinSV(){
        $id_sinhvien = Auth::id();
        $sinhvien = $this->sinhVienModel->with([
                'nguoiDung',
                'lop',
                'lop.nganh',
                'nguoiDung.hocKys',
            ])
            ->where('id_sinhvien', $id_sinhvien)
            ->get();


        if (!$sinhvien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy thông tin sinh viên.',
                'sinhvien' => null
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Thông tin sinh viên được lấy thành công.',
            'sinhvien' => $sinhvien
        ]);
    }
    
    public function layDanhSachGiangVienHd(){
        $id_sinhvien = Auth::id();

        $ds_giangvien_hd = PhanCong::with(['hocKy', 'giangVien', 'nguoiDungGiangVien', 'sinhVien', 'nguoidungSinhVien'])
            ->where('ma_sinhvien', $id_sinhvien)
            ->get();

        
        if (!$ds_giangvien_hd || $ds_giangvien_hd->isEmpty()) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy giảng viên được phân công cho sinh viên này.',
                'ds_giangvien_hd' => []
            ], 404);
        }

        foreach ($ds_giangvien_hd as $tt){
            $tt["nganh_gv"] = $tt->giangVien->nganh->ten_nganh;

        }


        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Danh sách giảng viên được phân công cho sinh viên.',
            'ds_giangvien_hd' => $ds_giangvien_hd
        ]);
    }

    public function layDanhSachNhom()
    {
        $id_sinhvien = Auth::id();

        $sinhvien = $this->sinhVienModel->find($id_sinhvien);
        if (!$sinhvien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Sinh viên không tồn tại.'
            ], 404);
        }

        $ds_nhom = $sinhvien->nhomDoAns()
                            ->with(['hocKy', 'nguoiTao.nguoiDung', 'sinhViens'])
                            ->orderBy('created_at', 'desc')
                            ->get();

        if ($ds_nhom->isEmpty()) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Sinh viên chưa tham gia nhóm nào.'
            ]);
        }

        

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Danh sách nhóm được lấy thành công.',
            'ds_nhom' => $ds_nhom
        ]);
    }

   
}
