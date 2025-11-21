<?php

namespace App\Imports;

use App\Models\GiangVien;
use App\Models\Nganh;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class GiangViensImport implements ToModel, WithHeadingRow, WithChunkReading, WithValidation, SkipsOnFailure, SkipsEmptyRows
{
    private $hocKyId;
    // private const VAI_TRO = 'GV';
    private $nganhs;
    private $lois = [];
    
    public function __construct($hocKyId)
    {
        $this->hocKyId = $hocKyId;
        $this->nganhs = Nganh::pluck('id_nganh', 'ky_hieu')->toArray();
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
            'emailgv' => 'required|email',
            'hoten' => 'required|string', 
            'kyhieunganh' => 'required|string',
            'hochamhocvi' => 'nullable|string',
            'sodienthoai' => 'nullable',
            'diachi' => 'nullable|string',
            'vaitro' => 'required|string'
        ];
    }
    
    public function customValidationMessages()
    {
        return [
            'emailgv.required' => 'Thiếu cột [Email GV] hoặc tiêu đề cột không đúng.',
            'hoten.required' => 'Thiếu cột [Họ Tên] hoặc tiêu đề cột không đúng.',
            'kyhieunganh.required' => 'Thiếu cột [Ký Hiệu Ngành] hoặc tiêu đề cột không đúng.',
            'hochamhocvi.required' => 'Thiếu cột [Học Hàm Học Vị] hoặc tiêu đề cột không đúng.',
            'sodienthoai.required' => 'Thiếu cột [Số Điện Thoại] hoặc tiêu đề cột không đúng.',
            'diachi.required' => 'Thiếu cột [Địa Chỉ] hoặc tiêu đề cột không đúng.',
            'vaitro.required' => 'Thiếu cột [Vai Trò] hoặc tiêu đề cột không đúng.'
        ];
    }
    public function model(array $dong)
    {
        logger()->info('Dòng Excel đọc được:', $dong); 

        $email = $dong['emailgv'] ?? null;
        $hoTen = $dong['hoten'] ?? null;
        $maNganh = $this->nganhs[$dong['kyhieunganh']] ?? null;
        $hocHamHocVi = $dong['hochamhocvi'] ?? null;
        $soDienThoai = $dong['sodienthoai'] ?? null;
        $diaChi = $dong['diachi'] ?? null;
        $vaiTro = $dong['vaitro'] ?? null;

        if(empty($email) || empty($hoTen) || empty($maNganh) || empty($vaiTro)){
            return null;
        }

        return DB::transaction(function () use ($email, $hoTen, $hocHamHocVi, $soDienThoai, $diaChi, $maNganh, $vaiTro) {
            
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
            $vaiTroString = $vaiTro;

            $mangMaVaiTro = collect(preg_split('/,\s*/', $vaiTroString))
                            ->filter()
                            ->unique()
                            ->toArray();

            $dsMaVaiTro = DB::table('vai_tro')
                            ->whereIn('id_vaitro', $mangMaVaiTro)
                            ->pluck('id_vaitro')
                            ->toArray();

            foreach ($dsMaVaiTro as $maVaiTro) {
                DB::table('nguoidung_vaitro')->updateOrInsert(
                [
                    'ma_nguoidung' => $nguoiDungId, 
                    'ma_vaitro' => $maVaiTro,
                ],
                [
                    'created_at' => now(), 
                    'updated_at' => now(),
                ]
            );
            }
            

            DB::table('nguoidung_hocky')->updateOrInsert(
                [
                    'ma_nguoidung' => $nguoiDungId, 
                    'ma_hocky' => $this->hocKyId
                ],
                [
                    'created_at' => now(), 
                    'updated_at' => now(),
                ]
            );

            $giangVien = GiangVien::updateOrCreate(
                ['id_giangvien' => $nguoiDungId], 
                [
                    'ma_nganh' => $maNganh,
                    'hoc_ham_hoc_vi' => $hocHamHocVi,
                ]
            );


            return $giangVien;
        });

    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
