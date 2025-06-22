import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || "1", 10);
    const pageSize = parseInt(searchParams.get('pageSize') || "10", 10);
    const orderBy = searchParams.get('orderBy') || "currentStreak";

    const skip = (page - 1) * pageSize;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        currentStreak: true,
        maxStreak: true,
        totalDays: true,
      },
      orderBy: [
        { 
          [orderBy === "currentStreak" ? "currentStreak" : 
           orderBy === "maxStreak" ? "maxStreak" : "totalDays"]: 'desc' 
        },
        { name: 'asc' }
      ],
      skip,
      take: pageSize,
    });

    //contar total de usuários para metadados de paginação
    const totalCount = await prisma.user.count();

    //formatar os dados para o cliente
    const formattedUsers = users.map((user, index) => ({
      position: skip + index + 1,
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      currentStreak: user.currentStreak,
      maxStreak: user.maxStreak,
      totalDays: user.totalDays,
      isCurrentUser: user.id === session.user.id,
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Erro ao obter ranking:", error);
    
    return NextResponse.json(
      { error: "Erro ao obter ranking", message: error.message },
      { status: 500 }
    );
  }
} 