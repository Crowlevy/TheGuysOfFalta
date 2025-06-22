//pedi pro gpt fazer isso aqui, não tankei ter que colocar um por um

import { PrismaClient, BadgeType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');
  
  try {
    // Limpar dados existentes em ordem para evitar violações de chave estrangeira
    console.log('Removendo dados existentes...');
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.attendance.deleteMany();
    
    console.log('Criando conquistas...');
    
    // Criar conquistas de streak
    
    // Criar um usuário admin para teste (opcional)
    try {
      const adminPassword = await hash('admin123', 12);
      
      await prisma.user.upsert({
        where: { email: 'admin@bolsonaro.com' },
        update: {},
        create: {
          name: 'Administrador',
          email: 'admin@bolsonaro.com',
          password: adminPassword,
          image: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        },
      });
      
      console.log('Usuário admin criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário admin:', error);
    }
    
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 