import { useEffect, useRef, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import { useParams } from "react-router-dom";
import { limitToLast, onValue, query, ref, update } from "firebase/database";
import { db } from "../../firebase";
import { useNguoiDung } from "../../hooks/useNguoiDung";


// interface NguoiDung{
//     id_nguoidung: string;
//     ho_ten: string;
//     email: string;

// }


interface TinNhanNhom{
    id_firebase?: string;
    id_tinnhan: string;
    ma_nhom: string;
    id_nguoigui: string;
    ho_ten: string;
    noi_dung: string;
    ten_tep: string;
    duong_dan_tep: string;
    da_xem: boolean;
    tinnhan_ghim: boolean;
    tinnhan_xoa: boolean;
    created_at: Date;
    updated_at: Date;
    dang_gui: boolean;
}

const NhomChat = () => {

    // Lấy tin nhắn nhóm
    const { nguoiDung } = useNguoiDung();
    const la_giangvien = nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV');
    const { id_nhom } = useParams<{ id_nhom: string }>();
    const [tinNhanNhom, setTinNhanNhom] = useState<TinNhanNhom[]>([]);

    // Xử lý tự động cuộn xuống tin nhắn mới nhất
    const cuonXuongTinNhan = useRef<HTMLDivElement>(null);
    const xuLyTuDongCuonXuong = () => {
        cuonXuongTinNhan.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        if(tinNhanNhom.length > 0){
            xuLyTuDongCuonXuong();
        }
    }, [tinNhanNhom]);

    // Kiểm tra tin nhắn ảnh
    const laHinhAnh = (url: string) => {
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
    };


    // Lấy tin nhắn nhóm từ Firebase
    useEffect(() => {
        if (!id_nhom) return;

        const tinNhanHienTai = ref(db, `nhom_chat/${id_nhom}/tin_nhan`);
        
        const q = query(tinNhanHienTai, limitToLast(50));

        const dongKetNoi = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dsTinNhan = Object.keys(data).map(key => ({
                    ...data[key],
                    id_firebase: key,
                }));

                dsTinNhan.sort((a, b) => {
                    const dangGhimA = a.tinnhan_ghim && !a.tinnhan_xoa;
                    const dangGhimB = b.tinnhan_ghim && !b.tinnhan_xoa;

                    if (dangGhimA !== dangGhimB) {
                        return dangGhimA ? 1 : -1;
                    }
                    if (dangGhimA && dangGhimB) {
                        return (a.updated_at || 0) - (b.updated_at || 0);
                    }else {
                        return (a.created_at || 0) - (b.created_at || 0);
                    }
                });

                setTinNhanNhom(dsTinNhan);
                console.log("Tin nhắn nhóm cập nhật:", dsTinNhan);
            } else {
                setTinNhanNhom([]); 
            }
        });

        return () => dongKetNoi();
    }, [id_nhom]);


    const [noiDung, setNoiDung] = useState("");
    const [tepChon, setTepChon] = useState<File | null>(null);
    const tepChonHienTai = useRef<HTMLInputElement>(null);
    

    const xuLyChonTep = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTepChon(e.target.files[0]);
        }
    };
    const xuLyGuiTinNhan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noiDung.trim() && !tepChon) return;

        // --- TẠO TIN NHẮN GIẢ ---
        const idTamThoi = "temp-" + Date.now();
        const tinNhanTamThoi: TinNhanNhom = {
            id_tinnhan: idTamThoi,
            ma_nhom: id_nhom || "",
            id_nguoigui: String(nguoiDung?.id_nguoidung || ""),
            ho_ten: nguoiDung?.ho_ten || "", 
            noi_dung: noiDung,
            ten_tep: "",
            duong_dan_tep: "",
            da_xem: false,
            tinnhan_ghim: false,
            tinnhan_xoa: false,
            created_at: new Date(),
            updated_at: new Date(),
            dang_gui: true
        };

        setTinNhanNhom((prev) => [...prev, tinNhanTamThoi]);
        setNoiDung("");
        setTepChon(null);

        const formData = new FormData();
        formData.append('ma_nhom', String(id_nhom));
        formData.append('noi_dung', noiDung);
        if (tepChon) {
            formData.append('tinnhan_tep', tepChon);
        }

        try {
            const res = await ketNoiAxios.post("/nhom/chi-tiet/tinnhan/gui", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.trangthai) {
                setNoiDung("");
                setTepChon(null);
                if (tepChonHienTai.current) tepChonHienTai.current.value = "";
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            setTinNhanNhom((prev) => prev.filter(tn => tn.id_tinnhan !== idTamThoi));
            alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    };

    const xuLyGhimTinNhan = async (maNhom: string, idFirebase: string, idTinnhan: string, trangThaiGhimHienTai: boolean) => {
        try {
            const tinNhanRef = ref(db, `nhom_chat/${maNhom}/tin_nhan/${idFirebase}`);
            await update(tinNhanRef, {
                tinnhan_ghim: !trangThaiGhimHienTai,
                updated_at: Date.now()
            });

            const res = await ketNoiAxios.post(`/nhom/chi-tiet/tinnhan/ghim`, {
                id_tinnhan: idTinnhan,
                tinnhan_ghim: !trangThaiGhimHienTai,
            });

            if (res.data.trangthai) {
                console.log(res.data.thongbao);
            }

        } catch (error) {
            console.error("Lỗi ghim tin nhắn:", error);
            alert("Bạn không có quyền thực hiện thao tác này.");
        }
    }

    
    const xuLyXoaTinNhan = async (maNhom: string, idFirebase: string, idTinnhan: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;
        try {
            const tinNhanRef = ref(db, `nhom_chat/${maNhom}/tin_nhan/${idFirebase}`);
            await update(tinNhanRef, {
                tinnhan_xoa: true,
                updated_at: Date.now()
            });

            const res = await ketNoiAxios.post(`/nhom/chi-tiet/tinnhan/xoa/${idTinnhan}`);

            if (res.data.trangthai) {
                console.log(res.data.thongbao);
            }

        } catch (error) {
            console.error("Lỗi xóa tin nhắn:", error);
            alert("Bạn không có quyền thực hiện thao tác này.");
        }
    }


    return (
        <div className="khu-vuc-nhan-tin flex-col">
            <div className="hien-thi-tin-nhan flex-col">
                <div className="khung-tin-nhan-cuon flex-col">
                    
                    {tinNhanNhom.length > 0 ? (
                        tinNhanNhom.map((tn) => (
                            <div key={tn.id_tinnhan} 
                                className={`tin-nhan-dong flex-row ${tn.dang_gui ? 'opacity-50' : ''}`}
                                
                            >
                                <div className="avt-tin-nhan">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <div className="noi-dung-tin-nhan flex-col"
                                    style={tn.tinnhan_xoa ? { opacity: 0.6, fontStyle: 'italic', cursor: 'default'} : {}}
                                >
                                    <div className="thong-tin-nguoi-gui flex-row">
                                        <span className="ten-nguoi-gui">{tn.ho_ten}</span>
                                        <span className="thoi-gian-gui">
                                            {tn.dang_gui ? "Đang gửi..." : (tn.created_at ? new Date(tn.created_at).toLocaleTimeString() : "")}
                                        </span>
                                    </div>
                                    {!tn.tinnhan_xoa ? (
                                        <>
                                            <div className="noi-dung-tin-nhan-gui">{tn.noi_dung}</div>
                                            <div className="noi-dung-tep-gui">
                                                {tn.duong_dan_tep && (
                                                    laHinhAnh(tn.duong_dan_tep) ? (
                                                        <div className="noi-dung-anh-gui">
                                                            <img 
                                                                src={tn.duong_dan_tep} 
                                                                alt="đính kèm" 
                                                                onClick={() => window.open(tn.duong_dan_tep, '_blank')}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="tep-dinh-kem">
                                                            <a href={tn.duong_dan_tep} target="_blank" rel="noreferrer" className="flex-row">
                                                                <i className="bi bi-file-earmark-arrow-down-fill"></i>
                                                                <span>{tn.ten_tep}</span>
                                                            </a>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        
                                        
                                            {tn.tinnhan_ghim && (
                                                <div className="tin-nhan-ghim flex-row">
                                                    <i className="bi bi-pin-angle-fill"></i>
                                                </div>
                                            )}
                                            
                                            <div className="chuc-nang-tin-nhan flex-row">
                                                <span 
                                                    className="ghim-tn"
                                                    onClick={() => xuLyGhimTinNhan(String(id_nhom), tn.id_firebase!, tn.id_tinnhan, tn.tinnhan_ghim)}
                                                >
                                                    <i className={`bi ${tn.tinnhan_ghim ? 'bi-pin' : 'bi-pin-fill'}`}></i> 
                                                    {tn.tinnhan_ghim ? " Bỏ ghim" : " Ghim"}
                                                </span>
                                                <span className="sua-tn">
                                                    <i className="bi bi-pencil-fill"></i> Sửa
                                                </span>
                                                {(tn.id_nguoigui === String(nguoiDung?.id_nguoidung) || la_giangvien) &&  (
                                                    <span className="xoa-tn" 
                                                        onClick={() => xuLyXoaTinNhan(String(id_nhom), tn.id_firebase!, tn.id_tinnhan)}
                                                    >
                                                        <i className="bi bi-trash3-fill"></i> Xóa
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="tin-nhan-xoa flex-row">
                                            <i className="bi bi-trash3-fill"></i> Tin nhắn này đã bị xóa
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="khung-khong-co-tin-nhan" style={{textAlign: 'center'}}>
                            Nhóm chưa có tin nhắn mới nào.
                        </div>
                    )}

                    <div ref={cuonXuongTinNhan}></div>
                </div>
               
            </div>

            {/* --- Khu vực nhập tin nhắn --- */}
            <div className="khung-nhap-tin-nhan">
                {tepChon && (
                    <div className="tep-cho-gui flex-row">
                        <span>
                            <i className="bi bi-file-earmark-arrow-down-fill"></i>
                            {tepChon.name}
                        </span>
                        <i className="xoa-tep-chon bi bi-x-square" onClick={() => setTepChon(null)}></i>
                    </div>
                )}
                <form className="form-nhap-tin-nhan flex-row" onSubmit={xuLyGuiTinNhan}>
                    <div className="khung-icon-gui flex-row">
                        {/* Input file ẩn */}
                        <input 
                            type="file" 
                            ref={tepChonHienTai} 
                            onChange={xuLyChonTep} 
                            style={{ display: 'none' }} 
                        />
                        <i  className="nut-gui-tep bi bi-paperclip" 
                            onClick={() => tepChonHienTai.current?.click()}
                            style={{ cursor: 'pointer' }}
                        ></i>
                        <i className="nut-gui-nhandan bi bi-emoji-smile"></i>
                    </div>
                    <div className="khung-nhap-noi-dung">
                        <textarea id="tinnhan-guidi"
                            value={noiDung}
                            onChange={(e) => setNoiDung(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    xuLyGuiTinNhan(e);
                                }
                            }}
                            placeholder="Nhập tin nhắn..." 
                        />
                    </div>
                    <div className="khung-nut-gui">
                        <button type="submit">
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NhomChat;