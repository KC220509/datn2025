<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class VaiTro extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

   
    protected $table = 'vai_tro';
     protected $primaryKey = 'id_vaitro'; 
     protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_vaitro',
        'ten_hien_thi',
        'mo_ta',
    ];


    public function nguoiDungs(): BelongsToMany
    {
        return $this->belongsToMany(
            NguoiDung::class,
            'nguoidung_vaitro', 
            'ma_vaitro',
            'ma_nguoidung',
        )->withTimestamps();
    }
}
