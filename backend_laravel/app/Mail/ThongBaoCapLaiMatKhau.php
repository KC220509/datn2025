<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ThongBaoCapLaiMatKhau extends Mailable
{
    use Queueable, SerializesModels;

    public $nguoiDung;
    public $matKhauMoi;
    public function __construct($nguoiDung, $matKhauMoi)
    {
        $this->nguoiDung = $nguoiDung;
        $this->matKhauMoi = $matKhauMoi;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thông Báo Cấp Lại Mật Khẩu',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cap-lai-mat-khau',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
