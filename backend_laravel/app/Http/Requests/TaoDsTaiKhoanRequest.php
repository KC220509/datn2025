<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaoDsTaiKhoanRequest extends FormRequest
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
        ];
    }
}
