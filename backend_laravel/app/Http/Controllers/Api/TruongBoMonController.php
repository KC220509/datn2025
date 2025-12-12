<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PhanCongNgauNhienRequest;
use App\Models\HocKyDk;
use App\Models\PhanCong;
use App\Models\PhanCongHuongDan;
use App\Services\NguoiDungService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TruongBoMonController extends Controller
{
    protected $nguoiDungService;
    public function __construct(NguoiDungService $nguoiDungService)
    {
        $this->nguoiDungService = $nguoiDungService;
    }
    public function layNganhCuaTBM()
    {
        $nganh = $this->nguoiDungService->layNganhCuaTBM(Auth::id());

        if (!$nganh) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy ngành của trưởng bộ môn.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'nganh' => $nganh,
        ]);
    }
    public function phanCongNgauNhien(PhanCongNgauNhienRequest $request)
    {
        $idHocKy = $request->id_hocky;
        $dsgv_id = $request->dsgv_id;
        $dssv_id = collect($request->dssv_id)->shuffle()->all(); 

        $soLuongGv = count($dsgv_id);
        $soLuongSv = count($dssv_id);

        if ($soLuongGv === 0 || $soLuongSv === 0 ) {
            return response()->json([
                'trangthai' => false, 
                'thongbao' => 'Không có Gv/Sv nào để phân công.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            PhanCong::where('ma_hocky', $idHocKy)
                ->whereIn('ma_sinhvien', $dssv_id)
                ->delete();

            $phanCongData = [];

            for ($i = 0; $i < $soLuongSv; $i++) {
                $gvIndex = $i % $soLuongGv;
                $phanCongData[] = [
                    'id_phancong' => Str::uuid(),
                    'ma_truongbomon' => Auth::user()->id_nguoidung,
                    'ma_giangvien' => $dsgv_id[$gvIndex],
                    'ma_sinhvien' => $dssv_id[$i],
                    'ma_hocky' => $idHocKy,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            PhanCong::insert($phanCongData);
            DB::commit();

            $tenHocKy = HocKyDk::where('id_hocky', $idHocKy)->value('ten_hoc_ky');

            return response()->json([
                'trangthai' => true, 
                'thongbao' => 'Phân công sinh viên ngẫu nhiên cho học kỳ ' . $tenHocKy . ' thành công!'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi phân công ngẫu nhiên: ' . $e->getMessage());
            return response()->json(
                ['trangthai' => false,
                'thongbao' => 'Đã xảy ra lỗi trong quá trình phân công.'
            ], 500);
        }
    }

    public function layDsPhanCongTheoTBM()
    {
        $id_tbm = Auth::id();
        $dsPhanCong = PhanCong::with(['sinhVien', 'giangVien', 'hocKy', 'nguoiDungSinhVien', 'nguoiDungGiangVien'])
            ->where('ma_truongbomon', $id_tbm)
            ->get();

        return response()->json([
            'trangthai' => true,
            'ds_phancong' => $dsPhanCong
        ], 200);
    }
}
