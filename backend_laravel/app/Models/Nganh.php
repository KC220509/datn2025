<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Nganh extends Model
{
     use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'nganh';
    protected $primaryKey = 'id_nganh';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_nganh',
        'ma_khoa',
        'ten_nganh',
        'ky_hieu',
    ];

    public function khoa()
    {
        return $this->belongsTo(Khoa::class, 'ma_khoa', 'id_khoa');
    }

    public function giangViens()
    {
        return $this->hasMany(GiangVien::class, 'ma_nganhh', 'id_nganh');
    }
}
