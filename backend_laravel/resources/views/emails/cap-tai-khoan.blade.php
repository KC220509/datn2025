<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông Báo Cấp Tài Khoản</title>
</head>
<body>
<div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <div class="email-title" style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 24px; color: #333;">Xin chào</h3>
        <h1 style="margin: 10px 0; font-size: 28px; color: #4070f4;">{{ $nguoiDung->ho_ten }}</h1>
    </div>
    <p style="font-size: 16px; line-height: 1.5; color: #555;">Email đăng nhập: <strong>{{ $nguoiDung->email }}</strong></p>
    <p style="font-size: 16px; line-height: 1.5; color: #555;">Mật khẩu của bạn là: <strong>{{ $matKhau }}</strong></p>
    <p style="font-size: 15px; line-height: 1.5; color: #555;">Hãy đăng nhập và thay đổi mật khẩu để đảm bảo an toàn cho tài khoản của bạn.</p>
    
</div>

</body>
</html>
