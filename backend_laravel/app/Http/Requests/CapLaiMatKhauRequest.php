<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CapLaiMatKhauRequest extends FormRequest
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
            'email' => 'required|email|exists:nguoi_dung,email',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email là trường bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.exists' => 'Email không tồn tại trong hệ thống.',
        ];
    }
}
