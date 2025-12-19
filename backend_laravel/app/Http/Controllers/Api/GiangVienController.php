<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaoNhomRequest;
use App\Http\Requests\ThemSinhVienNhomRequest;
use App\Models\NhomDoAn;
use App\Models\PhanCong;
use App\Models\ThanhVienNhom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GiangVienController extends Controller
{
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
}
