import { useEffect, useRef } from "react";


const NhomChat = () => {
   
    const cuonXuongTinNhan = useRef<HTMLDivElement>(null);

    const xuLyTuDongCuonXuong = () => {
        cuonXuongTinNhan.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        xuLyTuDongCuonXuong();
    }, []);
    
    
    return (
        <div className="khu-vuc-nhan-tin flex-col">
            
            <div className="hien-thi-tin-nhan flex-col">
                
                {/* Element ảo để cuộn xuống */}

                <div className="khung-tin-nhan-cuon flex-col">
                    <div className="tin-nhan-dong flex-row">
                        <div className="avt-tin-nhan">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="noi-dung-tin-nhan flex-col">
                            <div className="thong-tin-nguoi-gui flex-row">
                                <span className="ten-nguoi-gui">Nguyễn Văn A</span>
                                <span className="thoi-gian-gui">10:15 AM</span>
                            </div>
                            <div className="noi-dung-tin-nhan-gui">Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! </div>
                            <div className="noi-dung-anh-gui">
                                <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588841/background_bcdmj8.png" alt="" />
                                <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588841/background_bcdmj8.png" alt="" />
                            </div>
                            
                        </div>
                    </div>

                    <div className="tin-nhan-dong flex-row">
                        <div className="avt-tin-nhan">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="noi-dung-tin-nhan flex-col">
                            <div className="thong-tin-nguoi-gui flex-row">
                                <span className="ten-nguoi-gui">Nguyễn Văn A</span>
                                <span className="thoi-gian-gui">10:15 AM</span>
                            </div>
                            <div className="noi-dung-gui">Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! </div>
                            
                        </div>
                    </div>
                    <div className="tin-nhan-dong flex-row">
                        <div className="avt-tin-nhan">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="noi-dung-tin-nhan flex-col">
                            <div className="thong-tin-nguoi-gui flex-row">
                                <span className="ten-nguoi-gui">Nguyễn Văn A</span>
                                <span className="thoi-gian-gui">10:15 AM</span>
                            </div>
                            <div className="noi-dung-tin-nhan-gui">Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! </div>
                            <div className="noi-dung-anh-gui">
                                <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588841/background_bcdmj8.png" alt="" />
                                <img src="https://res.cloudinary.com/dpkysexsr/image/upload/v1761588841/background_bcdmj8.png" alt="" />
                            </div>
                            
                        </div>
                    </div>

                    <div className="tin-nhan-dong flex-row">
                        <div className="avt-tin-nhan">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="noi-dung-tin-nhan flex-col">
                            <div className="thong-tin-nguoi-gui flex-row">
                                <span className="ten-nguoi-gui">Nguyễn Văn A</span>
                                <span className="thoi-gian-gui">10:15 AM</span>
                            </div>
                            <div className="noi-dung-gui">Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! </div>
                            
                        </div>
                    </div>
                    <div className="tin-nhan-dong flex-row">
                        <div className="avt-tin-nhan">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="noi-dung-tin-nhan flex-col">
                            <div className="thong-tin-nguoi-gui flex-row">
                                <span className="ten-nguoi-gui">Nguyễn Văn A</span>
                                <span className="thoi-gian-gui">10:15 AM</span>
                            </div>
                            <div className="noi-dung-gui">Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! Hôm nay chúng ta sẽ thảo luận về dự án nhóm.Chào mọi người! </div>
                            
                        </div>
                    </div>

                    <div ref={cuonXuongTinNhan}></div>
                </div>
               
            </div>

            {/* --- Khu vực nhập tin nhắn --- */}
            <div className="khung-nhap-tin-nhan">
                <form className="form-nhap-tin-nhan flex-row">
                    <div className="khung-icon-gui flex-row">
                        <i className="nut-gui-tep bi bi-paperclip"></i>
                        <i className="nut-gui-nhandan bi bi-emoji-smile"></i>
                    </div>
                    <div className="khung-nhap-noi-dung">
                        <textarea id="tinnhan-guidi" placeholder="Nhập tin nhắn..." />
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