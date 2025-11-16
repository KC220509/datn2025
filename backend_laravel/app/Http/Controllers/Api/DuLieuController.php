<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportDanhSachRequest;
use App\Imports\SinhViensImport;
use App\Models\HocKyDk;
use App\Services\KhoaNganhLopService;
use App\Services\NguoiDungService;
use Maatwebsite\Excel\Excel;

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

    public function importDsSinhVien(ImportDanhSachRequest $importDanhSachRequest){
        $duLieu = $importDanhSachRequest->validated();

        $hocKyId = $duLieu['id_hocky'];
        $file = $duLieu['file'];

        
        try{
            Excel::import(new SinhViensImport($hocKyId), $file);
            return response()->json([
                'trangthai' => true,
                'thongbao' => 'Nhập danh sách sinh viên thành công.',
            ]);
        }
        catch(\Exception $e){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Có lỗi xảy ra trong quá trình nhập dữ liệu: ' . $e->getMessage(),
            ], 500);
        }
    }

}
