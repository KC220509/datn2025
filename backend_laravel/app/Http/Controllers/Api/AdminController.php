<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaoDsTaiKhoanSvRequest;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function taoDsTaiKhoanSv(TaoDsTaiKhoanSvRequest $taoDsTaiKhoanSvRequest)
    {
        $requestTao = $taoDsTaiKhoanSvRequest->validated();
    }
}
