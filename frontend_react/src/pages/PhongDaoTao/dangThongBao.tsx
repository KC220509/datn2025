// import type { Timestamp } from "firebase/firestore";
import { useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";




const DangThongBao = () => {

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


    
    // xử lý đăng thông báo
    const [tep_dinh_kem, setTepDinhKem] = useState<File | null>(null);
    const [tieu_de, setTieuDe] = useState("");
    const [noi_dung, setNoiDung] = useState("");
    const [dangTai, setDangTai] = useState(false);

    const xuLyDangThongBao = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('tieu_de', tieu_de);
        formData.append('noi_dung', noi_dung);
        if(tep_dinh_kem){
            formData.append('tep_dinh_kem', tep_dinh_kem);
        }
        setDangTai(true);

        try{
            const phanhoi = await ketNoiAxios.post('/pdt/dang-bai', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(phanhoi.data.trangthai){
                alert(phanhoi.data.thongbao);
                return location.replace('/dao-tao/ql-thongbao');
            }
        }
        catch(error){
            console.error("Lỗi khi đăng thông báo:", error);
            alert("Đã có lỗi xảy ra khi đăng thông báo. Vui lòng thử lại sau.");
            setDangTai(false);
        }
    }


    return (
        <div className="khung-dang-thongbao flex-col">
            <h2 className="tieude-khung">Đăng Thông Báo Mới</h2>
            <form className="form-dang-thongbao flex-col" onSubmit={xuLyDangThongBao}>
                <div className="khung-nhap flex-col">
                    <label htmlFor="tieude_tb">Tiêu Đề Thông Báo <span style={{color: 'red'}}>*</span></label>
                    <input className="noidung-nhap" type="text" id="tieude_tb"
                            value={tieu_de}
                            onChange={(e) => setTieuDe(e.target.value)}
                            required
                            placeholder="Nhập tiêu đề thông báo..."
                    />
                </div>
                <div className="khung-nhap flex-col">
                    <label htmlFor="noiDung_tb">Nội Dung Thông Báo <span style={{color: 'red'}}>*</span></label>
                    <textarea className="noidung-nhap" id="noiDung_tb"
                            value={noi_dung}
                            onChange={(e) => setNoiDung(e.target.value)}
                            required
                            placeholder="Nhập nội dung thông báo...">
                    </textarea>
                </div>
                
                <div className="khung-nhap flex-col">
                    <label htmlFor="tep_dinh_kem" className="cauhinh-tepdinhkem">
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
                    <input type="file" id="tep_dinh_kem" onChange={xuLyChonTep} />
                </div>
                <div className="khung-nut-dang flex-row">
                    <button type="submit" className="nut-dang-thongbao" disabled={dangTai}>
                        {dangTai ? 'Đang đăng...' : 'Đăng Thông Báo'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DangThongBao;