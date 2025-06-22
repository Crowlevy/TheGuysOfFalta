import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { badges } from "@/lib/constants/badges";
import { BadgeType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Buscar usuário e suas estatísticas
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        maxStreak: true,
        totalDays: true,
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Obter IDs das conquistas já ganhas
    const earnedBadgeIds = user.badges.map(ub => ub.badge.id);

    // Mapear todas as conquistas com seu progresso
    const badgesWithProgress = badges.map(badge => {
      let progress = 0;

      switch (badge.type) {
        case BadgeType.STREAK:
          progress = Math.min(Math.round((user.currentStreak / badge.threshold) * 100), 100);
          break;
        case BadgeType.TOTAL_DAYS:
          progress = Math.min(Math.round((user.totalDays / badge.threshold) * 100), 100);
          break;
        case BadgeType.CONSISTENCY:
          // Progresso baseado no tipo específico de consistência
          switch (badge.name) {
            case "Semana Perfeita":
              progress = Math.min(Math.round((user.currentStreak / 5) * 100), 100);
              break;
            case "Mês Dourado":
              progress = Math.min(Math.round((user.totalDays / 20) * 100), 100);
              break;
          }
          break;
        case BadgeType.SPECIAL:
          // Conquistas especiais têm progresso binário (0 ou 100)
          progress = earnedBadgeIds.includes(badge.id) ? 100 : 0;
          break;
      }

      return {
        ...badge,
        earned: earnedBadgeIds.includes(badge.id),
        progress
      };
    });

    return NextResponse.json(badgesWithProgress);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 