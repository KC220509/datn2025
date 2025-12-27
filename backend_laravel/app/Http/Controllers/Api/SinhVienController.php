<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SinhVienNopBaiRequest;
use App\Models\NguoiDung;
use App\Models\NhiemVu;
use App\Models\NhomDoAn;
use App\Models\NopBai;
use App\Models\PhanCong;
use App\Models\SinhVien;
use App\Models\ThanhVienNhom;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SinhVienController extends Controller
{

    protected $sinhVienModel;
    protected $cloudinaryService;
    public function __construct(SinhVien $sinhVienModel, CloudinaryService $cloudinaryService)
    {
        $this->sinhVienModel = $sinhVienModel;
        $this->cloudinaryService = $cloudinaryService;
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

    public function NopBai(SinhVienNopBaiRequest $request, $idNhiemVu)
    {
        $id_sinhvien = Auth::id();

        $nhiemvu = NhiemVu::find($idNhiemVu);
        if (!$nhiemvu) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Nhiệm vụ không tồn tại.'
            ], 404);
        }

        // Xử lý lưu tệp đính kèm
        $dsDuongDanTep = [];
        if($request->hasFile('tep_dinh_kem')){
            $dsTep = $request->file('tep_dinh_kem');
            $tenThuMuc = 'nhiem_vu/nhom_' . $nhiemvu->ma_nhom . '/nv_' . $idNhiemVu . '/nop_bai_sv' .$id_sinhvien;
            $dsDuongDanTep = $this->cloudinaryService->uploadNhieuTep($dsTep, $tenThuMuc);
        }

        $ketQua = NopBai::updateOrCreate(
            [
                'ma_nhiemvu' => $idNhiemVu,
                'ma_sinhvien' => $id_sinhvien
            ],
            [
                'id_nopbai' => Str::uuid(),
                'ma_nhom' => $nhiemvu->ma_nhom,
                'duong_dan_teps' => $dsDuongDanTep,
                'thoigian_nop' => now(),
                'trang_thai' => now() > $nhiemvu->han_nop ? 'tre_han' : 'dung_han' 
            ]
        );
        

        

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Nộp bài thành công.',
            'nhiemvu' => $nhiemvu,
            'nopBai' => $ketQua
        ]);
    }
}
