import { PrismaClient } from '@prisma/client';
import { badges } from '../lib/constants/badges';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed das conquistas...');

  //criar todas as badges que são definidas no arquivo de constantes badges.ts
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: {
        id: badge.id
      },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        type: badge.type,
        threshold: badge.threshold
      },
      create: {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        type: badge.type,
        threshold: badge.threshold
      }
    });
  }

  console.log('✅ Seed das conquistas concluído!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 