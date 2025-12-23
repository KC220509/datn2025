import { useState, useEffect } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';

interface Props {
    nhiemVuId: string;
    laGiangVien: boolean;
    onBack: () => void;
}

interface NhiemVu {
    id_nhiemvu: string;
    ten_nhiemvu: string;
    noi_dung: string;
    duong_dan_teps?: string[];
    ten_teps?: string[];
    han_nop: string;
    han_dong: string;
    trang_thai_nop?: string; 
    trangthai_nhiemvu: string;
    danh_sach_nop_bai_count?: number;
}

const ChiTietBaiTap = ({ nhiemVuId, laGiangVien, onBack }: Props) => {
    const [baiTap, setBaiTap] = useState<NhiemVu | null>(null);
    const [dangGui, setDangGui] = useState(false);

    useEffect(() => {
        layChiTietNhiemVu(String(nhiemVuId));
    }, [nhiemVuId]);

    const layChiTietNhiemVu = async (nhiemVuId: string) => {
        try {
            const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/nhiem-vu/${nhiemVuId}`);
            if (phanhoi.data.trangthai) {
                setBaiTap(phanhoi.data.nhiem_vu);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết nhiệm vụ", error);
        }
    };

    const [tepChon, setTepChon] = useState<File[]>([]);
    const xuLyXoaTepChon = (indexXoa: number) => {
        setTepChon(prev => prev.filter((_, index) => index !== indexXoa));
    };



    const xuLyNopBai = async () => {
        if (tepChon.length === 0) return alert("Vui lòng chọn ít nhất một tệp!");

        const formData = new FormData();
        tepChon.forEach(file => formData.append('tep_bai_lam[]', file));
        formData.append('ma_nhiemvu', nhiemVuId);

        setDangGui(true);
        try {
            const phanhoi = await ketNoiAxios.post(`/sinh-vien/nop-bai`, formData, {
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
    const daNopBai = baiTap.trangthai_nhiemvu === 'hoan_thanh';
    const daDong = baiTap.trangthai_nhiemvu === 'da_dong';

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

                {/* PHẦN PHẢI: KHU VỰC NỘP BÀI (Chỉ hiện cho Sinh viên) */}
                {!laGiangVien && (
                    <div className="cot-phai flex-col">
                        <div className="khung-nop-bai">
                            <h3>Bài làm của bạn</h3>
                            <div className="thong-tin-han">
                                <b className='flex-row'>Hạn nộp: <p>{new Date(baiTap.han_nop).toLocaleString('vi-VN')}</p></b>
                                <b className='flex-row'>Đóng vào: <p>{new Date(baiTap.han_dong).toLocaleString('vi-VN')}</p></b>
                                <b className='flex-row'>Trạng thái:  
                                    <p className={baiTap.trangthai_nhiemvu}>
                                        {baiTap.trangthai_nhiemvu === 'da_dong' ? 'Đã đóng' : 
                                            (baiTap.trangthai_nhiemvu === 'con_han' ? 'Đang diễn ra' : 
                                                (baiTap.trangthai_nhiemvu === 'dang_tre_han' ? 'Nộp bài trễ' : 
                                                    (baiTap.trangthai_nhiemvu === 'dung_han' ? 'Đã nộp bài' : 
                                                        (baiTap.trangthai_nhiemvu === 'tre_han' ? 'Đã nộp trễ' : '')
                                                    )
                                                )
                                            )
                                        }
                                    </p>
                                </b>
                            </div>

                            <div className="vung-upload flex-col">
                                <input 
                                    type="file" 
                                    id="input-nop-bai" 
                                    multiple 
                                    hidden 
                                    disabled={dangGui || daDong || daNopBai}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const filesArray = Array.from(e.target.files);
                                            setTepChon(prev => [...prev, ...filesArray]);
                                            e.target.value = ""; // Reset để có thể chọn lại cùng 1 file
                                        }
                                    }}
                                />
                                <label 
                                    htmlFor="input-nop-bai" 
                                    className={`label-upload flex-col ${dangGui || daDong || daNopBai ? 'disabled' : ''}`}
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
                            </div>

                            <button 
                                className={`nut-gui-bai ${baiTap.trangthai_nhiemvu}`}
                                onClick={xuLyNopBai}
                                disabled={dangGui || baiTap.trangthai_nhiemvu === 'da_dong'|| baiTap.trangthai_nhiemvu === 'hoan_thanh'}
                            >
                                {dangGui ? "Đang gửi..." : 
                                    (baiTap.trangthai_nhiemvu === 'da_dong' ? 'Đã Đóng' : 
                                        (baiTap.trangthai_nhiemvu === 'con_han' ? 'Nộp Bài' : 
                                            (baiTap.trangthai_nhiemvu === 'dang_tre_han' ? 'Nộp Bài Trễ' : 
                                                (baiTap.trangthai_nhiemvu === 'dung_han' ? 'Đã Nộp Bài' : 
                                                    (baiTap.trangthai_nhiemvu === 'tre_han' ? 'Đã Nộp Trễ' : '')
                                                )
                                            )
                                        )
                                    )
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChiTietBaiTap;