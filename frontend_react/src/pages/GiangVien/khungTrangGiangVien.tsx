
import './trangGiangVien.css';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNguoiDung } from '../../hooks/useNguoiDung';

const KhungGiangVien: React.FC = () => {
    const [ktraTBM, setKtraTBM] = useState<boolean>(false);
    
    const { nguoiDung } = useNguoiDung();
    const chuyenhuong = useNavigate();
    const duongdan = useLocation();
    
    useEffect(() => {
        if(nguoiDung){
            if (nguoiDung.vai_tros.some(vt => vt.id_vaitro === 'TBM')) {
                setKtraTBM(true);
            } else {
                if(duongdan.pathname === '/giang-vien/quan-ly-phan-cong'){
                    chuyenhuong('/giang-vien');
                }
            }
        }
    }, [nguoiDung, chuyenhuong, duongdan]);

    return(
        <div className="khung-tranggiangvien flex-col">
            <div className="khung-dieuhuong flex-row">
                <aside className="thanh-dieuhuong">
                    <nav>
                        <ul className="danh-sach-menu flex-row">
                            <li>
                                <NavLink to="/giang-vien" end className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Tổng Quan Giảng Viên
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/giang-vien/sinh-vien-phan-cong" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                    Quản Lý Sinh Viên Phân Công
                                </NavLink>
                            </li>
                            {ktraTBM && (
                                <li>
                                    <NavLink to="/giang-vien/quan-ly-phan-cong" className={({ isActive }) => isActive ? 'muc-menu-active' : 'muc-menu'}>
                                        Quản Lý Phân Công
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                </aside>
            </div>
            <div className="khung-noidung-tranggiangvien flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default KhungGiangVien;