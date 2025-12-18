import { useState } from "react";


const DangThongBao = () => {


    const [tenTep, setTenTep] = useState("");

    const xuLyChonTep = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            setTenTep(event.target.files[0].name);
        }
    };


    return (
        <div className="khung-dang-thongbao flex-col">
            <h2 className="tieude-khung">Đăng Thông Báo Mới</h2>
            <form className="form-dang-thongbao flex-col">
                <div className="khung-nhap flex-col">
                    <label htmlFor="tieude_tb">Tiêu Đề Thông Báo <span style={{color: 'red'}}>*</span></label>
                    <input className="noidung-nhap" type="text" id="tieude_tb" placeholder="Nhập tiêu đề thông báo..." />
                </div>
                <div className="khung-nhap flex-col">
                    <label htmlFor="noiDung_tb">Nội Dung Thông Báo</label>
                    <textarea className="noidung-nhap" id="noiDung_tb" placeholder="Nhập nội dung thông báo..."></textarea>
                </div>
                
                <div className="khung-nhap flex-col">
                    <label htmlFor="tep_dinh_kem" className="cauhinh-tepdinhkem">
                        <div className="noidung-tailen flex-col">
                            <span className="tep-icon">
                                <i className="bi bi-file-earmark-arrow-up-fill"></i>
                            </span>
                            <span className="tep-text">
                                {tenTep ? tenTep : 'Nhấn để chọn tệp hoặc kéo thả'}
                            </span>
                            {!tenTep && <span className="tep-nhan">Hỗ trợ JPG, PNG, PDF, XLSX, DOCX, TXT,...</span>}
                        </div>
                    </label>
                    <input type="file" id="tep_dinh_kem" onChange={xuLyChonTep} />
                </div>
                <div className="khung-nut-dang flex-row">
                    <button type="submit" className="nut-dang-thongbao">Đăng Thông Báo</button>
                </div>
            </form>
        </div>
    );
}

export default DangThongBao;