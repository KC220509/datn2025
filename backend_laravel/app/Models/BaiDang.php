<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaiDang extends Model
{
    protected $table = 'bai_dang';

    protected $primaryKey = 'id_baidang';
    public $incrementing = false;

    protected $fillable = [
        'id_baidang',
        'ma_phongdaotao',
        'tieu_de',
        'noi_dung',
        'duong_dan_tep',
        'created_at',
        'updated_at'
    ];



    public function nguoiDang()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_phongdaotao', 'id_nguoidung');
    }

}
