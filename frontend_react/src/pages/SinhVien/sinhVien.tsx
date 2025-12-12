import { useEffect, useState } from 'react';
import './trangSinhVien.css'
import ketNoiAxios from '../../tienichs/ketnoiAxios';


interface HocKy{
    id_hocky: string;
    ten_hoc_ky: string;
}

interface Lop{
    id_lop: string;
    ten_lop: string;
    nganh: Nganh;
}

interface Nganh{
    id_nganh: string;
    ten_nganh: string;

}

interface NguoiDung{
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    trang_thai: boolean;

}

interface GiangVien {
    id_giangvien: string;
    nguoi_dung: NguoiDung;
    hoc_ham_hoc_vi: string;
}

interface SinhVien {
    id_sinhvien: string;
    msv: string;
    lop: Lop;
    nguoi_dung: NguoiDung;
}



interface GiangVienHD{
    hoc_ky: HocKy;
    nganh_gv: string;
    giang_vien: GiangVien;
    nguoi_dung_giang_vien: NguoiDung;
}

const SinhVien: React.FC = () => {

    const [moKhungThongTinGV, setMoKhungThongTinGV] = useState<number | null>(null);


    const xuLyMoKhungThongTinGV = (chimuc: number) => {
        setMoKhungThongTinGV(chon => (chon === chimuc ? null : chimuc));
    }


    const [sinhVien, setSinhVien] = useState<SinhVien | null>(null);
    const [dsGiangVienHD, setDsGiangVienHD] = useState<GiangVienHD[]>([]);

    useEffect(() => {   
        layThongTinSV();
        layDsGiangVienHD();
    }, []);

    const layThongTinSV = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('/sv/thong-tin-sv');
            if(phanhoi.data.trangthai){
                setSinhVien(phanhoi.data.sinhvien[0]);
            }
        }catch(error){
            console.log('Lỗi khi lấy danh sách giảng viên hướng dẫn:', error);
        }
    }
    const layDsGiangVienHD = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('/sv/ds-giangvien-hd');
            if(phanhoi.data.trangthai){
                setDsGiangVienHD(phanhoi.data.ds_giangvien_hd);
            }
        }catch(error){
            console.log('Lỗi khi lấy danh sách giảng viên hướng dẫn:', error);
        }
    }



    return (
        <div className='tong-quan-sinhvien flex-row'>
            <div className="thong-tin flex-col">
                <h4 className='tieude-muc'>Thông tin sinh viên</h4>
                <div className="khung-thongtin flex-row">
                    <div className="thongtin-trai flex-col">
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Họ và Tên:</span>
                            <span className="noi-dung-dong">{sinhVien?.nguoi_dung.ho_ten}</span>
                        </div>
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Email:</span>
                            <span className="noi-dung-dong">{sinhVien?.nguoi_dung.email}</span>
                        </div>
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Chuyên ngành:</span>
                            <span className="noi-dung-dong">{sinhVien?.lop?.nganh.ten_nganh}</span>
                        </div>
                    </div>
                    <div className="thongtin-phai flex-col">
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Mã sinh viên:</span>
                            <span className="noi-dung-dong">{sinhVien?.msv}</span>
                        </div>
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Lớp sinh hoạt:</span>
                            <span className="noi-dung-dong">{sinhVien?.lop.ten_lop}</span>
                        </div>
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Số điện thoại:</span>
                            <span className="noi-dung-dong">{sinhVien?.nguoi_dung.so_dien_thoai}</span>
                        </div>
                        <div className="dong-thongtin flex-row">
                            <span className="tieu-de-dong">Trạng thái:</span>
                            <span className="noi-dung-dong" style={{color: sinhVien?.nguoi_dung?.trang_thai ? 'green' : 'red', fontWeight: 'bold'}}>{sinhVien?.nguoi_dung?.trang_thai ? 'Hoạt động' : 'Không hoạt động'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="thong-tin flex-col">
                <h4 className='tieude-muc'>Giảng viên hướng dẫn</h4>
                <div className="ds-giangvien-hk flex-col">
                {dsGiangVienHD.length > 0 ? (
                    dsGiangVienHD.map((gv, index) => (
                        <div key={index}>
                            <div className={`khung-giangvien-hk flex-row ${moKhungThongTinGV === index ? 'active' : ''}`}>
                                <div className="dong-ten-hocky flex-row">
                                    <span className='ten-giangvien'>GVHD : {gv.nguoi_dung_giang_vien.ho_ten}</span>
                                    
                                    <span className='hocky-giangvien'>Học kỳ {gv.hoc_ky.ten_hoc_ky}</span>
                                </div>
                                <i className={`nut-mo-thongtin bi bi-caret-down-fill ${moKhungThongTinGV === index ? 'active' : ''}`} onClick={() => xuLyMoKhungThongTinGV(index)}></i>
                            </div>
                            {moKhungThongTinGV === index && (
                                <div className="khung-thongtin flex-row">
                                    <div className="thongtin-trai flex-col">
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Họ và Tên:</span>
                                            <span className="noi-dung-dong">{gv.nguoi_dung_giang_vien.ho_ten}</span>
                                        </div>
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Email:</span>
                                            <span className="noi-dung-dong">{gv.nguoi_dung_giang_vien.email}</span>
                                        </div>
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Chuyên ngành:</span>
                                            <span className="noi-dung-dong">{gv.nganh_gv}</span>
                                        </div>
                                    </div>
                                    <div className="thongtin-phai flex-col">
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Học hàm Học vị:</span>
                                            <span className="noi-dung-dong">{gv.giang_vien.hoc_ham_hoc_vi}</span>
                                        </div>
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Số điện thoại:</span>
                                            <span className="noi-dung-dong">{gv.nguoi_dung_giang_vien.so_dien_thoai.length === 9 ? `0${gv.nguoi_dung_giang_vien.so_dien_thoai}` : gv.nguoi_dung_giang_vien.so_dien_thoai}</span>
                                        </div>
                                        <div className="dong-thongtin flex-row">
                                            <span className="tieu-de-dong">Trạng thái:</span>
                                            <span className="noi-dung-dong" style={{color: gv.nguoi_dung_giang_vien.trang_thai ? 'green' : 'red', fontWeight: 'bold'}}>{gv.nguoi_dung_giang_vien.trang_thai ? "Hoạt động" : "Không hoạt động"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                    ) : (
                        <div className="khung-chua-gvhd flex-row">
                        Hiện tại bạn chưa có giảng viên hướng dẫn nào.
                    </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default SinhVien;