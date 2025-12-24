

import { useEffect, useState } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';


interface BaiDang{
    id_baidang: string;
    tieu_de: string;
    noi_dung: string;
    ten_teps: string[];
    duong_dan_teps: string[];
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
        setMucTep(0);
        setXemChiTietTB(true);
    };

    const [mucTep, setMucTep] = useState<number>(0);

    const xuLyDongChiTietTB = () => {
        setChiTietTB(null);
        setXemChiTietTB(false);
    };

    const layLoaiTep = (url: string) => {
        if (!url) return '';
        return url.split('.').pop()?.toLowerCase();
    };

    const xuLyTaiTep = (duongDanTep: string) => {
        if (!duongDanTep) return '';
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

    
    const xuLyDongKhungSuaBai = () => {
        setMoKhungSuaBai(false);
        setDanhSachTep([]);
        setTieuDe('');
        setNoiDung('');
    }


     // Xử lý chọn tệp đính kèm
    const [danhSachTep, setDanhSachTep] = useState<File[]>([]);
    // const [tenTep, setTenTep] = useState("");

    const xuLyChonTep = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const tepChon = Array.from(e.target.files);
            setDanhSachTep(prev => [...prev, ...tepChon]);
            e.target.value = "";
        }
    };

    const xuLyXoaTep = (tepXoa: number) => {
        setDanhSachTep(prev => prev.filter((_, index) => index !== tepXoa));
    };


    const [tieu_de, setTieuDe] = useState("");
    const [noi_dung, setNoiDung] = useState("");
    const [dangTai, setDangTai] = useState(false);

    const xuLyCapNhatBaiDang = async (event: React.FormEvent<HTMLFormElement>, id_baidang: string) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('tieu_de', tieu_de);
        formData.append('noi_dung', noi_dung);

        if (danhSachTep) {
            danhSachTep.forEach((file) => {
                formData.append('tep_dinh_kem[]', file); 
            });
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
                setDanhSachTep([]);
                layDsThongBao();

                setChiTietTB(phanhoi.data.baidang_moi);
                setMoKhungSuaBai(false);
            }
        }
        catch(error){
            console.error("Lỗi khi đăng thông báo:", error);
            alert("Đã có lỗi xảy ra khi đăng thông báo. Vui lòng thử lại sau.");
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
                                <div className="top-khung flex-col">
                                    <span><i className="bi bi-paperclip"></i> Tệp đính kèm:</span>
                                    {chiTietTB?.duong_dan_teps?.map((url, index) => (
                                        <div key={index} className="muc-tep-xem flex-row">
                                            <span 
                                                className='ten-tep-xem'
                                                onClick={() => setMucTep(index)}
                                                style={{ cursor: 'pointer', color: mucTep === index ? '#007bff' : '#333', fontWeight: mucTep === index ? '600' : 'normal' }}
                                            >
                                                <i className="bi bi-file-earmark"></i> {chiTietTB.ten_teps[index]}
                                            </span>
                                            <a href={xuLyTaiTep(url)} download target="_blank" rel="noopener noreferrer" style={{ color: '#28a745' }}>
                                                <i className="bi bi-download"></i>
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <div className="vung-xem-truc-tiep" style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                                    {chiTietTB?.duong_dan_teps ? (
                                        
                                        <div key={mucTep}>
                                            {(() => {
                                                const duongDan = chiTietTB.duong_dan_teps[mucTep];
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

                            <div className="khung-chucnang-chitiet flex-row">
                                <button className='nut-sua-baidang' onClick={() => {
                                    setTieuDe(chiTietTB?.tieu_de || '');
                                    setNoiDung(chiTietTB?.noi_dung || '');
                                    setDanhSachTep([]);
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
                                    
                                    <div className="khung-chon-tepdinhkem flex-col">
                                        <label htmlFor="tep_dinh_kem_sua" className="cauhinh-tepdinhkem">
                                            <div className="noidung-tailen flex-col">
                                                <span className="tep-icon">
                                                    <i className="bi bi-file-earmark-arrow-up-fill"></i>
                                                </span>
                                                <span className="tep-text">
                                                    Nhấn để chọn tệp tải lên
                                                </span>
                                                <span className="tep-nhan">Hỗ trợ JPG, PNG, PDF, XLSX, DOCX, TXT,...</span>
                                            </div>
                                        </label>
                                        {danhSachTep.length > 0 ? (
                                            <div className="khung-danh-sach-tep-da-chon flex-col">
                                                {danhSachTep.map((file, index) => (
                                                    <div key={index} className="tep-cho-upload flex-row">
                                                        <span className="ten-tep-rut-gon" title={file.name}>
                                                            {file.name}
                                                        </span>
                                                        <i 
                                                            className="bi bi-x-square nut-xoa-tep" 
                                                            onClick={() => xuLyXoaTep(index)}
                                                        ></i>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="khung-danh-sach-tep-da-chon flex-col">
                                                {chiTietTB?.ten_teps.map((ten, index) => (
                                                    <div key={index} className="tep-cho-upload flex-row">
                                                        <span className="ten-tep-rut-gon" title={ten}>
                                                            {ten}
                                                        </span>
                                                        
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <input type="file" id="tep_dinh_kem_sua" onChange={xuLyChonTep} multiple />
                                    </div>
                                    <div className="khung-nut-sua flex-row">
                                        <button type="submit" className="nut-sua-thongbao" disabled={dangTai}>
                                            {dangTai ? 'Đang cập nhật...' : 'Cập nhật'}
                                        </button>
                                        <button className='nut-huy-capnhat' onClick={() => xuLyDongKhungSuaBai()}>Hủy</button>
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