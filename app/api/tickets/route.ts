import { NextResponse } from 'next/server';
import { container } from '@/app/lib/cosmos';
import { analyzeSentiment } from '@/app/lib/sentimentAnalysis';
import { v4 as uuidv4 } from 'uuid';

// Middleware para validar o token
async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Token não fornecido', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  // Se o token está presente, considera como válido sem verificar com JWT
  return { valid: true, decoded: { token } };
}

export async function GET(req: Request) {
  try {
    // Validar o token
    const { valid, error, status } = await validateToken(req);
    if (!valid) {
      return NextResponse.json({ error }, { status });
    }

    // Buscar apenas onde isDelete = false e o campo existe
    const query = {
      query: "SELECT * FROM c WHERE IS_DEFINED(c.isDelete) AND c.isDelete = @isDelete",
      parameters: [
        { name: "@isDelete", value: false }
      ]
    };

    const { resources: tickets } = await container.items.query(query).fetchAll();

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    return NextResponse.json({ error: 'Falha ao buscar tickets' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    // Validar o token
    const { valid, error, status } = await validateToken(req);
    if (!valid) {
      return NextResponse.json({ error }, { status });
    }

    const { title, description, category } = await req.json();

    // Validação
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    // Análise de sentimento
    const prompt = `Analise a descrição a seguir e responda **apenas** com o sentimento correspondente, precedido pelo ícone. Use: 😊 Positivo | 😐 Neutro | 😞 Negativo. Não adicione nenhuma explicação. Descrição: ${description}`;

    // Obter o token do cabeçalho para a análise de sentimento, se necessário
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || '';

    const sentiment = await analyzeSentiment(prompt, token);

    // Criar chamado
    const ticket = {
      id: uuidv4(), // Usando UUID para o Cosmos DB
      title,
      description,
      category,
      sentiment,
      createdAt: new Date().toISOString(),
      isDelete: false,
    };

    const { resource } = await container.items.create(ticket);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return NextResponse.json({ error: 'Falha ao criar ticket' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { valid, error, status } = await validateToken(request);
    if (!valid) {
      return NextResponse.json({ error }, { status });
    }

    // Tentar obter o id do corpo da requisição
    let id;
    try {
      const body = await request.json();
      id = body.id;
    } catch (e) {
      // Se o corpo estiver vazio ou inválido, tentar obter o id dos query parameters
      const { searchParams } = new URL(request.url);
      id = searchParams.get('id');
    }

    if (!id) {
      return NextResponse.json({ error: 'ID do ticket ausente' }, { status: 400 });
    }

    // Buscar o item usando o id como partition key
    const { resource: ticket } = await container.item(id, id).read();
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    // Atualizar isDelete para true
    ticket.isDelete = true;
    const { resource } = await container.item(id, id).replace(ticket);

    return NextResponse.json({ message: 'Ticket marcado como deletado' }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao marcar ticket como deletado:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Falha ao marcar ticket como deletado', details: error.message }, { status: 500 });
  }
}