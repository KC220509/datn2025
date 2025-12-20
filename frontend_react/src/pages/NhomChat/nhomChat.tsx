import { useEffect, useRef, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import { useParams } from "react-router-dom";
import { limitToLast, onValue, query, ref } from "firebase/database";
import { db } from "../../firebase";
import { useNguoiDung } from "../../hooks/useNguoiDung";


interface NguoiDung{
    id_nguoidung: string;
    ho_ten: string;
    email: string;

}


interface TinNhanNhom{
    id_tinnhan: string;
    ma_nhom: string;
    nguoi_gui: NguoiDung;
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


    
    useEffect(() => {
        if (!id_nhom) return;

        const tinNhanHienTai = ref(db, `nhom_chat/${id_nhom}`);
        
        const q = query(tinNhanHienTai, limitToLast(50));

        const dongKetNoi = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dsTinNhan = Object.keys(data).map(key => ({
                    id_firebase: key,
                    id_tinnhan: data[key].id_tinnhan || key,
                    ...data[key]
                }));

                console.log("Dữ liệu nhận từ Firebase:", dsTinNhan);
                setTinNhanNhom(dsTinNhan);
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
            nguoi_gui: { 
                id_nguoidung: String(nguoiDung?.id_nguoidung || ""), 
                ho_ten: nguoiDung?.ho_ten || "", 
                email: nguoiDung?.email || "" 
            },
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

        // --- GỬI TIN NHẮN THẬT LÊN SERVER ---
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

    return (
        <div className="khu-vuc-nhan-tin flex-col">
            
            <div className="hien-thi-tin-nhan flex-col">
                

                <div className="khung-tin-nhan-cuon flex-col">
                    
                    {tinNhanNhom.length > 0 ? (
                        tinNhanNhom.map((tn) => (
                            <div key={tn.id_tinnhan} className={`tin-nhan-dong flex-row ${tn.dang_gui ? 'opacity-50' : ''}`}>
                                <div className="avt-tin-nhan">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <div className="noi-dung-tin-nhan flex-col">
                                    <div className="thong-tin-nguoi-gui flex-row">
                                        <span className="ten-nguoi-gui">{tn.ho_ten}</span>
                                        <span className="thoi-gian-gui">
                                            {tn.dang_gui ? "Đang gửi..." : (tn.created_at ? new Date(tn.created_at).toLocaleTimeString() : "")}
                                        </span>
                                    </div>
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