<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PhongDaoTaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phongDaoTaoId = (string) Str::uuid();

        DB::table('nguoi_dung')->insert([
            'id_nguoidung' => $phongDaoTaoId,
            'email' => 'phongdaotao@gmail.com',
            'mat_khau' => Hash::make('pdt123'),
            'ho_ten' => 'Phòng Đào Tạo',
            'gioi_tinh' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Gán Vai trò (VaiTro)
        DB::table('vai_tro')->insert([
            'ma_nguoidung' => $phongDaoTaoId,
            'ten_vai_tro' => 'PDT',
            'mo_ta' => 'Phòng Đào Tạo',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
