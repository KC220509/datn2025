<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class LopSinhHoat extends Model
{
     use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'lop_sinh_hoat';
    protected $primaryKey = 'id_lop';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_lop',
        'ma_nganh',
        'ten_lop',
    ];

    public function nganh()
    {
        return $this->belongsTo(Nganh::class, 'ma_nganh', 'id_nganh');
    }
}
