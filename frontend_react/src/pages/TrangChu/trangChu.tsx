

import { useEffect, useState } from "react";
import "./trangchu.css";
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import { useLocation } from "react-router-dom";


interface BaiDang{
    id_baidang: string;
    tieu_de: string;
    noi_dung: string;
    duong_dan_teps: string[];
    ten_teps: string[];
    created_at: Date;
    updated_at: Date;
}

const TrangChu = () => {

  const location = useLocation();

  const [dsThongBao, setDsThongBao] = useState<BaiDang[]>([]);
  const [thongBaoHienTai, setThongBaoHienTai] = useState<BaiDang | null>(null);
  const [idThongBao, setIdThongBao] = useState<string>("");

  useEffect(() => {
    const layDsThongBao = async () => {
        try{
            const phanhoi = await ketNoiAxios.get('ds-thongbao');
            if(phanhoi.data.trangthai){
              const tb = phanhoi.data.ds_thongbao;
              setDsThongBao(tb);

              const idBaiDang = location.state?.id_baidang;
              if(idBaiDang){
                setIdThongBao(idBaiDang);
              }
              else if(tb.length > 0 && !idThongBao){
                setIdThongBao(tb[0].id_baidang);
              }
            }
        }
        catch(error){
            console.log('Lỗi kết nối API lấy danh sách thông báo: ' + error);
        }
    };

    layDsThongBao();
  }, [idThongBao, location.state]);

  const layChiTietThongBao = async (id_baidang: string) => {
    try{
        const phanhoi = await ketNoiAxios.get(`/ds-thongbao/chi-tiet/${id_baidang}`);
        if(phanhoi.data.trangthai){
            setThongBaoHienTai(phanhoi.data.thongbao);
        }
    }
    catch(error){
        console.log('Lỗi kết nối API lấy chi tiết thông báo: ' + error);
    }
  };

  useEffect(() => {
    if (idThongBao) {
        layChiTietThongBao(String(idThongBao));
    }
  }, [idThongBao]);

  const [mucTep, setMucTep] = useState<number>(0);
  const layLoaiTep = (url: string) => {
    if (!url) return '';
    return url.split('.').pop()?.toLowerCase();
  };

  const xuLyTaiTep = (duongDanTep: string) => {
    if (!duongDanTep) return '';
    return  duongDanTep.replace('/upload/', '/upload/fl_attachment/');
  }



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
                    <p style={thongBaoHienTai?.id_baidang === tb.id_baidang ? {color: '#007bff', fontWeight: '600', textDecoration: 'underline'} : {}} className="tieude-thongbao" onClick={() => layChiTietThongBao(tb.id_baidang)}>{tb.tieu_de}</p>
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
          <p className="tieude-khung">Thông tin Chi tiết</p>
          <div className="khung-chitiet-thongbao flex-col">
            <h4>{thongBaoHienTai?.tieu_de}</h4>
            <p className='thoigian-tao flex-row'>
                <i className="bi bi-calendar3"></i>
                {thongBaoHienTai ? new Date(thongBaoHienTai.created_at).toLocaleString('vi-VN') : ''}
            </p>
            <p className="noidung-thongbao-ct" style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                {thongBaoHienTai?.noi_dung}
            </p>

            <div className="khung-tepdinhkem flex-col" style={{ gap: '15px' }}>
              <div className="top-khung flex-col">
                <span><i className="bi bi-paperclip"></i> Tệp đính kèm:</span>
                {thongBaoHienTai?.duong_dan_teps?.map((url, index) => (
                  <div key={index} className="muc-tep-xem flex-row">
                      <span 
                          className='ten-tep-xem'
                          onClick={() => setMucTep(index)}
                          style={{ cursor: 'pointer', color: mucTep === index ? '#007bff' : '#333', fontWeight: mucTep === index ? '600' : 'normal' }}
                      >
                          <i className="bi bi-file-earmark"></i> {thongBaoHienTai.ten_teps[index]}
                      </span>
                      <a href={xuLyTaiTep(url)} download target="_blank" rel="noopener noreferrer" style={{ color: '#28a745' }}>
                          <i className="bi bi-download"></i>
                      </a>
                  </div>
                ))}
              </div>

              <div className="vung-xem-truc-tiep">
                {thongBaoHienTai?.duong_dan_teps ? (
                  <div key={mucTep}>
                    {(() => {
                      const duongDan = thongBaoHienTai?.duong_dan_teps[mucTep];
                      if (!duongDan) return null;

                      const loaiTep = layLoaiTep(duongDan);
                      if(loaiTep === 'pdf'){
                          return (
                            <object
                              data={`${duongDan}#toolbar=1`}
                              type="application/pdf"
                              width="100%"
                              height="600px"
                            >
                              <div style={{ padding: '20px', textAlign: 'center' }}>
                                  <p>Trình duyệt không hỗ trợ xem PDF trực tiếp.</p>
                                  <a href={duongDan} download target="_blank" rel="noreferrer">Nhấn vào đây để tải tệp</a>
                              </div>
                            </object>
                          );
                      }

                      if (['jpg', 'jpeg', 'png', 'gif'].includes(loaiTep || '')) {
                        return (
                          <div style={{ textAlign: 'center', padding: '10px' }}>
                            <img 
                              src={duongDan} 
                              alt="Ảnh đính kèm" 
                              style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} 
                            />
                          </div>
                        );
                      }

                      if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(loaiTep || '')) {
                          return (
                            <div className="khung-xem-office" translate="no" style={{ width: '100%', height: '600px' }}>
                              <iframe
                                key={`office-${duongDan}`}
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(duongDan)}&embedded=true`}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title="Trình xem tài liệu"
                              ></iframe>
                            </div>
                          );
                      }
                      return (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                          <i className="bi bi-file-earmark-zip" style={{ fontSize: '40px' }}></i>
                          <p>Định dạng tệp (.{loaiTep}) không hỗ trợ xem trực tiếp.</p>
                          <a href={xuLyTaiTep(duongDan)} download target="_blank" rel="noreferrer" className="nut-tai-ve" style={{ textDecoration: 'underline' }}>
                              Tải về để xem nội dung
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                    <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>Không có nội dung xem trước</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrangChu;