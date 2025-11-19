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
            'ho_ten' => 'Trần Khánh Song',
            'gioi_tinh' => true,
            'trang_thai' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Gán Vai trò (VaiTro)
        DB::table('nguoidung_vaitro')->insert([
            'ma_nguoidung' => $phongDaoTaoId,
            'ma_vaitro' => 'PDT',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
