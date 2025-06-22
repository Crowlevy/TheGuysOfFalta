import Link from "next/link";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/*header - preciso melhorar ele*/}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/Logo_Roxa.svg"
                alt="Logo The Guys Of Falta porra"
                width={64}
                height={64}
                className="object-contain"
              />
              <span className="text-primary-600 font-bold text-xl">TheGuysOfFalta</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-primary-700 text-sm">
                Início
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-primary-700 text-sm">
                Entrar
              </Link>
              <Link href="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm">
                Registrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/*main*/}
      <main className="flex-grow">
        {children}
      </main>

      {/*footer pra melhorar também*/}
      <footer className="bg-white py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} TheGuysOfFalta. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Política de privacidade</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Termos de uso</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 