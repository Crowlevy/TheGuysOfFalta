import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { isWithinTokenExpiration } from "@/lib/utils/date-utils";
import { AttendanceService } from '@/lib/services/attendance-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const location = body.location || 'Joviano De Aguiar'; //local padrão se não for especificado

    const result = await AttendanceService.registerAttendance(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao registrar presença' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const [history, stats] = await Promise.all([
      AttendanceService.getAttendanceHistory(session.user.id),
      AttendanceService.getAttendanceStats(session.user.id)
    ]);

    return NextResponse.json({
      history,
      stats
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de presença:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de presença' },
      { status: 500 }
    );
  }
}

//função para validar código de presença
//em prod, dá pra implementar uma verificação real contra um código gerado, meio trampo sipa
async function isValidAttendanceCode(code: string): Promise<boolean> {
  //em ambiente real, você verificaria o código em uma tabela de códigos gerados para o dia
  //aqui, é só um exemplo
  //poderia implementar também se o cara tentou marcar num dia não válido e o programa zoar ele
  return code === "PRESENTE";
}

//verificar e conceder conquistas
async function checkAndAssignBadges(userId: string, streak: number, totalDays: number): Promise<void> {
  //buscar todas as insígnias que o usuário ainda não tem
  const badges = await prisma.badge.findMany({
    where: {
      users: {
        none: {
          userId: userId,
        },
      },
    },
  });

  for (const badge of badges) {
    let shouldAward = false;
    
    //verifica se o usuário atingiu a condição para a insígnia
    if (badge.type === "STREAK" && streak >= badge.threshold) {
      shouldAward = true;
    } else if (badge.type === "TOTAL_DAYS" && totalDays >= badge.threshold) {
      shouldAward = true;
    }
    
    if (shouldAward) {
      await prisma.userBadge.create({
        data: {
          userId: userId,
          badgeId: badge.id,
        },
      });
    }
  }
} 