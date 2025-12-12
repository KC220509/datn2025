<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiangVien extends Model
{
    
    protected $table = 'giang_vien';
    protected $primaryKey = 'id_giangvien';

    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_giangvien',
        'ma_nganh',
        'hoc_ham_hoc_vi',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'id_giangvien', 'id_nguoidung');
    }

    public function nganh()
    {
        return $this->belongsTo(Nganh::class, 'ma_nganh', 'id_nganh');
    }


    public function phanCongs()
    {
        return $this->hasMany(PhanCong::class, 'ma_giangvien', 'id_giangvien');
    }

    public function tbmPhanCong()
    {
        return $this->hasMany(PhanCong::class, 'ma_truongbomon', 'id_giangvien');
    }

}
