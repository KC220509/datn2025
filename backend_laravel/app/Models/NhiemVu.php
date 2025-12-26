<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class NhiemVu extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'nhiem_vu';
    protected $primaryKey = 'id_nhiemvu';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_nhiemvu',
        'ma_nhom',
        'ten_nhiemvu',
        'noi_dung',
        'duong_dan_teps',
        'han_nop',
        'han_dong',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'duong_dan_teps' => 'array',
        'han_nop' => 'datetime',
        'han_dong' => 'datetime',
    ];

    public function nhomDATN()
    {
        return $this->belongsTo(NhomDoAn::class, 'ma_nhom', 'id_nhom');
    }

    public function danhSachNopBai(){
        return $this->hasMany(NopBai::class, 'ma_nhiemvu', 'id_nhiemvu');
    }

    protected $appends = ['trangthai_nhiemvu'];

    public function getTrangthaiNhiemvuAttribute()
    {
        $now = now();
        $nguoiDung = Auth::user();

        $vaiTroIds = $nguoiDung->vaiTros->pluck('id_vaitro')->toArray();


        if (in_array('GV', $vaiTroIds)) {
            if ($now <= $this->han_dong) {
                return 'con_han'; 
            }
            return 'hoan_thanh';
        }

        $baiNop = $this->danhSachNopBai()->where('ma_sinhvien', $nguoiDung->id_nguoidung)->first();

        if ($baiNop) {
            return 'hoan_thanh'; 
        }else{
            if ($now > $this->han_dong) {
                return 'da_dong'; 
            }else if ($now > $this->han_nop) {
                return 'dang_tre_han';
            }
        }
        
        return 'con_han';
    }

}
