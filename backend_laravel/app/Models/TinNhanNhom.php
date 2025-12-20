<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TinNhanNhom extends Model
{
    protected $table = 'tin_nhan_nhom';
    protected $primaryKey = 'id_tinnhan';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_tinnhan',
        'ma_nhom',
        'ma_nguoigui',
        'noi_dung',
        'duong_dan_tep',
        'da_xem',
        'tinnhan_ghim',
        'tinnhan_xoa',
        'created_at',
        'updated_at'
    ];
    
    
    public function nguoiGui()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoigui', 'id_nguoidung');
    }

    public function nhomDoAn()
    {
        return $this->belongsTo(NhomDoAn::class, 'ma_nhom', 'id_nhom');
    }
}
