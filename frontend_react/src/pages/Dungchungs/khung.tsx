
import "./khung.css";

import TieuDe from "./tieuDe.tsx";
import ChanTrang from "./chanTrang.tsx";
import { useNguoiDung } from "../../hooks/useNguoiDung";

interface LayoutProps {
  trangcon: React.ReactNode;
}
const Khung: React.FC<LayoutProps> = ({ trangcon }) => {
    const { dangTai } = useNguoiDung();

   

    if (dangTai) {
        return (
            <div className="flex justify-center items-center min-h-screen" >
                <p>Đang tải dữ liệu người dùng...</p>
            </div>
        );
    }

    return (
        <div className="khung-cha flex-col">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <TieuDe />
                <div className="noi-dung-chinh">
                    {trangcon}
                </div>
                <ChanTrang />
            </div>
        </div>
    );
};
export default Khung;