<?php

namespace App\Imports;

use App\Models\LopSinhHoat;
use App\Models\NguoiDung;
use App\Models\SinhVien;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class SinhViensImport implements ToModel, WithHeadingRow, WithChunkReading, WithValidation, SkipsOnFailure, SkipsEmptyRows
{
    private $hocKyId;
    private const VAI_TRO = 'SV';
    private $lopSinhHoats;
    private $lois = [];
    
    public function __construct($hocKyId)
    {
        $this->hocKyId = $hocKyId;
        $this->lopSinhHoats = LopSinhHoat::pluck('id_lop', 'ten_lop')->toArray(); 
    }

    public function onFailure(Failure ...$lois)
    {
        $this->lois = array_merge($this->lois, $lois);
    }

    public function getFailures()
    {
        return $this->lois;
    }

    public function rules(): array
    {
        return [
            'emailsv' => 'required|email',
            'hoten' => 'required|string',
            'masinhvien' => 'required',
            'lop' => 'required|string', 
            'sodienthoai' => 'nullable',
            'diachi' => 'nullable|string',
        ];
    }
    
    public function customValidationMessages()
    {
        return [
            'emailsv.required' => 'Thiếu cột [Email SV] hoặc tiêu đề cột không đúng.',
            'hoten.required' => 'Thiếu cột [Họ Tên] hoặc tiêu đề cột không đúng.',
            'masinhvien.required' => 'Thiếu cột [Mã Sinh Viên] hoặc tiêu đề cột không đúng.',
            'lop.required' => 'Thiếu cột [Lớp] hoặc tên lớp bị trống.',
            'emailsv.unique' => 'Email sinh viên đã tồn tại.',
        ];
    }
    
    public function model(array $dong)
    {
        // logger()->info('Dòng Excel đọc được:', $dong); 

        $email = $dong['emailsv'] ?? null;
        $hoTen = $dong['hoten'] ?? null;
        $maSv = $dong['masinhvien'] ?? null;
        $soDienThoai = $dong['sodienthoai'] ?? null;
        $diaChi = $dong['diachi'] ?? null;
        $maLop = $this->lopSinhHoats[$dong['lop']] ?? null;

        
        
        if(empty($email) || empty($hoTen) || empty($maSv)){
            return null;
        }

        if (!$maLop) {
           throw new \Exception("Không tìm thấy UUID Lớp cho tên lớp: " . $dong['lop']);
        }


        return DB::transaction(function () use ($email, $hoTen, $maSv, $soDienThoai, $diaChi, $maLop) {
            
            $nguoiDung = NguoiDung::firstOrCreate(
                ['email' => $email],
                [
                    'id_nguoidung' => (string) Str::uuid(), 
                    'mat_khau' => null, 
                    'ho_ten' => $hoTen,
                    'so_dien_thoai' => $soDienThoai,
                    'dia_chi' => $diaChi,
                    'gioi_tinh' => true,
                    'trang_thai' => true,
                ]
            );

            // Cập nhật thông tin nếu User đã tồn tại
            if (!$nguoiDung->wasRecentlyCreated) {
                $nguoiDung->update([
                    'ho_ten' => $hoTen,
                    'so_dien_thoai' => $soDienThoai,
                    'dia_chi' => $diaChi,
                ]);
            }

            $nguoiDungId = $nguoiDung->id_nguoidung;
            DB::table('nguoidung_vaitro')->updateOrInsert(
                [
                    'ma_nguoidung' => $nguoiDungId, 
                    'ma_vaitro' => self::VAI_TRO
                ],
                [
                    'created_at' => now(), // Chỉ thêm khi insert
                    'updated_at' => now(),
                ]
            );

            DB::table('nguoidung_hocky')->updateOrInsert(
                [
                    'ma_nguoidung' => $nguoiDungId, 
                    'ma_hocky' => $this->hocKyId
                ],
                [
                    'created_at' => now(), // Chỉ thêm khi insert
                    'updated_at' => now(),
                ]
            );

            $sinhVien = SinhVien::updateOrCreate(
                ['id_sinhvien' => $nguoiDungId], // Key tìm kiếm
                [
                    'ma_lop' => $maLop,
                    'msv' => $maSv,
                ]
            );


            return $sinhVien; 
        }); 
    }

    // public function batchSize(): int
    // {
    //     return 1000;
    // }

    public function chunkSize(): int  // Mỗi lần đọc 1000 dòng
    {
        return 1000;
    }
}
