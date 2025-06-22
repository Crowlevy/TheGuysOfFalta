"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  position: number;
  name: string | null;
  email: string | null;
  image: string | null;
  currentStreak: number;
  maxStreak: number;
  totalDays: number;
  isCurrentUser: boolean;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export default function RankingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [orderBy, setOrderBy] = useState("currentStreak");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/ranking");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await fetch(`/api/ranking?page=${pagination.page}&pageSize=${pagination.pageSize}&orderBy=${orderBy}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar os dados do ranking");
        }
        
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (error: any) {
        console.error("Erro ao buscar ranking:", error);
        setError(error.message || "Ocorreu um erro ao buscar os dados");
      } finally {
        setLoading(false);
      }
    };
    
    if (status === "authenticated") {
      fetchRanking();
    }
  }, [pagination.page, pagination.pageSize, orderBy, status]);

  const filteredUsers = users.filter(user => 
    !searchTerm || 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sort: string) => {
    setOrderBy(sort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/*head*/}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ranking</h1>
        <p className="text-gray-600">
          Compare seu desempenho com outros participantes e mantenha-se motivado!
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/*filter search*/}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
              value={orderBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="currentStreak">Streak Atual</option>
              <option value="maxStreak">Streak Máximo</option>
              <option value="totalDays">Total de Presenças</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 p-2.5 w-full"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/*rankinh*/}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak Atual
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak Máximo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Presenças
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        {searchTerm ? 'Nenhum usuário encontrado com esse termo de busca.' : 'Não há usuários no ranking.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className={user.isCurrentUser ? "bg-blue-50" : undefined}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.position <= 3 ? (
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                user.position === 1 ? 'bg-yellow-100 text-yellow-600' : 
                                user.position === 2 ? 'bg-gray-100 text-gray-600' : 
                                'bg-orange-100 text-orange-600'
                              } font-bold text-sm`}>
                                {user.position}
                              </div>
                            ) : (
                              <div className="text-gray-600 w-8 text-center font-medium">
                                {user.position}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.image ? (
                              <img className="h-10 w-10 rounded-full" src={user.image} alt={user.name || ""} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "Usuário"}
                              </div>
                              {user.isCurrentUser && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Você
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{user.currentStreak} dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.maxStreak} dias</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.totalDays} dias</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/*paginação*/}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
                      </span>{" "}
                      de <span className="font-medium">{pagination.totalCount}</span> resultados
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        pagination.page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page === pagination.totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        pagination.page === pagination.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 