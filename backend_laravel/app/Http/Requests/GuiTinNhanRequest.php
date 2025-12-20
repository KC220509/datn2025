<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuiTinNhanRequest extends FormRequest
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
            'ma_nhom' => 'required|string|exists:nhom_do_an,id_nhom',
            'noi_dung' => 'required_without:tinnhan_tep|nullable|string|max:1000',
            'tinnhan_tep' => 'required_without:noi_dung|nullable|file|mimes:pdf,doc,docx,jpg,png,xlsx,xls',
        ];
    }
}
