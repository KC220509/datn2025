<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClearDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        // 2. Danh sách các bảng cần làm sạch (bạn phải liệt kê tất cả các bảng của mình)
        $tables = [
            'bao_cao',
            'ket_qua_DATN',
            'de_tai',
            'tin_nhan_nhom',
            'nhiem_vu',
            'nhom_do_an', 
            'phan_cong', 
            'giang_vien',
            'sinh_vien', 
            'lop_sinh_hoat',
            'nganh',
            'khoa',
            'nguoidung_hocky',
            'ds_sinhvien_giangvien',
            'hoc_ky_dk',
            'bai_dang',
            'vai_tro', 
            'nguoi_dung' 
        ];

        // 3. Thực hiện Truncate
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        // 4. Bật kiểm tra ràng buộc
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
