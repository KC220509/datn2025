<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DangBaiRequest extends FormRequest
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
            'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'tep_dinh_kem' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,xlsx,xls',
        ];
    }
}
