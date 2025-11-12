<?php

namespace App\Services;

use App\Models\Khoa;
use App\Models\LopSinhHoat;
use App\Models\Nganh;

class KhoaNganhLopService
{
    protected $khoaModel;
    protected $nganhModel;
    protected $lopModel;

    public function __construct(Khoa $khoaModel, Nganh $nganhModel, LopSinhHoat $lopModel)
    {
        $this->khoaModel = $khoaModel;
        $this->nganhModel = $nganhModel;
        $this->lopModel = $lopModel;
    }

    public function layDanhSachKhoa()
    {
        return $this->khoaModel->all();
    }

    public function layDanhSachNganh(){
        return $this->nganhModel->all();
    }
    
    public function layDanhSachLop(){
        return $this->lopModel->all();
    }

    public function layNganhTheoKhoa($khoa_id){
        return $this->nganhModel->where('khoa_id', $khoa_id)->get();
    }

    public function layLopTheoNganh($nganh_id){
        return $this->lopModel->where('nganh_id', $nganh_id)->get();
    }
}