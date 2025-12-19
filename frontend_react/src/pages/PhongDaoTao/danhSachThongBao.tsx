

import { useEffect, useState } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';


interface BaiDang{
    id_baidang: string;
    tieu_de: string;
    noi_dung: string;
    ten_tep: string;
    duong_dan_tep: string;
    created_at: Date;
    updated_at: Date;

}
const DanhSachThongBao = () => {


    const [dsThongBao, setDsThongBao] = useState<BaiDang[]>([]);

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
    }

    useEffect(() => {
        layDsThongBao();
    }, []);


    const [xemChiTietTB, setXemChiTietTB] = useState<boolean>(false);
    const [chiTietTB, setChiTietTB] = useState<BaiDang | null>(null);

    const xuLyXemChiTietTB = (thongbao: BaiDang) => {
        setChiTietTB(thongbao);
        setXemChiTietTB(true);
    };

    const xuLyDongChiTietTB = () => {
        setChiTietTB(null);
        setXemChiTietTB(false);
    };

    const layLoaiTep = (url: string) => {
        return url.split('.').pop()?.toLowerCase();
    };
    const xuLyTaiTep = (duongDanTep: string) => {
        return  duongDanTep.replace('/upload/', '/upload/fl_attachment/');
    }


    const xuLyXoaBaiDang = async (id_baidang: string) => {
        if(!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")){
            return;
        }
        try{
            const phanhoi = await ketNoiAxios.delete(`/pdt/xoa-bai/${id_baidang}`);
            if(phanhoi.data.trangthai){
                alert(phanhoi.data.thongbao);
                layDsThongBao();
                xuLyDongChiTietTB();
            }
        }
        catch(error){
            console.log('Lỗi kết nối API xóa bài đăng: ' + error);
        }
    }


    // Xử lý sửa bài đăng ở đây

    const [moKhungSuaBai, setMoKhungSuaBai] = useState(false);

     // Xử lý chọn tệp đính kèm
    const [tenTep, setTenTep] = useState("");
    const xuLyChonTep = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            setTenTep(event.target.files[0].name);
            setTepDinhKem(event.target.files[0]);
        }else{
            setTepDinhKem(null);
        }
    };


    const [tep_dinh_kem, setTepDinhKem] = useState<File | null>(null);
    const [tieu_de, setTieuDe] = useState("");
    const [noi_dung, setNoiDung] = useState("");
    const [dangTai, setDangTai] = useState(false);

    const xuLyCapNhatBaiDang = async (event: React.FormEvent<HTMLFormElement>, id_baidang: string) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('tieu_de', tieu_de);
        formData.append('noi_dung', noi_dung);

        if(tep_dinh_kem){
            formData.append('tep_dinh_kem', tep_dinh_kem);
        }

        setDangTai(true);

        try{
            const phanhoi = await ketNoiAxios.post(`/pdt/sua-bai/${id_baidang}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(phanhoi.data.trangthai){
                alert(phanhoi.data.thongbao);
                layDsThongBao();

                setChiTietTB(phanhoi.data.baidang_moi);
                setMoKhungSuaBai(false);
            }
        }
        catch(error){
            console.error("Lỗi khi đăng thông báo:", error);
            alert("Đã có lỗi xảy ra khi đăng thông báo. Vui lòng thử lại sau.");
            setDangTai(false);
        }finally {
            setDangTai(false);
        }
    }

    return (
        <>
            {!xemChiTietTB ? (
                <div className="khung-ds-thong-bao flex-col">
                    <div className="khung-chucnang-top flex-row">
                        <div className="khung-timkiem flex-row">
                            <label htmlFor="timKiemTB">Tìm kiếm</label>
                            <input type="text" id="timKiemTB" placeholder="Nhập từ khóa muốn tìm..." />
                        </div>
                    </div>

                    <div className="danhsach-thongbao flex-col">
                        {dsThongBao.length > 0 ? (
                            dsThongBao.map((thongbao) => (
                                <div className="dong-thong-bao flex-row" key={thongbao.id_baidang}>
                                    <div className="logo-thongbao flex-col">
                                        <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1766033437/logo_thongbao_umaxuz.png" alt=""  />
                                    </div>
                                    <div className="noidung-thongbao flex-col">
                                        <p className="tieude-thongbao" onClick={() => xuLyXemChiTietTB(thongbao)}>{thongbao.tieu_de}</p>
                                        <span className='thoigian-tao'>{new Date(thongbao.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{color: '#ccc', textAlign: 'center'}}>Hiện không có thông báo nào.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="khung-chitiet-thongbao flex-col">
                    {!moKhungSuaBai ? (
                        <>
                            <button className="nut-dong-chitiet-tb" onClick={xuLyDongChiTietTB}>
                                <i className="bi bi-box-arrow-right"></i>
                            </button>
                            <h4>{chiTietTB?.tieu_de}</h4>
                            <p className='thoigian-tao flex-row'>
                                <i className="bi bi-calendar3"></i>
                                {chiTietTB ? new Date(chiTietTB.created_at).toLocaleString('vi-VN') : ''}
                            </p>
                            <p className="noidung-thongbao-ct" style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                                {chiTietTB?.noi_dung}
                            </p>

                            <div className="khung-tepdinhkem flex-col" style={{ gap: '15px' }}>
                                <div className="top-khung flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span><i className="bi bi-paperclip"></i> Tệp đính kèm:</span>
                                    {chiTietTB?.duong_dan_tep && (
                                        <a href={xuLyTaiTep(chiTietTB.duong_dan_tep)} 
                                            download={chiTietTB.ten_tep}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="nut-tai-ve"
                                        >
                                            <i className="bi bi-download"></i> {chiTietTB.ten_tep}
                                        </a>
                                    )}
                                </div>

                                <div className="vung-xem-truc-tiep" style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                                    {chiTietTB?.duong_dan_tep ? (
                                        <>
                                            {/* TRƯỜNG HỢP LÀ PDF */}
                                            {layLoaiTep(chiTietTB.duong_dan_tep) === 'pdf' && (
                                                <object
                                                    data={`${chiTietTB.duong_dan_tep}#toolbar=1`}
                                                    type="application/pdf"
                                                    width="100%"
                                                    height="500px"
                                                >
                                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                                        <p>Trình duyệt của bạn không hỗ trợ xem PDF trực tiếp.</p>
                                                        <a href={chiTietTB.duong_dan_tep} target="_blank" rel="noreferrer">Nhấn vào đây để xem tệp</a>
                                                    </div>
                                                </object>
                                            )}

                                            {/* TRƯỜNG HỢP LÀ ẢNH */}
                                            {['jpg', 'jpeg', 'png', 'gif'].includes(layLoaiTep(chiTietTB.duong_dan_tep) || '') && (
                                                <img 
                                                    src={chiTietTB.duong_dan_tep} 
                                                    alt="Ảnh đính kèm" 
                                                    style={{ width: '100%', display: 'block' }} 
                                                />
                                            )}

                                            {/* TRƯỜNG HỢP LÀ WORD/EXCEL */}
                                            {['doc', 'docx', 'xls', 'xlsx'].includes(layLoaiTep(chiTietTB.duong_dan_tep) || '') && (
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(chiTietTB.duong_dan_tep)}&embedded=true`}
                                                    width="100%"
                                                    height="500px"
                                                    style={{ border: 'none' }} 
                                                    title="Trình xem tài liệu"
                                                ></iframe>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>Không có nội dung xem trước</div>
                                    )}
                                </div>
                                
                            </div>

                            <div className="khung-chucnang-chitiet flex-row">
                                <button className='nut-sua-baidang' onClick={() => {
                                    setTieuDe(chiTietTB?.tieu_de || '');
                                    setNoiDung(chiTietTB?.noi_dung || '');
                                    setTenTep(chiTietTB?.ten_tep || '');
                                    setMoKhungSuaBai(true);
                                }}>
                                    Chỉnh sửa
                                </button>
                                <button className='nut-xoa-baidang' onClick={() => xuLyXoaBaiDang(chiTietTB?.id_baidang || '')}>Xóa bài</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="khung-sua-thongbao flex-col">
                                <h2 className="tieude-khung">Chỉnh sửa Thông Báo</h2>
                                <form className="form-sua-thongbao flex-col" onSubmit={(e) => xuLyCapNhatBaiDang(e, chiTietTB?.id_baidang || '')}>
                                    <div className="khung-nhap flex-col">
                                        <label htmlFor="tieude_tb_sua">Tiêu Đề Thông Báo <span style={{color: 'red'}}>*</span></label>
                                        <input className="noidung-nhap" type="text" id="tieude_tb_sua"
                                                value={tieu_de}
                                                onChange={(e) => setTieuDe(e.target.value)}
                                                required
                                                placeholder="Nhập tiêu đề thông báo..."
                                        />
                                    </div>
                                    <div className="khung-nhap flex-col">
                                        <label htmlFor="noiDung_tb_sua">Nội Dung Thông Báo <span style={{color: 'red'}}>*</span></label>
                                        <textarea className="noidung-nhap" id="noiDung_tb_sua"
                                                value={noi_dung}
                                                onChange={(e) => setNoiDung(e.target.value)}
                                                required
                                                placeholder="Nhập nội dung thông báo...">
                                        </textarea>
                                    </div>
                                    
                                    <div className="khung-nhap flex-col">
                                        <label htmlFor="tep_dinh_kem_sua" className="cauhinh-tepdinhkem">
                                            <div className="noidung-tailen flex-col">
                                                <span className="tep-icon">
                                                    <i className="bi bi-file-earmark-arrow-up-fill"></i>
                                                </span>
                                                <span className="tep-text">
                                                    {tenTep ? tenTep : 'Nhấn để chọn tệp tải lên'}
                                                </span>
                                                {!tenTep && <span className="tep-nhan">Hỗ trợ JPG, PNG, PDF, XLSX, DOCX, TXT,...</span>}
                                            </div>
                                        </label>
                                        <input type="file" id="tep_dinh_kem_sua" onChange={xuLyChonTep} />
                                    </div>
                                    <div className="khung-nut-sua flex-row">
                                        <button type="submit" className="nut-sua-thongbao" disabled={dangTai}>
                                            {dangTai ? 'Đang cập nhật...' : 'Cập nhật'}
                                        </button>
                                        <button className='nut-huy-capnhat' onClick={() => setMoKhungSuaBai(false)}>Hủy</button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )} 
        </>
    );
}

export default DanhSachThongBao;