"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

type RankingUser = {
  position: number;
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  currentStreak: number;
  maxStreak: number;
  totalDays: number;
  isCurrentUser: boolean;
};

type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type SortBy = "position" | "currentStreak" | "totalDays" | "maxStreak";

export default function RankingPage() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("position");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const fetchRanking = async () => {
      if (status === "loading") return;
      
      try {
        setIsLoading(true);
        setError("");
        
        const orderByParam = sortBy === "position" ? "currentStreak" : sortBy;
        const response = await fetch(`/api/ranking?page=${pagination.page}&pageSize=${pagination.pageSize}&orderBy=${orderByParam}`);
        
        if (!response.ok) {
          throw new Error("Falha ao buscar dados do ranking");
        }
        
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError("Não foi possível carregar o ranking. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRanking();
  }, [pagination.page, pagination.pageSize, sortBy, status]);
  
  const filteredUsers = users.filter(user => 
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Ranking de Participantes
            </h2>
          </div>
        </div>
        
        {/*filters and search */}
        <div className="mt-4 md:flex md:items-center md:justify-between">
          <div className="flex">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Buscar participante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <span className="text-gray-700">Ordenar por:</span>
            <button
              className={`${sortBy === "position" ? "text-blue-600 font-medium" : "text-gray-500"} hover:text-blue-500`}
              onClick={() => setSortBy("position")}
            >
              Posição
            </button>
            <button
              className={`${sortBy === "currentStreak" ? "text-blue-600 font-medium" : "text-gray-500"} hover:text-blue-500`}
              onClick={() => setSortBy("currentStreak")}
            >
              Streak
            </button>
            <button
              className={`${sortBy === "totalDays" ? "text-blue-600 font-medium" : "text-gray-500"} hover:text-blue-500`}
              onClick={() => setSortBy("totalDays")}
            >
              Total
            </button>
            <button
              className={`${sortBy === "maxStreak" ? "text-blue-600 font-medium" : "text-gray-500"} hover:text-blue-500`}
              onClick={() => setSortBy("maxStreak")}
            >
              Recorde
            </button>
          </div>
        </div>
        
        {/*loading state*/}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/*error message*/}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/*ranking table*/}
        {!isLoading && !error && (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posição
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participante
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Streak Atual
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recorde
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total de Presenças
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            {searchTerm 
                              ? "Nenhum participante encontrado com esse termo de busca" 
                              : "Nenhum participante encontrado"}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className={user.isCurrentUser ? "bg-blue-50" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {user.position === 1 ? (
                                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 font-bold">
                                    1
                                  </span>
                                ) : user.position === 2 ? (
                                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    2
                                  </span>
                                ) : user.position === 3 ? (
                                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-700 flex items-center justify-center text-yellow-100 font-bold">
                                    3
                                  </span>
                                ) : (
                                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                    {user.position}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {user.image ? (
                                  <div className="flex-shrink-0 h-10 w-10 relative">
                                    <Image
                                      className="rounded-full"
                                      src={user.image}
                                      alt={user.name || "Usuário"}
                                      fill
                                      sizes="40px"
                                      style={{ objectFit: "cover" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name || "Usuário sem nome"}
                                  </div>
                                  {user.isCurrentUser && (
                                    <div className="text-xs text-blue-600">
                                      (Você)
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.currentStreak} dias</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.maxStreak} dias</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.totalDays}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/*paginacao*/}
        {!isLoading && !error && pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> a <span className="font-medium">{Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}</span> de <span className="font-medium">{pagination.totalCount}</span> resultados
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  pagination.page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  pagination.page === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        )}
        
        {/*info sec*/}
        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Como funciona o ranking?
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                O ranking é baseado principalmente no streak atual de presenças consecutivas.
                Em caso de empate, são considerados o recorde de streak e o total de presenças.
                Mantenha sua presença diária para subir no ranking!
              </p>
            </div>
            <div className="mt-3">
              <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voltar para o Dashboard <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 