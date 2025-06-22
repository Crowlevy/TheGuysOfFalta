"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDate, getFriendlyDate, toBrazilianTimezone } from "@/lib/utils/date-utils";
import { motion } from "framer-motion";
import { badgeTypes } from "@/lib/constants/theme";
import { format,parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from 'date-fns-tz';

interface Attendance {
  id: string;
  date: string;
  streak: number;
  location: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  earnedAt: string;
}


interface AttendanceWithBadges extends Attendance {
  badges?: Badge[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function AttendanceHistory() {
  const [history, setHistory] = useState<AttendanceWithBadges[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);

        const [historyResponse, badgesResponse] = await Promise.all([
          fetch("/api/attendance"),
          fetch(`/api/users/${session.user.id}/badges`)
        ]);

        if (!historyResponse.ok || !badgesResponse.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const [historyData, badgesData] = await Promise.all([
          historyResponse.json(),
          badgesResponse.json()
        ]);

        //integração futura = (combinar histórico de presença com conquistas ganhas)
        const historyWithBadges = historyData.history.map((attendance: Attendance) => {
          const badges = badgeTypes && badgesData.badges
            ? Object.entries(badgesData.badges as Record<string, Badge[]>).flatMap(([type, badges]) => 
                badges.filter((badge: Badge) => {
                  if (!badge.earnedAt) return false;
                  
                  const badgeDate = new Date(badge.earnedAt);
                  const attendanceDate = new Date(attendance.date);
                  return (
                    badgeDate.getDate() === attendanceDate.getDate() &&
                    badgeDate.getMonth() === attendanceDate.getMonth() &&
                    badgeDate.getFullYear() === attendanceDate.getFullYear()
                  );
                })
              )
            : [];

          return {
            ...attendance,
            badges: badges.length > 0 ? badges : undefined
          };
        });

        setHistory(historyWithBadges);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Filtrar histórico
  const filteredHistory = () => {
    if (filter === 'all') return history;
    
    const now = toBrazilianTimezone(new Date());
    let startDate: Date;
    
    if (filter === 'week') {
      // Início da semana atual (domingo)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Início do mês atual
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return history.filter(item => {
      // A data no item é uma string YYYY-MM-DD
      const itemDate = parseISO(item.date);
      return itemDate >= startDate;
    });
  };

  // Agrupar por mês
  const groupByMonth = (items: AttendanceWithBadges[]) => {
    const grouped: Record<string, AttendanceWithBadges[]> = {};
    
    items.forEach(item => {
      // A data no item é uma string YYYY-MM-DD
      const date = parseISO(item.date);
      console.log('Data no histórico:', {
        original: item.date,
        parseada: format(date, 'yyyy-MM-dd HH:mm:ss', { locale: ptBR })
      });
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(item);
    });
    
    return Object.entries(grouped).map(([key, items]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month);
      
      return {
        month: format(date, 'MMMM yyyy', { locale: ptBR }),
        items
      };
    }).sort((a, b) => {
      // Ordenar do mês mais recente para o mais antigo
      const monthA = parseISO(a.items[0].date).getTime();
      const monthB = parseISO(b.items[0].date).getTime();
      return monthB - monthA;
    });
  };

  const grouped = groupByMonth(filteredHistory());

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-8 w-24 bg-neutral-200 rounded"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-20 bg-neutral-200 rounded"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900">
            Histórico de Presença
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center py-12">
          <div className="p-3 bg-neutral-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-neutral-600 text-center mb-2">
            Nenhum registro de presença encontrado.
          </p>
          <p className="text-neutral-500 text-sm text-center">
            Registre sua presença diariamente para começar a construir seu histórico.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-bold text-neutral-900">
          Histórico de Presença
        </h3>
        
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'month'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'week'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Esta Semana
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-3 bg-neutral-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-neutral-600">
              Nenhum registro encontrado para o período selecionado.
            </p>
          </div>
        ) : (
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {grouped.map((group, groupIndex) => (
              <div key={group.month} className="space-y-4">
                <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                  {group.month}
                </h4>
                
                {group.items.map((attendance, index) => {
                  // A data no item é uma string YYYY-MM-DD
                  const date = parseISO(attendance.date);
                  console.log('Renderizando presença:', {
                    data: attendance.date,
                    parseada: format(date, 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
                    dia: format(date, 'EEEE', { locale: ptBR })
                  });
                  
                  const now = new Date();
                  const isToday = format(now, 'yyyy-MM-dd') === attendance.date;
                  const dayOfWeek = format(date, 'EEEE', { locale: ptBR });
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <motion.div
                      key={attendance.id}
                      className={`border rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-md ${
                        isToday 
                          ? 'border-primary-300 bg-primary-50' 
                          : isWeekend
                            ? 'border-warning-200 bg-warning-50'
                            : 'border-neutral-200 bg-white'
                      }`}
                      variants={itemVariants}
                    >
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-center ${
                              isToday 
                                ? 'bg-primary-100 text-primary-700' 
                                : isWeekend
                                  ? 'bg-warning-100 text-warning-700'
                                  : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              <span className="text-sm font-bold">
                                {format(date, 'd', { locale: ptBR })}
                              </span>
                              <span className="text-xs">
                                {format(date, 'MMM', { locale: ptBR })}
                              </span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium text-neutral-900">
                                  {getFriendlyDate(attendance.date)}
                                </h4>
                                {isToday && (
                                  <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Hoje
                                  </span>
                                )}
                                {isWeekend && (
                                  <span className="bg-warning-100 text-warning-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Fim de Semana
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-neutral-500 capitalize">
                                {dayOfWeek}
                              </p>
                              
                              <p className="text-sm text-neutral-400">
                                Local: {attendance.location}
                              </p>
                              
                              <div className="flex items-center gap-1 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                                <span className="text-sm font-medium text-primary-600">
                                  Streak: {attendance.streak} {attendance.streak === 1 ? 'dia' : 'dias'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {attendance.badges && attendance.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {attendance.badges.map((badge) => {
                                const badgeType = badgeTypes[badge.type as keyof typeof badgeTypes];
                                return (
                                  <div
                                    key={badge.id}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full text-sm"
                                    style={{ 
                                      backgroundColor: badgeType?.bg || 'var(--color-primary-50)',
                                      color: badgeType?.color || 'var(--color-primary-700)',
                                      border: `1px solid ${badgeType ? badgeType.iconBg : 'var(--color-primary-200)'}`
                                    }}
                                    title={badge.description}
                                  >
                                    <span>{badge.icon}</span>
                                    <span className="font-medium">{badge.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 