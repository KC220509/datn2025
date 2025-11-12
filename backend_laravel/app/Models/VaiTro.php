<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class VaiTro extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

   
    protected $table = 'vai_tro';
     protected $primaryKey = null; 
    public $incrementing = false;
    public $timestamps = true;
    protected $fillable = [
        'ten_vai_tro',
        'mo_ta',
    ];


    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoidung', 'id_nguoidung');
    }
}
