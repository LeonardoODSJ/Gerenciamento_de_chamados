export async function analyzeSentiment(description: string, token: string): Promise<string> {
  try {
    const apiUrl = process.env.SENTIMENT_API_URL;
    if (!apiUrl) throw new Error('SENTIMENT_API_URL não definida');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mensagem: description }),
    });

    if (!response.ok) {
      throw new Error('Falha ao analisar sentimento');
    }

    // Usar response.text() em vez de response.json(), já que a API retorna uma string
    const sentiment = await response.text();
    return sentiment; // Retorna diretamente a string, ex.: "😞 Negativo"
  } catch (error) {
    console.error('Erro na análise de sentimento:', error);
    return '😊 Neutro'; // Fallback para "Neutro" com ícone, mantendo o formato esperado
  }
}