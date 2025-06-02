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

    const { resources: tickets } = await container.items.readAll().fetchAll();
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
    };

    const { resource } = await container.items.create(ticket);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return NextResponse.json({ error: 'Falha ao criar ticket' }, { status: 500 });
  }
}