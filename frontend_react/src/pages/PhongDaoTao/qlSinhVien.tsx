import { useEffect, useState } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


const QlSinhVien = () => {
  
  interface HocKy {
    id_hocky: number;
    ten_hoc_ky: string;
  }

  interface Lop {
    id_lop: number;
    ten_lop: string;
  }

  interface NguoiDung{
    id_nguoidung: number;
    ho_ten: string;
    email: string;
  }

  interface SinhVien {
    id_sinhvien: number;
    ho_ten: NguoiDung;
    email: NguoiDung;
    msv: string;
    gioi_tinh: boolean;
    so_dien_thoai: string;
    lop: Lop;
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




  const [moKhungTaiTep, setMoKhungTaiTep] = useState(false);
  
  const [id_hocky, setIdHocKy] = useState('');
  const [loiTaiTep, setLoiTaiTep] = useState('');
  const [tep, setTep] = useState<File>(null!);
  const [trangThaiChon, setTrangThaiChon] = useState(false);

  const xuLyMoKhungTaiTep = () => {
    setMoKhungTaiTep(true);
  }

  const xuLyDongKhungTaiTep = () => {
    setMoKhungTaiTep(false);
    setTep(null!);
  }

  const [keoTep, setKeoTep] = useState(false);
  

  const nganChanMacDinh = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const xuLyKeoTepVao = (event: React.DragEvent<HTMLElement>) => {
    nganChanMacDinh(event);
    setKeoTep(true);
  }
  const xuLyKeoTepRa = (event: React.DragEvent<HTMLElement>) => {
    nganChanMacDinh(event);
    setKeoTep(false);
  }
  

  

  const xuLyTaiTep = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setTep(event.target.files[0]);
      setLoiTaiTep('');
      setTrangThaiChon(true);
    }
  };


  const xuLyThaTep = (event: React.DragEvent<HTMLDivElement>) => { 
    nganChanMacDinh(event);
    setKeoTep(false);

    const tepDaTai = event.dataTransfer.files;
    if (tepDaTai.length > 0) {
      xuLyTaiTep({ target: { files: tepDaTai } } as React.ChangeEvent<HTMLInputElement>);
    };
  }



  const taiDanhSachSinhVien = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tep) {
      setLoiTaiTep('Vui lòng chọn tệp để tải lên.');
      return;
    }

    const formData = new FormData();
    formData.append('file', tep);
    formData.append('id_hocky', id_hocky);
    try {
      const duLieu = await ketNoiAxios.post('/admin/dssv-tailen', formData);
      console.log('Kết quả tải lên:', duLieu.data);
    } catch (error) {
      console.error('Lỗi khi tải lên tệp:', error);
    }
  }



  return  (
    <>
      <div className="khung-daotao-sv flex-col">
        <div className="khung-tren flex-row">
          <div className="mo-form" onClick={xuLyMoKhungTaiTep}>
            Tải danh sách sinh viên
          </div>
          {moKhungTaiTep && (
            <div className="khung-taidulieu-sv">
                <form method="post" className="form-taidulieu flex-col" onSubmit={taiDanhSachSinhVien}>
                    <div className="tieude-form flex-row">
                        <h4 className="tieude-khungtai">Tải danh sách sinh viên</h4>
                        <i className="dong-form bi bi-x-square" onClick={xuLyDongKhungTaiTep}></i>
                    </div>
                    
                    <div className="noidung-khungtai flex-col">
                        <label htmlFor="chonfile" className="nhan-file"
                          
                        >
                            <input 
                                type="file" 
                                id="chonfile" 
                                className="chon-file-sv an-tenfile" 
                                accept=".xlsx" 
                                onChange={xuLyTaiTep}
                            />

                            <div className={`khung-hienthi-file  ${keoTep ? 'dang-keo-tep' : ''}`}
                              onDragEnter={xuLyKeoTepVao}
                              onDragLeave={xuLyKeoTepRa}
                              onDragOver={nganChanMacDinh}
                              onDrop={xuLyThaTep}
                            >
                                {tep && tep.name ? (
                                    <div className="file-chon flex-row">
                                        <i className="bi bi-filetype-xls icon-file"></i> 
                                        <div className="thongtin-file">
                                            <p className="ten-file">{tep.name}</p>
                                            <span className="kichthuoc-file">
                                                {(tep.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="file-chua-chon flex-col">
                                        <i className="bi bi-file-earmark-arrow-up"></i>
                                        <p>Chọn hoặc kéo thả tệp (.xlsx) vào đây</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        
                        {loiTaiTep && <p className="thongbao-loi-taifile">{loiTaiTep}</p>}
                        
                        <div className="nut-hanhdong-khungtai flex-row">
                            <button type="submit" className={`nut-xacnhan-tai  ${trangThaiChon ? '' : 'disabled'}`} disabled={!trangThaiChon}>
                              <i className="bi bi-upload"></i>
                              Tải lên
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}

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
        <div className="khung-duoi">
          <table className="bang-ds-sinhvien">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th className="col-hoten">Họ tên</th>
                <th className="col-email">Email</th>
                <th className="col-msv">Mã Sinh viên</th>
                <th className="col-lop">Lớp</th>
                <th className="col-gioitinh">Giới tính</th>
                <th className="col-sodienthoai">Số điện thoại</th>
                <th className="col-hocky">Học kỳ</th>
                <th className="col-chucnang">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-stt">1</td>
                <td className="col-hoten">Nguyễn Văn A</td>
                <td className="col-email">nguyenvana@example.com</td>
                <td className="col-msv">21115053120306</td>
                <td className="col-lop">CTK42</td>
                <td className="col-gioitinh">Nam</td>
                <td className="col-sodienthoai">0123456789</td>
                <td className="col-hocky">122</td>
                <td className="col-chucnag">
                  <button className="nut-chucnang pdt-xoa-sinhvien">
                    <i className="bi bi-x-square"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
};
export default QlSinhVien;