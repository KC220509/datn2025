<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CapLaiMatKhauRequest;
use App\Http\Requests\DangNhapRequest;
use App\Http\Requests\DoiMatKhauRequest;
use App\Mail\ThongBaoCapLaiMatKhau;
use App\Models\NguoiDung;
use App\Services\NguoiDungService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;

class TaiKhoanController extends Controller
{
    protected $nguoiDungService;
    protected $firebaseAuth;

    // Inject Firebase Auth vào qua Constructor
    
    public function __construct(NguoiDungService $nguoiDungService, FirebaseAuth $firebaseAuth)
    {
        $this->nguoiDungService = $nguoiDungService;
        $this->firebaseAuth = $firebaseAuth;
    }


    public function dangNhap(DangNhapRequest $dangNhapRequest)
    {
        $request = $dangNhapRequest->validated();

        $nguoidung = NguoiDung::where('email', $request['email'])->first();

        if (!$nguoidung || !password_verify($request['mat_khau'], $nguoidung->mat_khau)) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Thông tin đăng nhập không chính xác.'
            ], 401);
        }

        if(!$nguoidung->trang_thai){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tài khoản không tồn tại hoặc đã bị khóa.'
            ], 403);
        }

        $firebaseToken = $this->firebaseAuth->createCustomToken((string)$nguoidung->id_nguoidung)->toString();
        
        $vaiTros = $nguoidung->vaiTros->map(function($vt){
            return [
                'id_vaitro' => $vt->id_vaitro,
                'ten_hien_thi' => $vt->ten_hien_thi
            ];
        });

        $token = $nguoidung->createToken('auth_token')->plainTextToken;

        return response()->json([
            'trangthai' => true,
            'token' => $token,
            'token_type' => 'Bearer',
            'firebase_token' => $firebaseToken,
            'nguoi_dung' => [
                'id_nguoidung' => $nguoidung->id_nguoidung,
                'ho_ten' => $nguoidung->ho_ten,
                'email' => $nguoidung->email,
                'vai_tros' => $vaiTros
            ],
        ]);
    }


    public function layNguoiDung(Request $request)
    {
        $nguoiDung = $request->user();

        if(!$nguoiDung->trang_thai){
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tài khoản không tồn tại hoặc đã bị khóa.'
            ], 403);
        }

        $firebaseToken = $this->firebaseAuth->createCustomToken((string)$nguoiDung->id_nguoidung)->toString();

        $vaiTros = $nguoiDung->vaiTros->map(function($vt){
            return [
                'id_vaitro' => $vt->id_vaitro,
                'ten_hien_thi' => $vt->ten_hien_thi
            ];
        });
        $hocKys = $nguoiDung->hocKys->map(function($hk){
            return [
                'id_hocky' => $hk->id_hocky,
                'ten_hoc_ky' => $hk->ten_hoc_ky
            ];
        });
        return response()->json([
            'trangthai' => true,
            'firebase_token' => $firebaseToken,
            'nguoi_dung' => [
                'id_nguoidung' => $nguoiDung->id_nguoidung,
                'ho_ten' => $nguoiDung->ho_ten,
                'email' => $nguoiDung->email,
                'vai_tros' => $vaiTros,
                'hoc_kys' => $hocKys
            ],
        ]);
    }


    public function capLaiMatKhau(CapLaiMatKhauRequest $capLaiMatKhauRequest){
        $request = $capLaiMatKhauRequest->validated();

        $nguoiDung = NguoiDung::where('email', $request['email'])->first();

        if ($nguoiDung->mat_khau == null || $nguoiDung->trang_thai == false) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Tài khoản không tồn tại hoặc đã bị khóa.'
            ], 404);
        }
        $matKhauMoi = Str::random(8);
        $nguoiDung->mat_khau = Hash::make($matKhauMoi);
        $nguoiDung->save();

        Mail::to($request['email'])->send(new ThongBaoCapLaiMatKhau($nguoiDung, $matKhauMoi));
        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
        ]);

    }


    public function doiMatKhau(DoiMatKhauRequest $doiMatKhauRequest){
        $request = $doiMatKhauRequest->validated();

        $nguoiDung = NguoiDung::find(Auth::id());
        if (!password_verify($request['matKhauCu'], $nguoiDung->mat_khau)) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Mật khẩu cũ không đúng.'
            ], 400);
        }

        if ( $request['matKhauCu'] === $request['matKhauMoi']) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Mật khẩu mới phải khác mật khẩu cũ.'
            ], 400);
        }

        if ( $request['matKhauMoi'] !== $request['xacNhanMatKhauMoi']) {
            return response()->json([
                'trangthai' => false,
                'thongbao' => 'Xác nhận mật khẩu mới không khớp.'
            ], 400);
        }

        $nguoiDung->mat_khau = Hash::make($request['matKhauMoi']);

        $nguoiDung->save();

        return response()->json([
            'trangthai' => true,
            'thongbao' => 'Đổi mật khẩu thành công. Hệ thống sẽ tiến hành đăng nhập lại.'
        ]);
    }
}