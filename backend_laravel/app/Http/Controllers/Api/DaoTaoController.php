<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DangBaiRequest;
use App\Models\BaiDang;
use App\Models\HocKyDk;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\ImportDanhSachGvRequest;
use App\Http\Requests\ImportDanhSachSvRequest;
use App\Imports\GiangViensImport;
use App\Imports\SinhViensImport;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use Illuminate\Support\Facades\Auth;

class DaoTaoController extends Controller
{
    protected $cloudinaryService;
    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }
    
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
                $tenHocKy = HocKyDk::where('id_hocky', $hocKyId)->value('ten_hoc_ky');
                $tenThuMuc = 'danh-sach-sinh-vien/' . $tenHocKy;

                $duongDanTep = $this->cloudinaryService->uploadTep($tep, $tenThuMuc);

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

                $tenHocKy = HocKyDk::where('id_hocky', $hocKyId)->value('ten_hoc_ky');
                
                $tenThuMuc = 'danh-sach-giang-vien/' . $tenHocKy;
                $duongDanTep = $this->cloudinaryService->uploadTep($tep, $tenThuMuc);

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
        ini_set('max_execution_time', 300); 
        
        $maPhongDaoTao = Auth::id();
        $baiDangMoi = null;

        DB::transaction(function () use ($dangBaiRequest, $maPhongDaoTao, &$baiDangMoi) {
            $dsDuongDanTep = [];
            if($dangBaiRequest->hasFile('tep_dinh_kem')){
                $dsTep = $dangBaiRequest->file('tep_dinh_kem');

                $tenThuMuc = 'thong_bao/phong_dao_tao_' . $maPhongDaoTao;
                $dsDuongDanTep = $this->cloudinaryService->uploadNhieuTep($dsTep, $tenThuMuc);
            }


            $baiDangMoi = BaiDang::create([
                'id_baidang' => (string) Str::uuid(),
                'ma_phongdaotao' => $maPhongDaoTao,
                'tieu_de' => $dangBaiRequest->input('tieu_de'),
                'noi_dung' => $dangBaiRequest->input('noi_dung'),
                'duong_dan_teps' => $dsDuongDanTep,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
        

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Đăng bài mới thành công.',
            'baidang_moi' => $baiDangMoi,
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
        ini_set('max_execution_time', 300);
        
        $maPhongDaoTao = Auth::id();

        $baiDang = BaiDang::where('id_baidang', $id_baidang)
            ->where('ma_phongdaotao', $maPhongDaoTao)
            ->first();

        if (!$baiDang) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Bài đăng không tồn tại hoặc bạn không có quyền cập nhật bài đăng này.'
            ], 404);
        }

        $baiDang->tieu_de = $dangBaiRequest->input('tieu_de');
        $baiDang->noi_dung = $dangBaiRequest->input('noi_dung');

        $dsDuongDanTep = [];
        if($dangBaiRequest->hasFile('tep_dinh_kem')){
            $dsTep = $dangBaiRequest->file('tep_dinh_kem');
            
            $tenThuMuc = 'thong_bao/phong_dao_tao_' . $maPhongDaoTao;
            $dsDuongDanTep = $this->cloudinaryService->uploadNhieuTep($dsTep, $tenThuMuc);
        }
        
        if(count($dsDuongDanTep) > 0){
            $baiDang->duong_dan_teps = $dsDuongDanTep;
        }
        $baiDang->save();


        $dsTenTep = [];
        if ($baiDang->duong_dan_teps) {
            foreach ($baiDang->duong_dan_teps as $duongDanTep) {
                $dsTenTep[] = urldecode(basename($duongDanTep));
            }
        }

        $baiDang->ten_teps = $dsTenTep;
        
        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Cập nhật bài đăng thành công.',
            'baidang_moi' => $baiDang,
        ]);
    }
}