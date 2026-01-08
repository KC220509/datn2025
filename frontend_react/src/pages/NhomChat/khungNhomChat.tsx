import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate, NavLink } from 'react-router-dom';
import './khungNhomChat.css';
import ketNoiAxios from '../../tienichs/ketnoiAxios';
import { useNguoiDung } from '../../hooks/useNguoiDung';
import axios from 'axios';
import { limitToLast, onValue, query, ref } from 'firebase/database';
import { db } from '../../firebase';


interface NguoiDung{
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    trang_thai: boolean;
}

interface HocKy {
    id_hocky: string;
    ten_hoc_ky: string;
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

interface PhanCong {
    id_phancong: string;
    giang_vien: GiangVien;
    sinh_vien: SinhVien;
    hoc_ky: HocKy;
    nguoi_dung_giang_vien: NguoiDung;
    nguoi_dung_sinh_vien: NguoiDung;
}


interface ThongTinNhom {
    id_nhom: string;
    ten_nhom: string;
    nguoi_tao: GiangVien;
    sinh_viens: SinhVien[];
    created_at: Date;
    ma_hocky: string;
}



interface TepDinhKemNhom{
    id_tinnhan: string;
    ma_nhom: string;
    ten_tep: string;
    duong_dan_tep: string;
}


const KhungNhomChat = () => {

    const { nguoiDung } = useNguoiDung();
    const { id_nhom } = useParams<{ id_nhom: string }>();
    const navigate = useNavigate();

    const [tepDinhKem, setTepDinhKem] = useState<TepDinhKemNhom[]>([]);

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

                const dsTep = dsTinNhan.filter(item => 
                                            item.ten_tep !== null && 
                                            item.duong_dan_tep !== "" &&
                                            item.tinnhan_xoa === false 
                                        )
                                        .reverse();

                console.log('Danh sách tệp đính kèm cập nhật:', dsTep);
                setTepDinhKem(dsTep);
            } else {
                setTepDinhKem([]); 
            }
        });

        return () => dongKetNoi();
    }, [id_nhom]);
    
    const [thongTinNhom, setThongTinNhom] = useState<ThongTinNhom>();

    const [danhSachSvPc, setDanhSachSvPc] = useState<PhanCong[]>([]);
    const [dsIdSinhVienChonThem, setDsIdSinhVienChonThem] = useState<Set<string>>(new Set());

    useEffect(() => {
        const layThongTinNhom = async (id_nhom: string) => {
            try {
                const phanhoi = await ketNoiAxios.get(`/nhom/chi-tiet/${id_nhom}`);

                if(phanhoi.data.trangthai) {
                    setThongTinNhom(phanhoi.data.nhom);
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data;
                    
                    if (data?.la_thanh_vien === false) {
                        navigate('/khong-co-quyen');
                    }
                }
            } 
        };

        layThongTinNhom(String(id_nhom));
    }, [id_nhom, navigate]);

    useEffect(() => {
        if(nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV')){
            const layDanhSachSvPc = async () => {
                try {
                    const phanhoi = await ketNoiAxios.get('/gv/ds-sinhvien-pc');
                    if(phanhoi.data.trangthai){
                        setDanhSachSvPc(phanhoi.data.ds_sinhvien_pc);
                    }
                }catch(error){
                    console.error('Lỗi khi lấy danh sách sinh viên phân công:', error);
                }
            }
            layDanhSachSvPc();
        }
    }, [nguoiDung]);

   
    const ds_menu = [
        { id: 'kenh-chat', ten: 'Kênh Chat', icon: '💬', duongdan: `.` },
        { id: 'bai-tap', ten: 'Bài Tập', icon: '📝', duongdan: `bai-tap` },
        // { id: 'tai-lieu', ten: 'Tài Liệu', icon: '📚', duongdan: `tai-lieu` },
    ];

    

    const xuLyThoatNhom = () => {
        if(nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV')){
            navigate('/giang-vien/sinh-vien-phan-cong/danhsach-nhom');
        }else if(nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'SV')){
            navigate('/sinh-vien/ds-nhom-doan');
        }
    };

    const [moKhungThemThanhVien, setMoKhungThemThanhVien] = useState<boolean>(false);



    const xuLyThemThanhVien = async (id_nhom: string) => {
        if (!thongTinNhom) return;
        if (dsIdSinhVienChonThem.size === 0) {
            alert('Vui lòng chọn ít nhất một sinh viên để thêm.');
            return;
        }

        try {
            const phanhoi = await ketNoiAxios.post(`/gv/nhom/them-thanh-vien/${id_nhom}`, {
                sinh_vien_ids: Array.from(dsIdSinhVienChonThem)
            });

            if (phanhoi.data.trangthai) {
                alert('Thêm thành viên vào nhóm thành công!');
                setMoKhungThemThanhVien(false);
                setDsIdSinhVienChonThem(new Set());
                const phanhoi2 = await ketNoiAxios.get(`/nhom/chi-tiet/${id_nhom}`);
                if (phanhoi2.data.trangthai) {
                    setThongTinNhom(phanhoi2.data.nhom);
                }
            } else {
                alert('Thêm thành viên vào nhóm thất bại!');
            }
        } catch (error) {
            alert('Lỗi khi thêm thành viên vào nhóm');
            console.error('Lỗi khi thêm thành viên vào nhóm:', error);
        }
    };

    const xuLyXoaThanhVien = async (id_nhom: string, id_sinhvien: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này khỏi nhóm ?')) {
            ketNoiAxios.delete(`/gv/nhom/xoa-thanh-vien/${id_nhom}/${id_sinhvien}`)
                .then(async phanhoi => {
                    if (phanhoi.data.trangthai) {
                        alert(phanhoi.data.thongbao);
                        const capNhatDs = await ketNoiAxios.get(`/nhom/chi-tiet/${id_nhom}`);
                        if (capNhatDs.data.trangthai) {
                            setThongTinNhom(capNhatDs.data.nhom);
                        }
                    } else {
                        alert(`Xóa thành viên khỏi nhóm thất bại: ${phanhoi.data.thongbao || 'Lỗi không xác định'}`);
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi xóa thành viên khỏi nhóm:', error);
                    alert('Đã xảy ra lỗi khi xóa thành viên khỏi nhóm. Vui lòng thử lại.');
                });
        }
    };
    
    const xuLyChonSinhVien = (id_sinhvien: string) => {
        setDsIdSinhVienChonThem(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id_sinhvien)) {
                newSet.delete(id_sinhvien);
            } else {
                newSet.add(id_sinhvien);
            }
            return newSet;
        });
    };

    const dsSinhVienHienThi = danhSachSvPc.filter(pc => {
        if (thongTinNhom?.ma_hocky) {
            return pc.hoc_ky.id_hocky === thongTinNhom.ma_hocky;
        }
        return true; 
    });

    return (
        <div className="khung-nhom-chat">
            {moKhungThemThanhVien && (
                <div className="lop-phu-modal">
                    <div className="khung-modal-them-tv">
                        <h4>Thêm Thành Viên Vào Nhóm</h4>
                        <div className="ds-sinhvien-modal">
                            <table className="bang-ds-sv-modal">
                                <thead>
                                    <tr>
                                        <th>Chọn</th>
                                        <th>MSV</th>
                                        <th>Họ Tên</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dsSinhVienHienThi.map((pc) => {
                                        const daLaThanhVien = thongTinNhom?.sinh_viens.some(sv => sv.id_sinhvien === pc.sinh_vien.id_sinhvien);
                                        return (
                                            <tr key={pc.sinh_vien.id_sinhvien}>
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={daLaThanhVien || dsIdSinhVienChonThem.has(pc.sinh_vien.id_sinhvien)}
                                                        disabled={daLaThanhVien}
                                                        onChange={() => xuLyChonSinhVien(pc.sinh_vien.id_sinhvien)}
                                                    />
                                                </td>
                                                <td>{pc.sinh_vien.msv}</td>
                                                <td>{pc.nguoi_dung_sinh_vien.ho_ten}</td>
                                                <td>{pc.nguoi_dung_sinh_vien.email}</td>
                                            </tr>
                                        );
                                    })}
                                    {dsSinhVienHienThi.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{textAlign: 'center'}}>Không có sinh viên nào trong học kỳ này.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="khung-nut-modal">
                            <button className="nut-modal them" onClick={() => xuLyThemThanhVien(thongTinNhom?.id_nhom ?? '')}>Thêm</button>
                            <button className="nut-modal huy" onClick={() => {
                                setMoKhungThemThanhVien(false);
                                setDsIdSinhVienChonThem(new Set());
                            }}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
            
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
                                <NavLink to={item.duongdan!}
                                    end={item.id === 'kenh-chat'}
                                    className={({ isActive }) => `nut-menu-chat ${isActive ? 'active' : ''}`}
                                >
                                    <span className="icon-menu">{item.icon}</span>
                                    <span className="ten-menu">{item.ten}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            
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

           
            <aside className="sidebar-phai khung-thong-tin-nhom">
                <div className="khung-tieude-thong-tin">
                    <h3>Thông Tin Nhóm</h3>
                </div>

                
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

               
                <div className="phan-thanh-vien">
                    <div className="phan-tieude flex-row">
                        <h4 className="tieude-phan">Thành Viên Nhóm ({thongTinNhom?.sinh_viens.length})</h4>
                        {nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV') && (
                            <i className="bi bi-person-plus-fill" onClick={() => setMoKhungThemThanhVien(true)}></i>
                        )}
                    </div>
                    <div className="danh-sach-thanh-vien">
                        {thongTinNhom?.sinh_viens.map((thanh_vien) => (
                            <div key={thanh_vien.id_sinhvien} className="item-thanh-vien">
                                <div className="avatar-thanh-vien"><i className="bi bi-person-fill"></i></div>
                                <div className="chi-tiet-thanh-vien">
                                    <p className="ten-thanh-vien">{thanh_vien?.nguoi_dung?.ho_ten}</p>
                                    <p className="email-thanh-vien">{thanh_vien?.nguoi_dung.email}</p>
                                </div>
                                
                                {nguoiDung?.vai_tros.some(vt => vt.id_vaitro === 'GV') && (
                                    <i className="nut-xoa-thanhvien bi bi-person-x-fill"
                                        onClick={() => xuLyXoaThanhVien(String(thongTinNhom?.id_nhom), thanh_vien.id_sinhvien)}
                                    ></i>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                
                {tepDinhKem.length > 0 && (
                    <div className="phan-tep-dinh-kem">
                        <div className="phan-tieude flex-row">
                            <h4 className="tieude-phan">Tệp Đính Kèm (Nhóm Chat)</h4>
                        </div>
                        <div className="danh-sach-tep">
                            {tepDinhKem.map((tep) => (
                                <a key={tep.id_tinnhan} href={`${tep.duong_dan_tep}`} target='_blank' className="item-tep flex-row">
                                    <div className="avatar-tep">
                                        <i className="bi bi-file-earmark-arrow-down-fill"></i>
                                    </div>
                                    <div className="chi-tiet-tep">
                                        <p className="ten-tep">{tep.ten_tep}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default KhungNhomChat; 