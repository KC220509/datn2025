


function ChanTrang() {
    return (
        <footer className="khung-chan-trang flex-row">
            <div className="chan-trang-con chan-trang-trai flex-col">
                <h3 className="tieude">Trường đại học sư phạm kỹ thuật</h3>
                <p className="dia-chi flex-row">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>Cơ sở 1:</span>
                    48 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng
                </p>
                <p className="dia-chi flex-row">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>Cơ sở 2:</span>
                    Khu Đô thị đại học, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng
                </p>
            </div>
            <div className="chan-trang-con chan-trang-giua flex-col">
                <h3 className="tieude">Thông tin liên lạc</h3>
                <p className="dia-chi flex-row">
                    <i className="bi bi-phone-vibrate-fill"></i>
                    <span>Điện thoại:</span>
                    0236 3822 571
                </p>
                <p className="dia-chi flex-row">
                    <i className="bi bi-envelope-fill"></i>
                    <span>Email:</span>
                    pdt@ute.udn.vn
                </p>
            </div>
            <div className="chan-trang-con chan-trang-phai flex-col">
                <h3 className="tieude">Đào tạo</h3>
                <a href="https://daotao.ute.udn.vn/curriculums.asp">Chương trình đào tạo</a>
            </div>
        </footer>
    );
}

export default ChanTrang;