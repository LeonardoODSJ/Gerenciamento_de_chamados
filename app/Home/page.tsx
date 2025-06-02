'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-xl">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start p-6 sm:p-10">
      {/* Header Section */}
      <div className="w-full max-w-5xl text-left mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-400 mb-4 animate-fade-in">
          Gestão de Chamados
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200">
          {greeting}, <span className="font-semibold text-blue-300">{session.user?.name}</span>!
        </p>
        <p className="text-gray-400 italic mt-2 text-lg">
          Transforme a confiança digital em eficiência operacional.
        </p>
        <p className="text-gray-300 mt-1">
          Gerencie chamados com agilidade e inteligência, integrado ao Azure Text Analytics.
        </p>
      </div>

      {/* Cards Section */}
<div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="group bg-neutral-800 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[200px] flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-blue-300 mb-4">Criar Chamado</h2>
      <p className="text-gray-400 mb-6">Inicie um novo chamado com descrições detalhadas e análise de sentimento automática.</p>
    </div>
    <button
      onClick={() => router.push('/chamados')}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label="Acessar página para criar novo chamado"
    >
      Criar Novo Chamado
    </button>
  </div>

  <div className="group bg-neutral-800 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[200px] flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-blue-300 mb-4">Ver Chamados</h2>
      <p className="text-gray-400 mb-6">Acompanhe o status e os detalhes de todos os chamados abertos.</p>
    </div>
    <button
      onClick={() => router.push('/chamados')}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label="Acessar página de listagem de chamados"
    >
      Visualizar Chamados
    </button>
  </div>
</div>

    </div>
  );
}