<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportDanhSachGvRequest extends FormRequest
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
            'id_hocky' => 'required|uuid|exists:hoc_ky_dk,id_hocky',
            'file_giangvien' => 'required|file|mimes:xlsx,xls',
        ];
    }

    public function messages(): array
    {
        return [
            'id_hocky.required' => 'Mã học kỳ là bắt buộc.',
            'id_hocky.uuid' => 'ID Học kỳ không hợp lệ.',
            'id_hocky.exists' => 'Học kỳ không tồn tại trong hệ thống.',
            'file_giangvien.required' => 'Tệp tin là bắt buộc.',
            'file_giangvien.file' => 'Tệp tin không hợp lệ.',
            'file_giangvien.mimes' => 'Tệp tin phải có định dạng xlsx hoặc xls.',
        ];
    }
}
