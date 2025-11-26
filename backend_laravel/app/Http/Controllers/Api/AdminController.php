<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\SinhVien;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaoDsTaiKhoanSvRequest;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function taoDsTaiKhoanSv(TaoDsTaiKhoanSvRequest $taoDsTaiKhoanSvRequest)
    {
        $validatedData = $taoDsTaiKhoanSvRequest->validated();
        $idHocKy = $validatedData['id_hocky'];

        $dsSinhVien = [];

        DB::beginTransaction();
        try {
            $danhSachSinhVienId = SinhVien::whereHas('nguoiDung.hocKys', function ($query) use ($idHocKy) {
                $query->where('id_hocky', $idHocKy);
            })->distinct()->pluck('id_sinhvien');

            if ($danhSachSinhVienId->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy sinh viên nào trong học kỳ này.'], 404);
            }

            $nguoiDungs = NguoiDung::whereIn('id_nguoidung', $danhSachSinhVienId)->get();

            foreach ($nguoiDungs as $nguoiDung) {
                $matKhauGoc = Str::random(8);
                $nguoiDung->mat_khau = Hash::make($matKhauGoc);
                $nguoiDung->save();

                $dsSinhVien[] = [
                    'sinhvien' => $nguoiDung,
                ];
            }

            DB::commit();
            return response()->json([
                'trangthai' => true,
                'ds_sinhvien' => $dsSinhVien,
                'thongbao' => 'Tạo tài khoản sinh viên thành công.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi cấp lại mật khẩu hàng loạt cho sinh viên: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình xử lý.'], 500);
        }
    }
}
