<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NopBai extends Model
{
    protected $table = 'nop_bai';

    protected $primaryKey = 'id_nopbai';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_nopbai',
        'ma_nhom',
        'ma_nhiemvu',
        'ma_sinhvien',
        'duong_dan_teps',
        'thoigian_nop',
        'trang_thai',
        'nhan_xet',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'duong_dan_teps' => 'array',
        'thoigian_nop' => 'datetime',
    ];

    public function nhiemVu()
    {
        return $this->belongsTo(NhiemVu::class, 'ma_nhiemvu', 'id_nhiemvu');
    }

    public function sinhVienNopBai()
    {
        return $this->belongsTo(SinhVien::class, 'ma_sinhvien', 'id_sinhvien');
    }

    public function nhomDATN()
    {
        return $this->belongsTo(NhomDoAn::class, 'ma_nhom', 'id_nhom');
    }
}
