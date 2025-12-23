<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class NhiemVu extends Model
{
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

    // Xử lý trạng thái nhiệm vụ
    protected $appends = ['trangthai_nhiemvu'];

    public function getTrangthaiNhiemvuAttribute()
    {
        $now = now();
        $nguoiDung = Auth::user();

        $vaiTroIds = $nguoiDung->vaiTros->pluck('id_vaitro')->toArray();


        // --- Lấy trạng thái nhiệm vụ cho GIẢNG VIÊN ---
        if (in_array('GV', $vaiTroIds)) {
            if ($now <= $this->han_dong) {
                return 'con_han'; 
            }
            return 'hoan_thanh';
        }

        // Lấy trạng thái nhiệm vụ cho SINH VIÊN
        $baiNop = $this->danhSachNopBai()->where('ma_sinhvien', $nguoiDung->id_nguoiDung)->first();

        if ($baiNop) {
            return $baiNop->trang_thai; // 'dung_han' hoặc 'tre_han'
        }else{
            if ($now > $this->han_dong) {
                return 'da_dong'; // Quá hạn đóng --> Không thể nộp
            }else if ($now > $this->han_nop) {
                return 'dang_tre_han'; // Quá hạn nộp nhưng vẫn nộp trễ được
            }
        }
        
        return 'con_han';
    }
}
