

const TrangQlGiangVienAd = () => {
    return (
        <>
            <div className="trang-qlgiangvien-ad flex-col">
                <h1 className="tieude-trang">Danh Sách Giảng Viên</h1>
                <div className="khung-ql-chucnang flex-row">
                    <div className="khung-tao-taikhoan flex-row">
                        <div className="mokhung tao-dstaikhoan">
                            Tạo tài khoản giảng viên
                        </div>
                        <div className="mokhung them-taikhoan">
                            Thêm mới giảng viên
                        </div>
                    </div>
                    <div className="khung-timkiem">
                        <input
                            type="text"
                            className="input-timkiem"
                            placeholder="Tìm kiếm giảng viên..."
                        />
                        <button className="nut-timkiem">Tìm kiếm</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrangQlGiangVienAd;