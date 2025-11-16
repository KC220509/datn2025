<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class SinhVien extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $table = 'sinh_vien';
    protected $primaryKey = 'id_sinhvien';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_sinhvien',
        'id_malop',
        'msv',
    ];
}
