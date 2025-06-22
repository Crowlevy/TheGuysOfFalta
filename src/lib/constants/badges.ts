import { BadgeType } from "@prisma/client";

export const badges = [
  //conquistas streak
  {
    id: "streak-1",
    name: "Iniciante",
    description: "Mantenha um streak de 3 dias",
    icon: "🌱",
    type: BadgeType.STREAK,
    threshold: 3
  },
  {
    id: "streak-2",
    name: "Dedicado",
    description: "Mantenha um streak de 5 dias",
    icon: "🔥",
    type: BadgeType.STREAK,
    threshold: 5
  },
  {
    id: "streak-3",
    name: "Veterano",
    description: "Mantenha um streak de 10 dias",
    icon: "⚡",
    type: BadgeType.STREAK,
    threshold: 10
  },
  {
    id: "streak-4",
    name: "Lendário",
    description: "Mantenha um streak de 20 dias",
    icon: "👑",
    type: BadgeType.STREAK,
    threshold: 20
  },

  //conquistas total dias
  {
    id: "total-1",
    name: "Primeiro Passo",
    description: "Registre presença por 5 dias no total",
    icon: "👣",
    type: BadgeType.TOTAL_DAYS,
    threshold: 5
  },
  {
    id: "total-2",
    name: "Frequentador",
    description: "Registre presença por 15 dias no total",
    icon: "📚",
    type: BadgeType.TOTAL_DAYS,
    threshold: 15
  },
  {
    id: "total-3",
    name: "Estudioso",
    description: "Registre presença por 30 dias no total",
    icon: "🎓",
    type: BadgeType.TOTAL_DAYS,
    threshold: 30
  },
  {
    id: "total-4",
    name: "Mestre",
    description: "Registre presença por 50 dias no total",
    icon: "🏆",
    type: BadgeType.TOTAL_DAYS,
    threshold: 50
  },

  //conquistas consistência
  {
    id: "consistency-1",
    name: "Semana Perfeita",
    description: "Registre presença todos os dias úteis da semana",
    icon: "📅",
    type: BadgeType.CONSISTENCY,
    threshold: 5
  },
  {
    id: "consistency-2",
    name: "Mês Dourado",
    description: "Registre presença por 20 dias em um mês",
    icon: "🌟",
    type: BadgeType.CONSISTENCY,
    threshold: 20
  },

  //conquistas especiais
  {
    id: "special-1",
    name: "Guerreiro de Segunda",
    description: "Registre presença em uma segunda-feira",
    icon: "⚔️",
    type: BadgeType.SPECIAL,
    threshold: 1
  },
  {
    id: "special-2",
    name: "Anti-Preguiça",
    description: "Registre presença em um feriado",
    icon: "💪",
    type: BadgeType.SPECIAL,
    threshold: 1
  },
  {
    id: "special-3",
    name: "Sem Desculpas",
    description: "Registre presença em um dia chuvoso",
    icon: "☔",
    type: BadgeType.SPECIAL,
    threshold: 1
  },
  {
    id: "special-4",
    name: "Maratonista",
    description: "Registre presença no fim de semana",
    icon: "🏃",
    type: BadgeType.SPECIAL,
    threshold: 1
  },
  {
    id: "special-5",
    name: "Pontual Master",
    description: "Chegue antes das 8:15",
    icon: "⏰",
    type: BadgeType.SPECIAL,
    threshold: 1
  },
  {
    id: "special-6",
    name: "Rei do Quincas",
    description: "Registre presença no Quincas",
    icon: "👑",
    type: BadgeType.SPECIAL,
    threshold: 1
  }
]; 