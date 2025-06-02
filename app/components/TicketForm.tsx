// 'use client';

// import { useState } from 'react';

// export default function TicketForm() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const response = await fetch('/api/tickets', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title, description, category }),
//     });

//     if (response.ok) {
//       setTitle('');
//       setDescription('');
//       setCategory('');
//       window.location.reload();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-foreground">
//           Título
//         </label>
//         <input
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//         />
//       </div>
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-foreground">
//           Descrição
//         </label>
//         <input
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//         />
//       </div>
//       <div>
//         <label htmlFor="category" className="block text-sm font-medium text-foreground">
//           Categoria
//         </label>
//         <select
//           id="category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//         >
//           <option value="" disabled>
//             Selecione uma categoria
//           </option>
//           <option value="TI">TI</option>
//           <option value="RH">RH</option>
//           <option value="Manutenção">Manutenção</option>
//         </select>
//       </div>
//       <button
//         type="submit"
//         className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
//       >
//         Criar Chamado
//       </button>
//     </form>
//   );
// }