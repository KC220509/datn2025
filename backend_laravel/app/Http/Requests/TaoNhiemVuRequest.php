<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoNhiemVuRequest extends FormRequest
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
            'ten_nhiemvu' => 'required|string|max:255',
            'noi_dung' => 'required_without:tep_dinh_kem|nullable|string',
            'tep_dinh_kem.*' => 'required_without:noi_dung|nullable|file|max:20480',
            'han_nop' => 'required|date',
            'han_dong' => 'required|date|after_or_equal:today',
        ];
    }
}
