"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date-utils";
import { badgeTypes } from "@/lib/constants/theme";
import { motion } from "framer-motion";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  type: string;
  earned: boolean;
  earnedAt: string | null;
  progress: number;
};

type GroupedBadges = {
  [key: string]: Badge[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function BadgesPage() {
  const [badges, setBadges] = useState<GroupedBadges | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const fetchBadges = async () => {
      if (status === "loading" || !session?.user?.id) return;
      
      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch(`/api/users/${session.user.id}/badges`);
        
        if (!response.ok) {
          throw new Error("Falha ao buscar conquistas");
        }
        
        const data = await response.json();
        setBadges(data.badges || {});
        setTotalEarned(data.totalEarned || 0);
        setTotalAvailable(data.totalAvailable || 0);
      } catch (err) {
        console.error("Erro ao buscar conquistas:", err);
        setError("Não foi possível carregar suas conquistas. Tente novamente mais tarde.");
        setBadges({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBadges();
  }, [session, status]);
  
  //percentage badges
  const completionPercentage = totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="text-neutral-600 font-medium">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Erro</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!badges || Object.keys(badges).length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-neutral-100 rounded-full p-4 mx-auto w-fit mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Nenhuma conquista disponível</h3>
          <p className="text-neutral-500">Continue participando para desbloquear conquistas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/*texto main*/}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Suas Conquistas</h1>
            <p className="text-neutral-500 mt-1">
              Desbloqueie conquistas para mostrar seu progresso e dedicação
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para o Dashboard
          </Link>
        </div>
        
        {/*barra de progresso*/}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-neutral-900">Progresso Total</h2>
              <p className="text-neutral-500 text-sm mt-1">
                {totalEarned} de {totalAvailable} conquistas desbloqueadas
              </p>
            </div>
            <div className="text-2xl font-bold text-primary-600">
              {completionPercentage}%
            </div>
          </div>
          
          <div className="mt-4 w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/*conquistas*/}
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(badges).map(([type, typeBadges]) => {
          const badgeType = badgeTypes[type as keyof typeof badgeTypes] || {
            color: '#333',
            bg: '#f5f5f5',
            iconBg: '#e5e5e5',
            title: 'Outras Conquistas',
            emoji: '🏆',
            description: 'Conquistas especiais'
          };
          
          return (
            <motion.div 
              key={type} 
              className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
              variants={itemVariants}
            >
              <div className="px-6 py-5 border-b border-neutral-200" style={{ backgroundColor: badgeType.bg }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{badgeType.emoji}</span>
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: badgeType.color }}>
                      {badgeType.title}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: badgeType.color }}>
                      {badgeType.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className={`relative p-4 rounded-lg border ${
                      badge.earned
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-neutral-200 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          badge.earned
                            ? 'bg-primary-100'
                            : 'bg-neutral-100'
                        }`}
                      >
                        {badge.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-medium truncate ${
                          badge.earned ? 'text-primary-900' : 'text-neutral-900'
                        }`}>
                          {badge.name}
                        </h4>
                        
                        <p className={`text-sm mt-1 ${
                          badge.earned ? 'text-primary-600' : 'text-neutral-500'
                        }`}>
                          {badge.description}
                        </p>
                        
                        {badge.earned && badge.earnedAt && (
                          <p className="text-xs text-primary-500 mt-2">
                            Conquistado em {formatDate(badge.earnedAt)}
                          </p>
                        )}
                        
                        {!badge.earned && badge.progress > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-neutral-600">Progresso</span>
                              <span className="text-neutral-900 font-medium">{badge.progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-1.5">
                              <div 
                                className="bg-primary-500 h-1.5 rounded-full" 
                                style={{ width: `${badge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {badge.earned && (
                        <div className="absolute top-4 right-4 text-primary-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/*informação adicional*/}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-lg font-medium text-neutral-900">
            Como funcionam as conquistas?
          </h3>
        </div>
        <div className="p-6">
          <div className="text-neutral-600 space-y-4">
            <p>
              As conquistas são desbloqueadas automaticamente quando você atinge certos marcos.
              Mantenha sua presença diária para desbloquear todas as conquistas disponíveis!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🔥</span>
                  <h4 className="font-medium text-neutral-900">Conquistas de Streak</h4>
                </div>
                <p className="text-sm text-neutral-600">
                  Mantenha sua presença por dias consecutivos para desbloquear estas conquistas especiais.
                </p>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">📆</span>
                  <h4 className="font-medium text-neutral-900">Conquistas de Total de Dias</h4>
                </div>
                <p className="text-sm text-neutral-600">
                  Acumule dias de presença ao longo do tempo para ganhar estas conquistas.
                </p>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">⏱️</span>
                  <h4 className="font-medium text-neutral-900">Conquistas de Consistência</h4>
                </div>
                <p className="text-sm text-neutral-600">
                  Seja consistente em períodos específicos como semanas ou meses.
                </p>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🎯</span>
                  <h4 className="font-medium text-neutral-900">Conquistas Especiais</h4>
                </div>
                <p className="text-sm text-neutral-600">
                  Conquistas únicas por ações especiais como registrar presença em finais de semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 