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
            'ho_ten' => 'Khánh Công',
            'gioi_tinh' => true,
            'trang_thai' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('nguoidung_vaitro')->insert([
            'ma_nguoidung' => $adminId,
            'ma_vaitro' => 'AD',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
