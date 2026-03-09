<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    //
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    // 1. พยายามตรวจสอบ User ด้วย JWT
    if (!$token = auth('api')->attempt($credentials)) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // 2. สร้าง Cookie ที่มีคุณสมบัติ HttpOnly
    $cookie = cookie(
        'token',                               // ชื่อ Cookie
        $token,                                // ค่า Token ที่ได้
        auth('api')->factory()->getTTL(),      // อายุ (นาที) เท่ากับค่า TTL ใน config
        '/',                                   // Path
        null,                                  // Domain
        false,                                 // Secure (ถ้าเป็น HTTPS ให้ปรับเป็น true)
        true,                                  // HttpOnly (สำคัญที่สุด! ป้องกัน JavaScript เข้าถึง)
        false,                                 // Raw
        'Lax'                                  // SameSite (ช่วยป้องกัน CSRF)
    );

    // 3. ส่ง JSON กลับไปพร้อมแนบ Cookie (ไม่ต้องส่ง Token ใน Body แล้ว)
    return response()->json([
        'message' => 'Login successful',
        'user' => auth('api')->user()
    ])->withCookie($cookie);
}
}
