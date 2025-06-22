# 🎯 TheGuysOfFalta - Rastreador de Presença

> O app que vai transformar seus amigos em pessoas quase funcionais da sociedade

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Faltômetro](https://img.shields.io/badge/Falt%C3%B4metro-Quebrado-red)](https://github.com/crowlevy/theguysoffalta)

## Sobre o Projeto

O **TheGuysOfFalta** é a solução definitiva para aquele grupo de amigos que de 10 aulas, faltam 15.

Criado com muito amor, café até demais e uma pitada de desespero por alguém que estava cansado de ser o único que faltava (era eu).

### O Problema

Conhece aquele amigo que sempre diz "cara, eu não consigo ir hoje" 5 minutos antes do compromisso? Ou aquele que some quando tem que acordar cedo? 

Pois é, eu também. Decidi criar uma solução científica para esse problema secular.

### A Solução (mais ou menos)

- **Gamificação**: Porque quem não gosta de ganhar pontinhos virtuais?
- **Dados brutalmente honestos**: Vai descobrir quem é o verdadeiro vilão do grupo
- **Sistema de conquistas**: Para compensar a falta de conquistas na vida real
- **Constrangimento público**: Nada como uma boa exposição para motivar
- **Interface que até sua vó usaria**: Simples demais para dar desculpa

## Funcionalidades

### Sistema de Autenticação
- Login que funciona (diferente da pontualidade dos seus amigos)
- OAuth para os preguiçosos que não querem criar senha
- Perfis personalizáveis (porque a única coisa que personalizamos é desculpa)

### Registro de Presença
- **Check-in diário**: Clique um botão. Sério, só isso.
- **Horário limite**: Depois das 9h não vale chorar
- **Status em tempo real**: Todo mundo vai ver quem furou
- **Histórico completo**: Suas vergonhas ficam guardadas para sempre

### Sistema de Streaks
- **Contador de dias consecutivos**: Igual Duolingo, mas para vida social
- **Quebra automática**: Falto = streak destruída = alma destruída
- **Recorde pessoal**: Para você se gabar dos seus 3 dias seguidos

### Gamificação (A Parte Divertida)
- **Ranking**: Descubra quem é o menos pior do grupo
- **Badges especiais**:
  - "Primeira vez que não falta" (7 dias)
  - "Será que virou gente?" (30 dias)
  - "Lenda Viva" (100 dias)
  - "Unicórnio" (365 dias - praticamente impossível)
  - "Fantasma" (10 faltas seguidas)
  - "Rei das Desculpas" (maior coleção de desculpas criativas)

### Dashboard da Vergonha
- **Gráficos brutalmente honestos** do seu desempenho
- **Estatísticas dolorosas**: "Você faltou 60% das vezes"
- **Comparação com amigos**: Para saber o quão ruim você é
- **Análise de padrões**: "Você sempre falta nas segundas" (surpresa!)

### Sistema de Desculpas
- **Banco de dados de desculpas**: Todas ficam registradas
- **Ranking de criatividade**: As melhores desculpas da semana
- **Hall da Fama**: As desculpas mais épicas de todos os tempos

## Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| **Frontend** | Next.js 13+|
| **Framework** | React 18+ |
| **Estilização** | Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Banco de Dados** | PostgreSQL 15+ | 
| **ORM** | Prisma 5+ |
| **Autenticação** | NextAuth.js 4+ |
| **Linguagem** | TypeScript 4.9+ |

## Como Instalar (E Começar a Julgar Seus Amigos)

### Pré-requisitos

Você vai precisar de:

- **Node.js** 18+ (mais atual que a pontualidade dos seus amigos)
- **npm** ou **yarn** (escolha sua religião)
- **PostgreSQL** 15+ (para guardar os dados da vergonha)
- **Paciência** para lidar com amigos faltosos

### Instalação Para Marinheiros de Primeira Viagem

1. **Clone esse repositório**
   ```bash
   git clone https://github.com/crowlevy/theguysoffalta.git
   cd theguysoffalta
   ```
   *Parabéns! Você acabou de dar o primeiro passo para acabar com a falta de compromisso dos seus amigos.*

2. **Instale as dependências**
   ```bash
   npm install
   # ou se você é team yarn:
   yarn install
   ```
   *Agora é uma boa hora para começar a chorar ouvindo Black do Pearl Jam (esse cara é bom demais pqp)*

3. **Configure o ambiente**
   
   Crie um arquivo `.env.local` e coloque suas informações secretas:
   ```env
   # Database (onde ficam guardadas as vergonhas)
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/theguysoffalta"
   
   # NextAuth (para ninguém hackear e apagar seu streak)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="uma_senha_mais_confiavel_que_seus_amigos"
   
   # OAuth (para os preguiçosos)
   GOOGLE_CLIENT_ID="seu_google_client_id"
   GOOGLE_CLIENT_SECRET="seu_google_client_secret"
   GITHUB_ID="seu_github_id"
   GITHUB_SECRET="seu_github_secret"
   ```

4. **Configure o banco de dados**
   ```bash
   # Gera o cliente Prisma (não questione)
   npx prisma generate
   
   # Cria as tabelas no banco
   npx prisma migrate dev --name init
   
   # (Opcional) Adiciona dados de exemplo
   npx prisma db seed
   ```

5. **Hora da verdade**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

6. **Acesse a aplicação**
   
   Vá para [http://localhost:3000](http://localhost:3000) e comece a julgar seus amigos!

## Telas

| Tela | O que faz |
|------|-----------|
| **Página Inicial** | Te convence a usar o app (você precisa) |
| **Dashboard** | Onde você clica o botão mágico do "Presente!" |
| **Ranking** | Onde você descobre quem é o maior faltoso |
| **Histórico** | Suas vergonhas documentadas para posteridade |
| **Conquistas** | Suas medalhinhas virtuais (que valem mais que diploma) |
| **Configurações** | Para personalizar sua experiência de julgamento |

## Roadmap

### 🚧 Em Desenvolvimento (Se Eu Não Procrastinar)
- [ ] **Notificações push**: "Oi, você esqueceu de existir hoje"
- [ ] **Modo escuro**: Para quem não sai de casa assim como eu
- [ ] **Exportação de dados**: Para fazer relatórios da vergonha
- [ ] **Grupos customizados**: Academia, igreja, etc.

### Versões Futuras (Se Eu Não Desistir)
- [ ] **Bot do Telegram**: Para ser chato diretamente no seu celular
- [ ] **Sistema de punições**: Quem falta paga café para todo mundo
- [ ] **Eventos especiais**: "Semana do Compromisso" com prêmios
- [ ] **API pública**: Para outros devs criarem bots ainda mais chatos
- [ ] **App mobile**: Para você não ter desculpa nem no banheiro
- [ ] **IA de desculpas**: Que julga se sua desculpa é boa ou ruim

## 🤝 Como Contribuir (E Entrar Para o Time)

Quer ajudar a acabar com a falta de compromisso mundial? Aqui está como:

1. **Faça um Fork** (não é garfo)
2. **Crie uma branch** (`git checkout -b feature/funcionalidade-incrivel`)
3. **Commit suas mudanças** (`git commit -m 'feat: adiciona detector de mentiras'`)
4. **Mande para o GitHub** (`git push origin feature/funcionalidade`)
5. **Abra um Pull Request** e espere aprovação

### 📋 Padrões de Commit (Para Não Bagunçar Tudo)

Segui o [Conventional Commits](https://www.conventionalcommits.org/) porque sou altamente profissional e imaturo até demais:

- `feat:` nova feature
- `fix:` consertei algo que quebrei
- `docs:` documentação (porque ninguém lê, mas tem que ter)
- `style:` deixei o código bonito
- `refactor:` mexi no código sem quebrar LET'S GO
- `chore:` tarefas chatas mas necessárias

## 📊 Scripts Úteis (Para Não Esquecer)

```bash
# Para desenvolver
npm run dev          # Roda o app em modo dev
npm run build        # Constrói para produção
npm run start        # Roda em produção
npm run lint         # Verifica se o código está bonitinho
npm run type-check   # TypeScript sendo chatinho

# Para o banco de dados
npm run db:generate  # Gera o cliente Prisma
npm run db:migrate   # Atualiza o banco
npm run db:seed      # Adiciona dados fake
npm run db:studio    # Interface visual do banco
```

## 🐛 Encontrou um Bug? (Provavelmente Encontrou)

Achou algo quebrado? Não entre em pânico:

1. Respire fundo (bugs acontecem)
2. Veja se já não tem [issue](https://github.com/crowlevy/theguysoffalta/issues) sobre isso
3. Se não tem, crie uma nova com:
   - Descrição dramática do problema
   - Como reproduzir (passo a passo para idiotas)
   - O que você esperava vs o que aconteceu
   - Prints
   - Informações técnicas (SO, navegador, etc.)

## 📊 Estatísticas Interessantes

Desde o lançamento:
- 🎯 **73%** dos usuários melhoraram sua pontualidade
- 📈 **89%** das desculpas são relacionadas a jogos
- 🏆 **Apenas 2%** conseguiram streak de 100 dias
- 💀 **Record de faltas consecutivas**: 14 dias (parabéns, João! <- Eu😭)

## 📄 Licença

Este projeto está sob a licença **MIT** - basicamente você pode fazer o que quiser, só não me processe se der ruim.

## Agradecimentos Especiais

- **À procrastinação**: Que me fez criar isso em vez de estudar
- **Ao café**: O verdadeiro combustível deste projeto
- **À pizza**: Que me sustentou durante as madrugadas de código
- **Aos jogos online**: Que me ensinaram o poder da gamificação
- **Stack Overflow**: Por ter todas as respostas que eu precisava
- **Rubber Duck Debugging**: Meu psicólogo de código

## 🏆 Hall da Fama das Desculpas

> "Não consigo ir porque meu despertador não tocou (nem programou o despertador)"
> *- Sei lá, 2024*

> "Fiquei doente mano... depois de acabar as provas."
> *- Algum cara aleatório, 2024*

> "Não posso ir à escola, joguei a noite toda."
> *- Honesto Demais, 2024*

---

<div align="center">

**Desenvolvido com muito ☕ por [Crowlevy](https://github.com/crowlevy)**

*"Transformando faltosos em pessoas funcionais desde 2024"*

*P.S.: Se você chegou até aqui, parabéns! Você tem mais persistência que seus amigos têm compromisso.*

[🔗 Demo](https://theguysoffalta.vercel.app) • [📚 Docs](https://docs.theguysoffalta.com) • [🐛 Issues](https://github.com/crowlevy/theguysoffalta/issues) • [💬 Discussions](https://github.com/crowlevy/theguysoffalta/discussions)

**⚠️ Aviso Legal**: Este app pode causar constrangimento público, perda de amizades e/ou melhora significativa na pontualidade. Use com responsabilidade.

</div>