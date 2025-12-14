import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import './khungNhomChat.css';

interface ThanhVienNhom {
    id_sinhvien: string;
    msv: string;
    ten_sinhvien: string;
    email: string;
}

interface ThongTinNhom {
    id_nhom: string;
    ten_nhom: string;
    giangvien_tao: {
        id_giangvien: string;
        ten_giangvien: string;
        email: string;
    };
    danh_sach_thanh_vien: ThanhVienNhom[];
    ngay_tao: string;
}

const KhungNhomChat = () => {
    const { id_nhom } = useParams<{ id_nhom: string }>();
    const navigate = useNavigate();
    
    // State quản lý thông tin nhóm
    const [thongTinNhom, setThongTinNhom] = useState<ThongTinNhom>({
        id_nhom: '1',
        ten_nhom: 'Nhóm Đồ Án 1',
        giangvien_tao: {
            id_giangvien: 'gv001',
            ten_giangvien: 'Thầy Nguyễn Văn A',
            email: 'thay.a@school.edu.vn',
        },
        danh_sach_thanh_vien: [
            { id_sinhvien: 'sv001', msv: '20210001', ten_sinhvien: 'Trần Văn B', email: 'sv001@student.edu.vn' },
            { id_sinhvien: 'sv002', msv: '20210002', ten_sinhvien: 'Lê Thị C', email: 'sv002@student.edu.vn' },
            { id_sinhvien: 'sv003', msv: '20210003', ten_sinhvien: 'Phạm Văn D', email: 'sv003@student.edu.vn' },
        ],
        ngay_tao: '2024-01-15',
    });

    const [menu_hien_tai, setMenuHienTai] = useState('kenh-chung');

    // Fetch dữ liệu nhóm từ API khi component mount hoặc id_nhom thay đổi
    useEffect(() => {
        if (id_nhom) {
            console.log('Lấy dữ liệu nhóm:', id_nhom);
            // TODO: Thay thế bằng gọi API thực tế
            // const layThongTinNhom = async () => {
            //     try {
            //         const response = await ketNoiAxios.get(`/gv/chi-tiet-nhom/${id_nhom}`);
            //         if (response.data.trangthai) {
            //             setThongTinNhom(response.data.thong_tin_nhom);
            //         }
            //     } catch (error) {
            //         console.error('Lỗi khi lấy thông tin nhóm:', error);
            //     }
            // };
            // layThongTinNhom();
        }
    }, [id_nhom]);

    // Danh sách menu bên trái
    const ds_menu = [
        { id: 'kenh-chung', ten: 'Kênh Chung', icon: '💬' },
        { id: 'bai-tap', ten: 'Bài Tập', icon: '📝' },
        { id: 'tai-lieu', ten: 'Tài Liệu', icon: '📚' },
        { id: 'hop-tac', ten: 'Hợp Tác', icon: '🤝' },
    ];

    const xu_ly_chon_menu = (id: string) => {
        setMenuHienTai(id);
    };

    const xu_ly_thoat_nhom = () => {
        navigate('/giang-vien/sinh-vien-phan-cong/danhsach-nhom');
    };

    return (
        <div className="khung-nhom-chat">
            {/* Sidebar trái - Menu */}
            <aside className="sidebar-trai khung-menu">
                <div className="tieude-menu-chat">
                    <button 
                        className="nut-back-nhom"
                        onClick={xu_ly_thoat_nhom}
                        title="Quay lại danh sách nhóm"
                    >
                        ← Thoát Nhóm
                    </button>
                </div>
                <div className="tieude-menu-chat">
                    <h3>{thongTinNhom.ten_nhom}</h3>
                </div>
                <nav className="danh-sach-menu-chat">
                    <ul>
                        {ds_menu.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`nut-menu-chat ${menu_hien_tai === item.id ? 'active' : ''}`}
                                    onClick={() => xu_ly_chon_menu(item.id)}
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
                    <h2>{thongTinNhom.ten_nhom}</h2>
                    <div className="tro-giup">
                        <button className="nut-co-ban">❓ Trợ Giúp</button>
                    </div>
                </div>
                <div className="khung-noi-dung-chat">
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
                        <p className="gia-tri-thong-tin">{thongTinNhom.ten_nhom}</p>
                    </div>

                    <div className="khung-thong-tin-item">
                        <label className="tieude-thong-tin">Ngày Tạo</label>
                        <p className="gia-tri-thong-tin">{new Date(thongTinNhom.ngay_tao).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>

                {/* Thông tin người tạo (Giảng viên) */}
                <div className="phan-giang-vien">
                    <h4 className="tieude-phan">Giảng Viên Hướng Dẫn</h4>
                    <div className="khung-thong-tin-giang-vien">
                        <div className="avatar-giang-vien">👨‍🏫</div>
                        <div className="chi-tiet-giang-vien">
                            <p className="ten-giang-vien">{thongTinNhom.giangvien_tao.ten_giangvien}</p>
                            <p className="email-giang-vien">{thongTinNhom.giangvien_tao.email}</p>
                        </div>
                    </div>
                </div>

                {/* Danh sách thành viên */}
                <div className="phan-thanh-vien">
                    <h4 className="tieude-phan">Thành Viên Nhóm ({thongTinNhom.danh_sach_thanh_vien.length})</h4>
                    <div className="danh-sach-thanh-vien">
                        {thongTinNhom.danh_sach_thanh_vien.map((thanh_vien) => (
                            <div key={thanh_vien.id_sinhvien} className="item-thanh-vien">
                                <div className="avatar-thanh-vien">👤</div>
                                <div className="chi-tiet-thanh-vien">
                                    <p className="ten-thanh-vien">{thanh_vien.ten_sinhvien}</p>
                                    <p className="msv-thanh-vien">{thanh_vien.msv}</p>
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