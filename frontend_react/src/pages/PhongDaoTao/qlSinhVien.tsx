import { useEffect, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


const QlSinhVien = () => {
  
  interface HocKy {
    id_hocky: number;
    ten_hoc_ky: string;
  }

  const [dsHocKy, setDsHocKy] = useState<HocKy[]>([]);

  const fetchDsHocKy = async () => {
    try{
      const danhSachHocKy = await ketNoiAxios.get('/admin/ds-hocky');
      if(danhSachHocKy){
        setDsHocKy(danhSachHocKy.data.ds_hocky);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách học kỳ:', error);
    }
  };

  useEffect(() => {
    fetchDsHocKy();
  }, []);

  return  (
    <>
      <div className="khung-daotao-sv flex-col">
        <div className="khung-tren flex-row">
          <div className="mo-form">
            Tải danh sách sinh viên
          </div>
          <div className="khung-boloc flex-row">
            <div className="loc-hocky flex-row">
              <label htmlFor="hocky-select" className="nhan-chon">Học kỳ</label>
              <select id="hocky-select" className="chon-hocky">
                <option value="">Tất cả</option>
                {dsHocKy.map((hocKy) => (
                  <option key={hocKy.id_hocky} value={hocKy.id_hocky}>{hocKy.ten_hoc_ky}</option>
                ))}
              </select>
            </div>

            <form method="post" className="khung-timkiem flex-row">
              <i className="bi bi-search"></i>
              <input className="nhap-timkiem" type="text" placeholder="Nhập từ khóa tìm kiếm"/>
              <button className="nut-timkiem">
                Tìm kiếm
              </button>
            </form>
          </div>
          

        </div>
        <div className="khung-duoi"></div>
      </div>
    </>
  )
};
export default QlSinhVien;