<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhanCong extends Model
{
    protected $table = 'phan_cong';
    protected $primaryKey = 'id_phancong';
    public $incrementing = false;
    protected $fillable = [
        'id_phancong',
        'ma_truongbomon',
        'ma_giangvien',
        'ma_sinhvien',
        'ma_hocky',
    ];


    public function sinhVien(){
        return $this->belongsTo(SinhVien::class, 'ma_sinhvien', 'id_sinhvien');
    }

    public function nguoiDungSinhVien(){
        return $this->hasOneThrough(
            NguoiDung::class,
            SinhVien::class,
            'id_sinhvien', 
            'id_nguoidung',
            'ma_sinhvien',
            'id_sinhvien'
        );
    }

    public function giangVien(){
        return $this->belongsTo(GiangVien::class, 'ma_giangvien', 'id_giangvien');
    }

    public function nguoiDungGiangVien(){
        return $this->hasOneThrough(
            NguoiDung::class,
            GiangVien::class,
            'id_giangvien', 
            'id_nguoidung',
            'ma_giangvien',
            'id_giangvien'
        );
    }

    public function hocKy(){
        return $this->belongsTo(HocKyDk::class, 'ma_hocky', 'id_hocky');
    }

    
}
