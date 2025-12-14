<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoNhomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'ten_nhom' => 'required|string|max:255',
            'ma_hocky' => 'required|exists:hoc_ky_dk,id_hocky',
            'sinh_vien_ids' => 'nullable|array',
            'sinh_vien_ids.*' => 'exists:sinh_vien,id_sinhvien',
        ];
    }
}
