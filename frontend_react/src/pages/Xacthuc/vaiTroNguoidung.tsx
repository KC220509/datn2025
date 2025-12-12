import React, { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNguoiDung } from '../../hooks/useNguoiDung';

interface Props {
  trangcon: JSX.Element;
  vaitros?: string[]; 
}

const VaiTroNguoiDung: React.FC<Props> = ({ trangcon, vaitros }) => {
  const { nguoiDung, dangTai } = useNguoiDung(); 
  const location = useLocation();

  if (dangTai) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  if (!nguoiDung) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }
  
  
  if (vaitros && nguoiDung.vai_tros) {
    const nguoiDungQuyen = Array.isArray(nguoiDung.vai_tros) ? nguoiDung.vai_tros.map(vt => vt.id_vaitro) : [];
    
    const coQuyen = vaitros.some(quyen => nguoiDungQuyen.includes(quyen));

    if (!coQuyen) {
      return <Navigate to="/khong-co-quyen" state={{ from: location }} replace />;
    }
  }

  return trangcon; 
};

export default VaiTroNguoiDung;