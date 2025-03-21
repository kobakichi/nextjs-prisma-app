// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ユーザー情報の更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const { name, email } = await request.json();

  const updateUser = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  return NextResponse.json(updateUser);
}
