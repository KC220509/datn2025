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
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_sinhvien',
        'ma_lop',
        'msv',
    ];

    public function lop()
    {
        return $this->belongsTo(LopSinhHoat::class, 'ma_lop', 'id_lop');
    }

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'id_sinhvien', 'id_nguoidung');
    }

    public function phanCongs()
    {
        return $this->hasMany(PhanCong::class, 'ma_sinhvien', 'id_sinhvien');
    }

    public function nhomDoAns()
    {
        return $this->belongsToMany(
            NhomDoAn::class, 
            'thanh_vien_nhom', 
            'ma_sinhvien', 
            'ma_nhom', 
            'id_sinhvien', 
            'id_nhom'
        );
    }
}