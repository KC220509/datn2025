import { useEffect, useState } from "react";

import './trangGiangVien.css';
import ketNoiAxios from "../../tienichs/ketnoiAxios";

const PhanCongGvSv = () => {

    interface HocKy{
        id_hocky: string;
        ten_hoc_ky: string;
    }

    interface Nganh{
        id_nganh: string;
        ma_truongbomon: string;
        ten_nganh: string;
        ky_hieu: string;
    }

    interface NguoiDung{
        id_nguoidung: string;
        ho_ten: string;
        nganh: Nganh;
    }

    interface GiangVien{
        id_giangvien: string;
        ma_nganh: string;
        hoc_ham_hoc_vi: string;
        nguoi_dung: NguoiDung;
    }

    interface SinhVien{
        id_sinhvien: string;
        msv: string;
        nguoi_dung: NguoiDung;
    }

    const [loaiPhanCong, setLoaiPhanCong] = useState<boolean>(true);
    const xuLyChonLoaiPhanCong = (loai: boolean) => {
        setLoaiPhanCong(loai);
    }

    const [ds_hocky, setDsHocKy] = useState<HocKy[]>([]);
    const layDsHocKy = async () => {
        try{
            const ds = await ketNoiAxios.get('/gv/ds-hocky');
            if(ds.data.ds_hocky){
                setDsHocKy(ds.data.ds_hocky);
            }
        }catch(error){
            console.log(error);
        }
    }

    const [dsGvNganh, setDsGvNganh] = useState<GiangVien[]>([]);
    const [dsSvNganh, setDsSvNganh] = useState<SinhVien[]>([]);

    //Lấy ds giảng viên và sinh viên theo ngành của trưởng bộ môn
    
    
    const [idHocKy, setIdHocKy] = useState<string>('');
    
    const [ktraChonHocKy, setKtraChonHocKy] = useState<boolean>(false);


    
    
    useEffect(() => {
        layDsHocKy();

        if(idHocKy){
            setKtraChonHocKy(true);
        } else {
            setKtraChonHocKy(false);
        }
    }, [idHocKy]);
    

    return (
        <div className="trang-phancong-gvsv flex-col">
            <div className="chon-loai-phancong flex-row">
                <span className={`chon ${loaiPhanCong ? 'phancong-ngaunhien' : ''}`} onClick={() => xuLyChonLoaiPhanCong(true)}>Phân Công Ngẫu Nhiên</span>
                <span className={`chon ${!loaiPhanCong ? 'phancong-thucong' : ''}`} onClick={() => xuLyChonLoaiPhanCong(false)}>Phân Công Thủ Công</span>
            </div>
            <div className="khung-phancong-gvsv flex-row">
                {loaiPhanCong ? (
                    <form className="khung-phancong-ngaunhien flex-row">
                        <div className="khung-ds-nguoidung flex-row">
                            <div className="khung-ds ds-giangvien flex-col">
                                <h4>Danh Sách Giảng Viên Hướng Dẫn</h4>
                                <div className="ds-nguoidung">
                                    <ul className="flex-col">
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                        <li>Nguyễn Văn A - 21115053120306</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="khung-ds ds-sinhvien flex-col">
                                <h4>Danh Sách Sinh Viên</h4>
                                <div className="ds-nguoidung">
                                    <ul className="flex-col">
                                        <li>Trần Thị B - 21115053120307</li>
                                        <li>Trần Thị B - 21115053120307</li>
                                        <li>Trần Thị B - 21115053120307</li>
                                        <li>Trần Thị B - 21115053120307</li>
                                        <li>Trần Thị B - 21115053120307</li>
                                        <li>Trần Thị B - 21115053120307</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="khung-chucnang-phancong flex-col">
                            <div className="khung-chon-hocky flex-row">
                                <label htmlFor="id_hocky">Chọn Học Kỳ</label>
                                <select className="chon-hocky-phancong" name="id_hocky" id="id_hocky"
                                    onChange={(e) => setIdHocKy(e.target.value)}
                                    value={idHocKy}
                                >
                                    <option value="">Tất cả</option>
                                    {ds_hocky.map((hocky) => (
                                        <option key={hocky.id_hocky} value={hocky.id_hocky}>{hocky.ten_hoc_ky}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="khung-tienhanh-phancong">
                                <button className={`nut-phancong ${ktraChonHocKy ? '' : 'disabled'}`} type="submit" disabled={!ktraChonHocKy}>Tiến Hành Phân Công</button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form className="khung-phancong-thucong flex-col">
                        <h4>Phân Công Thủ Công</h4>
                    </form>
                )}
                
            </div>
        </div>
    );
}

export default PhanCongGvSv;