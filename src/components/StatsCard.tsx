"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge, BadgeType } from '@prisma/client';
import { badges } from '@/lib/constants/badges';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, CalendarCheck, Star } from "lucide-react";

interface Stats {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
}

interface BadgeWithStatus extends Badge {
  earned: boolean;
  progress: number;
}

interface GroupedBadges {
  [key: string]: BadgeWithStatus[];
}

interface BadgeWithProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  threshold: number;
  earned: boolean;
  progress: number;
}

const getNextBadge = (type: BadgeType, badges: BadgeWithProgress[] = []) => {
  if (!Array.isArray(badges)) return null;
  const typeBadges = badges.filter(badge => badge.type === type);
  return typeBadges.find(badge => !badge.earned);
};

const getBadgeProgress = (type: BadgeType, badges: BadgeWithProgress[] = []) => {
  if (!Array.isArray(badges)) return 0;
  const nextBadge = getNextBadge(type, badges);
  return nextBadge?.progress || 0;
};

const getEarnedBadgesCount = (type: BadgeType, badges: BadgeWithProgress[] = []) => {
  if (!Array.isArray(badges)) return 0;
  return badges.filter(badge => badge.type === type && badge.earned).length;
};

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);

        const [statsResponse, badgesResponse] = await Promise.all([
          fetch("/api/attendance"),
          fetch(`/api/users/${session.user.id}/badges`)
        ]);

        if (!statsResponse.ok || !badgesResponse.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const [statsData, badgesData] = await Promise.all([
          statsResponse.json(),
          badgesResponse.json()
        ]);

        setStats(statsData.stats);
        setBadges(Array.isArray(badgesData) ? badgesData : []);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-8 w-8 bg-neutral-200 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 bg-neutral-200 rounded"></div>
            <div className="h-28 bg-neutral-200 rounded"></div>
            <div className="h-28 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 border-b border-neutral-200 bg-neutral-50">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Seu Progresso
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/badges"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 transition-colors duration-200 font-medium text-sm"
            >
              <Trophy className="h-4 w-4 mr-2 text-primary-600" />
              Ver Todas as Conquistas
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Streak Atual
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                {getNextBadge(BadgeType.STREAK, badges)?.name || 'Todas conquistas obtidas!'}
              </p>
              <Progress 
                value={getBadgeProgress(BadgeType.STREAK, badges)} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Maior Streak
              </CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.longestStreak}</div>
              <p className="text-xs text-muted-foreground">
                {getNextBadge(BadgeType.STREAK, badges)?.description || 'Continue assim!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Presenças
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDays}</div>
              <p className="text-xs text-muted-foreground">
                {getNextBadge(BadgeType.TOTAL_DAYS, badges)?.name || 'Todas conquistas obtidas!'}
              </p>
              <Progress 
                value={getBadgeProgress(BadgeType.TOTAL_DAYS, badges)} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conquistas Especiais
              </CardTitle>
              <Star className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getEarnedBadgesCount(BadgeType.SPECIAL, badges)}
              </div>
              <p className="text-xs text-muted-foreground">
                {getNextBadge(BadgeType.SPECIAL, badges)?.name || 'Todas conquistas obtidas!'}
              </p>
              <Progress 
                value={getBadgeProgress(BadgeType.SPECIAL, badges)} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 text-sm text-neutral-500">
          <div className="flex items-center mb-2">
            <div className="p-1.5 bg-primary-50 text-primary-500 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Mantenha seu streak registrando presença todos os dias consecutivos. Quanto maior o streak, mais conquistas você desbloqueia!</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 