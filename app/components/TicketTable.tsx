'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Importando useSession do next-auth

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  sentiment: string;
}

export default function TicketManager() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Obtendo status e session do next-auth
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Buscar o token ao carregar a página
  useEffect(() => {
    const fetchToken = async (retries = 3) => {
      try {
        console.log('Buscando token, página iniciada.');
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-App-Key': process.env.NEXT_PUBLIC_INTERNAL_APP_KEY || '',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro HTTP: ${response.status}, ${JSON.stringify(errorData.errors)}`);
        }
        const data = await response.json();
        if (data.status === 'SUCCESS' && data.token) {
          setToken(data.token);
        } else {
          throw new Error('Token não obtido');
        }
      } catch (error) {
        console.error('Erro ao buscar token:', error);
        if (retries > 0) {
          setTimeout(() => fetchToken(retries - 1), 1000);
        } else {
          console.error('Falha ao carregar token após tentativas');
        }
      }
    };

    if (status === 'authenticated' && !token) {
      fetchToken();
    }
  }, [status, token]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Carregar tickets na montagem do componente
  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return; // Evitar chamada se o token não estiver disponível
      try {
        const response = await fetch('/api/tickets', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Incluindo o token no cabeçalho
          },
        });
        if (!response.ok) {
          throw new Error('Erro ao carregar tickets');
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      }
    };

    fetchTickets();
  }, [token]); // Dependência no token para garantir que ele esteja disponível

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      console.error('Token não disponível para criar o chamado');
      return;
    }
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluindo o token no cabeçalho
        },
        body: JSON.stringify({ title, description, category }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setCategory('');
        // Atualizar a lista de tickets
        const newTickets = await fetch('/api/tickets', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Incluindo o token no cabeçalho
          },
        }).then((res) => res.json());
        setTickets(newTickets);
      } else {
        const errorData = await response.json();
        console.error('Erro ao criar chamado:', errorData);
      }
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Criação de Chamado */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Criar Novo Chamado</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Título
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Descrição
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!token} // Desabilitar o botão se o token não estiver disponível
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            Criar Chamado
          </button>
        </form>
      </div>

      {/* Tabela de Chamados */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de Chamados</h2>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Título</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Descrição</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Categoria</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Sentimento</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{ticket.id}</td>
                  <td className="p-4">{ticket.title}</td>
                  <td className="p-4">{ticket.description}</td>
                  <td className="p-4">{ticket.category}</td>
                  <td className="p-4">{ticket.sentiment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}