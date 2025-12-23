<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuiTinNhanRequest;
use App\Models\HocKyDk;
use App\Models\NguoiDung;
use App\Models\NhiemVu;
use App\Models\NhomDoAn;
use App\Models\ThanhVienNhom;
use App\Models\TinNhanNhom;
use App\Services\KhoaNganhLopService;
use App\Services\NguoiDungService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Kreait\Firebase\Contract\Database;

// use Excel;

class DuLieuController extends Controller
{
    protected $nguoiDungService;
    protected $khoaNganhLopService;

    protected $firebaseDb;


    public function __construct(NguoiDungService $nguoiDungService, KhoaNganhLopService $khoaNganhLopService, Database $firebaseDb)
    {
        $this->nguoiDungService = $nguoiDungService;
        $this->khoaNganhLopService = $khoaNganhLopService;
        $this->firebaseDb = $firebaseDb;
    }

    public function dsHocKy()
    {
        $dsHocKy = HocKyDk::orderBy('created_at', 'desc')->get();

        return response()->json([
            'trangthai' => true,
            'ds_hocky' => $dsHocKy,
        ]);
    }

    public function dsNguoiDung()
    {
        $dsNguoiDung = $this->nguoiDungService->layDanhSachNguoiDung();

        if (!$dsNguoiDung) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy người dùng nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_nguoidung' => $dsNguoiDung,
        ]);
    }

    public function dsKhoaNganhLop()
    {
        $dsKhoa = $this->khoaNganhLopService->layDanhSachKhoa();
        $dsNganh = $this->khoaNganhLopService->layDanhSachNganh();
        $dsLop = $this->khoaNganhLopService->layDanhSachLop();

        return response()->json([
            'trangthai' => true,
            'ds_khoa' => $dsKhoa,
            'ds_nganh' => $dsNganh,
            'ds_lop' => $dsLop,
        ]);
    }


    public function dsSinhVien()
    {
        $dsSinhVien = $this->nguoiDungService->layDanhSachSinhVien();

        if (!$dsSinhVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy sinh viên nào.'
            ], 404);
        }

        $dsSinhVien = $dsSinhVien->map(function($sinhVien) {
            if($sinhVien->nguoiDung) {
                $sinhVien->nguoiDung->makeVisible(['mat_khau']);
            }
            return $sinhVien;
        });

        return response()->json([
            'trangthai' => true,
            'ds_sinhvien' => $dsSinhVien,
        ]);
    }

    public function dsGiangVien(){
        $dsGiangVien = $this->nguoiDungService->layDanhSachGiangVien();

        if (!$dsGiangVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy giảng viên nào.'
            ], 404);
        }

        $dsGiangVien = $dsGiangVien->map(function($giangVien) {
            if($giangVien->nguoiDung) {
                $giangVien->nguoiDung->makeVisible(['mat_khau']);
            }
            return $giangVien;
        });

        return response()->json([
            'trangthai' => true,
            'ds_giangvien' => $dsGiangVien,
        ]);
    }


    public function layDsGiangVienTheoNganh($maNganh)
    {
        $dsGiangVien = $this->nguoiDungService->layDsGiangVienTheoNganh($maNganh);

        if (!$dsGiangVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy giảng viên nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_giangvien' => $dsGiangVien,
        ]);
    }

    public function layDsSinhVienTheoNganh($maNganh)
    {
        $dsSinhVien = $this->nguoiDungService->layDsSinhVienTheoNganh($maNganh);

        if (!$dsSinhVien) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy sinh viên nào.'
            ], 404);
        }

        return response()->json([
            'trangthai' => true,
            'ds_sinhvien' => $dsSinhVien,
        ]);
    }


    public function layChiTietNhom($id_nhom)
    {
        $nguoidung_id = Auth::id();

        $nhom = NhomDoAn::where('id_nhom', $id_nhom)
                        ->where(function($query) use ($nguoidung_id) {
                            $query->where('ma_nguoitao', $nguoidung_id) 
                                ->orWhereHas('sinhViens', function($q) use ($nguoidung_id) {
                                    $q->where('id_sinhvien', $nguoidung_id);
                                });
                        })
                        ->with(['nguoiTao.nguoiDung', 'sinhViens.nguoiDung'])
                        ->first();

        if (!$nhom) {
            return response()->json([
                'trangthai' => false,
                'la_thanh_vien' => false,
                'thongbao' => 'Bạn không có quyền truy cập nhóm này hoặc nhóm không tồn tại.',

            ], 403);
        }

        return response()->json([
            'trangthai' => true,
            'la_thanh_vien' => true,
            'thongbao' => 'Chi tiết nhóm được lấy thành công.',
            'nhom' => $nhom,
        ]);
    }


    public function layDsThongBao()
    {

        $dsThongBao = DB::table('bai_dang')
            ->orderBy('created_at', 'desc')
            ->get();

        // // lấy tên tệp từ đường dẫn cloudinary
        foreach ($dsThongBao as $thongBao) {
            if ($thongBao->duong_dan_tep) {
                $thongBao->ten_tep = urldecode(basename($thongBao->duong_dan_tep));
            } else {
                $thongBao->ten_tep = null;
            }
        }

        

        return response()->json([
            'trangthai' => true,
            'ds_thongbao' => $dsThongBao
        ]);
    }

    public function layChiTietThongBao($id_baidang)
    {
        $thongBao = DB::table('bai_dang')
            ->where('id_baidang', $id_baidang)
            ->first();

        if (!$thongBao) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy thông báo.'
            ], 404);
        }
        // lấy tên tệp từ đường dẫn cloudinary
        if ($thongBao->duong_dan_tep) {
            $thongBao->ten_tep = urldecode(basename($thongBao->duong_dan_tep));
        } else {
            $thongBao->ten_tep = null;
        }

        return response()->json([
            'trangthai' => true,
            'thongbao' => $thongBao
        ]);
    }

    public function layTinNhanNhom($idNhom)
    {
        $dsTinNhan = TinNhanNhom::where('ma_nhom', $idNhom)
            ->orderBy('created_at', 'asc')
            ->with('nguoiGui')
            ->get();

        return response()->json([
            'trangthai' => true,
            'ds_tinnhan' => $dsTinNhan,
        ]);
    }


    // Xử lý việc nhắn tin

    public function guiTinNhan(GuiTinNhanRequest $request) {
        $id_nguoidung = Auth::id();
        $nguoiDung = NguoiDung::find($id_nguoidung);

        if (!$nguoiDung) {
            return response()->json(['trangthai' => false, 'thongbao' => 'Người dùng không tồn tại.'], 404);
        }

        DB::transaction(function () use ($request, $id_nguoidung, $nguoiDung) {
            $tep = $request->file('tinnhan_tep');
            if($tep) {
                $gocTenTep = pathinfo($request->tinnhan_tep->getClientOriginalName(), PATHINFO_FILENAME); 
                $duoiTep = $request->tinnhan_tep->getClientOriginalExtension(); 

                $newTenTep = $gocTenTep . '.' . $duoiTep; 
                $duongDanTepMoi = $tep->move(
                    sys_get_temp_dir(), 
                    $newTenTep  
                );

                $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
                    [
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                        'use_filename' => true,
                    ]
                );

                $duongDanTep = $taiLenCloud['secure_url'];
            } else {
                $duongDanTep = null;
            }

            $tinNhan = new TinNhanNhom();
            $tinNhan->id_tinnhan = Str::uuid();
            $tinNhan->ma_nhom = $request->ma_nhom;
            $tinNhan->ma_nguoigui = $id_nguoidung;
            $tinNhan->noi_dung = $request->noi_dung;
            $tinNhan->duong_dan_tep = $duongDanTep;
            $tinNhan->da_xem = false;
            $tinNhan->tinnhan_ghim = false;
            $tinNhan->tinnhan_xoa = false;
            $tinNhan->created_at = now();
            $tinNhan->updated_at = now();
            $tinNhan->save();


            $dataFirebase = [
                'id_tinnhan'    => (string) $tinNhan->id_tinnhan,
                'id_nguoigui'   => (string) $tinNhan->ma_nguoigui,
                'ho_ten'        => $nguoiDung->ho_ten, 
                'noi_dung'      => $tinNhan->noi_dung ?? "",
                'ten_tep'       => $tep ? $gocTenTep . '.' . $duoiTep : "",
                'duong_dan_tep' => $tinNhan->duong_dan_tep ?? "",
                'da_xem'        => false,
                'tinnhan_ghim'  => false,
                'tinnhan_xoa'   => false,
                'created_at'    => now()->getTimestamp() * 1000, 
                'updated_at'    => now()->getTimestamp() * 1000
            ];
            // 3. Đẩy lên Firebase Realtime Database
            $this->firebaseDb->getReference('nhom_chat/' . $request->ma_nhom)
                ->push($dataFirebase);

        });


        return response()->json([
            'trangthai' => true, 
            'thongbao' => 'Gửi tin nhắn thành công.'
        ]);
    }
    

    public function layDsNhiemVu($idNhom) {
        $nguoiDung = Auth::user();
        
        $vaiTroIds = $nguoiDung->vaiTros->pluck('id_vaitro')->toArray();

        if ($vaiTroIds && in_array('GV', $vaiTroIds)) {
            return $this->layDsChoGiangVien($idNhom);
        } 
        if ($vaiTroIds && in_array('SV', $vaiTroIds)) {
            return $this->layDsChoSinhVien($idNhom);
        }

           return response()->json([
               'thongbao' => 'Không có quyền truy cập nhóm.'
           ], 403);
    

    }

     public function layDsChoSinhVien($id_nhom){
        $id_sinhvien = Auth::id();
        $thanhVien = ThanhVienNhom::where('ma_nhom', $id_nhom)
                        ->where('ma_sinhvien', $id_sinhvien)
                        ->exists();

        if(!$thanhVien){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Sinh viên không thuộc nhóm này.'
            ], 403);
        }
        $dsNhiemVu = NhiemVu::where('ma_nhom', $id_nhom)
                            ->with(['danhSachNopBai' => function($query) use ($id_sinhvien) {
                                $query->where('ma_sinhvien', $id_sinhvien);
                            }])
                            ->orderBy('han_nop', 'asc')
                            ->get();
                            
        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Danh sách nhiệm vụ được lấy thành công.',
            'ds_nhiemvu' => [
                'con_han' => $dsNhiemVu->filter(fn($q) => in_array($q->trangthai_nhiemvu, ['con_han', 'dang_tre_han']))->values(),
                'qua_han' => $dsNhiemVu->filter(fn($q) => $q->trangthai_nhiemvu === 'da_dong')->values(),
                // 'dung_han' => $dsNhiemVu->filter(fn($q) => $q->trangthai_nhiemvu === 'dung_han')->values(),
                // 'tre_han' => $dsNhiemVu->filter(fn($q) => $q->trangthai_nhiemvu === 'tre_han')->values(),
                'hoan_thanh' => $dsNhiemVu->filter(fn($q) => in_array($q->trangthai_nhiemvu, ['dung_han', 'tre_han']))->values(),


            ]
        ]);
    }

    private function layDsChoGiangVien($idNhom) {
        $id_giangvien = Auth::id();

        $nhom = NhomDoAn::where('id_nhom', $idNhom)
                        ->where('ma_nguoitao', $id_giangvien)
                        ->first();

        if (!$nhom) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Bạn không có quyền quản lý nhóm này.'
            ], 403);
        }

        try {
            $nhiemVus = NhiemVu::where('ma_nhom', $idNhom)
                                ->withCount('danhSachNopBai')
                                ->orderBy('created_at', 'desc')
                                ->get();

            $tongSV = ThanhVienNhom::where('ma_nhom', $idNhom)->count();

            return response()->json([
                'trangthai' => true,
                'ds_nhiemvu' => [
                    // Nhiệm vụ đang mở
                    'con_han' => $nhiemVus->filter(fn($q) => $q->trangthai_nhiemvu === 'con_han')->values(),
                    // Nhiệm vụ đã đóng hoàn toàn
                    'hoan_thanh' => $nhiemVus->filter(fn($q) => $q->trangthai_nhiemvu === 'hoan_thanh')->values(),
                    'tong_so_sv' => $tongSV
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }

    public function layChiTietNhiemVu($idNhiemVu)
    {
        $nhiemVu = NhiemVu::where('id_nhiemvu', $idNhiemVu)
            ->with('nhomDATN')
            ->first();


        if (!$nhiemVu) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Không tìm thấy nhiệm vụ.'
            ], 404);
        }

        $dsTenTep = [];
        if ($nhiemVu->duong_dan_teps) {
            foreach ($nhiemVu->duong_dan_teps as $duongDanTep) {
                $dsTenTep[] = urldecode(basename($duongDanTep));
            }
        }

        $nhiemVu->ten_teps = $dsTenTep;


        return response()->json([
            'trangthai' => true,
            'nhiem_vu' => $nhiemVu
        ]);
    }
}
