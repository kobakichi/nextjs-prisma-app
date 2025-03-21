// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => new PrismaClient();

declare global {
  var prisma: undefined | ReturnType<typeof PrismaClientSingleton>;
}

const prisma = global.prisma ?? PrismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
