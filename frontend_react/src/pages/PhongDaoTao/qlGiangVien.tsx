import { useEffect, useState, useCallback } from "react";
import ketNoiAxios from "../../tienichs/ketnoiAxios";


const QlGiangVien = () => {
  
  interface HocKy {
    id_hocky: string;
    ten_hoc_ky: string;
  }

  interface Nganh {
    id_nganh: string;
    ten_nganh: string;
  }

  
  interface NguoiDung{
    id_nguoidung: string;
    ho_ten: string;
    email: string;
    gioi_tinh: boolean;
    so_dien_thoai: string;
    hoc_kys: HocKy[];
  }
  

  interface GiangVien {
    id_giangvien: string;
    nganh: Nganh;
    hoc_ham_hoc_vi: string;
    nguoi_dung: NguoiDung;
    ten_hoc_ky?: string;
  }

  const [dsHocKy, setDsHocKy] = useState<HocKy[]>([]);
  const [dsGiangVien, setDsGiangVien] = useState<GiangVien[]>([]);

  const fetchDsHocKy = useCallback(async () => {
    try{
      const danhSachHocKy = await ketNoiAxios.get('/pdt/ds-hocky');
      if(danhSachHocKy){
        setDsHocKy(danhSachHocKy.data.ds_hocky);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách học kỳ:', error);
    }
  }, []);

  const fetchDsGiangVien = useCallback(async () => {
    try{
      const duLieu = await ketNoiAxios.get('/pdt/ds-giangvien');

        if (duLieu.data.trangthai === true) {
            const dsGoc = duLieu.data.ds_giangvien;

            const phanTach = dsGoc.flatMap((giangVien: GiangVien) => { 
                const hocKys = giangVien.nguoi_dung?.hoc_kys || []; 
                
                return hocKys.map((hk: HocKy) => ({
                    ...giangVien,
                    ten_hoc_ky: hk.ten_hoc_ky
                }));
            });
            
            setDsGiangVien(phanTach);
        }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giảng viên:', error);
    }
  }, []);

  useEffect(() => {
    fetchDsHocKy();
    fetchDsGiangVien();
  }, [fetchDsHocKy, fetchDsGiangVien]);

  
  const [trangHienTai, setTrangHienTai] = useState(1);
  const phanTuMoiTrang = 10;

  const indexCuoiCung = trangHienTai * phanTuMoiTrang;
  const indexDauTien = indexCuoiCung - phanTuMoiTrang;
  const dsGiangVienHienThi = dsGiangVien.slice(indexDauTien, indexCuoiCung);
  const tongSoTrang = Math.ceil(dsGiangVien.length / phanTuMoiTrang);
  const xyLyChuyenTrang = (soTrang: number) => {
    setTrangHienTai(soTrang);
  };

  const phanTrang = () => {
    const trangSos = [];
    for (let i = 1; i <= tongSoTrang; i++) {
      trangSos.push(i);
    }

    return trangSos.map((trang) => (
      <button
        key={trang}
        className={`nut-phantrang ${trangHienTai === trang ? 'active' : ''}`}
        onClick={() => xyLyChuyenTrang(trang)}
      > 
        {trang}
      </button>
    ));
  };
  const [moKhungTaiTep, setMoKhungTaiTep] = useState(false);
  
  const [id_hocky, setIdHocKy] = useState<string>('');
  const [tep, setTep] = useState<File | null>(null);

  const [trangThaiChon, setTrangThaiChon] = useState(false);
  // const [thongBao, setThongBao] = useState('');
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState('');
  const [thongBaoThatBai, setThongBaoThatBai] = useState('');

  const xuLyMoKhungTaiTep = () => {
    setMoKhungTaiTep(true);
  }

  const xuLyDongKhungTaiTep = () => {
    setMoKhungTaiTep(false);
    setIdHocKy('');
    setTep(null);
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
      setThongBaoThanhCong(''); 
    }
  };


  const xuLyThaTep = (event: React.DragEvent<HTMLDivElement>) => { 
    nganChanMacDinh(event);
    setKeoTep(false);

    const tepDaTai = event.dataTransfer.files;
    if (tepDaTai.length > 0) {
      setTep(tepDaTai[0]);
      setThongBaoThanhCong('');
    };
  }

  useEffect(() => {
    if (tep && id_hocky) {
      setTrangThaiChon(true);
    } else {
      setTrangThaiChon(false);
    }
  }, [tep, id_hocky]);

  const taiDanhSachGiangVien = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id_hocky', id_hocky);
    if (tep) {
      formData.append('file_giangvien', tep);
    }

    try {
      const duLieu = await ketNoiAxios.post('/pdt/dsgv-tailen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'enctype': 'multipart/form-data',
        },
      });
      if(duLieu.data.trangthai === false){
        setThongBaoThatBai(duLieu.data.thongbao);
        setTimeout(() => {
          setThongBaoThatBai('');
        }, 5000);
        return;
      }else{

        setThongBaoThanhCong(duLieu.data.thongbao);
        fetchDsGiangVien();
        setTimeout(() => {
          setThongBaoThanhCong('');
          setMoKhungTaiTep(false);
          setIdHocKy('');
          setTep(null);
        }, 3000);
      }
    }
    catch (error) {
      console.error('Lỗi khi tải lên tệp:', error);
      setThongBaoThatBai('Tệp tải lên không hợp lệ.');
      setTimeout(() => {
        setThongBaoThatBai('');
      }, 3000);
    }
  }



  return  (
    <>
      <div className="khung-daotao-sv flex-col">
        <div className="khung-tren flex-row">
          <div className="mo-form" onClick={xuLyMoKhungTaiTep}>
            Tải danh sách giảng viên
          </div>
          {moKhungTaiTep && (
            <div className="khung-taidulieu-sv">
                <form method="POST" className="form-taidulieu flex-col" onSubmit={taiDanhSachGiangVien} encType="multipart/form-data">
                    
                    <div className="tieude-form flex-row">
                        <h4 className="tieude-khungtai">Tải danh sách giảng viên</h4>
                        <i className="dong-form bi bi-x-square" onClick={xuLyDongKhungTaiTep}></i>
                    </div>

                    <div className="khung-chon-hocky flex-row">
                        <label htmlFor="hocky-danhsach" className="nhan-chon-hocky">Chọn Học kỳ áp dụng</label>
                        <select id="hocky-danhsach" name="id_hocky" className="chon-hocky"
                          value={id_hocky}
                          onChange={(e) => setIdHocKy(e.target.value)}
                        >
                          <option value="">Tất cả</option>
                          {dsHocKy.map((hocKy) => (
                            <option key={hocKy.id_hocky} value={hocKy.id_hocky}>{hocKy.ten_hoc_ky}</option>
                          ))}
                        </select>
                    </div>

                    <div className="noidung-khungtai flex-col">
                      <label htmlFor="chonfile" className="nhan-file">
                        <input 
                            type="file" 
                            id="chonfile" 
                            name="file_giangvien"
                            className="chon-file-sv an-tenfile" 
                            accept=".xlsx, .xls" 
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
                      
                      
                      <div className="nut-hanhdong-khungtai flex-row">
                          <button type="submit" className={`nut-xacnhan-tai  ${trangThaiChon ? '' : 'disabled'}`} disabled={!trangThaiChon}>
                            <i className="bi bi-upload"></i>
                            Tải lên
                          </button>
                      </div>
                      {thongBaoThanhCong && <p className="thongbao-thanhcong-taifile">{thongBaoThanhCong}</p>}
                      {thongBaoThatBai && <p className="thongbao-loi-taifile">{thongBaoThatBai}</p>}
                    </div>
                </form>
            </div>
          )}

          <div className="khung-boloc flex-row">
            <div className="loc-hocky flex-row">
              <label htmlFor="hocky-select" className="nhan-chon">Lọc theo học kỳ</label>
              <select id="hocky-select" className="chon-hocky">
                <option value="">Tất cả</option>
                {dsHocKy.map((hocKy) => (
                  <option key={hocKy.id_hocky} value={hocKy.id_hocky}>{hocKy.ten_hoc_ky}</option>
                ))}
              </select>
            </div>

            <form method="post" className="khung-timkiem flex-row">
              <i className="bi bi-search"></i>
              <input id="pdt-timkiem" name="pdt-timkiem" className="nhap-timkiem" type="text" placeholder="Nhập từ khóa tìm kiếm"/>
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
                <th className="col-nganh">Ngành</th>
                <th className="col-hochamhocvi">Học hàm học vị</th>
                <th className="col-gioitinh">Giới tính</th>
                <th className="col-sodienthoai">Số điện thoại</th>
                <th className="col-hocky">Học kỳ</th>
                <th className="col-chucnang">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {dsGiangVienHienThi && dsGiangVienHienThi.length > 0 ? (
                dsGiangVienHienThi.map((giangVienItem, index) => (
                  <tr key={giangVienItem.id_giangvien + '-' + index}>
                    <td className="col-stt">{index + 1}</td>
                    <td className="col-hoten">{giangVienItem.nguoi_dung?.ho_ten}</td>
                    <td className="col-email">{giangVienItem.nguoi_dung?.email}</td>
                    <td className="col-nganh">{giangVienItem.nganh?.ten_nganh}</td>
                    <td className="col-hochamhocvi">{giangVienItem.hoc_ham_hoc_vi}</td>
                    <td className="col-gioitinh">{giangVienItem.nguoi_dung?.gioi_tinh ? 'Nam' : 'Nữ'}</td>
                    <td className="col-sodienthoai">{giangVienItem.nguoi_dung?.so_dien_thoai}</td>
                    <td className="col-hocky">
                        {giangVienItem.ten_hoc_ky}
                    </td>
                    
                    <td className="col-chucnag">
                      <button className="nut-chucnang pdt-xoa-sinhvien">
                        <i className="bi bi-x-square"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">Chưa có dữ liệu giảng viên</td>
                </tr>
              )}
            </tbody>
          </table>
          {dsGiangVienHienThi && dsGiangVienHienThi.length > 0 ? (
            <div className="khung-phantrang flex-row">
              <button className={`nut-phantrang truoc ${trangHienTai === 1 ? "disabled" : ""}`}
                onClick={() => xyLyChuyenTrang(trangHienTai > 1 ? trangHienTai - 1 : 1)}
                disabled={trangHienTai === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              {phanTrang()}
              <button className={`nut-phantrang sau ${trangHienTai === tongSoTrang ? "disabled" : ""}`}
                onClick={() => xyLyChuyenTrang(trangHienTai + 1)}
                disabled={trangHienTai === tongSoTrang}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
};
export default QlGiangVien;