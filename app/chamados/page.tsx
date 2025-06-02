
import TicketTable from "../components/TicketTable";


export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Chamados</h1>
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Criar Novo Chamado</h2>
        <TicketForm />
      </div> */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de Chamados</h2>
        <TicketTable />
      </div>
    </main>
  );
}