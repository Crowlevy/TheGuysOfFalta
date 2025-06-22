"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#profile-menu') && !target.closest('#profile-button')) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoggedIn = !!session;
  const username = session?.user?.name?.split(" ")[0] || "Usuário";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.span 
                className="text-primary-600 font-bold text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                TheGuysOfFalta
              </motion.span>
            </Link>
          </div>

          {/*nav desktop*/}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" isActive={false}>
              Início
            </NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink href="/dashboard" isActive={false}>
                  Dashboard
                </NavLink>
                <NavLink href="/ranking" isActive={false}>
                  Ranking
                </NavLink>
                <NavLink href="/badges" isActive={false}>
                  Conquistas
                </NavLink>
                
                {/*dropdown profile*/}
                <div className="relative ml-3">
                  <motion.button
                    id="profile-button"
                    type="button"
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                      isScrolled ? "bg-primary-50 text-primary-700" : "bg-white/80 text-primary-700"
                    } hover:bg-primary-100 transition-all duration-200`}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="mr-1">{username}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        id="profile-menu"
                        className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          Seu Perfil
                        </Link>
                        <Link 
                          href="/settings" 
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          Configurações
                        </Link>
                        <div className="border-t border-neutral-200 my-1"></div>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left block px-4 py-2 text-sm text-error-700 hover:bg-neutral-100"
                        >
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" isActive={false}>
                  Entrar
                </NavLink>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link 
                    href="/register" 
                    className="bg-primary-600 text-white hover:bg-primary-700 ml-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Registrar
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/*mobile menu btn*/}
          <div className="flex items-center md:hidden">
            <motion.button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/*menu monbile*/}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg border-t border-neutral-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/">
                Início
              </MobileNavLink>
              
              {isLoggedIn ? (
                <>
                  <MobileNavLink href="/dashboard">
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/ranking">
                    Ranking
                  </MobileNavLink>
                  <MobileNavLink href="/badges">
                    Conquistas
                  </MobileNavLink>
                  <MobileNavLink href="/profile">
                    Seu Perfil
                  </MobileNavLink>
                  <MobileNavLink href="/settings">
                    Configurações
                  </MobileNavLink>
                  <div 
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error-700 hover:bg-neutral-100 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sair
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login">
                    Entrar
                  </MobileNavLink>
                  <Link 
                    href="/register" 
                    className="block w-full text-center bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-base font-medium mt-2"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? "bg-primary-50 text-primary-700" 
          : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
      }`}
    >
      {children}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
}

function MobileNavLink({ href, children }: MobileNavLinkProps) {
  return (
    <Link 
      href={href} 
      className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
    >
      {children}
    </Link>
  );
} 