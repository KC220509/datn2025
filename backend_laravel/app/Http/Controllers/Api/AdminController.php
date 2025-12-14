<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TaoDsTaiKhoanRequest;
use App\Models\User;
use App\Models\SinhVien;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaoDsTaiKhoanSvRequest;
use App\Mail\ThongBaoCapTaiKhoan;
use App\Models\GiangVien;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function taoDsTaiKhoanSv(TaoDsTaiKhoanRequest $taoDsTaiKhoanRequest)
    {
        $validatedData = $taoDsTaiKhoanRequest->validated();
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
                if ($nguoiDung->mat_khau == null) {
                    $matKhauGoc = Str::random(8);
                    $nguoiDung->mat_khau = Hash::make($matKhauGoc);
                    $nguoiDung->trang_thai = true;
                    $nguoiDung->save();

                    // Gửi email thông báo tài khoản và mật khẩu cho sinh viên
                    Mail::to($nguoiDung->email)->send(new ThongBaoCapTaiKhoan($nguoiDung, $matKhauGoc));

                }
                
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
            Log::error('Lỗi khi tạo tài khoản hàng loạt cho sinh viên: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình xử lý.'], 500);
        }
    }

    public function taoDsTaiKhoanGv(TaoDsTaiKhoanRequest $taoDsTaiKhoanRequest)
    {
        $data = $taoDsTaiKhoanRequest->validated();
        $idHocKy = $data['id_hocky'];

        DB::beginTransaction();

        try {
            $danhSachGiangVienId = GiangVien::whereHas('nguoiDung.hocKys', function ($query) use ($idHocKy) {
                $query->where('id_hocky', $idHocKy);
            })->distinct()->pluck('id_giangvien');

            if ($danhSachGiangVienId->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy giảng viên nào trong học kỳ này.'], 404);
            }

            $nguoiDungs = NguoiDung::whereIn('id_nguoidung', $danhSachGiangVienId)->get();

            foreach ($nguoiDungs as $nguoiDung) {
                if ($nguoiDung->mat_khau == null) {
                    $matKhauGoc = Str::random(8);
                    $nguoiDung->mat_khau = Hash::make($matKhauGoc);
                    $nguoiDung->trang_thai = true;
                    $nguoiDung->save();

                    // Gửi email thông báo tài khoản và mật khẩu cho sinh viên
                    Mail::to($nguoiDung->email)->send(new ThongBaoCapTaiKhoan($nguoiDung, $matKhauGoc));

                    // $dsGiangVien[] = [
                    //     'giangvien' => $nguoiDung,
                    // ];
                }
                $dsGiangVien[] = [
                    'giangvien' => $nguoiDung,
                ];
            }

            DB::commit();

            return response()->json([
                'trangthai' => true,
                'ds_giangvien' => $dsGiangVien,
                'thongbao' => 'Tạo tài khoản giảng viên thành công.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi tạo tài khoản hàng loạt cho giảng viên: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình xử lý.'], 500);
        }
    }
}
