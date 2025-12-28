<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TaoDsTaiKhoanRequest;
use App\Http\Requests\TaoTaiKhoanGvRequest;
use App\Http\Requests\TaoTaiKhoanSvRequest;
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

    public function taoTaiKhoanSV(TaoTaiKhoanSvRequest $request)
    {
        $duLieu = $request->validated();
        
        $ktraNguoiDung = NguoiDung::where('email', $duLieu['email'])->first();
        if ($ktraNguoiDung) {
            return response()->json(['message' => 'Email đã tồn tại trong hệ thống.'], 400);
        }

        DB::beginTransaction();
        try {
            $matKhauGoc = Str::random(8);
        
            $nguoiDung = NguoiDung::create([
                'id_nguoidung'  => Str::uuid(),
                'email'         => $duLieu['email'],
                'mat_khau'      => Hash::make($matKhauGoc),
                'ho_ten'        => $duLieu['ho_ten'],
                'so_dien_thoai' => $duLieu['so_dien_thoai'] ?? null,
                'dia_chi'       => $duLieu['dia_chi'] ?? null,
                'gioi_tinh'     => $duLieu['gioi_tinh'] ?? true, 
                'trang_thai'    => true,
            ]);
            

            // Tạo sinh viên
            SinhVien::create([
                'id_sinhvien' => $nguoiDung->id_nguoidung,
                'ma_lop'      => $duLieu['ma_lop'],
                'msv'         => $duLieu['msv'],
            ]);

            // Lưu vào người dùng vai trò
            $nguoiDung->vaiTros()->attach('SV');

            // Người dùng học kỳ
            DB::table('nguoidung_hocky')->insert([
                'ma_nguoidung' => $nguoiDung->id_nguoidung,
                'ma_hocky' => $duLieu['ma_hocky'], 
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();
            
            // Gửi mail thông báo
            Mail::to($nguoiDung->email)->send(new ThongBaoCapTaiKhoan($nguoiDung, $matKhauGoc));


            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tạo tài khoản sinh viên thành công.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi tạo tài khoản sinh viên: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình xử lý.'], 500);
        }
    }
    public function taoTaiKhoanGV(TaoTaiKhoanGvRequest $request)
    {
        $duLieu = $request->validated();
        
        $ktraNguoiDung = NguoiDung::where('email', $duLieu['email'])->first();
        if ($ktraNguoiDung) {
            return response()->json(['message' => 'Email đã tồn tại trong hệ thống.'], 400);
        }

        DB::beginTransaction();
        try {
            $matKhauGoc = Str::random(8);
        
            $nguoiDung = NguoiDung::create([
                'id_nguoidung'  => Str::uuid(),
                'email'         => $duLieu['email'],
                'mat_khau'      => Hash::make($matKhauGoc),
                'ho_ten'        => $duLieu['ho_ten'],
                'so_dien_thoai' => $duLieu['so_dien_thoai'] ?? null,
                'dia_chi'       => null,
                'gioi_tinh'     => $duLieu['gioi_tinh'] ?? true, 
                'trang_thai'    => true,
            ]);
            

            // Tạo sinh viên
            GiangVien::create([
                'id_giangvien' => $nguoiDung->id_nguoidung,
                'ma_nganh'      => $duLieu['ma_nganh'],
                'hoc_ham_hoc_vi' => $duLieu['hoc_ham_hoc_vi'],
            ]);

            // Lưu vào vai trò người dùng
            $nguoiDung->vaiTros()->attach('GV');
            if(isset($duLieu['la_truong_bomon']) && $duLieu['la_truong_bomon']){
                $nguoiDung->vaiTros()->attach('TBM');

                $idTBMCu = DB::table('nganh')
                        ->where('id_nganh', $duLieu['ma_nganh'])
                        ->value('ma_truongbomon');

                if ($idTBMCu && $idTBMCu !== $nguoiDung->id_nguoidung) {
                    DB::table('nguoidung_vaitro')
                        ->where('ma_nguoidung', $idTBMCu)
                        ->where('ma_vaitro', 'TBM')
                        ->delete();
                }
                    
                DB::table('nganh')->where('id_nganh', $duLieu['ma_nganh'])->update(
                    [
                        'ma_truongbomon' => $nguoiDung->id_nguoidung, 
                        'updated_at' => now(),
                    ]
                );
            }

            // Người dùng học kỳ
            DB::table('nguoidung_hocky')->insert([
                'ma_nguoidung' => $nguoiDung->id_nguoidung,
                'ma_hocky' => $duLieu['ma_hocky'], 
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();
            
            // Gửi mail thông báo
            Mail::to($nguoiDung->email)->send(new ThongBaoCapTaiKhoan($nguoiDung, $matKhauGoc));


            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tạo tài khoản giảng viên thành công.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi tạo tài khoản giảng viên: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình xử lý.'], 500);
        }
    }

    public function taoDsTaiKhoanSv(TaoDsTaiKhoanRequest $taoDsTaiKhoanRequest)
    {
        $duLieu = $taoDsTaiKhoanRequest->validated();
        $idHocKy = $duLieu['id_hocky'];

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
        $duLieu = $taoDsTaiKhoanRequest->validated();
        $idHocKy = $duLieu['id_hocky'];

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

                    Mail::to($nguoiDung->email)->send(new ThongBaoCapTaiKhoan($nguoiDung, $matKhauGoc));
  
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


    public function xoaTkGiangVien($idGiangVien)
    {
        DB::beginTransaction();
        try {
            $giangVien = GiangVien::find($idGiangVien);
            $nguoiDung = NguoiDung::find($idGiangVien);

            if (!$giangVien || !$nguoiDung) {
                return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
            }

            $giangVien->delete();
            $nguoiDung->delete();

            DB::commit();

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Xóa tài khoản giảng viên thành công.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi xóa tài khoản giảng viên: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function xoaTkSinhVien($idSinhVien)
    {
        DB::beginTransaction();
        try {
            $sinhVien = SinhVien::find($idSinhVien);
            $nguoiDung = NguoiDung::find($idSinhVien);

            if (!$sinhVien || !$nguoiDung) {
                return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
            }

            $sinhVien->delete();
            $nguoiDung->delete();

            DB::commit();

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Xóa tài khoản sinh viên thành công.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi xóa tài khoản sinh viên: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function khoaTaiKhoan($idNguoiDung)
    {
        DB::beginTransaction();
        try {
            $nguoiDung = NguoiDung::find($idNguoiDung);

            if (!$nguoiDung) {
                return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
            }

            $nguoiDung->trang_thai = false;
            $nguoiDung->save();

            DB::commit();

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Khóa tài khoản người dùng thành công.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi khóa tài khoản người dùng: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
    public function moKhoaTaiKhoan($idNguoiDung)
    {
        DB::beginTransaction();
        try {
            $nguoiDung = NguoiDung::find($idNguoiDung);

            if (!$nguoiDung) {
                return response()->json(['thongbao' => 'Không tìm thấy dữ liệu.'], 404);
            }

            if($nguoiDung->mat_khau == null){
                return response()->json(['thongbao' => 'Tài khoản người dùng chưa được cấp.'], 400);
            }else{

                $nguoiDung->trang_thai = true;
                $nguoiDung->save();
            }


            DB::commit();

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Mở khóa tài khoản người dùng thành công.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi mở khóa tài khoản người dùng: ' . $e->getMessage());
            return response()->json(['thongbao' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}
