<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThanhVienNhom extends Model
{
    protected $table = 'thanh_vien_nhom';
    protected $primaryKey = 'id_thanhviennhom';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_thanhviennhom',
        'ma_nhom',
        'ma_sinhvien',
    ];




    public function nhomDoAn()
    {
        return $this->belongsTo(NhomDoAn::class, 'ma_nhom', 'id_nhom');
    }

    public function sinhVien()
    {
        return $this->belongsTo(SinhVien::class, 'ma_sinhvien', 'id_sinhvien');
    }
}
