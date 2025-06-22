"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router]);
  
  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/*hero section*/}
      <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block px-4 py-2 bg-primary-500/20 rounded-full mb-4 border border-primary-400/20 backdrop-blur-sm"
              >
                <span className="text-primary-200 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Deixando de ser cabaço e se tornando disciplinado
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transforme sua <span className="text-primary-200">presença</span> em{" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block"
                >
                  <span className="text-primary-200">conquistas</span>
                </motion.span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 max-w-2xl md:mx-0 mx-auto text-primary-50/90">
              Sistema de gamificação para melhorar nossa assiduidade de faltar para caralho, e pelo menos deixar o hábito de ir a aula algo bom e divertido.              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/register" 
                    className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block w-full sm:w-auto text-center shadow-lg shadow-primary-900/20"
                  >
                    Experimente Grátis
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/login" 
                    className="bg-primary-500 hover:bg-primary-400 border border-primary-400 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block w-full sm:w-auto text-center shadow-lg shadow-primary-900/20"
                  >
                    Fazer Login
                  </Link>
                </motion.div>
              </div>

            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 md:mt-24 hidden md:block"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl relative overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                </motion.div>
                <img 
                  src="/images/dashboard-preview.jpg" 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-lg w-full relative z-10 transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm text-white">Visualize suas estatísticas em tempo real e acompanhe seu progresso</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      <main className="flex-grow">
        {/*features section*/}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4 text-primary-600 font-medium"
              >
                Recursos Principais
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Como funciona?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-600 max-w-2xl mx-auto text-lg"
              >
                Um sistema simples e eficiente para acompanhar sua presença e motivar sua constância
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div 
                className="p-8 rounded-xl shadow-md bg-white border border-neutral-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Registre Presenças</h3>
                  <p className="text-neutral-600 mb-6">
                    Com apenas um clique diário, registre sua presença e mantenha seu streak ativo. Simples, rápido e eficiente.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 text-sm text-neutral-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                      <span>Presença registrada hoje!</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-8 rounded-xl shadow-md bg-white border border-neutral-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Acompanhe Estatísticas</h3>
                  <p className="text-neutral-600 mb-6">
                    Visualize seu histórico de presenças, streaks atuais e progresso em direção às suas metas de forma clara e intuitiva.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-600">Streak atual</span>
                        <span className="font-semibold text-primary-600">7 dias</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-8 rounded-xl shadow-md bg-white border border-neutral-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Ganhe Conquistas</h3>
                  <p className="text-neutral-600 mb-6">
                    Desbloqueie badges e conquistas à medida que mantém sua constância, criando uma competição saudável entre colegas.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-20 max-w-5xl mx-auto bg-neutral-50 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900">
                      Dashboard Intuitivo
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      Interface moderna e fácil de usar, projetada para tornar o acompanhamento de presença uma experiência agradável e motivadora.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-700">Visualização clara do progresso</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-700">Estatísticas detalhadas</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-700">Notificações em tempo real</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-400/20 rounded-xl"></div>
                    <img 
                      src="/images/dashboard-preview.jpg"
                      alt="Dashboard Interface"
                      className="rounded-xl shadow-lg relative z-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/*benefits section*/}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4 text-primary-600 font-medium"
              >
                Por que escolher nossa plataforma?
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Benefícios
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-600 max-w-2xl mx-auto text-lg"
              >
                Por que usar o Presence Tracker para melhorar sua assiduidade
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-6 items-start group"
              >
                <div className="bg-primary-100 p-4 rounded-2xl text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Melhore sua Consistência</h3>
                  <p className="text-neutral-600 mb-4">
                    Visualizar seu progresso diariamente incentiva o comparecimento regular, criando um ciclo positivo de motivação e resultados.
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600">Meta mensal</span>
                      <span className="text-primary-600 font-medium">80%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-6 items-start group"
              >
                <div className="bg-primary-100 p-4 rounded-2xl text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Incentivo Competitivo</h3>
                  <p className="text-neutral-600 mb-4">
                    A competição saudável entre colegas aumenta a motivação para manter a regularidade e buscar novas conquistas.
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 text-sm font-medium">JD</div>
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 text-sm font-medium">MR</div>
                        <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 text-sm font-medium">+3</div>
                      </div>
                      <span className="text-sm text-neutral-600">Competindo esta semana</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-6 items-start group"
              >
                <div className="bg-primary-100 p-4 rounded-2xl text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Acompanhamento Visual</h3>
                  <p className="text-neutral-600 mb-4">
                    Gráficos e estatísticas mostram seu progresso de forma clara e motivacional, facilitando a visualização de seu desenvolvimento.
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-primary-100 rounded"></div>
                      <div className="h-12 bg-primary-200 rounded"></div>
                      <div className="h-10 bg-primary-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-6 items-start group"
              >
                <div className="bg-primary-100 p-4 rounded-2xl text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">Formação de Hábito</h3>
                  <p className="text-neutral-600 mb-4">
                    O sistema ajuda a transformar a presença regular em um hábito sólido, contribuindo para seu desenvolvimento pessoal e profissional.
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                      <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                      <span className="ml-2 text-sm text-neutral-600">3 dias consecutivos</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/*os guys porra*/}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4 text-primary-600 font-medium"
              >
                Hall da Falta
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                As Lendas de 2024
              </motion.h2>
              <p className="text-neutral-600">As desculpas mais bobas já registradas no Joviano</p>
            </div>

            {/*cards da melancolia*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="bg-white p-6 rounded-xl text-center group hover:bg-primary-50 transition-all duration-300 shadow-lg"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-all duration-300 transform group-hover:rotate-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 group-hover:text-primary-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-neutral-800 group-hover:text-primary-700">"Dormi demais"</div>
                <div className="text-sm text-neutral-600 mt-2 group-hover:text-primary-600">
                  Alarme? Que alarme? 
                  <span className="block mt-1 text-xs italic">* Tem 27 alarmes no celular e ainda assim...</span>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Usada 158 vezes este semestre
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white p-6 rounded-xl text-center group hover:bg-primary-50 transition-all duration-300 shadow-lg"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-all duration-300 transform group-hover:-rotate-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 group-hover:text-primary-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-neutral-800 group-hover:text-primary-700">"Tá chovendo..."</div>
                <div className="text-sm text-neutral-600 mt-2 group-hover:text-primary-600">
                  Sol de rachar em Gouveia
                  <span className="block mt-1 text-xs italic">* Nem tem previsão de chuva pros próximos 3 meses</span>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Usada 89 vezes este semestre
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="bg-white p-6 rounded-xl text-center group hover:bg-primary-50 transition-all duration-300 shadow-lg"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-all duration-300 transform group-hover:rotate-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 group-hover:text-primary-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-neutral-800 group-hover:text-primary-700">"Tô chegando"</div>
                <div className="text-sm text-neutral-600 mt-2 group-hover:text-primary-600">
                  Ainda tá em casa...
                  <span className="block mt-1 text-xs italic">* Nem acordou ainda</span>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Usada 247 vezes este semestre
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white p-6 rounded-xl text-center group hover:bg-primary-50 transition-all duration-300 shadow-lg"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-all duration-300 transform group-hover:-rotate-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 group-hover:text-primary-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-neutral-800 group-hover:text-primary-700">"Tô doente viado"</div>
                <div className="text-sm text-neutral-600 mt-2 group-hover:text-primary-600">
                  Só queria ficar em casa	
                  <span className="block mt-1 text-xs italic">* Passou a noite inteira jogando</span>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Usada 73 vezes este semestre
                </div>
              </motion.div>
            </div>

            {/* conquistas épicas*/}
            <div className="max-w-4xl mx-auto mt-20">
              <div className="text-center mb-12">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-4"
                >
                  Conquistas que você pode desbloquear
                </motion.h3>
                <p className="text-neutral-600">Prove que você não é um cabaço!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg group hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg mb-2">O Improvável</h4>
                  <p className="text-sm text-neutral-600">30 dias sem inventar desculpa</p>
                  <div className="mt-4 h-2 bg-neutral-100 rounded-full">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">1/30 dias</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg group hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Flash do Joviano</h4>
                  <p className="text-sm text-neutral-600">Chegou 15min antes da aula</p>
                  <div className="mt-4 h-2 bg-neutral-100 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">0/1 vez</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg group hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Lendário</h4>
                  <p className="text-sm text-neutral-600">100% de presença no bimestre</p>
                  <div className="mt-4 h-2 bg-neutral-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Quase lá!</p>
                </motion.div>
              </div>
            </div>

            {/* Contador Universal de Desculpas */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Contador Universal de Desculpas</h3>
                <div className="text-5xl font-bold text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  362
                </div>
                <p className="text-neutral-600">Desculpas diferentes registradas este semestre</p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-800">#1</div>
                    <div className="text-sm text-neutral-600">"Dormi demais"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-800">#2</div>
                    <div className="text-sm text-neutral-600">"Tô chegando"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-800">#3</div>
                    <div className="text-sm text-neutral-600">"5 minutinhos"</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* call to action*/}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-center"
            >
              <h3 className="text-2xl font-bold mb-6">
                Pronto para entrar pro Hall da Falta?
              </h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="inline-block bg-primary-600 cursor-pointer text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:bg-primary-500 transition-colors duration-300"
              >
                Começar Agora e Virar Lenda
              </motion.div>
              <p className="mt-4 text-neutral-600 text-sm">
                * Nenhuma desculpa foi maltratada durante a criação deste site
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/*footer*/}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/Logo_SVG.svg"
                  alt="Logo The Guys Of Falta"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </Link>
              <h3 className="text-2xl font-bold">TheGuysOfFalta</h3>
              <p className="text-neutral-400 mt-2">Transformando presença em conquistas</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3">Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/login" className="text-neutral-400 hover:text-white transition-colors">Entrar</Link></li>
                  <li><Link href="/register" className="text-neutral-400 hover:text-white transition-colors">Registrar</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Contato</h4>
                <ul className="space-y-2">
                  <li className="text-neutral-400">contato@theguysoffalta.com</li>
                  <li className="text-neutral-400">Gouveia - MG, Brasil</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center md:text-left md:flex md:justify-between md:items-center">
            <p>&copy; {new Date().getFullYear()} TheGuysOfFalta. Todos os direitos reservados.</p>
            <div className="mt-4 md:mt-0 flex gap-4 justify-center md:justify-start">
              <a href="https://www.instagram.com/joaopedro.jar/" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/Crowlevy" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.465.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
