<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoTaiKhoanSvRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:nguoi_dung,email',
            'ho_ten' => 'required|string|max:255',
            'msv' => 'required|string|unique:sinh_vien,msv',
            'so_dien_thoai' => 'nullable|string|max:15',
            'dia_chi' => 'nullable|string|max:1000',
            'gioi_tinh' => 'nullable|boolean',
            'ma_hocky' => 'required|exists:hoc_ky_dk,id_hocky',
            'ma_lop' => 'required|exists:lop_sinh_hoat,id_lop',
        ];
    }
}
