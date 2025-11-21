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
                ['ten' => 'Cơ khí Chế tạo', 'ky_hieu' => 'CKCT'],
                ['ten' => 'Cơ khí Ô tô', 'ky_hieu' => 'CKOT'],
                ['ten' => 'Cơ điện tử', 'ky_hieu' => 'CĐT'],
                ['ten' => 'Cơ nhiệt - Điện lạnh', 'ky_hieu' => 'CNĐL'],
            ],
            'Kỹ thuật Xây dựng' => [
                ['ten' => 'Xây dựng', 'ky_hieu' => 'XD'],
                ['ten' => 'Cầu đường', 'ky_hieu' => 'CĐ'],
                ['ten' => 'Kiến trúc', 'ky_hieu' => 'KT'],
            ],
            'Điện - Điện tử' => [
                ['ten' => 'Tự động hóa', 'ky_hieu' => 'TĐH'],
                ['ten' => 'Điện tử Viễn thông', 'ky_hieu' => 'ĐTVT'],
                ['ten' => 'Hệ thống điện', 'ky_hieu' => 'HTĐ'],
            ],
            'Công nghệ Hóa học - Môi trường' => [
                ['ten' => 'Công nghệ Hóa học', 'ky_hieu' => 'CNHH'],
                ['ten' => 'Kỹ thuật Môi trường', 'ky_hieu' => 'KTMT'],
                ['ten' => 'Công nghệ Sinh học', 'ky_hieu' => 'CNSH'],
                ['ten' => 'Công nghệ Thực phẩm', 'ky_hieu' => 'CNTP'],
            ],
            'Sư phạm Công nghiệp' => [
                ['ten' => 'Sư phạm Kỹ thuật', 'ky_hieu' => 'SPKT'],
                ['ten' => 'Cơ sở Kỹ thuật', 'ky_hieu' => 'CSKT'],
            ],
            'Công nghệ số' => [
                ['ten' => 'Công nghệ Thông tin', 'ky_hieu' => 'CNTT'],
            ],
        ];

        $data = [];
        $now = now();

        foreach ($duLieuNganhTheoKhoa as $tenKhoa => $cacNganh) {
            
            $khoa = Khoa::where('ten_khoa', $tenKhoa)->first();

            if ($khoa) {
                foreach ($cacNganh as $nganh) {
                    $data[] = [
                        'id_nganh' => (string) Str::uuid(),
                        'ma_khoa' => $khoa->id_khoa, 
                        'ten_nganh' => $nganh['ten'],
                        'ky_hieu' => $nganh['ky_hieu'],
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
