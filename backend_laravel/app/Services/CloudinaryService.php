<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public function uploadNhieuTep(array $teps, string $thu_muc = 'tai-len'): array
    {
        $duongDans = [];
        foreach ($teps as $tep) {
            if ($tep instanceof UploadedFile) {
                $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME);
                $duoiTep = $tep->getClientOriginalExtension();
                $newTenTep = $gocTenTep . '.' . $duoiTep;

                $duongDanTepTam = $tep->move(sys_get_temp_dir(), $newTenTep);

                $taiLenCloud = cloudinary()->uploadApi()->upload(
                    $duongDanTepTam->getRealPath(),
                    [
                        'folder'        => $thu_muc, 
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                        'resource_type' => 'auto',
                        'use_filename'  => true,
                    ]
                );
                
                $duongDans[] = $taiLenCloud['secure_url'];

                if (file_exists($duongDanTepTam->getRealPath())) {
                    unlink($duongDanTepTam->getRealPath());
                }
            }
        }
        return $duongDans;
    }

    public function uploadTep(UploadedFile $tep, string $thu_muc = 'tai-len'): string
    {
        $gocTenTep = pathinfo($tep->getClientOriginalName(), PATHINFO_FILENAME); 
        $duoiTep = $tep->getClientOriginalExtension();

        $newTenTep = $gocTenTep . '.' . $duoiTep; 
        $duongDanTepMoi = $tep->move(
            sys_get_temp_dir(), 
            $newTenTep  
        );

        $taiLenCloud = cloudinary()->uploadApi()->upload($duongDanTepMoi->getRealPath(),
            [
                'folder'        => $thu_muc,
                'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
                'resource_type' => 'auto',
                'use_filename'  => true,
            ]
        );

        $duongDanTep = $taiLenCloud['secure_url'];
        
        return $duongDanTep;
    
    }
}