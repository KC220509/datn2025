<?php

namespace Database\Seeders;

use App\Models\Nganh;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LopSinhHoatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $duLieuLopTheoNganh = [
            'Tự động hóa' => [
                '21TDH1',
                '21TDH2',
                '21TDH3',
            ],
            'Cơ điện tử' => [
                '21CDT1',
                '21CDT2',
            ],
            'Công nghệ Thông tin' => [
                '20T1',
                '20T2',
                '20T3',
                '21T1',
                '21T2',
                '21T3',
            ],
        ];

        $data = [];
        $now = now();

        // 🛑 Bước 2: Duyệt qua dữ liệu tĩnh và tìm ID Ngành tương ứng
        foreach ($duLieuLopTheoNganh as $tenNganh => $cacLop) {
            
            // Tìm ID Ngành dựa trên tên (Cần đảm bảo tên ngành đã tồn tại)
            $nganh = Nganh::where('ten_nganh', $tenNganh)->first();

            if ($nganh) {
                foreach ($cacLop as $tenLop) {
                    $data[] = [
                        'id_lop' => (string) Str::uuid(),
                        'ma_nganh' => $nganh->id_nganh, 
                        'ten_lop' => $tenLop,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            } else {
                // Tùy chọn: Ghi log nếu tên ngành không tồn tại (lỗi trong NganhSeeder)
                // dd("Lỗi: Không tìm thấy Ngành có tên: " . $tenNganh);
            }
        }

        // 🛑 Bước 3: Insert dữ liệu
        DB::table('lop_sinh_hoat')->insert($data);
    }
}
