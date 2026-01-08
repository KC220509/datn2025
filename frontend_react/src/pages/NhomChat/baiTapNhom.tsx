import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ketNoiAxios from '../../tienichs/ketnoiAxios';
import { useNguoiDung } from '../../hooks/useNguoiDung';
import './khungNhomChat.css'; 
import ChiTietBaiTap from './chiTietBaiTap';

interface NopBai {
    id_nopbai: string;
    ma_nhom: string;
    ma_sinhvien: string;
    ma_nhiemvu: string;
    duong_dan_teps: string[];
    trang_thai: string; 
    nhan_xet: string;
    thoigian_nop: string;
}

interface NhiemVu {
    id_nhiemvu: string;
    ten_nhiemvu: string;
    han_nop: string;
    han_dong: string;
    trangthai_nhiemvu: string;
    danh_sach_nop_bai?: NopBai[];
    danh_sach_nop_bai_count?: number;    
}

interface DSNhiemVuTrangThai {
    con_han: NhiemVu[];
    qua_han: NhiemVu[];
    hoan_thanh: NhiemVu[];
    tong_so_sv?: number;
}

const QuanLyBaiTap = () => {
    const { nguoiDung } = useNguoiDung();
    const { id_nhom } = useParams<{ id_nhom: string }>();
    const laGiangVien = nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV');
    
    const [danhSachTep, setDanhSachTep] = useState<File[]>([]);

    const [formTao, setFormTao] = useState({
        ten_nhiemvu: '',
        noi_dung: '',
        han_nop: '',
        han_dong: ''
    });

    const [moKhungTao, setMoKhungTao] = useState(false);
    const [dangTao, setDangTao] = useState(false);

    const xyLyDongKhungTao = () => {
        setMoKhungTao(false);
        setFormTao({
            ten_nhiemvu: '',
            noi_dung: '',
            han_nop: '',
            han_dong: ''
        });
        setDanhSachTep([]);
    }

    const [dsTrangThaiBaiTap, setDsTrangThaiBaiTap] = useState<DSNhiemVuTrangThai>({
        con_han: [],
        qua_han: [],
        hoan_thanh: [],
        tong_so_sv: 0
    });
    

    type tabBaiTap = 'con_han' | 'qua_han' | 'hoan_thanh';
    const [tabHienTai, setTabHienTai] = useState<tabBaiTap>('con_han');
    const xuLyChonTab = async (tab: tabBaiTap) => {
        setTabHienTai(tab);
        await layDanhSachBaiTap(String(id_nhom));
    };

    
    const layDanhSachBaiTap = async (id_nhom: string) => {
        try {
            const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/${id_nhom}/nhiem-vu`);
            if (phanhoi.data.trangthai) {
                
                setDsTrangThaiBaiTap(phanhoi.data.ds_nhiemvu);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách bài tập", error);
        }
    };
    useEffect(() => {
        layDanhSachBaiTap(String(id_nhom));
    }, [id_nhom]);



    useEffect(() => {
        if (formTao.han_nop && formTao.han_dong) {
            const hanNopDate = new Date(formTao.han_nop);
            const hanDongDate = new Date(formTao.han_dong);

            if (hanDongDate < hanNopDate) {
                setFormTao(prev => ({
                    ...prev,
                    han_dong: prev.han_nop
                }));
            }
        }
    }, [formTao.han_nop, formTao.han_dong]);

    const xuLyChonTep = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const cacTepMoi = Array.from(e.target.files);
            setDanhSachTep(prev => [...prev, ...cacTepMoi]);
            e.target.value = "";
        }
    };
    const xuLyXoaTep = (tepXoa: number) => {
        setDanhSachTep(prev => prev.filter((_, index) => index !== tepXoa));
    };


    const xuLyTaoBaiTap = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!formTao.noi_dung && danhSachTep.length === 0) {
            alert("Vui lòng nhập nội dung hoặc đính kèm tệp cho bài tập.");
            return;
        }

        const formData = new FormData();
        formData.append('ten_nhiemvu', formTao.ten_nhiemvu);
        formData.append('noi_dung', formTao.noi_dung);
        formData.append('han_nop', formTao.han_nop);
        formData.append('han_dong', formTao.han_dong);

        if (danhSachTep) {
            Array.from(danhSachTep).forEach((file) => {
                formData.append('tep_dinh_kem[]', file); 
            });
        }

        setDangTao(true);
        try {
            const phanhoi = await ketNoiAxios.post(`/nhom/chi-tiet/${id_nhom}/tao-nhiem-vu`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (phanhoi.data.trangthai) {
                alert("Tạo bài tập thành công!");

                setFormTao({
                    ten_nhiemvu: '',
                    noi_dung: '',
                    han_nop: '',
                    han_dong: ''
                });
                setMoKhungTao(false);
                setDanhSachTep([]); 
                layDanhSachBaiTap(String(id_nhom));
            }
        } catch (error) {
            alert("Lỗi khi tạo bài tập");
            console.error("Lỗi khi tạo bài tập", error);
        }finally{
            setDangTao(false);
        }
    };

    const nhanTrangThaiNop = (bt: NhiemVu) => {
        const baiNop = bt.danh_sach_nop_bai?.[0];
        if (baiNop) {
            return (
                <span className={`nhan-trang-thai ${baiNop.trang_thai === 'tre_han' ? 'hoan-thanh-tre' : 'hoan-thanh'}`}>
                    {baiNop.trang_thai === 'tre_han' ? 'Đã nộp trễ' : 'Đã nộp bài'}
                </span>
            );
        }
        switch (bt.trangthai_nhiemvu) {
            // Đang diễn ra
            case 'con_han': return <span className="nhan-trang-thai cho-nop">Đang diễn ra</span>;
            case 'dang_tre_han': return <span className="nhan-trang-thai tre-han">Nộp trễ</span>;

            // Quá hạn
            case 'da_dong': return <span className="nhan-trang-thai da-dong">Chưa nộp bài</span>;
            
            default: return null;
        }
    };

    // Chi tiết bài tập
    const [idNhiemVuDangXem, setIdNhiemVuDangXem] = useState<string | null>(null);

    return (
        <div className="khung-quan-ly-bai-tap">
            {idNhiemVuDangXem ? (
                <ChiTietBaiTap
                    nhiemVuId={idNhiemVuDangXem} 
                    laGiangVien={laGiangVien ?? false}
                    onBack={() => {
                        setIdNhiemVuDangXem(null)
                        layDanhSachBaiTap(String(id_nhom));
                    }} 
                />
            ) : (
                <>
                    <div className="thanh-dieu-huong-tab">
                        <div className="nhom-tab">
                            <button className={tabHienTai === 'con_han' ? 'active' : ''} onClick={() => xuLyChonTab('con_han')}>
                                Đang diễn ra ({dsTrangThaiBaiTap.con_han.length})
                            </button>
                            {!laGiangVien && (
                                <>
                                    <button className={tabHienTai === 'qua_han' ? 'active' : ''} onClick={() => xuLyChonTab('qua_han')}>
                                        Quá hạn ({dsTrangThaiBaiTap.qua_han.length})
                                    </button>
                                </>
                            )}
                            <button className={tabHienTai === 'hoan_thanh' ? 'active' : ''} onClick={() => xuLyChonTab('hoan_thanh')}>
                                Hoàn thành ({dsTrangThaiBaiTap.hoan_thanh.length})
                            </button>
                            
                        </div>
                        
                        {laGiangVien && (
                            <button className="nut-them-bai-tap" onClick={() => setMoKhungTao(true)}>
                                <i className="bi bi-plus-square-dotted"></i> Bài Tập
                            </button>
                        )}
                    </div>

                    <div className="danh-sach-bai-tap">
                        {(dsTrangThaiBaiTap[tabHienTai])?.length > 0 ? (
                            (dsTrangThaiBaiTap[tabHienTai]).map((bt) => (
                                <div key={bt.id_nhiemvu} className={`the-bai-tap ${bt.trangthai_nhiemvu}`}>
                                    <div className="ben-trai">
                                        
                                        <div className="bieu-tuong-van-ban">
                                            {tabHienTai === 'hoan_thanh' ? '✅' : tabHienTai === 'qua_han' ? '⏰' : '📝'}
                                        </div>
                                        <div className="thong-tin-bt">
                                            <h4>{bt.ten_nhiemvu}</h4>
                                            <p className="han-nop">Đến hạn: {new Date(bt.han_nop).toLocaleString('vi-VN')}</p>
                                            <p className="thoi-gian-dong">Đóng vào: {new Date(bt.han_dong).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="ben-phai">
                                        {!laGiangVien && nhanTrangThaiNop(bt)}
                                        {laGiangVien && (
                                            <span className="nhan-trang-thai da-dong">
                                                {`Đã nộp: ${bt.danh_sach_nop_bai_count || 0} / ${dsTrangThaiBaiTap.tong_so_sv || 0}`}
                                            </span>
                                        )}
                                        <button className="nut-chi-tiet" onClick={() => setIdNhiemVuDangXem(bt.id_nhiemvu)}>
                                            {laGiangVien ? (
                                                <span className="nhan-trang-thai thong-ke-nop">
                                                    {/* {bt.trangthai_nhiemvu === 'hoan_thanh' ? (
                                                        `Đã nộp: ${bt.danh_sach_nop_bai_count || 0} / ${dsTrangThaiBaiTap.tong_so_sv || 0}`
                                                    ) : (
                                                        'Xem chi tiết'
                                                    )} */}
                                                    Xem chi tiết
                                                </span>
                                            ) : (
                                                bt.trangthai_nhiemvu === 'da_dong' ? 'Xem chi tiết' : 'Xem nhiệm vụ'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="trong-rong" style={{textAlign: 'center'}}>Không có bài tập nào trong mục này.</div>
                        )}
                    </div>
                </>
            )}

            {/* Khung tạo bài tập cho Giảng viên */}
            {moKhungTao && (
                <div className="lop-phu-modal">
                    <div className="khung-modal-tao-bt">
                        <h3>Thêm Bài Tập Mới</h3>
                        <form onSubmit={xuLyTaoBaiTap}>
                            <div className="o-nhap">
                                <label>Tên nhiệm vụ <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={formTao.ten_nhiemvu}
                                    onChange={(e) => setFormTao({...formTao, ten_nhiemvu: e.target.value})}
                                    placeholder='Nhập tiêu đề nhiệm vụ mới'
                                    required 
                                />
                            </div>
                            <div className="o-nhap">
                                <label>Nội dung</label>
                                <textarea 
                                    value={formTao.noi_dung}
                                    onChange={(e) => setFormTao({...formTao, noi_dung: e.target.value})} 
                                    placeholder='Nhập nội dung nhiệm vụ (nếu có)'
                                />
                            </div>
                            <div className="hang-nhap">
                                <div className="o-nhap">
                                    <label>Thời gian nộp <span style={{color: 'red'}}>*</span></label>
                                    <input 
                                        type="datetime-local" 
                                        value={formTao.han_nop}
                                        onChange={(e) => setFormTao({...formTao, han_nop: e.target.value})}
                                        required
                                        min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                    />
                                </div>
                                <div className="o-nhap">
                                    <label>Thời gian đóng <span style={{color: 'red'}}>*</span></label>
                                    <input 
                                        type="datetime-local" 
                                        value={formTao.han_dong}
                                        onChange={(e) => setFormTao({...formTao, han_dong: e.target.value})}
                                        required 
                                        min={formTao.han_nop}
                                    />
                                </div>
                            </div>
                            
                            <div className="o-nhap">
                                <label>Tệp đính kèm (Tài liệu,...)</label>
                                <div className="vung-chon-tep">
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={xuLyChonTep} 
                                        id="input-file-an"
                                        style={{display: 'none'}} 
                                    />
                                    <label htmlFor="input-file-an" className="nut-chon-file-gia">
                                        <i className="bi bi-cloud-arrow-up"></i> Nhấn để chọn tệp
                                    </label>

                                    {danhSachTep.length > 0 && (
                                        <div className="khung-danh-sach-tep-da-chon">
                                            {danhSachTep.map((file, index) => (
                                                <div key={index} className="item-tep-cho-upload">
                                                    <span className="ten-tep-rut-gon" title={file.name}>
                                                        {file.name}
                                                    </span>
                                                    <i 
                                                        className="bi bi-x-square nut-xoa-tep-hanh-dong" 
                                                        onClick={() => xuLyXoaTep(index)}
                                                    ></i>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="nhom-nut-modal">
                                <button type="submit" className="nut-luu" disabled={dangTao}>
                                    {dangTao ? 'Đang tạo...' : 'Tiến hành tạo'}
                                </button>
                                <button type="button" className="nut-dong" onClick={() => xyLyDongKhungTao()}>Đóng</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyBaiTap;