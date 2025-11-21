<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->uuid('id_nguoidung')->primary(); 
            $table->string('email')->unique();
            $table->string('mat_khau')->nullable();
            $table->string('ho_ten');
            $table->string('so_dien_thoai', 20)->nullable(); 
            $table->string('dia_chi')->nullable(); 
            $table->boolean('gioi_tinh')->default(true); // true: Nam, false: Nữ
            $table->boolean('trang_thai')->default(true);
            $table->timestamps(); 
        });

        Schema::create('vai_tro', function (Blueprint $table) {
            $table->string('id_vaitro', 10)->primary();
            $table->string('ten_hien_thi');
            $table->text('mo_ta')->nullable(); 
            $table->timestamps(); 
        });


        Schema::create('nguoidung_vaitro', function (Blueprint $table) {
            $table->uuid('ma_nguoidung');
            $table->string('ma_vaitro', 10);
            $table->primary(['ma_nguoidung', 'ma_vaitro']);
            $table->timestamps();

            $table->foreign('ma_nguoidung')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');

            $table->foreign('ma_vaitro')
                ->references('id_vaitro')
                ->on('vai_tro')
                ->onDelete('cascade');
        });

        Schema::create('bai_dang', function (Blueprint $table){
            $table->uuid('id_baidang')->primary();
            $table->uuid('ma_phongdaotao');
            $table->string('tieu_de');
            $table->text('noi_dung');
            $table->string('duong_dan_tep')->nullable();
            $table->timestamps();

            $table->foreign('ma_phongdaotao')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');
        });

        Schema::create('hoc_ky_dk', function (Blueprint $table) {
            $table->uuid('id_hocky')->primary(); 
            $table->string('ten_hoc_ky')->unique();
            $table->timestamps(); 
        });

        Schema::create('ds_sinhvien_giangvien', function (Blueprint $table){
            $table->uuid('id_danhsach')->primary();
            $table->uuid('ma_hocky');
            $table->uuid('ma_phongdaotao');
            $table->string('duong_dan_tep');
            $table->timestamps();

            $table->foreign('ma_hocky')
                ->references('id_hocky')
                ->on('hoc_ky_dk')
                ->onDelete('cascade');
            
            $table->foreign('ma_phongdaotao')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');
        });


        Schema::create('nguoidung_hocky', function (Blueprint $table) {
            $table->uuid('ma_nguoidung');
            $table->uuid('ma_hocky');
            $table->primary(['ma_nguoidung', 'ma_hocky']);
            $table->timestamps(); 

            $table->foreign('ma_nguoidung')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');

            $table->foreign('ma_hocky')
                ->references('id_hocky')
                ->on('hoc_ky_dk')
                ->onDelete('cascade');
        });


        Schema::create('khoa', function (Blueprint $table) {
            $table->uuid('id_khoa')->primary(); 
            $table->string('ten_khoa')->unique();
            $table->timestamps(); 
        });

        Schema::create('nganh', function (Blueprint $table) {
            $table->uuid('id_nganh')->primary(); 
            $table->uuid('ma_khoa');
            $table->string('ten_nganh')->unique();
            $table->string('ky_hieu')->unique();
            $table->timestamps(); 

            $table->foreign('ma_khoa')
                ->references('id_khoa')
                ->on('khoa')
                ->onDelete('cascade');
        });

        Schema::create('lop_sinh_hoat', function (Blueprint $table) {
            $table->uuid('id_lop')->primary(); 
            $table->uuid('ma_nganh');
            $table->string('ten_lop')->unique();
            $table->timestamps(); 

            $table->foreign('ma_nganh')
                ->references('id_nganh')
                ->on('nganh')
                ->onDelete('cascade');
        });

        Schema::create('sinh_vien', function (Blueprint $table) {
            $table->uuid('id_sinhvien')->primary(); 
            $table->uuid('ma_lop');
            $table->string('msv')->unique();
            $table->timestamps(); 

            $table->foreign('id_sinhvien')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');

            $table->foreign('ma_lop')
                ->references('id_lop')
                ->on('lop_sinh_hoat')
                ->onDelete('cascade');
        });


        Schema::create('giang_vien', function (Blueprint $table){
            $table->uuid('id_giangvien')->primary();
            $table->uuid('ma_nganh');
            $table->string('hoc_ham_hoc_vi')->nullable();
            $table->timestamps();

            $table->foreign('id_giangvien')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');

            $table->foreign('ma_nganh')
                ->references('id_nganh')
                ->on('nganh')
                ->onDelete('cascade');
        });


        Schema::create('phan_cong', function (Blueprint $table) {
            $table->uuid('id_phancong')->primary(); 
            $table->uuid('ma_truongbomon');
            $table->uuid('ma_giangvien');
            $table->uuid('ma_sinhvien')->unique();
            $table->timestamps(); 

            $table->foreign('ma_truongbomon')
                ->references('id_giangvien')
                ->on('giang_vien')
                ->onDelete('cascade');


            $table->foreign('ma_giangvien')
                ->references('id_giangvien')
                ->on('giang_vien')
                ->onDelete('cascade');


            $table->foreign('ma_sinhvien')
                ->references('id_sinhvien')
                ->on('sinh_vien')
                ->onDelete('cascade');
        });


        Schema::create('nhom_do_an', function (Blueprint $table){
            $table->uuid('id_nhom')->primary();
            $table->uuid('ma_nguoitao');
            $table->uuid('ma_sinhvien');
            // $table->uuid('ma_thanhvien');
            $table->string('ten_nhom');
            $table->timestamps();

            $table->foreign('ma_nguoitao')
                ->references('id_giangvien')
                ->on('giang_vien')
                ->onDelete('cascade');


            $table->foreign('ma_sinhvien')
                ->references('id_sinhvien')
                ->on('sinh_vien')
                ->onDelete('cascade');
        });


        Schema::create('nhiem_vu', function (Blueprint $table) {
            $table->uuid('id_nhiemvu')->primary();
            $table->uuid('ma_nhom');
            $table->string('ten_nhiemvu');
            $table->datetime('han_nop');
            $table->timestamps();

            $table->foreign('ma_nhom')
                ->references('id_nhom')
                ->on('nhom_do_an')
                ->onDelete('cascade');
        });


        Schema::create('tin_nhan_nhom', function (Blueprint $table){
            $table->uuid('id_tinhan')->primary();
            $table->uuid('ma_nhom');
            $table->uuid('ma_nguoigui');
            $table->text('noi_dung');
            $table->string('duong_dan_tep')->nullable();
            $table->boolean('da_xem')->default(false);
            $table->boolean('tinnhan_ghim')->default(false);
            $table->boolean('tinnhan_xoa')->default(false);
            $table->timestamps();

            $table->foreign('ma_nhom')
                ->references('id_nhom')
                ->on('nhom_do_an')
                ->onDelete('cascade');

        });

        Schema::create('de_tai', function (Blueprint $table){
            $table->uuid('id_detai')->primary();
            $table->uuid('ma_sinhvien')->unique();
            $table->uuid('ma_nhom');
            $table->string('ten_detai');
            $table->text('mo_ta')->nullable();
            $table->string('duong_dan_tep')->nullable();
            $table->enum('trang_thai', ['chờ duyệt','không duyệt','đã duyệt','đang thực hiện','chờ bảo vệ','đã bảo vệ'])->default('chờ duyệt');
            $table->timestamps();

            $table->foreign('ma_sinhvien')
                ->references('id_sinhvien')
                ->on('sinh_vien')
                ->onDelete('cascade');

            $table->foreign('ma_nhom')
                ->references('id_nhom')
                ->on('nhom_do_an')
                ->onDelete('cascade');
        });

        Schema::create('ket_qua_DATN', function (Blueprint $table){
            $table->uuid('id_ketqua')->primary();
            $table->uuid('ma_hocky');
            $table->uuid('ma_truongbomon');
            $table->uuid('ma_detai');
            $table->float('ket_qua')->nullable();
            $table->timestamps();


            $table->foreign('ma_hocky')
                ->references('id_hocky')
                ->on('hoc_ky_dk')
                ->onDelete('cascade');

            $table->foreign('ma_truongbomon')
                ->references('id_giangvien')
                ->on('giang_vien')
                ->onDelete('cascade');

            $table->foreign('ma_detai')
                ->references('id_detai')
                ->on('de_tai')
                ->onDelete('cascade');
        });

        Schema::create('bao_cao', function (Blueprint $table) {
            $table->uuid('id_baocao')->primary();
            $table->uuid('ma_truongbomon');
            $table->uuid('ma_phongdaotao');
            $table->string('duong_dan_tep')->nullable();
            $table->timestamps();

            $table->foreign('ma_truongbomon')
                ->references('id_giangvien')
                ->on('giang_vien')
                ->onDelete('cascade');

            $table->foreign('ma_phongdaotao')
                ->references('id_nguoidung')
                ->on('nguoi_dung')
                ->onDelete('cascade');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bao_cao');
        Schema::dropIfExists('ket_qua_DATN');
        Schema::dropIfExists('de_tai');
        Schema::dropIfExists('tin_nhan_nhom');
        Schema::dropIfExists('nhiem_vu');
        Schema::dropIfExists('nhom_do_an');
        Schema::dropIfExists('phan_cong');
        Schema::dropIfExists('giang_vien');
        Schema::dropIfExists('sinh_vien');
        Schema::dropIfExists('lop_sinh_hoat');
        Schema::dropIfExists('nganh');
        Schema::dropIfExists('khoa');
        Schema::dropIfExists('nguoidung_hocky');
        Schema::dropIfExists('ds_sinhvien_giangvien');
        Schema::dropIfExists('hoc_ky_dk');
        Schema::dropIfExists('bai_dang');
        Schema::dropIfExists('vai_tro');
        Schema::dropIfExists('nguoi_dung');
    }
};
