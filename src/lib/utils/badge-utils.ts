import { BadgeType, Attendance, Badge, UserBadge } from "@prisma/client";
import { isWeekend, isBefore, parseISO, differenceInDays, isSameDay } from "date-fns";
import { badges } from "../constants/badges";

export type BadgeWithProgress = Badge & {
    earned: boolean;
    earnedAt: Date | null;
    progress: number;
};

export const checkStreakBadges = (currentStreak: number) => {
    return badges
        .filter(badge => badge.type === BadgeType.STREAK)
        .map(badge => ({
            ...badge,
            earned: currentStreak >= badge.threshold,
            progress: Math.min(Math.round((currentStreak / badge.threshold) * 100), 100)
        }));
};

export const checkTotalDaysBadges = (totalDays: number) => {
    return badges
        .filter(badge => badge.type === BadgeType.TOTAL_DAYS)
        .map(badge => ({
            ...badge,
            earned: totalDays >= badge.threshold,
            progress: Math.min(Math.round((totalDays / badge.threshold) * 100), 100)
        }));
};

export const checkConsistencyBadges = (attendances: Attendance[]) => {
    return badges
        .filter(badge => badge.type === BadgeType.CONSISTENCY)
        .map(badge => {
            let earned = false;
            let progress = 0;

            switch (badge.id) {
                case "consistency-1": //semana perfeita
                    const weekdayAttendances = attendances.filter(a => !isWeekend(new Date(a.date)));
                    earned = weekdayAttendances.length >= 5;
                    progress = Math.min(Math.round((weekdayAttendances.length / 5) * 100), 100);
                    break;

                case "consistency-2": //mes exemplar
                    const monthlyAttendances = attendances.filter(a => !isWeekend(new Date(a.date)));
                    earned = monthlyAttendances.length >= 20;
                    progress = Math.min(Math.round((monthlyAttendances.length / 20) * 100), 100);
                    break;

                case "consistency-3": //pontualidade max
                    const earlyAttendances = attendances.filter(a => {
                        const checkInTime = a.checkIn;
                        const limit = new Date(checkInTime);
                        limit.setHours(7, 0, 0);
                        return isBefore(checkInTime, limit);
                    });
                    earned = earlyAttendances.length >= 5;
                    progress = Math.min(Math.round((earlyAttendances.length / 5) * 100), 100);
                    break;

                case "consistency-4": //dedicação total
                    const consecutiveWeeks = getConsecutiveWeeks(attendances);
                    earned = consecutiveWeeks >= 4;
                    progress = Math.min(Math.round((consecutiveWeeks / 4) * 100), 100);
                    break;
            }

            return {
                ...badge,
                earned,
                progress
            };
        });
};

export const checkSpecialBadges = (attendances: Attendance[]) => {
    return badges
        .filter(badge => badge.type === BadgeType.SPECIAL)
        .map(badge => {
            let earned = false;
            let progress = 0;

            switch (badge.id) {
                case "special-1": // madrugador
                    earned = attendances.some(a => {
                        const checkInTime = a.checkIn;
                        const limit = new Date(checkInTime);
                        limit.setHours(7, 0, 0);
                        return isBefore(checkInTime, limit);
                    });
                    progress = earned ? 100 : 0;
                    break;

                case "special-2": // fim de semana
                    earned = attendances.some(a => isWeekend(new Date(a.date)));
                    progress = earned ? 100 : 0;
                    break;

                case "special-3": // desafiador do clima
                    earned = attendances.some(a => a.weather && a.weather.includes("rain"));
                    progress = earned ? 100 : 0;
                    break;

                case "special-4": // explorador
                    const uniqueLocations = new Set(attendances.map(a => a.location)).size;
                    earned = uniqueLocations >= 3;
                    progress = Math.min(Math.round((uniqueLocations / 3) * 100), 100);
                    break;

                case "special-5": // feriado dedicado
                    earned = attendances.some(a => a.isHoliday);
                    progress = earned ? 100 : 0;
                    break;
            }

            return {
                ...badge,
                earned,
                progress
            };
        });
};

//função auxiliar para calcular semanas consecutivas
const getConsecutiveWeeks = (attendances: Attendance[]) => {
    if (attendances.length === 0) return 0;

    const dates = attendances
        .map(a => new Date(a.date))
        .sort((a, b) => a.getTime() - b.getTime());

    let consecutiveWeeks = 0;
    let currentWeek = new Set<number>();
    let lastDate = dates[0];

    dates.forEach(date => {
        const daysDiff = differenceInDays(date, lastDate);

        if (daysDiff > 7) {
            // Reset if gap is more than a week
            consecutiveWeeks = 0;
            currentWeek = new Set();
        } else if (!isSameDay(date, lastDate)) {
            if (daysDiff <= 7) {
                currentWeek.add(date.getDay());
                if (currentWeek.size >= 5) {
                    consecutiveWeeks++;
                    currentWeek = new Set();
                }
            }
        }

        lastDate = date;
    });

    return consecutiveWeeks;
}; 