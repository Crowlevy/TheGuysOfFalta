//o foda aqui é que a gente não tem controle direto sobre variáveis de feriado ou que do nada tenha uma greve
import { prisma } from '@/lib/db/prisma';
import { format, startOfDay, subHours } from 'date-fns';
import { BadgeService } from './badge-service';
import { toBrazilianTimezone } from '@/lib/utils/date-utils';

export class AttendanceService {
  static async checkAndUpdateBrokenStreaks(): Promise<number> {
    const timeZone = 'America/Sao_Paulo';
    const now = new Date();
    const brazilTime = toBrazilianTimezone(now);

    const yesterday = new Date(brazilTime);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    const users = await prisma.user.findMany();
    let updatedCount = 0;

    for (const user of users) {
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId: user.id,
          date: yesterdayStr
        }
      });

      if (!attendance && user.currentStreak > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { currentStreak: 0 }
        });
        updatedCount++;
      }
    }

    return updatedCount;
  }

  static async registerAttendance(userId: string) {
    const now = new Date();
    console.log('Data atual (UTC):', now.toISOString());
    
    // Converter para o fuso horário de São Paulo
    const brazilTime = toBrazilianTimezone(now);
    console.log('Data no fuso de São Paulo:', format(brazilTime, 'yyyy-MM-dd HH:mm:ss'));
    console.log('Hora São Paulo:', format(brazilTime, 'HH:mm:ss'));
    console.log('Dia da semana:', brazilTime.getDay(), '(0 = Domingo, 1 = Segunda, etc)');
    
    // Garantir que estamos trabalhando com o início do dia no fuso horário correto
    const todayStart = startOfDay(brazilTime);
    const todayStr = format(todayStart, 'yyyy-MM-dd');
    console.log('Data início do dia:', todayStr);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: todayStr
      }
    });

    if (existingAttendance) {
      console.log('Presença já registrada para a data:', existingAttendance.date);
      throw new Error('Você já registrou presença hoje');
    }

    const lastAttendance = await prisma.attendance.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    console.log('Última presença registrada:', lastAttendance?.date);

    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      throw new Error('Usuário não encontrado');
    }

    let currentStreak = 1;
    let shouldResetStreak = true;

    if (lastAttendance) {
      const yesterday = new Date(todayStart);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
      console.log('Data de ontem:', yesterdayStr);
      console.log('Última presença:', lastAttendance.date);

      if (lastAttendance.date === yesterdayStr) {
        currentStreak = currentUser.currentStreak + 1;
        shouldResetStreak = false;
        console.log('Streak mantido! Novo valor:', currentStreak);
      } else {
        console.log('Streak resetado! Última presença não foi ontem');
      }
    }

    // Criar presença com a data em string (YYYY-MM-DD) e checkIn como DateTime
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: todayStr,
        isHoliday: false,
        checkIn: brazilTime,
        location: 'Joviano de Aguiar'
      }
    });

    console.log('Nova presença registrada:', {
      date: attendance.date,
      checkIn: format(attendance.checkIn, 'HH:mm:ss'),
      userId: attendance.userId
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: shouldResetStreak ? 1 : currentStreak,
        maxStreak: shouldResetStreak ? currentUser.maxStreak : Math.max(currentStreak, currentUser.maxStreak),
        totalDays: {
          increment: 1
        }
      }
    });

    const weeklyDays = await this.getWeeklyDays(userId);
    const monthlyDays = await this.getMonthlyDays(userId);
    const isWeekend = brazilTime.getDay() === 0 || brazilTime.getDay() === 6;

    await BadgeService.checkAndAwardBadges({
      userId,
      currentStreak: updatedUser.currentStreak,
      totalDays: updatedUser.totalDays,
      weeklyDays,
      monthlyDays,
      isWeekend,
      isRainyDay: false,
      isHoliday: false,
      arrivalTime: brazilTime,
      lastLocation: 'Joviano de Aguiar'
    });

    return {
      attendance,
      currentStreak: updatedUser.currentStreak,
      totalDays: updatedUser.totalDays
    };
  }

  static async getWeeklyDays(userId: string): Promise<number> {
    const now = new Date();
    const brazilTime = toBrazilianTimezone(now);
    const startOfWeek = new Date(brazilTime);
    startOfWeek.setDate(brazilTime.getDate() - brazilTime.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return prisma.attendance.count({
      where: {
        userId,
        date: {
          gte: format(startOfWeek, 'yyyy-MM-dd'),
          lte: format(brazilTime, 'yyyy-MM-dd')
        }
      }
    });
  }

  static async getMonthlyDays(userId: string): Promise<number> {
    const now = new Date();
    const brazilTime = toBrazilianTimezone(now);
    const startOfMonth = new Date(brazilTime.getFullYear(), brazilTime.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    return prisma.attendance.count({
      where: {
        userId,
        date: {
          gte: format(startOfMonth, 'yyyy-MM-dd'),
          lte: format(brazilTime, 'yyyy-MM-dd')
        }
      }
    });
  }

  private static async isHoliday(date: string): Promise<boolean> {
    return false;
  }

  private static async isRainyDay(): Promise<boolean> {
    return false;
  }

  static async getAttendanceStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attendances: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const [weeklyDays, monthlyDays] = await Promise.all([
      this.getWeeklyDays(userId),
      this.getMonthlyDays(userId)
    ]);

    return {
      currentStreak: user.currentStreak,
      maxStreak: user.maxStreak,
      totalDays: user.totalDays,
      weeklyDays,
      monthlyDays,
      recentAttendances: user.attendances
    };
  }

  static async getAttendanceHistory(userId: string) {
    return prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
  }
}