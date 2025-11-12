<?php

namespace App\Services;

use App\Models\NguoiDung;

class NguoiDungService
{
    protected $nguoiDungModel;

    public function __construct(NguoiDung $nguoiDungModel)
    {
        $this->nguoiDungModel = $nguoiDungModel;
    }

    public function layNguoiDungTheoId($id)
    {
        return $this->nguoiDungModel->find($id);
    }

    public function layDanhSachNguoiDung()
    {
        $dsNguoiDung = $this->nguoiDungModel->with('vaiTro:ten_vai_tro')->get();

        return $dsNguoiDung;
    }


    public function layDanhSachSinhVien(){
        $dsSinhVien = $this->nguoiDungModel->whereHas('vaiTro', function($query){
            $query->where('ten_vai_tro', 'SV');
        })->get();

        return $dsSinhVien;
    }


    public function layDanhSachGiangVien(){
        $dsGiangVien = $this->nguoiDungModel->whereHas('vaiTro', function($query){
            $query->where('ten_vai_tro', 'GV');
        })->get();

        return $dsGiangVien;
    }

}


