<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
