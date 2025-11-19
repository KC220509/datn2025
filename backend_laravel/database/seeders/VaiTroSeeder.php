<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vaiTros = [
            [
                'id_vaitro' => 'AD', 
                'ten_hien_thi' => 'Quản trị viên',
                'mo_ta' => 'Có toàn quyền truy cập và quản lý hệ thống.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_vaitro' => 'PDT',
                'ten_hien_thi' => 'Phòng đào tạo',
                'mo_ta' => 'Quyền truy cập cơ bản, dành cho người dùng phòng đào tạo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_vaitro' => 'TBM',
                'ten_hien_thi' => 'Trưởng bộ môn',
                'mo_ta' => 'Quyền truy cập cơ bản, dành cho người dùng giảng viên có quyền trưởng bộ môn',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_vaitro' => 'GV',
                'ten_hien_thi' => 'Giảng viên',
                'mo_ta' => 'Quyền truy cập cơ bản, dành cho giảng viên hướng dẫn',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_vaitro' => 'SV',
                'ten_hien_thi' => 'Sinh viên',
                'mo_ta' => 'Quyền truy cập cơ bản dành cho sinh viên',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('vai_tro')->insert($vaiTros);
    }
}
