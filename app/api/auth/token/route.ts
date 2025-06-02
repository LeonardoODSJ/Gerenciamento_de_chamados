import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const appKey = request.headers.get('X-Internal-App-Key');
  const INTERNAL_APP_KEY = process.env.INTERNAL_APP_KEY;
  console.log('AppKey:', appKey, 'INTERNAL_APP_KEY:', INTERNAL_APP_KEY);

  if (!appKey || appKey !== INTERNAL_APP_KEY) {
    console.log('Acesso não autorizado:', { appKey, INTERNAL_APP_KEY });
    return NextResponse.json(
      { status: 'ERROR', errors: [{ message: 'Acesso não autorizado. appKey:' + appKey + 'Acesso não autorizado. INTERNAL_APP_KEY:' + INTERNAL_APP_KEY}] },
      { status: 403 }
    );
  }

  try {
    const AUTH_URL = process.env.AUTH_URL;
    console.log('AUTH_URL:', AUTH_URL);

    if (!AUTH_URL) {
      return NextResponse.json(
        { status: 'ERROR', errors: [{ message: 'AUTH_URL não está configurado corretamente.' }] },
        { status: 500 }
      );
    }

    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID || '',
        client_secret: process.env.CLIENT_SECRET || '',
        grant_type: 'client_credentials',
      }).toString(),
    });

    // Ler o corpo da resposta uma única vez
    const responseBody = await authResponse.text();
    console.log('authResponse:', authResponse.status, responseBody);

    // Parsear o corpo como JSON, se necessário
    let authData;
    try {
      authData = JSON.parse(responseBody);
    } catch (error) {
      console.error('Erro ao parsear JSON:', error);
      return NextResponse.json(
        { status: 'ERROR', errors: [{ message: 'Resposta inválida do servidor de autenticação.' }] },
        { status: 500 }
      );
    }

    const token = authData?.access_token;

    if (!token) {
      return NextResponse.json(
        { status: 'ERROR', errors: [{ message: 'Token de autenticação inválido.' }] },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: 'SUCCESS', token }, { status: 200 });
  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json(
      { status: 'ERROR', errors: [{ message: 'Erro interno no servidor.', details: error }] },
      { status: 500 }
    );
  }
}