// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod"; // バリデーション用ライブラリ

// リクエストボディの型定義とバリデーションスキーマ
const UpdateUserSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// ユーザー情報の更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // IDの検証
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // リクエストボディの取得と検証
    const body = await request.json();
    const result = UpdateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email }: UpdateUserInput = result.data;

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // ユーザー情報の更新
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// ユーザー削除処理
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ユーザーを削除しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ユーザー削除エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
