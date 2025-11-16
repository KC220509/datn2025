<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportDanhSachRequest extends FormRequest
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
            'file' => 'required|file|mimes:xlsx',
        ];
    }

    public function messages(): array
    {
        return [
            'id_hocky.required' => 'Mã học kỳ là bắt buộc.',
            'id_hocky.exists' => 'Học kỳ không tồn tại trong hệ thống.',
            'file.required' => 'Tệp tin là bắt buộc.',
            'file.file' => 'Tệp tin không hợp lệ.',
            'file.mimes' => 'Tệp tin phải có định dạng xlsx.',
        ];
    }
}
