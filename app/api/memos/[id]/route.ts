import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    const memo = await prisma.memo.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(memo);
  } catch (error) {
    return NextResponse.json(
      { error: "メモの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    await prisma.memo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "メモを削除しました" });
  } catch (error) {
    return NextResponse.json(
      { error: "メモの削除に失敗しました" },
      { status: 500 }
    );
  }
}
