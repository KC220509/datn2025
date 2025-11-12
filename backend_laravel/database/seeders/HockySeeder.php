<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HockySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $danhSachHocKy = [
            '121',
            '221',
            '122',
            '222',
            '123',
            '223',
            '124',
            '224',
            '125',
        ];

        $data = [];
        $now = now();

        foreach ($danhSachHocKy as $tenHocKy) {
            $data[] = [
                'id_hocky' => (string) Str::uuid(),
                'ten_hoc_ky' => $tenHocKy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        

        DB::table('hoc_ky_dk')->insert($data);
    }
}
