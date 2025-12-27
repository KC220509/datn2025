import { useState, useEffect, useCallback } from 'react';
import ketNoiAxios from '../../tienichs/ketnoiAxios';

interface Props {
    nhiemVuId: string;
    laGiangVien: boolean;
    onBack: () => void;
}

interface NguoiDung {
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    
}

interface SinhVien{
    id_sinhvien: string;
    nguoi_dung: NguoiDung;
}

interface NhomDATN {
    id_nhom: string;
    ten_nhom: string;
    sinh_viens: SinhVien[];
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
    nhom_do_an: NhomDATN;
}

interface FormCapNhat {
    ten_nhiemvu: string;
    noi_dung: string;
    han_nop: string;
    han_dong: string;
    tep_cu: string[];
    ten_tep_cu: string[];
}

const ChiTietBaiTap = ({ nhiemVuId, laGiangVien, onBack }: Props) => {
    const [baiTap, setBaiTap] = useState<NhiemVu | null>(null);
    const [tepChon, setTepChon] = useState<File[]>([]);

    // Phần giảng viên
    const [moKhungCapNhat, setMoKhungCapNhat] = useState(false);
    const [dangCapNhat, setDangCapNhat] = useState(false);

    const [formCapNhat, setFormCapNhat] = useState<FormCapNhat | null>(null);
    const xuLyMoKhungCapNhat = () => {
        if (baiTap) {
            setFormCapNhat({
                ten_nhiemvu: baiTap.ten_nhiemvu || '',
                noi_dung: baiTap.noi_dung || '',
                han_nop: xuLyThoiGian(baiTap.han_nop),
                han_dong: xuLyThoiGian(baiTap.han_dong),
                tep_cu: baiTap.duong_dan_teps || [],
                ten_tep_cu: baiTap.ten_teps || []
            });
            setTepChon([]); 
        }
        setMoKhungCapNhat(true);
    };

    const xuLyThoiGian = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        
        const nam = date.getFullYear();
        const thang = String(date.getMonth() + 1).padStart(2, '0');
        const ngay = String(date.getDate()).padStart(2, '0');
        const gio = String(date.getHours()).padStart(2, '0');
        const phut = String(date.getMinutes()).padStart(2, '0');

        return `${nam}-${thang}-${ngay}T${gio}:${phut}`;
    };

    const layChiTietNhiemVu = useCallback(async (nhiemVuId: string) => {
        try {
            const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/nhiem-vu/${nhiemVuId}`);
            if (phanhoi.data.trangthai) {
                const nv = phanhoi.data.nhiem_vu;
                setBaiTap(nv);
                if (laGiangVien){
                    setFormCapNhat({
                        ten_nhiemvu: nv.ten_nhiemvu,
                        noi_dung: nv.noi_dung || '',
                        han_nop: nv.han_nop ? xuLyThoiGian(nv.han_nop) : '',
                        han_dong: nv.han_dong ? xuLyThoiGian(nv.han_dong) : '',
                        tep_cu: nv.duong_dan_teps || [],
                        ten_tep_cu: nv.ten_teps || []
                    });
                }
                setTepChon([]);
                setHoanTacNopBai(false);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết nhiệm vụ", error);
        }
    }, [laGiangVien]);
    
    useEffect(() => {
        layChiTietNhiemVu(String(nhiemVuId));
        
    }, [nhiemVuId, layChiTietNhiemVu]);

    

    useEffect(() => {
        if (formCapNhat?.han_nop && formCapNhat?.han_dong) {
            const hanNopDate = new Date(formCapNhat.han_nop);
            const hanDongDate = new Date(formCapNhat.han_dong);

            if (hanDongDate < hanNopDate) {
                setFormCapNhat(prev => prev ? {
                    ...prev,
                    han_dong: prev.han_nop
                } : null);
            }
        }
    }, [formCapNhat?.han_nop, formCapNhat?.han_dong]);

    const xuLyCapNhatNhiemVu = async (e: React.FormEvent) => {
        e.preventDefault();

        setDangCapNhat(true);
        const formData = new FormData();
        formData.append('ten_nhiemvu', formCapNhat?.ten_nhiemvu || '');
        formData.append('noi_dung', formCapNhat?.noi_dung || '');
        formData.append('han_nop', formCapNhat?.han_nop || '');
        formData.append('han_dong', formCapNhat?.han_dong || '');

        tepChon.forEach(file => {
            formData.append('tep_dinh_kem[]', file);
        });

        try {
            const phanhoi = await ketNoiAxios.post(`/nhom/chi-tiet/nhiem-vu/${nhiemVuId}/cap-nhat`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (phanhoi.data.trangthai) {
                alert("Cập nhật nhiệm vụ thành công!");
                layChiTietNhiemVu(String(nhiemVuId));
                setMoKhungCapNhat(false);
            }
        } catch (error) {
            alert("Lỗi khi cập nhật nhiệm vụ");
            console.error("Lỗi cập nhật nhiệm vụ", error);
        } finally {
            setDangCapNhat(false);
        }
    }

    //Phần sinh viên
    const [hoanTacNopBai, setHoanTacNopBai] = useState(false);
    const [dangGui, setDangGui] = useState(false);
    

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

    

    const xuLyChonTep = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const cacTepMoi = Array.from(e.target.files);
            setTepChon(prev => [...prev, ...cacTepMoi]);
            e.target.value = "";
        }
    };

    const xuLyXoaTepChon = (indexXoa: number) => {
        setTepChon(prev => prev.filter((_, index) => index !== indexXoa));
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


    const xuLyXoaNhiemVu = async (nhiemVuId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) return;
        try {
            const phanhoi = await ketNoiAxios.delete(`/nhom/chi-tiet/nhiem-vu/${nhiemVuId}/xoa`);
            if (phanhoi.data.trangthai) {
                alert("Xóa nhiệm vụ thành công!");
                onBack();
            }
        } catch (error) {
            alert("Lỗi khi xóa nhiệm vụ");
            console.error("Lỗi xóa nhiệm vụ", error);
        }
    };

    return (
        <div className="khung-chi-tiet-bt">
            <div className="dau-trang flex-col">
                <div className="chuc-nang flex-row">
                    <button className="nut-back" onClick={onBack}>
                        <i className="bi bi-arrow-bar-left"></i> Quay lại
                    </button>
                    {laGiangVien && (
                        <>
                            <div className='chucnang-nhom flex-row'>
                                <button className='mokhung-cap-nhat' onClick={() => xuLyMoKhungCapNhat()}>
                                    <i className="bi bi-pencil-square"></i> Cập nhật
                                </button>
                                <button className='nut-xoa-nhiem-vu' onClick={() => xuLyXoaNhiemVu(baiTap.id_nhiemvu)}>
                                    <i className="bi bi-journal-x"></i> Xóa
                                </button>
                            </div>
                            {moKhungCapNhat && (
                                <div className="lop-phu-modal">
                                    <div className="khung-modal-tao-bt">
                                        <h3>Cập nhật nhiệm vụ</h3>
                                        <form onSubmit={(e) => xuLyCapNhatNhiemVu(e)}>
                                            <div className="o-nhap">
                                                <label>Tên nhiệm vụ <span style={{color: 'red'}}>*</span></label>
                                                <input 
                                                    type="text" 
                                                    value={formCapNhat?.ten_nhiemvu}
                                                    onChange={(e) => setFormCapNhat({...formCapNhat!, ten_nhiemvu: e.target.value})}
                                                    placeholder='Nhập tiêu đề nhiệm vụ mới'
                                                    required 
                                                />
                                            </div>
                                            <div className="o-nhap">
                                                <label>Nội dung</label>
                                                <textarea 
                                                    value={formCapNhat?.noi_dung}
                                                    onChange={(e) => setFormCapNhat({...formCapNhat!, noi_dung: e.target.value})} 
                                                    placeholder='Nhập nội dung nhiệm vụ (nếu có)'
                                                />
                                            </div>
                                            <div className="hang-nhap">
                                                <div className="o-nhap">
                                                    <label>Thời gian nộp <span style={{color: 'red'}}>*</span></label>
                                                    <input 
                                                        type="datetime-local" 
                                                        value={formCapNhat?.han_nop}
                                                        onChange={(e) => setFormCapNhat({...formCapNhat!, han_nop: e.target.value})}
                                                        required
                                                        
                                                    />
                                                </div>
                                                <div className="o-nhap">
                                                    <label>Thời gian đóng <span style={{color: 'red'}}>*</span></label>
                                                    <input 
                                                        type="datetime-local" 
                                                        value={formCapNhat?.han_dong}
                                                        onChange={(e) => setFormCapNhat({...formCapNhat!, han_dong: e.target.value})}
                                                        required 
                                                        min={formCapNhat?.han_nop}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="o-nhap">
                                                <label>Tệp đính kèm mới(Tài liệu,...)</label>
                                                <div className="vung-chon-tep">
                                                    <input 
                                                        type="file" 
                                                        multiple 
                                                        onChange={xuLyChonTep} 
                                                        id="input-file-an"
                                                        style={{display: 'none'}} 
                                                    />
                                                    <label htmlFor="input-file-an" className="nut-chon-file-gia">
                                                        <i className="bi bi-cloud-arrow-up"></i> Nhấn để chọn tệp mới
                                                    </label>

                                                    {tepChon.length > 0 ? (
                                                        <div className="khung-danh-sach-tep-da-chon">
                                                            {tepChon.map((file, index) => (
                                                                <div key={index} className="item-tep-cho-upload">
                                                                    <span className="ten-tep-rut-gon" title={file.name}>
                                                                        {file.name}
                                                                    </span>
                                                                    <i 
                                                                        className="bi bi-x-square nut-xoa-tep-hanh-dong" 
                                                                        onClick={() => xuLyXoaTepChon(index)}
                                                                    ></i>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="khung-danh-sach-tep-da-chon">
                                                            {baiTap.duong_dan_teps?.map((tep, index) => (
                                                                <div key={index} className="item-tep-cho-upload">
                                                                    <a key={index} href={tep} target="_blank" className="the-tep">
                                                                        <i className="bi bi-file-earmark-pdf"></i> {baiTap?.ten_teps ? baiTap.ten_teps[index] : ''}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="nhom-nut-modal">
                                                <button type="submit" className="nut-luu" disabled={dangCapNhat}>
                                                    {dangCapNhat ? 'Đang cập nhật...' : 'Cập nhật'}
                                                </button>
                                                <button type="button" className="nut-dong" onClick={() => setMoKhungCapNhat(false)}>Đóng</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <h2 className="tieu-de-nhiem-vu">{baiTap.ten_nhiemvu}</h2>
                <div className="thoigian-nhiemvu flex-row">
                    <p>Hạn nộp: {new Date(baiTap.han_nop).toLocaleString('vi-VN')}</p>
                    <p>Đóng vào: {new Date(baiTap.han_dong).toLocaleString('vi-VN')}</p>
                </div>
            </div>

            <div className="than-trang flex-row">
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
                    {laGiangVien && (
                        <div className="khung-sinhvien-nopbai flex-col">
                            <h3><i className="bi bi-people-fill"></i> Danh sách sinh viên đã nộp bài ({baiTap.danh_sach_nop_bai?.length || 0})</h3>
                            <table className="danh-sach-sinh-vien">
                                <thead>
                                    <tr className="tieu-de-bang">
                                        <th></th>
                                        <th className='ten-sinhvien'>Sinh viên</th>
                                        <th>Trạng thái nộp bài</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {baiTap.nhom_do_an?.sinh_viens?.map((item, idx) => (
                                        <tr key={idx} className="dong-sinh-vien">
                                            <td><i className="bi bi-person-circle"></i></td>
                                            <td className='ten-sinhvien'>{item.nguoi_dung.ho_ten}</td>
                                            <td className='trang-thai-nop-bai'>
                                                {baiTap.danh_sach_nop_bai?.some(nb => nb.ma_sinhvien === item.id_sinhvien)
                                                    ? (baiTap.danh_sach_nop_bai.find(nb => nb.ma_sinhvien === item.id_sinhvien)?.trang_thai == 'tre_han' 
                                                        ? <span className='nop-tre-han'>Đã nộp trễ</span> : <span className='da-nop'>Đã nộp bài</span>)
                                                    : (baiTap.trangthai_nhiemvu == 'con_han' 
                                                        ? <span className='chua-nop'>Chưa nộp</span> : <span className='qua-han'>Không nộp</span>)
                                                }
                                            </td>
                                            <td>
                                                <button className='nut-xem-bai' 
                                                    disabled={!baiTap.danh_sach_nop_bai?.some(nb => nb.ma_sinhvien === item.id_sinhvien)}
                                                    onClick={() => {}}
                                                >
                                                    {baiTap.danh_sach_nop_bai?.some(nb => nb.ma_sinhvien === item.id_sinhvien)
                                                        ? 'Xem bài làm' : (baiTap.trangthai_nhiemvu == 'con_han' ? 'Chưa nộp bài' : 'Không nộp bài')
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                
                            </table>
                        </div>
                    )}
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
                                                    {thongTinNopBai?.ten_teps?.[idx] || 'Tài liệu'}
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