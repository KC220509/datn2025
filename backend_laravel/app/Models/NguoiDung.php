<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
    
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'nguoi_dung';
    protected $primaryKey = 'id_nguoidung';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_nguoidung',
        'email',
        'mat_khau',
        'ho_ten',
        'so_dien_thoai',
        'dia_chi',
        'gioi_tinh',
        'trang_thai',
    ];

    protected $casts = [
        'gioi_tinh' => 'boolean',
    ];
    public function getGioiTinhTextAttribute()
    {
        return $this->gioi_tinh ? 'Nam' : 'Nữ';
    }

    protected $hidden = [
        'mat_khau',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'mat_khau' => 'hashed',
        ];
    }

    public function vaiTros(): BelongsToMany
    {
        return $this->belongsToMany(
            VaiTro::class, 
            'nguoidung_vaitro', 
            'ma_nguoidung',  
            'ma_vaitro',
        )->withTimestamps(); 
    }


    public function kiemTraVaiTro(string $vaiTroId): bool
    {
        return $this->vaiTros->contains('id_vaitro', $vaiTroId);
    }


    public function hocKys(): BelongsToMany
    {
        return $this->belongsToMany(
            HocKyDk::class,
            'nguoidung_hocky',
            'ma_nguoidung',
            'ma_hocky',
        )->withTimestamps();
    }

    public function sinhVien(): HasOne
    {
        return $this->hasOne(SinhVien::class, 'id_sinhvien', 'id_nguoidung');
    }

    public function giangVien(): HasOne
    {
        return $this->hasOne(GiangVien::class, 'id_giangvien', 'id_nguoidung');
    }


    public function baiDangs(): HasMany
    {
        return $this->hasMany(BaiDang::class, 'ma_phongdaotao', 'id_nguoidung');
    }
}
