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
            return response()->json(['message' => 'Vui lòng đăng nhập'], 401);
        }

        $nguoi_dung = NguoiDung::with('vaiTro')->find(Auth::id());
        if (!$nguoi_dung) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 401);
        }

        $tenVaiTro = $nguoi_dung->ten_vai_tro ?? ($nguoi_dung->vaiTro->ten_vai_tro ?? null);
        if ($tenVaiTro != $vaiTros) {
            
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }
        return $next($request); 
    }
}
