<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TepDuLieuHocKy extends Model
{
    
    protected $table = 'tep_dulieu_hocky';
    protected $primaryKey = 'id_tep';
    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        'id_tep',
        'ma_hocky',
        'ma_phongdaotao',
        'ten_tep',
        'duong_dan_tep',
    ];
    

    public function hocKy()
    {
        return $this->belongsTo(HocKyDk::class, 'ma_hocky', 'id_hocky');
    }
}
