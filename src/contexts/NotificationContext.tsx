"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Badge } from '@prisma/client';
import BadgeNotification from '@/components/BadgeNotification';

type NotificationContextType = {
  showBadgeNotification: (badge: Badge) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const showBadgeNotification = (badge: Badge) => {
    setActiveBadge(badge);
  };

  return (
    <NotificationContext.Provider value={{ showBadgeNotification }}>
      {children}
      {activeBadge && (
        <BadgeNotification
          badge={activeBadge}
          onClose={() => setActiveBadge(null)}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 