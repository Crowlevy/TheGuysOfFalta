"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

type Attendance = {
  id: string;
  date: string;
  checkIn: Date;
  checkOut: Date | null;
  userId: string;
};

export default function HistoryPage() {
  const { data: session } = useSession();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('calendar');

  useEffect(() => {
    const fetchAttendances = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const start = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const end = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
        
        const response = await fetch(
          `/api/users/${session.user.id}/attendances?start=${start}&end=${end}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch attendances');
        
        const data = await response.json();
        setAttendances(data);
      } catch (error) {
        console.error('Error fetching attendances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [session?.user?.id, selectedMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  const getAttendanceForDay = (date: Date) => {
    return attendances.find(a => 
      format(parseISO(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Histórico de Presença</h1>
        <p className="text-neutral-600">Visualize seu histórico de presença e estatísticas</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-neutral-900">
              {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button
              onClick={() => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-lg ${
                view === 'list' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'hover:bg-neutral-100'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 rounded-lg ${
                view === 'calendar' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'hover:bg-neutral-100'
              }`}
            >
              Calendário
            </button>
          </div>
        </div>

        {view === 'calendar' ? (
          <div className="grid grid-cols-7 gap-px bg-neutral-200">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="bg-neutral-50 p-2 text-center text-sm font-medium text-neutral-600">
                {day}
              </div>
            ))}
            {daysInMonth.map((date, index) => {
              const attendance = getAttendanceForDay(date);
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <motion.div
                  key={date.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`bg-white p-3 min-h-[100px] ${
                    attendance 
                      ? 'bg-primary-50' 
                      : ''
                  } ${
                    isToday
                      ? 'ring-2 ring-primary-500 ring-inset'
                      : ''
                  }`}
                >
                  <div className="font-medium text-sm text-neutral-900">
                    {format(date, 'd')}
                  </div>
                  {attendance && (
                    <div className="mt-2">
                      <div className="text-xs text-primary-600">
                        Entrada: {format(new Date(attendance.checkIn), 'HH:mm')}
                      </div>
                      {attendance.checkOut && (
                        <div className="text-xs text-primary-600">
                          Saída: {format(new Date(attendance.checkOut), 'HH:mm')}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {attendances.map((attendance, index) => (
              <motion.div
                key={attendance.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">
                      {format(parseISO(attendance.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">
                      Entrada: {format(new Date(attendance.checkIn), 'HH:mm')}
                      {attendance.checkOut && ` • Saída: ${format(new Date(attendance.checkOut), 'HH:mm')}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Presente
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 