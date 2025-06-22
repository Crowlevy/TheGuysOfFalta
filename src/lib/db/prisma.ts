import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var prisma: PrismaClient | undefined;
}

//prisma client para evitar conexões excessivas durante o desenvolvimento (tá no global então fodase pra prod)
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma; 