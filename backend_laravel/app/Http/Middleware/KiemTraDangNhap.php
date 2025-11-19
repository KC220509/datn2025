<?php

namespace App\Http\Middleware;

use App\Models\NguoiDung;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KiemTraDangNhap
{
    
    public function handle(Request $request, Closure $next, $vaiTros): Response
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }
        $nguoiDung = NguoiDung::find(Auth::id());
        if (!$nguoiDung) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }
        
        $danhSachVaiTros = explode(',', $vaiTros);
        $coQuyen = false;
        foreach ($danhSachVaiTros as $vaiTro) {
            if ($nguoiDung->vaiTros()->where('id_vaitro', $vaiTro)->exists()) {
                $coQuyen = true;
                break;
            }
        }
        if (!$coQuyen) {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }
        return $next($request);
    }
}
