<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        // ถ้ามี Cookie ที่ชื่อ 'token' ส่งมาด้วย
        if ($request->hasCookie('token')) {
            // ให้หยิบค่าจาก Cookie ไปยัดใส่ Header Authorization อัตโนมัติ
            $request->headers->set('Authorization', 'Bearer ' . $request->cookie('token'));
        }

        return $next($request);
    }
}