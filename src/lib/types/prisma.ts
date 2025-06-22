import { Prisma } from '@prisma/client';

export type AttendanceWithUser = Prisma.AttendanceGetPayload<{
  include: {
    user: true;
  };
}>;

export type UserWithBadges = Prisma.UserGetPayload<{
  include: {
    badges: {
      include: {
        badge: true;
      };
    };
  };
}>;

export type BadgeWithProgress = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  threshold: number;
  earned: boolean;
  progress: number;
}; 