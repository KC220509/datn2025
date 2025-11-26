<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ThongBaoTaiKhoanSinhVien extends Mailable
{
    use Queueable, SerializesModels;

    public $nguoiDung;
    public $matKhau;
    public function __construct($nguoiDung, $matKhau)
    {
        $this->nguoiDung = $nguoiDung;
        $this->matKhau = $matKhau;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thông Báo Cấp Tài Khoản Sinh Viên',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cap-tai-khoan',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
