<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use App\Models\NguoiDung;

class FirebaseAuthController extends Controller
{
    protected $auth;

    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    public function verifyToken(Request $request)
    {
        $idToken = $request->input('token');

        try {
            $xacMinhIdToken = $this->auth->verifyIdToken($idToken);
            
            $uid = $xacMinhIdToken->claims()->get('sub');
            $email = $xacMinhIdToken->claims()->get('email');
            
            // $nguoiDung = $this->auth->getUser($uid);

            $nguoiDung = NguoiDung::where('email', $email)->first();

            if (!$nguoiDung) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email này chưa được đăng ký trong hệ thống trường học.',
                ], 404);
            }

            $token = $nguoiDung->createToken('firebase_auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng nhập thành công',
                'token' => $token,
                'token_type' => 'Bearer',
                'nguoi_dung' => $nguoiDung,
            ]);

        } catch (FailedToVerifyToken $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token không hợp lệ: ' . $e->getMessage()
            ], 401);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}
