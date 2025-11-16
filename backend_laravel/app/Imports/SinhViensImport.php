<?php

namespace App\Imports;

use App\Models\HocKyDk;
use App\Models\LopSinhHoat;
use App\Models\NguoiDung;
use App\Models\SinhVien;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SinhViensImport implements ToModel, WithHeadingRow
{
    protected $hocKyId;

    public function __construct($hocKyId)
    {
        $this->hocKyId = $hocKyId;
    }

    public function tieuDeDong()
    {
        return 1;
    }
    public function model(array $dong)
    {
        return DB::transaction(function () use ($dong) {
            
            $lopsinhhoat = LopSinhHoat::where('ten_lop', $dong['lop_sinh_hoat'])->first();   
            $hocky = HocKyDk::find($this->hocKyId);

            if(!$lopsinhhoat || !$hocky) {
                return null;
            }

            $nguoiDungId = (string) Str::uuid();

            $nguoiDung = NguoiDung::create([
                'id_nguoidung' => $nguoiDungId,
                'email' => $dong['email'],
                'mat_khau' => null,
                'ho_ten' => $dong['ho_ten'],
                'so_dien_thoai' => $dong['so_dien_thoai'],
                'dia_chi' => $dong['dia_chi'],
                'gioi_tinh' => strtolower($dong['gioi_tinh']) === 'nam',
            ]);

            SinhVien::create([
                'id_sinhvien' => $nguoiDungId,
                'ma_lop' => $lopsinhhoat->id_lop,
                'msv' => $dong['msv'],
            ]);

            DB::table('vai_tro')->insert([
                'ma_nguoidung' => $nguoiDungId,
                'ten_vai_tro' => 'SV',
                'mo_ta' => 'Sinh Viên',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('nguoidung_hocky')->insert([
                'ma_nguoidung' => $nguoiDungId,
                'ma_hocky' => $hocky->id_hocky,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $nguoiDung;

        });
    }
}
