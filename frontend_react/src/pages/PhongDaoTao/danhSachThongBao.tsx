

import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';

const DanhSachThongBao = () => {

    interface BaiDang{
        id_baidang: string;
        tieu_de: string;
        noi_dung: string;
        duong_dan_tep: string;
        ngay_dang: string;
        created_at: Timestamp;
        updated_at: Timestamp;
    
    }


    const [dsThongBao, setDsThongBao] = useState<BaiDang[]>([]);

    const layDsThongBao = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('ds-thong-bao');
            if(phanhoi.data.trangthai){
                setDsThongBao(phanhoi.data.ds_thongbao);
            }
        }
        catch(error){
            console.log('Lỗi kết nối API lấy danh sách thông báo: ' + error);
        }
    }

    useEffect(() => {
        layDsThongBao();
    }, []);


    return (
        <div className="khung-ds-thong-bao flex-col">
            <div className="khung-chucnang-top flex-row">
                <div className="khung-timkiem flex-row">
                    <label htmlFor="timKiemTB">Tìm kiếm</label>
                    <input type="text" id="timKiemTB" placeholder="Nhập từ khóa muốn tìm..." />
                </div>
            </div>

            <div className="danhsach-thongbao flex-col">
                <div className="dong-thong-bao flex-row">
                    <div className="logo-thongbao flex-col">
                        <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1766033437/logo_thongbao_umaxuz.png" alt=""  />
                    </div>
                    <div className="noidung-thongbao flex-col">
                        <p className="tieude-thongbao">Thông báo v/v tổ chức thi, danh sách thi, SBD, ca thi và phòng thi kỳ ĐGNL tiếng Anh CĐR, đợt thi ngày 21/12/2025
                            tổ chức thi, danh sách thi, SBD, ca thi và phanh sách thi, SBD, ca thi và phòng thi kỳ ĐGNL tiếng Anh CĐR, đợt thi ngày 21/12/2025
                        </p>
                        <span className='thoigian-tao'>12/12/2023 12:10</span>
                    </div>
                </div>
                <div className="dong-thong-bao flex-row">
                    <div className="logo-thongbao flex-col">
                        <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1766033437/logo_thongbao_umaxuz.png" alt="" />
                    </div>
                    <div className="noidung-thongbao flex-col">
                        <p className="tieude-thongbao">Thông báo v/v tổ chức thi ca thi và phòng thi kỳ ĐGNL tiếng Anh CĐR, đợt thi ngày 21/12/2025
                        </p>
                        <span className='thoigian-tao'>12/12/2023 12:10</span>
                    </div>
                </div>
                {dsThongBao.length > 0 ? (
                    dsThongBao.map((thongbao, index) => (
                        <div className="dong-thong-bao flex-row" key={index}>
                            <div className="logo-thongbao flex-col">
                                <i className="bi bi-bell-fill"></i>
                            </div>
                            <div className="noidung-thongbao flex-col">
                                <p className="tieude-thongbao">{thongbao.tieu_de}</p>
                                <p className='thoigian-tao'>{thongbao.created_at.toDate().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{color: '#ccc', textAlign: 'center'}}>Hiện không có thông báo nào.</p>
                )}
            </div>
        </div>
    );
}

export default DanhSachThongBao;