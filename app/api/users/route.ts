// app/api/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NestedMiddlewareError } from "next/dist/build/utils";

// GETリクエストの処理
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POSTリクエストの処理
export async function POST(request: Request) {
  const { name, email } = await request.json();
  const user = await prisma.user.create({
    data: { name, email },
  });
  return NextResponse.json(user, { status: 201 });
}
