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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $dsHocKy = HocKyDk::all();

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
            Excel::import($importSinhViens, $tep);

            $layLois = $importSinhViens->getFailures();
            if(count($layLois) > 0){
                $chiTietLoi = [];
                foreach ($layLois as $loi) {
                    $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(", ", $loi->errors());
                }
                Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));

                return response()->json([
                    'trangthai' => false,
                    'thongbao' => 'Tải tệp thất bại. Vui lòng kiểm tra lại cấu trúc và dữ liệu trong tệp.',
                    'loi_chi_tiet' => $chiTietLoi
                ], 422);
            }

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
                'thongbao' => 'Tải tệp thất bại. Lỗi xác thực dữ liệu:',
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
            Excel::import($importGiangViens, $tep);

            $layLois = $importGiangViens->getFailures();
            if(count($layLois) > 0){
                $chiTietLoi = [];
                foreach ($layLois as $loi) {
                    $chiTietLoi[] = "Dòng " . $loi->row() . ": " . implode(", ", $loi->errors());
                }
                Log::error("Lỗi xác thực Excel sau import: " . json_encode($chiTietLoi));

                return response()->json([
                    'trangthai' => false,
                    'thongbao' => 'Tải tệp thất bại. Vui lòng kiểm tra lại cấu trúc và dữ liệu trong tệp.',
                    'loi_chi_tiet' => $chiTietLoi
                ], 422);
            }

            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Tải lên danh sách giảng viên thành công.'
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
                'thongbao' => 'Tải tệp thất bại. Lỗi xác thực dữ liệu:',
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

}
