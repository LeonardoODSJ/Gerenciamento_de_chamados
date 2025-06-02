'use client';
import '../globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  sentiment: string;
}

export default function TicketManager() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch token on page load
  useEffect(() => {
    const fetchToken = async (retries = 3) => {
      try {
        console.log('Fetching token, page started.');
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-App-Key': process.env.NEXT_PUBLIC_INTERNAL_APP_KEY || '',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP Error: ${response.status}, ${JSON.stringify(errorData.errors)}`);
        }
        const data = await response.json();
        if (data.status === 'SUCCESS' && data.token) {
          setToken(data.token);
        } else {
          throw new Error('Token not obtained');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        if (retries > 0) {
          setTimeout(() => fetchToken(retries - 1), 1000);
        } else {
          console.error('Failed to load token after retries');
        }
      }
    };

    if (status === 'authenticated' && !token) {
      fetchToken();
    }
  }, [status, token]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Load tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/tickets', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error loading tickets');
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    };

    fetchTickets();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      console.error('Token not available for creating ticket');
      return;
    }
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setCategory('');
        setIsModalOpen(false);
        const newTickets = await fetch('/api/tickets', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());
        setTickets(newTickets);
      } else {
        const errorData = await response.json();
        console.error('Error creating ticket:', errorData);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

const handleDelete = async (id: string) => {
  if (!confirm('Tem certeza que deseja excluir este chamado?')) {
    return;
  }

  if (!token) {
    console.error('Token not available for deleting ticket');
    return;
  }

  try {
    const response = await fetch(`/api/tickets?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Update ticket list
      const newTickets = await fetch('/api/tickets', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      setTickets(newTickets);
    } else {
      const errorData = await response.json();
      console.error('Error deleting ticket:', errorData);
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
  }
};

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setCategory('');
  };

if (status === 'loading') {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full max-w-4xl px-4">
        <h2 className="text-xl font-semibold mb-2">Lista de Chamados</h2>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left font-medium text-gray-500">ID</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Título</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Descrição</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Categoria</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Sentimento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-4 text-center">Carregando chamados...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="space-y-8 w-full max-w-4xl mx-auto px-4 py-8">
    {/* Botão para abrir o modal */}
    <div>
      <button
        onClick={openModal}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Criar Novo Chamado
      </button>
    </div>

    {/* Modal para criar chamado */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Criar Novo Chamado</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                Título
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-gray-900 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Descrição
              </label>
              <input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="text-gray-900 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="text-gray-900 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!token}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              >
                Criar Chamado
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Lista de chamados */}
    <div>
      <h2 className="text-xl font-semibold mb-2">Lista de Chamados</h2>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b">
            <tr>
              <th className="h-12 px-4 text-left font-medium text-gray-500">ID</th>
              <th className="h-12 px-4 text-left font-medium text-gray-500">Título</th>
              <th className="h-12 px-4 text-left font-medium text-gray-500">Descrição</th>
              <th className="h-12 px-4 text-left font-medium text-gray-500">Categoria</th>
              <th className="h-12 px-4 text-left font-medium text-gray-500">Sentimento</th>
              <th className="h-12 px-4 text-left font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-700">
                <td className="p-4">{ticket.id}</td>
                <td className="p-4">{ticket.title}</td>
                <td className="p-4">{ticket.description}</td>
                <td className="p-4">{ticket.category}</td>
                <td className="p-4">{ticket.sentiment}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Excluir chamado"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}