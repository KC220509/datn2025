

import { useEffect, useState } from "react";
import "./trangchu.css";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


interface BaiDang{
    id_baidang: string;
    tieu_de: string;
    noi_dung: string;
    duong_dan_tep: string;
    created_at: Date;
    updated_at: Date;
}

const TrangChu = () => {

  const [dsThongBao, setDsThongBao] = useState<BaiDang[]>([]);

  useEffect(() => {
    const layDsThongBao = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('ds-thongbao');
            if(phanhoi.data.trangthai){
                setDsThongBao(phanhoi.data.ds_thongbao);
            }
        }
        catch(error){
            console.log('Lỗi kết nối API lấy danh sách thông báo: ' + error);
        }
    };

    layDsThongBao();
  }, []);

  const xuLyXemThongBao = (id_baidang: BaiDang) => {
    console.log("Xem chi tiết thông báo:", id_baidang); 
  }

  const DANH_SACH_LIEN_KET = [
    { ten: "Bộ Giáo dục và Đào tạo", link: "http://moet.gov.vn/", anh: "v1761665186/bo_gd_dt.png" },
    { ten: "Trường Đại học Bách Khoa - ĐHĐN", link: "https://dut.udn.vn/", anh: "v1761665369/logo-dh-bk_yjbwal.png" },
    { ten: "Trường Đại học Kinh tế - ĐHĐN", link: "http://due.udn.vn/", anh: "v1761665551/logo-dh-kt_c29xsr.png" },
    { ten: "Trường Đại học Sư phạm - ĐHĐN", link: "http://ued.udn.vn/", anh: "v1761665554/logo-dh-sp_fdbeon.png" },
    { ten: "Trường Đại học Ngoại ngữ - ĐHĐN", link: "http://ufl.udn.vn/", anh: "v1761665552/logo-dh-nn_bpim2c.png" },
  ];

  return (
    <>
      <div className="khung-trang-chu flex-row">
        <div className="khung-noidung trai flex-col">
          <p className="tieude-khung">Thông tin - Thông báo</p>
          <div className="noi-dung-trai flex-col">
            {dsThongBao.length > 0 ? (
              dsThongBao.map((tb) => (
                <div className="khung-thong-bao flex-row" key={tb.id_baidang}>
                  <div className="thoigian-thongbao flex-col">
                    <p className="ngay-tao">{new Date(tb.created_at).getDate()}/{new Date(tb.created_at).getMonth() + 1}</p>
                    <p className="nam-tao">{new Date(tb.created_at).getFullYear()}</p>
                  </div>
                  <div className="noidung-thongbao flex-col">
                    <p className="tieude-thongbao">{tb.tieu_de}</p>
                    <p className="mota-thongbao">{tb.noi_dung}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: "center"}}>Không có thông báo nào.</p>
            )}
          </div>
        </div>

        <div className="khung-noidung giua flex-col">
          <p className="tieude-khung">Sự Kiện - Hoạt Động</p>
        </div>
        <div className="khung-noidung phai flex-col">
          <p className="tieude-khung">Liên Kết</p>
          <div className="noi-dung-phai flex-col">
            {DANH_SACH_LIEN_KET.map((lk, index) => (
              <div key={index} className="lien-ket flex-row">
                <img className="lien-ket-anh" src={`https://res.cloudinary.com/dpkysexsr/image/upload/${lk.anh}`} alt={lk.ten} />
                <a className="lien-ket-ten" href={lk.link} target="_blank" rel="noreferrer">{lk.ten}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TrangChu;