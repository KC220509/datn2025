<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportDanhSachGvRequest;
use App\Http\Requests\ImportDanhSachSvRequest;
use App\Imports\GiangViensImport;
use App\Imports\SinhViensImport;
use App\Models\HocKyDk;
use App\Services\KhoaNganhLopService;
use App\Services\NguoiDungService;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;

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

}
