"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Toaster } from "react-hot-toast";

//icons nav - declarar aqui
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const BadgesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RankingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20V14" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState({
    streak: 0,
    rank: 0,
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      
      setIsAuthChecked(true);
    };
    
    checkAuth();
  }, [status, router, pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/stats`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    };
    
    if (isAuthChecked && session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id, isAuthChecked]);

  if (!isAuthChecked || status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="text-primary-700 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { name: "Conquistas", href: "/badges", icon: <BadgesIcon /> },
    { name: "Histórico", href: "/history", icon: <HistoryIcon /> },
    { name: "Ranking", href: "/ranking", icon: <RankingIcon /> },
    { name: "Configurações", href: "/settings", icon: <SettingsIcon /> },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      <Toaster position="top-right" />
      
      {/*sidebar*/}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:block transition-all duration-300 ease-in-out bg-white border-r border-neutral-200 shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/*logo toggle*/}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Link href="/" className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold text-primary-600`}>
              TheGuysOfFalta
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors duration-200"
              aria-label={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>

          {/*resumo do perfil*/}
          <div className={`flex items-center p-4 border-b border-neutral-200 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {getInitials(session?.user?.name)}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-neutral-900 truncate">{session?.user?.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-primary-600 font-medium">🔥 {userData.streak} dias</span>
                  <span className="text-xs text-neutral-500">•</span>
                  <span className="text-xs text-neutral-500">#{userData.rank || '-'}</span>
                </div>
              </div>
            )}
          </div>

          {/*nav menu*/}
          <nav className="mt-4 flex-1 px-2 space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <span className={`${pathname === item.href ? 'text-primary-600' : 'text-neutral-500'}`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/*logout*/}
          <div className="p-4 border-t border-neutral-200 mt-auto">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200`}
            >
              <span className="text-neutral-500">
                <LogoutIcon />
              </span>
              {isSidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </div>

      {/*main*/}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/*navbar topo*/}
        <header className="bg-white border-b border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors duration-200"
                aria-label="Abrir menu"
              >
                <MenuIcon />
              </button>
              <h1 className="text-lg font-semibold text-neutral-900">
                {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-medium text-xs">
                  {getInitials(session?.user?.name)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50">
          {children}
        </main>
      </div>

      {/*mobile sidebar overlay*/}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <Link href="/" className="text-xl font-bold text-primary-600">
                TheGuysOfFalta
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors duration-200"
                aria-label="Fechar menu"
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="flex items-center p-4 border-b border-neutral-200">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {getInitials(session?.user?.name)}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-neutral-900 truncate">{session?.user?.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-primary-600 font-medium">🔥 {userData.streak} dias</span>
                  <span className="text-xs text-neutral-500">•</span>
                  <span className="text-xs text-neutral-500">#{userData.rank || '-'}</span>
                </div>
              </div>
            </div>
            
            <nav className="mt-4 flex-1 px-3 space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span className={`${pathname === item.href ? 'text-primary-600' : 'text-neutral-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t border-neutral-200 mt-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
              >
                <span className="text-neutral-500">
                  <LogoutIcon />
                </span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 