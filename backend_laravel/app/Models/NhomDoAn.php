<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NhomDoAn extends Model
{
    protected $table = 'nhom_do_an';
    protected $primaryKey = 'id_nhom';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_nhom',
        'ma_nguoitao',
        'ma_hocky',
        'ten_nhom',
    ];

    public function hocKy()
    {
        return $this->belongsTo(HocKyDk::class, 'ma_hocky', 'id_hocky');
    }

    public function nguoiTao(){
        return $this->belongsTo(GiangVien::class, 'ma_nguoitao', 'id_giangvien');
    }

    public function sinhViens()
    {
        return $this->belongsToMany(
            SinhVien::class, 
            'thanh_vien_nhom', 
            'ma_nhom', 
            'ma_sinhvien', 
            'id_nhom', 
            'id_sinhvien'
        );
    }
}
