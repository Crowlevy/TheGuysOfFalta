import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        currentStreak: true,
        maxStreak: true,
        totalDays: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Calcular ranking do usuário
    const userRank = await calculateUserRank(params.userId);

    return NextResponse.json({
      ...user,
      rank: userRank
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

async function calculateUserRank(userId: string): Promise<number> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      totalDays: true,
    },
    orderBy: {
      totalDays: 'desc',
    },
  });

  const userIndex = users.findIndex(user => user.id === userId);
  return userIndex + 1;
} 