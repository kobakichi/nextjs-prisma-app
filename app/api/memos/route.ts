import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const memos = await prisma.memo.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(memos);
  } catch (error) {
    return NextResponse.json(
      { error: "メモの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    const memo = await prisma.memo.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(memo);
  } catch (error) {
    return NextResponse.json(
      { error: "メモの作成に失敗しました" },
      { status: 500 }
    );
  }
}
