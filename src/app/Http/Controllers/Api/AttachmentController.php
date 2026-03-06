<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Security: ตรวจสอบ MIME Type และขนาดไฟล์ (ไม่เกิน 5MB)
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:5120', // 5MB
                'mimes:jpg,jpeg,png,pdf,docx,zip' // อนุญาตเฉพาะไฟล์ที่ปลอดภัย
            ],
            'task_id' => 'required|exists:tasks,id'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // 2. Storage: เก็บไฟล์ลงในโฟลเดอร์ attachments ภายใต้ public disk
            // Laravel จะทำการ Hash ชื่อไฟล์ให้โดยอัตโนมัติเพื่อความปลอดภัย
            $path = $file->store('attachments', 'public');

            // 3. Database: บันทึกข้อมูลไฟล์ลง DB
            $attachment = Attachment::create([
                'file_name' => $file->getClientOriginalName(), // ชื่อเดิมที่ user เห็น
                'file_path' => $path,                          // ที่อยู่ที่ไฟล์ถูกเก็บจริง
                'file_type' => $file->getMimeType(),          // MIME Type จริงจากเนื้อหาไฟล์
                'task_id' => $request->task_id,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully',
                'data' => $attachment
            ], 201);
        }


        return response()->json(['message' => 'File not found'], 400);
    }
    public function destroy($id)
    {
        $attachment = Attachment::findOrFail($id);

        // 1. Security Check: เช็คสิทธิ์ก่อนลบ
        if ($attachment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. เริ่ม Transaction
        DB::beginTransaction();

        try {
            // ดึง Path เก็บไว้ก่อนลบ record
            $filePath = $attachment->file_path;

            // ลบข้อมูลใน Database
            $attachment->delete();

            // ลบไฟล์จริงใน Storage
            if (Storage::disk('public')->exists($filePath)) {
                if (!Storage::disk('public')->delete($filePath)) {
                    // ถ้าลบไฟล์ใน Disk ไม่สำเร็จ ให้สั่งข้ามไปที่ catch เพื่อ Rollback
                    throw new \Exception('Could not delete file from disk');
                }
            }

            // ถ้าทำงานมาถึงจุดนี้ได้ แสดงว่าผ่านฉลุยทั้งคู่ สั่งบันทึกถาวร!
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Attachment and physical file deleted successfully'
            ]);

        } catch (\Exception $e) {
            // หากเกิด Error อะไรก็ตามใน try ให้สั่งยกเลิกทุกอย่าง (Rollback) 
            // ข้อมูลใน DB ที่ถูกลบไปจะเด้งกลับมาเหมือนเดิม
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete attachment: ' . $e->getMessage()
            ], 500);
        }
    }
}

