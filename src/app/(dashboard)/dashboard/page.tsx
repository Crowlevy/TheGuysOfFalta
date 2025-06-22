"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import StatsCard from "@/components/StatsCard";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceHistory from "@/components/AttendanceHistory";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quickStats, setQuickStats] = useState({
    totalDays: 0,
    currentStreak: 0,
    weeklyProgress: 0,
    monthlyProgress: 0
  });
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Bom dia");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
    
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/attendance")
        .then(res => res.json())
        .then(data => {
          if (data.stats) {
            setQuickStats({
              totalDays: data.stats.totalDays || 0,
              currentStreak: data.stats.currentStreak || 0,
              weeklyProgress: Math.min(data.stats.weeklyDays || 0, 5) / 5 * 100,
              monthlyProgress: Math.min(data.stats.monthlyDays || 0, 20) / 20 * 100
            });
          }
        })
        .catch(err => console.error("Erro ao buscar estatísticas:", err));
    }
  }, [session]);
  
  //se ainda estiver carregando ou não autenticado, não renderizar nada
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }
  
  //pegar o primeiro nome do usuário
  const firstName = session?.user?.name?.split(" ")[0] || "Usuário";
  
  //formatar a data atual
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Capitalizar primeira letra
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/*parte cima principal*/}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {greeting}, {firstName}! 👋
              </h1>
              <p className="text-primary-100">
                {capitalizedDate}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                <p className="text-xs font-medium text-primary-100">Streak Atual</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{quickStats.currentStreak}</span>
                  <span className="text-primary-200">dias</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                <p className="text-xs font-medium text-primary-100">Total de Presenças</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{quickStats.totalDays}</span>
                  <span className="text-primary-200">dias</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-primary-100">Progresso Semanal</p>
                <p className="text-sm font-medium text-white">{Math.round(quickStats.weeklyProgress)}%</p>
              </div>
              <div className="h-2 bg-primary-800/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-200"
                  initial={{ width: 0 }}
                  animate={{ width: `${quickStats.weeklyProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
              <p className="mt-2 text-xs text-primary-200">Meta: 5 dias por semana</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-primary-100">Progresso Mensal</p>
                <p className="text-sm font-medium text-white">{Math.round(quickStats.monthlyProgress)}%</p>
              </div>
              <div className="h-2 bg-primary-800/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-200"
                  initial={{ width: 0 }}
                  animate={{ width: `${quickStats.monthlyProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
              <p className="mt-2 text-xs text-primary-200">Meta: 20 dias por mês</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/*speed actions*/}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="font-medium text-neutral-900">Registrar Presença</span>
          </Link>
          
          <Link href="/badges" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="p-2 bg-warning-100 text-warning-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-medium text-neutral-900">Ver Conquistas</span>
          </Link>
          
          <Link href="/ranking" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="p-2 bg-success-100 text-success-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <span className="font-medium text-neutral-900">Ver Ranking</span>
          </Link>
          
          <Link href="/history" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="p-2 bg-error-100 text-error-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium text-neutral-900">Histórico</span>
          </Link>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/*stats*/}
          <motion.div variants={itemVariants}>
            <StatsCard />
          </motion.div>
          
          {/*history*/}
          <motion.div variants={itemVariants}>
            <AttendanceHistory />
          </motion.div>
        </div>
        
        <div className="space-y-8">
          {/*presença*/}
          <motion.div variants={itemVariants}>
            <AttendanceForm />
          </motion.div>
          
          {/*dicas*/}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-6 py-5 border-b border-neutral-200 flex items-center gap-3 bg-neutral-50">
              <div className="p-2 bg-warning-100 text-warning-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Dicas para Manter o Streak
              </h3>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4 text-neutral-600">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-warning-100 text-warning-700 rounded-full flex items-center justify-center font-medium text-sm">
                    1
                  </div>
                  <p>Defina um horário específico do dia para registrar sua presença.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-warning-100 text-warning-700 rounded-full flex items-center justify-center font-medium text-sm">
                    2
                  </div>
                  <p>Configure lembretes no seu celular para não esquecer.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-warning-100 text-warning-700 rounded-full flex items-center justify-center font-medium text-sm">
                    3
                  </div>
                  <p>Nos finais de semana, registre sua presença para ganhar conquistas especiais!</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-warning-100 text-warning-700 rounded-full flex items-center justify-center font-medium text-sm">
                    4
                  </div>
                  <p>Compartilhe suas conquistas com os amigos para manter a motivação.</p>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-500">Próxima meta</span>
                  <span className="text-sm font-medium text-primary-600">{quickStats.currentStreak + 1} dias</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary-500"
                    style={{ width: `${(quickStats.currentStreak % 5) / 5 * 100}%` }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 