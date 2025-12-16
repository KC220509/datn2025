import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import './khungNhomChat.css';
import ketNoiAxios from '../../tienichs/ketnoiAxios';


interface NguoiDung{
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    trang_thai: boolean;
}


interface SinhVien {
    id_sinhvien: string;
    msv: string;
    nguoi_dung: NguoiDung;
}



interface GiangVien{
    id_giangvien: string;
    hoc_ham_hoc_vi: string;
    nguoi_dung: NguoiDung;
}

// interface ThanhVienNhom {
//     id_thanhviennhom: string;
//     ma_nhom: string;
//     sinh_viens: SinhVien[];
// }

interface ThongTinNhom {
    id_nhom: string;
    ten_nhom: string;
    nguoi_tao: GiangVien;
    sinh_viens: SinhVien[];
    created_at: Date;

}

const KhungNhomChat = () => {

    const { id_nhom } = useParams<{ id_nhom: string }>();
    const navigate = useNavigate();
    
    const [thongTinNhom, setThongTinNhom] = useState<ThongTinNhom>();

    useEffect(() => {
        const layThongTinNhom = async (id_nhom: string) => {
            try {
                const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/${id_nhom}`);

                if (phanhoi.data.trangthai) {
                    setThongTinNhom(phanhoi.data.nhom);
                } else {
                    navigate('/khong-co-quyen');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin nhóm:', error);
            
            } 
        };

        layThongTinNhom(String(id_nhom));
    }, [id_nhom, navigate]);



    const [menu_hien_tai, setMenuHienTai] = useState('kenh-chung');

   

    // Danh sách menu bên trái
    const ds_menu = [
        { id: 'kenh-chung', ten: 'Kênh Chung', icon: '💬' },
        { id: 'bai-tap', ten: 'Bài Tập', icon: '📝' },
        { id: 'tai-lieu', ten: 'Tài Liệu', icon: '📚' },
    ];

    const xuLyChonMenu = (id: string) => {
        setMenuHienTai(id);
    };

    const xuLyThoatNhom = () => {
        navigate('/giang-vien/sinh-vien-phan-cong/danhsach-nhom');
    };

    return (
        <div className="khung-nhom-chat">
            {/* Sidebar trái - Menu */}
            <aside className="sidebar-trai khung-menu">
                <div className="tieude-menu-chat">
                    <div 
                        className="nut-back-nhom flex-row"
                        onClick={xuLyThoatNhom}
                        title="Quay lại danh sách nhóm"
                    >
                        <i className="bi bi-box-arrow-in-left"></i>
                        <span>Thoát Nhóm</span>
                    </div>
                </div>
                <div className="tieude-menu-chat">
                    <h3>Hệ Thống Hỗ Trợ ĐATN</h3>
                </div>
                <nav className="danh-sach-menu-chat">
                    <ul>
                        {ds_menu.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`nut-menu-chat ${menu_hien_tai === item.id ? 'active' : ''}`}
                                    onClick={() => xuLyChonMenu(item.id)}
                                >
                                    <span className="icon-menu">{item.icon}</span>
                                    <span className="ten-menu">{item.ten}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Cột giữa - Nội dung chính */}
            <main className="noi-dung-chinh-nhom">
                <div className="thanh-tieude-noi-dung">
                    <h2><i style={{fontSize: '28px'}} className="bi bi-people-fill"></i> {thongTinNhom?.ten_nhom}</h2>
                    <div className="cuoc-hop">
                        <button className="nut-tao-cuoc-hop">Cuộc Họp</button>
                    </div>
                </div>
                <div className="khung-noi-dung-nhom">
                    <Outlet />
                </div>
            </main>

            {/* Sidebar phải - Thông tin nhóm */}
            <aside className="sidebar-phai khung-thong-tin-nhom">
                <div className="khung-tieude-thong-tin">
                    <h3>Thông Tin Nhóm</h3>
                </div>

                {/* Thông tin nhóm */}
                <div className="phan-thong-tin">
                    <div className="khung-thong-tin-item">
                        <label className="tieude-thong-tin">Tên Nhóm</label>
                        <p className="gia-tri-thong-tin">{thongTinNhom?.ten_nhom}</p>
                    </div>

                    <div className="khung-thong-tin-item">
                        <label className="tieude-thong-tin">Ngày Tạo</label>
                        <p className="gia-tri-thong-tin">{thongTinNhom?.created_at ? new Date(thongTinNhom.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                </div>

                {/* Thông tin người tạo (Giảng viên) */}
                <div className="phan-giang-vien">
                    <h4 className="tieude-phan">Giảng Viên Hướng Dẫn</h4>
                    <div className="khung-thong-tin-giang-vien">
                        <div className="avatar-giang-vien">👨‍🏫</div>
                        <div className="chi-tiet-giang-vien">
                            <p className="ten-giang-vien">{thongTinNhom?.nguoi_tao?.nguoi_dung.ho_ten}</p>
                            <p className="email-giang-vien">{thongTinNhom?.nguoi_tao?.nguoi_dung.email}</p>
                        </div>
                    </div>
                </div>

                {/* Danh sách thành viên */}
                <div className="phan-thanh-vien">
                    <h4 className="tieude-phan">Thành Viên Nhóm ({thongTinNhom?.sinh_viens.length})</h4>
                    <div className="danh-sach-thanh-vien">
                        {thongTinNhom?.sinh_viens.map((thanh_vien) => (
                            <div key={thanh_vien.id_sinhvien} className="item-thanh-vien">
                                <div className="avatar-thanh-vien"><i className="bi bi-person-fill"></i></div>
                                <div className="chi-tiet-thanh-vien">
                                    <p className="ten-thanh-vien">{thanh_vien?.nguoi_dung?.ho_ten}</p>
                                    <p className="email-thanh-vien">{thanh_vien?.nguoi_dung.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default KhungNhomChat;