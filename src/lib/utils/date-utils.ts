import { format as fnsFormat, parseISO, subHours } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

//utils para formatação de datas, que parte insuportável, puta que pariu

/**
 * Converte uma data para o fuso horário de São Paulo
 * @param date - Data a ser convertida
 * @returns Data no fuso horário de São Paulo
 */
export function toBrazilianTimezone(date: Date | string): Date {
  const timeZone = 'America/Sao_Paulo';
  const d = typeof date === 'string' ? new Date(date) : date;
  console.log('Data original:', d.toISOString());
  
  // Converter para o fuso horário de São Paulo usando date-fns-tz
  const brazilDate = toZonedTime(d, timeZone);
  console.log('Data convertida:', brazilDate.toISOString());
  
  return brazilDate;
}

/**
 * formatando uma data para o formato brasileiro (dd/mm/yyyy)
 * @param dateString - data em formato string(ISO)
 * @returns data formatada - promise de merda
 */
export function formatDate(dateString: string): string {
  const timeZone = 'America/Sao_Paulo';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, 'dd/MM/yyyy', { timeZone });
}

/**
 * verificando se uma data é hoje
 * @param date data a ser verificada
 * @returns true se a data for hoje, false caso contrário
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * verificando se uma data é ontem
 * @param date data a ser verificada
 * @returns true se a data for ontem, false caso contrário
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 *desc data
 * @param dateString
 * @returns desc data 
 */
export function getFriendlyDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return "Ontem"; // trocar para hoje aqui, é só que funcionou agora
  }
  
  if (isYesterday(date)) {
    return "Hoje"; // KKKKKKKKKKKKKKKKKKKKKKKK maior gambiarra dessa porra
  }
  
  return formatDate(dateString);
}

/**
 *formatando uma data para mostrar com hora em formato brasileiro (DD/MM/YYYY HH:MM)
 */
export function formatDateWithTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

/**
 *verifica se uma data está dentro do tempo de expiração do token (30 min) - implementar melhor isso, sinto que algum bug vai dar
 */
export function isWithinTokenExpiration(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  //exp em 30 min
  const expirationMs = 30 * 60 * 1000;
  
  return now.getTime() - d.getTime() < expirationMs;
}

/**
 *str de dia/hora
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
    }
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  }
  
  return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
}

/**
 *pegando os bounds da semana
 */
export function getWeekBounds(date: Date | string): { start: Date, end: Date } {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = d.getDay();
  
  //inicio domingo
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  
  //final para sábado
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 *
 * @param date
 * @returns true se a data estiver na semana atual, false caso contrário
 */
export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); //domingo
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); //sabado
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
}

/**
 *verifica se uma data está dentro do mês atual
 * @param date
 * @returns
 */
export function isThisMonth(date: Date): boolean {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 *nome do dia da semana
 * @param date Data
 * @returns dia da semana
 */
export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString("pt-BR", { weekday: "long" });
}

/**
 * nome mês
 * @param date Data
 * @returns nome do mês
 */
export function getMonthName(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "long" });
}

/**
 *formato relativo (ha x dias, ha x horas)
 * @param dateString string de data a ser formatada
 * @returns data em formato relativo
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "agora mesmo";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `há ${diffInYears} ${diffInYears === 1 ? "ano" : "anos"}`;
} 