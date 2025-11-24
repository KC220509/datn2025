<?php

namespace App\Services;

use App\Models\GiangVien;
use App\Models\NguoiDung;
use App\Models\SinhVien;

class NguoiDungService
{
    protected $nguoiDungModel;
    protected $sinhVienModel;
    protected $giangVienModel;

    public function __construct(NguoiDung $nguoiDungModel, SinhVien $sinhVienModel, GiangVien $giangVienModel)
    {
        $this->nguoiDungModel = $nguoiDungModel;
        $this->sinhVienModel = $sinhVienModel;
        $this->giangVienModel = $giangVienModel;
    }

    public function layNguoiDungTheoId($id)
    {
        return $this->nguoiDungModel->find($id);
    }

    public function layDanhSachNguoiDung()
    {
        $dsNguoiDung = $this->nguoiDungModel
            ->with([
                'vaiTros',
                'sinhVien.lop.nganh',
                'giangVien.nganh',
                'sinhVien.lop',
                'hocKys',
            ])
            ->whereDoesntHave('vaiTros', function($query){
                $query->where('id_vaitro', 'AD');
            })
            ->get();

        $dsNguoiDung =  $dsNguoiDung->map(function($nguoiDung) {
            $nganh_chung = null;


            if ($nguoiDung->sinhVien) {
                $nganh_chung = $nguoiDung->sinhVien->lop->nganh;
            } elseif ($nguoiDung->giangVien) {
                $nganh_chung = $nguoiDung->giangVien->nganh;
            }

            $nguoiDung->nganh = $nganh_chung;

            return $nguoiDung;
        });
        return $dsNguoiDung;
    }


    public function layDanhSachSinhVien(){
        $dsSinhVien = $this->sinhVienModel->with([
                'nguoiDung',
                'lop',
                'lop.nganh',
                'nguoiDung.hocKys',
            ])
        ->get();

        return $dsSinhVien;
    }


    public function layDanhSachGiangVien(){
        $dsGiangVien = $this->giangVienModel->with([
                'nguoiDung',
                'nganh',
                'nguoiDung.hocKys',
            ])
        ->get();

        return $dsGiangVien;
    }

}


