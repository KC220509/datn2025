<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KhoaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $danhSachKhoa = [
            'Cơ khí',
            'Kỹ thuật Xây dựng',
            'Điện - Điện Tử',
            'Công nghệ Hóa học - Môi trường',
            'Sư phạm Công nghiệp',
            'Công nghệ số',
        ];

        $data = [];
        $now = now();

        foreach ($danhSachKhoa as $tenKhoa) {
            $data[] = [
                'id_khoa' => (string) Str::uuid(), 
                'ten_khoa' => $tenKhoa,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('khoa')->insert($data);
    }
}
