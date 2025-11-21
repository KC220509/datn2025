<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportDanhSachSvRequest extends FormRequest
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
            'id_hocky' => 'required|uuid|exists:hoc_ky_dk,id_hocky',
            'file_sinhvien' => 'required|file|mimes:xlsx,xls',
        ];
    }

    public function messages(): array
    {
        return [
            'id_hocky.required' => 'Mã học kỳ là bắt buộc.',
            'id_hocky.uuid' => 'ID Học kỳ không hợp lệ.',
            'id_hocky.exists' => 'Học kỳ không tồn tại trong hệ thống.',
            'file_sinhvien.required' => 'Tệp tin là bắt buộc.',
            'file_sinhvien.file' => 'Tệp tin không hợp lệ.',
            'file_sinhvien.mimes' => 'Tệp tin phải có định dạng xlsx hoặc xls.',
        ];
    }
}
