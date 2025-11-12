<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
    
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'nguoi_dung';
    protected $primaryKey = 'id_nguoidung';
    protected $fillable = [
        'email',
        'mat_khau',
        'ho_ten',
        'so_dien_thoai',
        'dia_chi',
        'gioi_tinh',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function vaiTro(): HasMany
    {
        return $this->hasMany(VaiTro::class, 'ma_nguoidung', 'id_nguoidung');
    }

}
