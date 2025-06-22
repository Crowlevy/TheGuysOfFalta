"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendanceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: session } = useSession();

  //atualiza o horário atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para registrar presença");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: "Joviano De Aguiar"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar presença");
      }

      //se ganhou a conquista
      const badgesResponse = await fetch(`/api/users/${session.user.id}/badges`);
      const badgesData = await badgesResponse.json();
      
      toast.success("Presença registrada com sucesso!");
      setIsSuccess(true);
      
      if (badgesData.newBadges?.length > 0) {
        setTimeout(() => {
          badgesData.newBadges.forEach((badge: any, index: number) => {
            setTimeout(() => {
              toast.success(`Nova conquista desbloqueada: ${badge.name}! 🎉`, {
                duration: 5000,
                icon: badge.icon,
                style: {
                  borderRadius: '10px',
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  border: '1px solid var(--color-primary-200)',
                },
              });
            }, index * 1000); 
          });
        }, 1000);
      }

      //refresh na página pra evitar de não aparecer insta
      setTimeout(() => {
        window.location.reload();
      }, 3000 + (badgesData.newBadges?.length || 0) * 1000);
    } catch (error) {
      console.error("Erro ao registrar presença:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao registrar presença", {
        style: {
          borderRadius: '10px',
          background: 'var(--color-error-50)',
          color: 'var(--color-error-700)',
          border: '1px solid var(--color-error-200)',
        },
      });
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-900">
            Registrar Presença
          </h3>
        </div>
        
        {isWeekend && (
          <span className="bg-warning-100 text-warning-700 text-xs font-medium px-2.5 py-1 rounded-full border border-warning-200">
            Fim de Semana
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500 capitalize">{formattedDate}</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold">{formattedTime}</span>
            </div>
          </div>
          
          <motion.div 
            className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-100 flex items-center gap-1.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hoje</span>
          </motion.div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-neutral-600">
            <p className="mb-2">
              Clique no botão abaixo para registrar sua presença hoje.
            </p>
            <motion.div 
              className="flex items-start gap-2 bg-primary-50 p-4 rounded-lg border border-primary-100 text-sm"
              whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-primary-700">
                Lembre-se que você só pode registrar presença uma vez por dia! Mantenha seu streak registrando presença todos os dias consecutivos.
              </p>
            </motion.div>
          </div>
          
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-success-100 text-success-800 p-4 rounded-lg border border-success-200 flex items-center gap-3"
                >
                  <div className="bg-success-200 p-2 rounded-full">
                    <svg className="h-6 w-6 text-success-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Presença registrada com sucesso!</p>
                    <p className="text-sm">Atualizando informações...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="button"
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ${
                    isLoading 
                      ? "bg-neutral-400 cursor-not-allowed" 
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                  whileHover={{ scale: isLoading ? 1 : 1.03 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Registrar Presença
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 