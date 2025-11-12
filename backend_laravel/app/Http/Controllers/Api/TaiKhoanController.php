<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DangNhapRequest;
use App\Models\NguoiDung;
use App\Services\NguoiDungService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaiKhoanController extends Controller
{
    protected $nguoiDungService;
    public function __construct(NguoiDungService $nguoiDungService)
    {
        $this->nguoiDungService = $nguoiDungService;
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
        $vaiTro = $nguoidung->vaiTro()->pluck('ten_vai_tro');
        $token = $nguoidung->createToken('auth_token')->plainTextToken;

        return response()->json([
            'trangthai' => true,
            'token' => $token,
            'token_type' => 'Bearer',
            'nguoi_dung' => [
                'id_nguoidung' => $nguoidung->id_nguoidung,
                'ho_ten' => $nguoidung->ho_ten,
                'email' => $nguoidung->email,
                'vai_tro' => $vaiTro
            ],
        ]);
    }


    public function layNguoiDung(Request $request)
    {
        // $request->user() sẽ lấy user đang login dựa trên token
        $nguoiDung = $request->user();

        $vaiTro = $nguoiDung->vaiTro()->pluck('ten_vai_tro');

        return response()->json([
            'trangthai' => true,
            'nguoi_dung' => [
                'id_nguoidung' => $nguoiDung->id_nguoidung,
                'ho_ten' => $nguoiDung->ho_ten,
                'email' => $nguoiDung->email,
                'vai_tro' => $vaiTro
            ],
        ]);
    }
}
