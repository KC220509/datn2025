<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DangBaiRequest;
use App\Models\HocKyDk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\ImportDanhSachGvRequest;
use App\Http\Requests\ImportDanhSachSvRequest;
use App\Imports\GiangViensImport;
use App\Imports\SinhViensImport;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use Illuminate\Support\Facades\Auth;

class DaoTaoController extends Controller
{
    
    public function importDsSinhVien(ImportDanhSachSvRequest $importDanhSachSvRequest){
        $hocKyId = $importDanhSachSvRequest->input('id_hocky');
        $tep = $importDanhSachSvRequest->file('file_sinhvien');

        $importSinhViens = new SinhViensImport($hocKyId);

        try {
            DB::transaction(function () use ($importSinhViens, $tep, $hocKyId) {
                Excel::import($importSinhViens, $tep);

                $layLois = $importSinhViens->getFailures();
                if(count($layLois) > 0){
                    $chiTietLoi = [];
                    foreach ($layLois as $loi) {
                        $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(", ", $loi->errors());
                    }
                    Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));

                    throw ValidationException::withMessages($chiTietLoi);
                }

                // Upload tệp lên Cloudinary
                $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME); 
                $duoiTep = $tep->getClientOriginalExtension(); 
                $tenHocKy = HocKyDk::where('id_hocky', $hocKyId)->value('ten_hoc_ky');
                $newTenTep = $gocTenTep . '_' . $tenHocKy . '.' . $duoiTep; 

                $duongDanTepMoi = $tep->move(
                    sys_get_temp_dir(), 
                    $newTenTep  
                );

                $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
                    [
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                    ]
                );

                $duongDanTep = $taiLenCloud['secure_url'];

                DB::table('tep_dulieu_hocky')->insert([
                    'id_tep' => (string) Str::uuid(),
                    'ma_hocky' => $hocKyId,
                    'ma_phongdaotao' => Auth::user()->id_nguoidung,
                    'ten_tep' => $tep->getClientOriginalName(),
                    'duong_dan_tep' => $duongDanTep,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tải lên danh sách sinh viên thành công.'
            ]);
                
        } catch (ValidationException $e) {

            $layLois = $e->failures();
            $chiTietLoi = [];
            foreach ($layLois as $loi) {
                 $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(', ', $loi->errors());
            }
            Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tải tệp thất bại. Lỗi xác thực dữ liệu.',
                'loi_chi_tiet' => $chiTietLoi
            ], 422);

        } catch (\Exception $e) {
            Log::error("Lỗi tải tệp:" . $e->getMessage());

            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tải tệp thất bại. Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }


    public function importDsGiangVien(ImportDanhSachGvRequest $importDanhSachGvRequest){
        $hocKyId = $importDanhSachGvRequest->input('id_hocky');
        $tep = $importDanhSachGvRequest->file('file_giangvien');

        $importGiangViens = new GiangViensImport($hocKyId);


        try {
            DB::transaction(function () use ($importGiangViens, $tep, $hocKyId) {
                Excel::import($importGiangViens, $tep);

                $layLois = $importGiangViens->getFailures();
                if(count($layLois) > 0){
                    $chiTietLoi = [];
                    foreach ($layLois as $loi) {
                        $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(", ", $loi->errors());
                    }
                    Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));

                    throw ValidationException::withMessages($chiTietLoi);
                }
                // Upload tệp lên Cloudinary
                $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME); 
                $duoiTep = $tep->getClientOriginalExtension(); 
                $tenHocKy = HocKyDk::where('id_hocky', $hocKyId)->value('ten_hoc_ky');
                $newTenTep = $gocTenTep . '_' . $tenHocKy . '.' . $duoiTep;  

                $duongDanTepMoi = $tep->move(
                    sys_get_temp_dir(), 
                    $newTenTep  
                );

                $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
                    [
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                    ]
                );

                $duongDanTep = $taiLenCloud['secure_url'];

                DB::table('tep_dulieu_hocky')->insert([
                    'id_tep' => (string) Str::uuid(),
                    'ma_hocky' => $hocKyId,
                    'ma_phongdaotao' => Auth::user()->id_nguoidung,
                    'ten_tep' => $tep->getClientOriginalName(),
                    'duong_dan_tep' => $duongDanTep,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tải lên danh sách giảng viên thành công.',
            ]);

        } catch (ValidationException $e) {

            $layLois = $e->failures();
            $chiTietLoi = [];
            
            foreach ($layLois as $loi) {
                $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(', ', $loi->errors());
            }
            
            Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tệp dữ liệu không hợp lệ',
                'loi_chi_tiet' => $chiTietLoi
            ], 422);

        } catch (\Exception $e) {
            Log::error("Lỗi tải tệp:" . $e->getMessage());

            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tải tệp thất bại. Lỗi hệ thống: ' . $e->getMessage(),
                'loi_chi_tiet' => $e->getFile() . ' line ' . $e->getLine()
            ], 500);
        }
    }



    public function dangBai(DangBaiRequest $dangBaiRequest)
    {
        // $duLieu = $dangBaiRequest->validated();
        $maPhongDaoTao = Auth::id();
        

        DB::transaction(function () use ($dangBaiRequest, $maPhongDaoTao) {
            $tep = $dangBaiRequest->file('tep_dinh_kem');
            
            if ($tep) {
                $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME); 
                $duoiTep = $tep->getClientOriginalExtension(); 
                $newTenTep = $gocTenTep . '.' . $duoiTep; 

                $duongDanTepMoi = $tep->move(
                    sys_get_temp_dir(), 
                    $newTenTep  
                );

                $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
                    [
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                        'use_filename' => true,
                    ]
                );

                $duongDanTep = $taiLenCloud['secure_url'];
            }else{
                $duongDanTep = null;
            }

            

            DB::table('bai_dang')->insert([
                'id_baidang' => (string) Str::uuid(),
                'ma_phongdaotao' => $maPhongDaoTao,
                'tieu_de' => $dangBaiRequest->input('tieu_de'),
                'noi_dung' => $dangBaiRequest->input('noi_dung'),
                'duong_dan_tep' => $duongDanTep,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Đăng bài mới thành công.'
        ]);
    }


    public function xoaBaiDang($id_baidang){
        $maPhongDaoTao = Auth::id();

        $baiDang = DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->where('ma_phongdaotao', $maPhongDaoTao)
            ->first();

        if (!$baiDang) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Bài đăng không tồn tại hoặc bạn không có quyền xóa bài đăng này.'
            ], 404);
        }

        DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->where('ma_phongdaotao', $maPhongDaoTao)
            ->delete();

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Xóa bài đăng thành công.'
        ]);
    }


    public function capNhatBaiDang(DangBaiRequest $dangBaiRequest, $id_baidang){
        $maPhongDaoTao = Auth::id();

        $baiDang = DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->where('ma_phongdaotao', $maPhongDaoTao)
            ->first();

        if (!$baiDang) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Bài đăng không tồn tại hoặc bạn không có quyền cập nhật bài đăng này.'
            ], 404);
        }

        DB::transaction(function () use ($dangBaiRequest, $maPhongDaoTao, $baiDang) {
            $tep = $dangBaiRequest->file('tep_dinh_kem');
            
            if ($tep) {
                $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME); 
                $duoiTep = $tep->getClientOriginalExtension(); 
                $newTenTep = $gocTenTep . '.' . $duoiTep; 

                $duongDanTepMoi = $tep->move(
                    sys_get_temp_dir(), 
                    $newTenTep  
                );

                $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
                    [
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                        'use_filename' => true,
                    ]
                );

                $duongDanTep = $taiLenCloud['secure_url'];
            }else{
                $duongDanTep = $baiDang->duong_dan_tep;
            }

            DB::table('bai_dang')
                ->where('id_baidang', $baiDang->id_baidang)
                ->where('ma_phongdaotao', $maPhongDaoTao)
                ->update([
                    'tieu_de' => $dangBaiRequest->input('tieu_de'),
                    'noi_dung' => $dangBaiRequest->input('noi_dung'),
                    'duong_dan_tep' => $duongDanTep,
                    'updated_at' => now(),
                ]);
        });

        $baiDangMoi = DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->where('ma_phongdaotao', $maPhongDaoTao)
            ->first();

        $baiDangMoi->ten_tep = urldecode(basename($baiDangMoi->duong_dan_tep));

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Cập nhật bài đăng thành công.',
            'baidang_moi' => $baiDangMoi,
        ]);
    }
}