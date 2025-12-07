import { useEffect, useState } from "react";

import './trangGiangVien.css';
import ketNoiAxios from "../../tienichs/ketnoiAxios";
import { useNguoiDung } from "../../hooks/useNguoiDung";

const PhanCongGvSv = () => {

    interface HocKy{
        id_hocky: string;
        ten_hoc_ky: string;
    }

    interface Lop{
        id_lop: string;
        ten_lop: string;
        nganh: Nganh;
    }

    interface Nganh{
        id_nganh: string;
        ma_truongbomon: string;
        ten_nganh: string;
        ky_hieu: string;
    }

    interface NguoiDung{
        id_nguoidung: string;
        ho_ten: string;
        email: string;
        trang_thai: boolean;
        hoc_kys?: HocKy[];
    }

    interface GiangVien{
        id_giangvien: string;
        nganh: Nganh;
        hoc_ham_hoc_vi: string;
        nguoi_dung: NguoiDung;
    }

    interface SinhVien{
        id_sinhvien: string;
        msv: string;
        nguoi_dung: NguoiDung;
        lop: Lop;
    }

    const [loaiPhanCong, setLoaiPhanCong] = useState<boolean>(true);
    const xuLyChonLoaiPhanCong = (loai: boolean) => {
        setLoaiPhanCong(loai);
    }

    const [ds_hockyTBM, setDsHocKyTBM] = useState<HocKy[]>([]);

    const { nguoiDung } = useNguoiDung();
    const [maNganh, setMaNganh] = useState<string>('');

    const layNganhCuaTBM = async (id_tbm: string) => {
        try{
            const dulieu = await ketNoiAxios.get(`/tbm/nganh/${id_tbm}`);
            if(dulieu.data.nganh){
                setMaNganh(dulieu.data.nganh.id_nganh);
            }
        }catch(error){
            console.log(error);
        }
    }

    const [dsGvNganh, setDsGvNganh] = useState<GiangVien[]>([]);
    const [dsSvNganh, setDsSvNganh] = useState<SinhVien[]>([]);

    const layDsGvSvTheoNganh = async (maNganh: string) => {
        try {
            // Lấy danh sách Giảng viên
            const dsGv = await ketNoiAxios.get(`/tbm/ds-giangvien/${maNganh}`);
            if (dsGv.data.ds_giangvien) {
                setDsGvNganh(dsGv.data.ds_giangvien);
            }

            // Lấy danh sách Sinh viên
            const dsSv = await ketNoiAxios.get(`/tbm/ds-sinhvien/${maNganh}`); 
            if (dsSv.data.ds_sinhvien) {
                setDsSvNganh(dsSv.data.ds_sinhvien);
            }
        } catch (error) {
            console.error('Lỗi khi lấy DS GV/SV theo ngành:', error);
        }
    }
    const [idHocKy, setIdHocKy] = useState<string>('');
    const [ktraChonHocKy, setKtraChonHocKy] = useState<boolean>(false);

    useEffect(() => {
        if (nguoiDung?.id_nguoidung) {
            layNganhCuaTBM(String(nguoiDung.id_nguoidung));
        }
        if (nguoiDung && nguoiDung.hoc_kys) {
            setDsHocKyTBM(nguoiDung.hoc_kys);
        } else {
            setDsHocKyTBM([]);
        }
    }, [nguoiDung]);

    useEffect(() => {
        if (maNganh !== '') {
            layDsGvSvTheoNganh(maNganh);
        }
    }, [maNganh]); 

    
    const [dsGvDaLoc, setDsGvDaLoc] = useState<GiangVien[]>([]);
    const [dsSvDaLoc, setDsSvDaLoc] = useState<SinhVien[]>([]);

    useEffect(() => {

        let gvLoc = dsGvNganh;
        let svLoc = dsSvNganh;
        if(idHocKy){
            gvLoc = dsGvNganh.filter((gv) => 
                gv.nguoi_dung.hoc_kys?.some((hk) => hk.id_hocky === idHocKy)
            );
            setDsGvDaLoc(gvLoc);

            svLoc = dsSvNganh.filter((sv) => 
                sv.nguoi_dung.hoc_kys?.some((hk) => hk.id_hocky === idHocKy)
            );
            setDsSvDaLoc(svLoc);

            setKtraChonHocKy(true);


        } else {
            setKtraChonHocKy(false);
            setDsGvDaLoc(dsGvNganh); 
            setDsSvDaLoc(dsSvNganh);
        }
    }, [idHocKy, dsGvNganh, dsSvNganh]);

    

    return (
        <div className="trang-phancong-gvsv flex-col">
            <div className="chon-loai-phancong flex-row">
                <span className={`chon ${loaiPhanCong ? 'phancong-ngaunhien' : ''}`} onClick={() => xuLyChonLoaiPhanCong(true)}>Phân Công Ngẫu Nhiên</span>
                <span className={`chon ${!loaiPhanCong ? 'phancong-thucong' : ''}`} onClick={() => xuLyChonLoaiPhanCong(false)}>Phân Công Thủ Công</span>
            </div>
            <div className="khung-phancong-gvsv flex-row">
                {loaiPhanCong ? (
                    <form className="khung-phancong-ngaunhien flex-row">
                        <div className="khung-ds-nguoidung flex-row">
                            <div className="khung-ds ds-giangvien flex-col">
                                <div className="tieude-menu flex-row">
                                    <h4>Danh Sách Giảng Viên Hướng Dẫn</h4>
                                    <span>SL: {dsGvDaLoc.length}</span>
                                </div>
                               
                                <table className="ds-nguoidung">
                                    <thead>
                                        <tr>
                                            <th className="cot-stt">STT</th>
                                            <th className="cot-ten">Họ Tên</th>
                                            <th className="cot-hhhv">Học Hàm Học Vị</th>
                                        </tr>
                                    </thead>
                                    <tbody className="flex-col">
                                        {dsGvDaLoc.map((gv, index) => (
                                            <tr key={gv.id_giangvien}>
                                                <td className="cot-stt">{index + 1}</td>
                                                <td className="cot-ten">{gv.nguoi_dung.ho_ten}</td>
                                                <td className="cot-hhhv">{gv.hoc_ham_hoc_vi}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="khung-ds ds-sinhvien flex-col">
                                <div className="tieude-menu flex-row">
                                    <h4>Danh Sách Sinh Viên</h4>
                                    <span>SL: {dsSvDaLoc.length}</span>
                                </div>
                                <table className="ds-nguoidung">
                                    <thead>
                                        <tr>
                                            <th className="cot-stt">STT</th>
                                            <th className="cot-ten">Họ Tên</th>
                                            <th className="cot-msv">Mã SV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="flex-col">
                                        {dsSvDaLoc.map((sv, index) => (
                                            <tr key={sv.id_sinhvien}>
                                                <td className="cot-stt">{index + 1}</td>
                                                <td className="cot-ten">{sv.nguoi_dung.ho_ten}</td>
                                                <td className="cot-msv">{sv.msv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="khung-chucnang-phancong flex-col">
                            <div className="khung-chon-hocky flex-row">
                                <label htmlFor="id_hocky">* Chọn Học Kỳ</label>
                                <select className="chon-hocky-phancong" name="id_hocky" id="id_hocky"
                                    onChange={(e) => setIdHocKy(e.target.value)}
                                    value={idHocKy}
                                >
                                    <option value="">Tất cả</option>
                                    {ds_hockyTBM.map((hocky) => (
                                        <option key={hocky.id_hocky} value={hocky.id_hocky}>{hocky.ten_hoc_ky}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="khung-tienhanh-phancong">
                                <button className={`nut-phancong ${ktraChonHocKy ? '' : 'disabled'}`} type="submit" disabled={!ktraChonHocKy}>Tiến Hành Phân Công</button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form className="khung-phancong-thucong flex-row">
                        <div className="khung-ds-nguoidung flex-row">
                            <div className="khung-ds ds-giangvien flex-col">
                                <div className="tieude-menu flex-row">
                                    <h4>Danh Sách Giảng Viên Hướng Dẫn</h4>
                                    <span>SL: {dsGvDaLoc.length}</span>
                                </div>
                               
                                <table className="ds-nguoidung">
                                    <thead>
                                        <tr>
                                            <th className="cot-chon flex-row">
                                                <input type="checkbox" name="idGvs" id="idGvs" />
                                                <label htmlFor="idGvs">All</label>
                                            </th>
                                            <th className="cot-ten">Họ Tên</th>
                                            <th className="cot-hhhv">Học Hàm Học Vị</th>
                                        </tr>
                                    </thead>
                                    <tbody className="flex-col">
                                        {dsGvDaLoc.map((gv) => (
                                            <tr key={gv.id_giangvien}>
                                                <td className="cot-chon">
                                                    <input type="checkbox" name="idGv" value={gv.id_giangvien} />
                                                </td>
                                                <td className="cot-ten">{gv.nguoi_dung.ho_ten}</td>
                                                <td className="cot-hhhv">{gv.hoc_ham_hoc_vi}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="khung-ds ds-sinhvien flex-col">
                                <div className="tieude-menu flex-row">
                                    <h4>Danh Sách Sinh Viên</h4>
                                    <span>SL: {dsSvDaLoc.length}</span>
                                </div>
                                <table className="ds-nguoidung">
                                    <thead>
                                        <tr>
                                            <th className="cot-chon flex-row">
                                                <input type="checkbox" name="idSvs" id="idSvs" />
                                                <label htmlFor="idSvs">All</label>
                                            </th>
                                            <th className="cot-ten">Họ Tên</th>
                                            <th className="cot-msv">Mã SV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="flex-col">
                                        {dsSvDaLoc.map((sv) => (
                                            <tr key={sv.id_sinhvien}>
                                                <td className="cot-chon">
                                                    <input type="checkbox" name="idSv" value={sv.id_sinhvien} />
                                                </td>
                                                <td className="cot-ten">{sv.nguoi_dung.ho_ten}</td>
                                                <td className="cot-msv">{sv.msv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="khung-chucnang-phancong flex-col">
                            <div className="khung-chon-hocky flex-row">
                                <label htmlFor="id_hocky">* Chọn Học Kỳ</label>
                                <select className="chon-hocky-phancong" name="id_hocky" id="id_hocky"
                                    onChange={(e) => setIdHocKy(e.target.value)}
                                    value={idHocKy}
                                >
                                    <option value="">Tất cả</option>
                                    {ds_hockyTBM.map((hocky) => (
                                        <option key={hocky.id_hocky} value={hocky.id_hocky}>{hocky.ten_hoc_ky}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="khung-tienhanh-phancong">
                                <button className={`nut-phancong ${ktraChonHocKy ? '' : 'disabled'}`} type="submit" disabled={!ktraChonHocKy}>Tiến Hành Phân Công</button>
                            </div>
                        </div>
                    </form>
                )}
                
            </div>
        </div>
    );
}

export default PhanCongGvSv;