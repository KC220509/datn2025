import { useState, useEffect } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';

interface Props {
    nhiemVuId: string;
    laGiangVien: boolean;
    onBack: () => void;
}

interface NopBai {
    id_nopbai: string;
    ma_nhom: string;
    ma_sinhvien: string;
    ma_nhiemvu: string;
    ten_teps: string[];
    duong_dan_teps: string[];
    trang_thai: string; 
    nhan_xet: string;
    thoigian_nop: string;
}


interface NhiemVu {
    id_nhiemvu: string;
    ten_nhiemvu: string;
    noi_dung: string;
    duong_dan_teps?: string[];
    ten_teps?: string[];
    han_nop: string;
    han_dong: string;
    trangthai_nhiemvu: string;
    danh_sach_nop_bai_count?: number;
    danh_sach_nop_bai?: NopBai[];
    bai_nop?: NopBai;
}

const ChiTietBaiTap = ({ nhiemVuId, laGiangVien, onBack }: Props) => {
    const [baiTap, setBaiTap] = useState<NhiemVu | null>(null);
    const [dangGui, setDangGui] = useState(false);
    const [hoanTacNopBai, setHoanTacNopBai] = useState(false);
    const [tepChon, setTepChon] = useState<File[]>([]);
    

    useEffect(() => {
        layChiTietNhiemVu(String(nhiemVuId));
    }, [nhiemVuId]);

    const layChiTietNhiemVu = async (nhiemVuId: string) => {
        try {
            const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/nhiem-vu/${nhiemVuId}`);
            if (phanhoi.data.trangthai) {
                setBaiTap(phanhoi.data.nhiem_vu);
                setHoanTacNopBai(false);
                setTepChon([]);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết nhiệm vụ", error);
        }
    };

    const xuLyXoaTepChon = (indexXoa: number) => {
        setTepChon(prev => prev.filter((_, index) => index !== indexXoa));
    };



    const xuLyNopBai = async (nhiemVuId: string) => {
        if (tepChon.length === 0) return alert("Vui lòng chọn ít nhất một tệp!");

        const formData = new FormData();
        tepChon.forEach(file => formData.append('tep_dinh_kem[]', file));

        setDangGui(true);
        try {
            const phanhoi = await ketNoiAxios.post(`nhom/chi-tiet/nhiem-vu/${nhiemVuId}/nop-bai`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (phanhoi.data.trangthai) {
                alert("Nộp bài thành công!");

                layChiTietNhiemVu(String(nhiemVuId));
            }
        } catch (error) {
            alert("Lỗi khi nộp bài");
            console.error("Lỗi nộp bài", error);
        } finally {
            setDangGui(false);
        }
    };


    if (!baiTap) return <div className="loading">Đang tải nội dung...</div>;
    const thongTinNopBai = baiTap.danh_sach_nop_bai && baiTap.danh_sach_nop_bai.length > 0 
                           ? baiTap.danh_sach_nop_bai[0] : null;

    const daNopBai = !!thongTinNopBai;

    const hienTai = new Date();
    const hanNop = new Date(baiTap.han_nop);
    const hanDong = new Date(baiTap.han_dong);
    
    const daDong = hienTai > hanDong;
    const dangTrongThoiGianTre = hienTai > hanNop && hienTai <= hanDong;


    return (
        <div className="khung-chi-tiet-bt">
            <div className="dau-trang flex-col">
                <div className="chuc-nang flex-row">
                    <button className="nut-back" onClick={onBack}>
                        <i className="bi bi-arrow-bar-left"></i> Quay lại
                    </button>
                    {laGiangVien && (
                        <button className='mokhung-cap-nhat'>
                            <i className="bi bi-pencil-square"></i> Cập nhật
                        </button>
                    )}
                </div>
                <h2 className="tieu-de-nhiem-vu">{baiTap.ten_nhiemvu}</h2>
            </div>

            <div className="than-trang flex-row">
                {/* PHẦN TRÁI: NỘI DUNG ĐỀ BÀI */}
                <div className="cot-trai flex-col">
                    <div className="khung-noi-dung">
                        <h3><i className="bi bi-info-circle"></i> Hướng dẫn</h3>
                        <div className="van-ban-noi-dung" style={{ whiteSpace: 'pre-wrap' }}>
                            {baiTap?.noi_dung || "Không có nội dung mô tả chi tiết."}
                        </div>
                    </div>

                    <div className="khung-tep-dinh-kem">
                        <h3><i className="bi bi-paperclip"></i> Tài liệu đính kèm</h3>
                        <div className="danh-sach-tep flex-col">
                            {baiTap?.duong_dan_teps && baiTap?.duong_dan_teps.map((tep: string, idx: number) => (
                                <a key={idx} href={tep} target="_blank" className="the-tep">
                                    <i className="bi bi-file-earmark-pdf"></i> {baiTap?.ten_teps ? baiTap.ten_teps[idx] : ''}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {!laGiangVien && (
                    <div className="cot-phai flex-col">
                        <div className="khung-nop-bai">
                            <h3>Bài làm của bạn</h3>
                            <div className="thong-tin-han">
                                <b className='flex-row'>Hạn nộp: <p>{hanNop.toLocaleString('vi-VN')}</p></b>
                                <b className='flex-row'>Đóng vào: <p>{hanDong.toLocaleString('vi-VN')}</p></b>
                                <b className='flex-row'>Trạng thái:  
                                    <p className={baiTap.trangthai_nhiemvu}>
                                        {daNopBai ? (thongTinNopBai?.trang_thai === 'tre_han' ? 'Đã nộp trễ' : 'Đã nộp bài')
                                            : (daDong ? 'Đã Đóng' : (dangTrongThoiGianTre ? 'Nộp bài trễ' : 'Nộp bài'))
                                        }
                                    </p>
                                </b>
                            </div>

                            <div className="vung-upload flex-col">
                                {daNopBai && hoanTacNopBai == false && (
                                    <div className="khung-tep-da-nop flex-col">
                                        <p>Danh Sách Tệp</p>
                                        {thongTinNopBai.duong_dan_teps.map((link, idx) => (
                                            <div key={idx} className="tep-item flex-row">
                                                <i className="bi bi-file-earmark-fill"></i>
                                                <a href={link} target="_blank" rel="noreferrer">
                                                    {thongTinNopBai.ten_teps[idx]}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(!daNopBai || hoanTacNopBai) && !daDong && (
                                    <>
                                        <input 
                                            type="file" 
                                            id="input-nop-bai" 
                                            multiple 
                                            hidden 
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    const filesArray = Array.from(e.target.files);
                                                    setTepChon(prev => [...prev, ...filesArray]);
                                                    e.target.value = ""; 
                                                }
                                            }}
                                        />

                                        
                                        <label 
                                            htmlFor="input-nop-bai" 
                                            className={`label-upload flex-col`}
                                        >
                                            <i className="bi bi-cloud-arrow-up"></i>
                                            <span>Chọn dữ liệu bài làm</span>
                                        </label>

                                        
                                        {tepChon.length > 0 && (
                                            <div className="khung-danh-sach-tep-da-chon flex-col">
                                                {tepChon.map((file, index) => (
                                                    <div key={index} className="item-tep-cho-upload flex-row">
                                                        <span className="ten-tep-rut-gon" style={{fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                            <i className="bi bi-file-earmark"></i> {file.name}
                                                        </span>
                                                        <i 
                                                            className="bi bi-x-square nut-xoa-tep-hanh-dong" 
                                                            style={{color: '#dc3545', cursor: 'pointer', fontSize: '14px'}}
                                                            onClick={() => xuLyXoaTepChon(index)}
                                                        ></i>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </>
                                )}
                            </div>

                            
                            <div className="nhom-nut-hanh-dong">
                                {daDong ? (
                                    <div className='da-dong'>
                                        <i className="bi bi-exclamation-octagon"></i> Đã Đóng
                                    </div>
                                ) : (
                                    daNopBai && !hoanTacNopBai ? (
                                        <button onClick={() => setHoanTacNopBai(true)} className='nut-hoan-tac'>
                                            <i className="bi bi-arrow-counterclockwise"></i> Hoàn tác nộp bài
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                className={`nut-gui-bai ${dangTrongThoiGianTre ? 'dang_tre_han' : 'con_han'}`}
                                                disabled={dangGui || tepChon.length === 0} 
                                                onClick={() => xuLyNopBai(baiTap.id_nhiemvu)}
                                                style={{cursor: tepChon.length === 0 ? 'not-allowed' : 'pointer', opacity: tepChon.length === 0 ? 0.6 : 1}}
                                            >
                                                {dangGui ? "Đang xử lý..." : (hoanTacNopBai ? "Nộp lại" : (dangTrongThoiGianTre ? "Nộp bài trễ" : "Nộp bài"))}
                                            </button>
                                            {hoanTacNopBai && (
                                                <button className='nut-huy-bo' onClick={() => {setHoanTacNopBai(false); setTepChon([]);}}>Hủy bỏ</button>
                                            )}
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChiTietBaiTap;