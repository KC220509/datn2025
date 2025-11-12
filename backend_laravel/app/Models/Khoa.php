<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Khoa extends Model
{
     use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'khoa';
    protected $primaryKey = 'id_khoa';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_khoa',
        'ten_khoa',
    ];

    public function nganhs()
    {
        return $this->hasMany(Nganh::class, 'ma_khoa', 'id_khoa');
    }
}
