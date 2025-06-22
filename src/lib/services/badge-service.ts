import { prisma } from '@/lib/db/prisma';
import { badges } from '../constants/badges';
import { BadgeType, Badge, UserBadge } from '@prisma/client';

interface CheckBadgesParams {
  userId: string;
  currentStreak: number;
  totalDays: number;
  weeklyDays: number;
  monthlyDays: number;
  isWeekend: boolean;
  isRainyDay: boolean;
  isHoliday: boolean;
  arrivalTime: Date;
  lastLocation: string;
}

export class BadgeService {
  /**
   * conquistas user
   */
  static async checkAndAwardBadges(params: CheckBadgesParams): Promise<Badge[]> {
    const {
      userId,
      currentStreak,
      totalDays,
      weeklyDays,
      monthlyDays,
      isWeekend,
      isRainyDay,
      isHoliday,
      arrivalTime,
      lastLocation
    } = params;

    //buscar conquistas já obtidas pelo usuário, vou me matar
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });

    const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

    //verificar cada tipo de conquista
    const newBadges = await Promise.all([
      this.checkStreakBadges(currentStreak, earnedBadgeIds),
      this.checkTotalDaysBadges(totalDays, earnedBadgeIds),
      this.checkConsistencyBadges(weeklyDays, monthlyDays, earnedBadgeIds),
      this.checkSpecialBadges({
        isWeekend,
        isRainyDay,
        isHoliday,
        arrivalTime,
        lastLocation,
        weeklyDays,
        monthlyDays
      }, earnedBadgeIds)
    ]);

    //registrar novas conquistas
    const allNewBadges = newBadges.flat().filter(badge => badge.earned);
    const awardedBadges: Badge[] = [];
    
    for (const badge of allNewBadges) {
      //primeiro, garantir que a badge existe no banco
      const createdBadge = await prisma.badge.upsert({
        where: { id: badge.id },
        create: {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          type: badge.type,
          threshold: badge.threshold
        },
        update: {}
      });

      //aqui depois, criar a relação usuário-badge
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          earnedAt: new Date()
        }
      });

      console.log(`Badge "${badge.name}" concedida para o usuário ${userId}`);
      awardedBadges.push(createdBadge);
    }

    return awardedBadges;
  }

  /**
   * conquistas streak
   */
  private static checkStreakBadges(currentStreak: number, earnedBadgeIds: string[]) {
    return badges
      .filter(badge => badge.type === BadgeType.STREAK)
      .map(badge => ({
        ...badge,
        earned: !earnedBadgeIds.includes(badge.id) && currentStreak >= badge.threshold,
        progress: Math.min(Math.round((currentStreak / badge.threshold) * 100), 100)
      }));
  }

  /**
   *conquistas total de dias
   */
  private static checkTotalDaysBadges(totalDays: number, earnedBadgeIds: string[]) {
    return badges
      .filter(badge => badge.type === BadgeType.TOTAL_DAYS)
      .map(badge => ({
        ...badge,
        earned: !earnedBadgeIds.includes(badge.id) && totalDays >= badge.threshold,
        progress: Math.min(Math.round((totalDays / badge.threshold) * 100), 100)
      }));
  }

  /**
   * conquistas consistência
   */
  private static checkConsistencyBadges(
    weeklyDays: number,
    monthlyDays: number,
    earnedBadgeIds: string[]
  ) {
    return badges
      .filter(badge => badge.type === BadgeType.CONSISTENCY)
      .map(badge => {
        let earned = false;
        let progress = 0;

        switch (badge.name) {
          case "Semana Perfeita":
            earned = !earnedBadgeIds.includes(badge.id) && weeklyDays >= 5;
            progress = Math.min(Math.round((weeklyDays / 5) * 100), 100);
            break;
          case "Mês Dourado":
            earned = !earnedBadgeIds.includes(badge.id) && monthlyDays >= 20;
            progress = Math.min(Math.round((monthlyDays / 20) * 100), 100);
            break;
        }

        return {
          ...badge,
          earned,
          progress
        };
      });
  }

  /**
   *conquistas especiais
   */
  private static checkSpecialBadges(
    params: {
      isWeekend: boolean;
      isRainyDay?: boolean;
      isHoliday?: boolean;
      arrivalTime?: Date;
      lastLocation?: string;
      weeklyDays: number;
      monthlyDays: number;
    },
    earnedBadgeIds: string[]
  ) {
    const today = new Date();
    
    return badges
      .filter(badge => badge.type === BadgeType.SPECIAL)
      .map(badge => {
        let earned = false;
        let progress = 0;

        if (earnedBadgeIds.includes(badge.id)) {
          return { ...badge, earned: false, progress: 0 };
        }

        switch (badge.name) {
          case "Guerreiro de Segunda":
            earned = today.getDay() === 1;
            progress = earned ? 100 : 0;
            break;

          case "Anti-Preguiça":
            earned = params.isHoliday === true;
            progress = earned ? 100 : 0;
            break;

          case "Sem Desculpas":
            earned = params.isRainyDay === true;
            progress = earned ? 100 : 0;
            break;

          case "Maratonista":
            earned = params.isWeekend;
            progress = earned ? 100 : 0;
            break;

          case "Pontual Master":
            if (params.arrivalTime) {
              const hour = params.arrivalTime.getHours();
              const minutes = params.arrivalTime.getMinutes();
              earned = hour < 8 || (hour === 8 && minutes <= 15);
            }
            progress = earned ? 100 : 0;
            break;

          case "Rei do Quincas":
            earned = params.lastLocation === 'Quincas';
            progress = earned ? 100 : 0;
            break;
        }

        return {
          ...badge,
          earned,
          progress
        };
      });
  }

  /**
   * todas as conquistas de um usuário
   */
  static async getUserBadges(userId: string) {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    //mapear todas as badges possíveis com seu status
    return badges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
      return {
        ...badge,
        earned: !!userBadge,
        earnedAt: userBadge?.earnedAt || null
      };
    });
  }
} 