<?php

namespace Database\Seeders;

use App\Models\Khoa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NganhSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $duLieuNganhTheoKhoa = [
            'Cơ khí' => [
                'Cơ khí Chế tạo',
                'Cơ khí Ô tô',
                'Cơ điện tử',
                'Cơ nhiệt - Điện lạnh'
            ],
            'Kỹ thuật Xây dựng' => [
                'Xây dựng',
                'Cầu đường',
                'Kiến trúc',
            ],
            'Điện - Điện tử' => [
                'Tự động hóa',
                'Điện tử Viễn thông',
                'Hệ thống điện',
            ],
            'Công nghệ Hóa học - Môi trường' => [
                'Công nghệ Hóa học',
                'Kỹ thuật Môi trường',
                'Công nghệ Sinh học',
                'Công nghệ Thực phẩm',
            ],
            'Sư phạm Công nghiệp' => [
                'Sư phạm Kỹ thuật',
                'Cơ sở Kỹ thuật',
            ],
            'Công nghệ số' => [
                'Công nghệ Thông tin',
            ],
        ];

        $data = [];
        $now = now();

        foreach ($duLieuNganhTheoKhoa as $tenKhoa => $cacNganh) {
            
            $khoa = Khoa::where('ten_khoa', $tenKhoa)->first();

            if ($khoa) {
                foreach ($cacNganh as $tenNganh) {
                    $data[] = [
                        'id_nganh' => (string) Str::uuid(),
                        'ma_khoa' => $khoa->id_khoa, 
                        'ten_nganh' => $tenNganh,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            } else {
                echo "Khoa với tên '$tenKhoa' không tồn tại trong cơ sở dữ liệu.\n";
            }
        }

        DB::table('nganh')->insert($data);
    }
}
