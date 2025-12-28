<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoTaiKhoanGvRequest extends FormRequest
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
            'so_dien_thoai' => 'nullable|string|max:15',
            'gioi_tinh' => 'nullable|boolean',
            'ma_hocky' => 'required|exists:hoc_ky_dk,id_hocky',
            'ma_nganh' => 'required|exists:nganh,id_nganh',
            'hoc_ham_hoc_vi' => 'required|string',
            'la_truong_bomon' => 'nullable|boolean',
        ];
    }
}
