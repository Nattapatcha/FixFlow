<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // 1. ลงทะเบียน Middleware ของเราให้ทำงานในกลุ่ม API
        $middleware->appendToGroup('api', [
            \App\Http\Middleware\JwtFromCookie::class,
        ]);

        // 2. ยกเว้นการเข้ารหัส Cookie ตัวนี้ (เพราะ JWT มีการเข้ารหัสและ Sign ป้องกันการปลอมแปลงในตัวมันเองอยู่แล้ว)
        $middleware->encryptCookies(except: [
            'token',
        ]);

        // 3. ยกเว้น CSRF สำหรับ API (กัน Error 419)
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
