<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PhanCongNgauNhienRequest extends FormRequest
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
            'id_hocky' => 'required|exists:hoc_ky_dk,id_hocky',
            'dsgv_id' => 'required|array|min:1',
            'dsgv_id.*' => 'required|exists:giang_vien,id_giangvien',
            'dssv_id' => 'required|array',
            'dssv_id.*' => 'required|exists:sinh_vien,id_sinhvien',
        ];
    }
}
