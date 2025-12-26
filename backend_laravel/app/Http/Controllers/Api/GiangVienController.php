<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaoNhiemVuRequest;
use App\Http\Requests\TaoNhomRequest;
use App\Http\Requests\ThemSinhVienNhomRequest;
use App\Models\NhiemVu;
use App\Models\NhomDoAn;
use App\Models\PhanCong;
use App\Models\ThanhVienNhom;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GiangVienController extends Controller
{
    protected $cloudinaryService;
    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }
    public function layDanhSachNhom()
    {
        $id_giangvien = Auth::id();
        $danhSachNhom = NhomDoAn::with(['hocKy', 'nguoiTao', 'sinhViens'])
            ->where('ma_nguoitao', $id_giangvien)
            ->orderBy('created_at', 'desc')
            ->get();


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


    public function layDanhSachSinhVienPc()
    {
        $id_giangvien = Auth::id();
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


    public function taoNhomDoAn(TaoNhomRequest $taoNhomRequest){
        $duLieu = $taoNhomRequest->validated();
        
        $sinhVienIds = $duLieu['sinh_vien_ids'] ?? [];
        $maNguoiTao = Auth::id();


        $nhomMoi = NhomDoAn::create([
            'id_nhom' => Str::uuid(),
            'ten_nhom' => $duLieu['ten_nhom'],
            'ma_nguoitao' => $maNguoiTao,
            'ma_hocky' => $duLieu['ma_hocky'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if(!empty($sinhVienIds)){
            $duLieuThanhVien = [];
            foreach($sinhVienIds as $idSV){
                $duLieuThanhVien[] = [
                    'id_thanhviennhom' => Str::uuid(),
                    'ma_nhom' => $nhomMoi->id_nhom,
                    'ma_sinhvien' => $idSV,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            ThanhVienNhom::insert($duLieuThanhVien);
        }


        
        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Tạo nhóm đồ án thành công.',
            'id_nhom' => $nhomMoi->id_nhom,
        ]);
    }

    public function themSinhVienVaoNhom(ThemSinhVienNhomRequest $request, $id_nhom){
        $nhom = NhomDoAn::find($id_nhom);
        if(!$nhom){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Nhóm đồ án không tồn tại.'
            ], 404);
        }

        $sinhVienIds = $request->input('sinh_vien_ids', []);
        if(empty($sinhVienIds)){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Danh sách sinh viên rỗng.'
            ], 400);
        }

        $duLieuThanhVien = [];
        foreach($sinhVienIds as $idSV){
            $duLieuThanhVien[] = [
                'id_thanhviennhom' => Str::uuid(),
                'ma_nhom' => $id_nhom,
                'ma_sinhvien' => $idSV,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        ThanhVienNhom::insert($duLieuThanhVien);

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Thêm sinh viên vào nhóm đồ án thành công.'
        ]);
    }

    public function xoaNhomDoAn($id_nhom){
        $nhom = NhomDoAn::find($id_nhom);
        if(!$nhom){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Nhóm đồ án không tồn tại.'
            ], 404);
        }

        ThanhVienNhom::where('ma_nhom', $id_nhom)->delete();

        // Xóa nhóm đồ án
        $nhom->delete();

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Xóa nhóm đồ án thành công.'
        ]);
    }

    public function xoaThanhVienKhoiNhom($id_nhom, $id_sinhvien){
        $thanhVien = ThanhVienNhom::where('ma_nhom', $id_nhom)
            ->where('ma_sinhvien', $id_sinhvien)
            ->first();
            
        if(!$thanhVien){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Thành viên không tồn tại trong nhóm.'
            ], 404);
        }
        $thanhVien->delete();
        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Xóa thành viên khỏi nhóm thành công.'
        ]);
    }


    

    public function taoNhiemVu(TaoNhiemVuRequest $request, $idNhom){
        $duLieu = $request->validated();

        if($idNhom){
            $nhom = NhomDoAn::find($idNhom);
            if(!$nhom){
                return response()->json([
                    'trangthai' => false,
                    'thongbao' => 'Nhóm không tồn tại.'
                ], 404);
            }
        }

        try{
            $dsDuongDanTep = [];
            $idNhiemVu = Str::uuid();
            if($request->hasFile('tep_dinh_kem')){
                $dsTep = $request->file('tep_dinh_kem');
                $tenThuMuc = "nhiem_vu/nhom_" . $idNhom . 'nv_' . $idNhiemVu;
                $dsDuongDanTep = $this->cloudinaryService->uploadNhieuTep($dsTep, $tenThuMuc);
            }

            $nhiemVu = NhiemVu::create([
                'id_nhiemvu' => $idNhiemVu,
                'ma_nhom' => $idNhom,
                'ten_nhiemvu' => $duLieu['ten_nhiemvu'],
                'noi_dung' => $duLieu['noi_dung'] ?? null,
                'duong_dan_teps' => $dsDuongDanTep,
                'han_nop' => $duLieu['han_nop'],
                'han_dong' => $duLieu['han_dong'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tạo nhiệm vụ thành công.',
                'nhiemvu' => $nhiemVu
            ]);
        }catch(\Exception $e){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Lỗi xử lý: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function xoaNhiemVu($id_nhiemvu){
        $nhiemVu = NhiemVu::find($id_nhiemvu);
        if(!$nhiemVu){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Nhiệm vụ không tồn tại.'
            ], 404);
        }

        $nhiemVu->delete();

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Xóa nhiệm vụ thành công.'
        ]);
    }

    public function capNhatNhiemVu(TaoNhiemVuRequest $request, $id_nhiemvu){
        $duLieu = $request->validated();

        $nhiemVu = NhiemVu::find($id_nhiemvu);
        if(!$nhiemVu){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Nhiệm vụ không tồn tại.'
            ], 404);
        }

        try{
            $dsDuongDanTep = $nhiemVu->duong_dan_teps;
            if($request->hasFile('tep_dinh_kem')){
                $dsTep = $request->file('tep_dinh_kem');
                $tenThuMuc = "nhiem_vu/nhom_" . $nhiemVu->ma_nhom . '/nv_' . $nhiemVu->id_nhiemvu;
                $dsDuongDanTep = $this->cloudinaryService->uploadNhieuTep($dsTep, $tenThuMuc);
            }

            $nhiemVu->update([
                'ten_nhiemvu' => $duLieu['ten_nhiemvu'],
                'noi_dung' => $duLieu['noi_dung'] ?? null,
                'duong_dan_teps' => $dsDuongDanTep,
                'han_nop' => $duLieu['han_nop'],
                'han_dong' => $duLieu['han_dong'],
                'updated_at' => now(),
            ]);

            $danhSachNop = $nhiemVu->danhSachNopBai;

            foreach ($danhSachNop as $nopBai) {
                $trangThaiMoi = ($nopBai->thoigian_nop <= $duLieu['han_nop']) ? 'dung_han' : 'tre_han';
                
                $nopBai->update(['trang_thai' => $trangThaiMoi]);
            }


            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Cập nhật nhiệm vụ thành công.',
                'nhiemvu' => $nhiemVu
            ]);
        }catch(\Exception $e){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Lỗi xử lý: ' . $e->getMessage(),
            ], 500);
        }
    }
    
}
