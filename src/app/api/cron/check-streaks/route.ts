import { NextResponse } from "next/server";
import { AttendanceService } from "@/lib/services/attendance-service";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    //verificar se a requisição veio do cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const updatedCount = await AttendanceService.checkAndUpdateBrokenStreaks();

    return NextResponse.json({
      success: true,
      message: `${updatedCount} streaks foram atualizados`,
      updatedCount
    });
  } catch (error: any) {
    console.error('Erro ao verificar streaks:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar streaks', message: error.message },
      { status: 500 }
    );
  }
} 