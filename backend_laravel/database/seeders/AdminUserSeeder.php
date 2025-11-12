<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = (string) Str::uuid();

        DB::table('nguoi_dung')->insert([
            'id_nguoidung' => $adminId,
            'email' => 'admin@gmail.com',
            'mat_khau' => Hash::make('admin123'),
            'ho_ten' => 'Admin Hệ thống',
            'gioi_tinh' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('vai_tro')->insert([
            'ma_nguoidung' => $adminId,
            'ten_vai_tro' => 'AD',
            'mo_ta' => 'Quản trị viên hệ thống',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
