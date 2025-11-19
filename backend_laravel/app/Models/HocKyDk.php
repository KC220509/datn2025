<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class HocKyDk extends Model
{
    protected $table = 'hoc_ky_dk';
    protected $primaryKey = 'id_hocky';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_hocky',
        'ten_hoc_ky',
    ];


    public function nguoiDungs(): BelongsToMany
    {
        return $this->belongsToMany(NguoiDung::class, 
            'nguoidung_hocky', 
            'ma_hocky', 
            'ma_nguoidung',
            )->withTimestamps();
    }
}
