<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NhomDoAn extends Model
{
    protected $table = 'nhom_do_an';
    protected $primaryKey = 'id_nhom';
    public $timestamps = false;

    protected $fillable = [
        'id_nhom',
        'ma_nguoitao',
        'ma_sinhvien',
        'ten_nhom',
    ];

    public function sinhVien()
    {
        return $this->belongsTo(SinhVien::class, 'ma_sinhvien', 'id_sinhvien');
    }

    public function nguoiTao(){
        return $this->belongsTo(GiangVien::class, 'ma_nguoitao', 'id_giangvien');
    }
}
