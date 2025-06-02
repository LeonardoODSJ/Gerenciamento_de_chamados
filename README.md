🎟️ Gerenciamento de Chamados de Serviço
   
Bem-vindo ao Gerenciamento de Chamados de Serviço, uma aplicação para Avaliação da CNI web responsiva para criar e listar chamados corporativos, com integração de análise de sentimento via um endpoint personalizado. Este projeto utiliza tecnologias de ponta para oferecer uma interface intuitiva e um back-end robusto, garantindo eficiência e escalabilidade.
📋 Visão Geral
Esta aplicação permite:

Criar chamados: Usuários podem registrar novos chamados com título, descrição e categoria.
Listar chamados: Exibe todos os chamados em uma tabela com ID, título, descrição, categoria e sentimento.
Análise de sentimento: Integração com um endpoint personalizado (https://servicos.com.br/api/chat) para analisar o sentimento das descrições.
Persistência de dados: Armazena os chamados no Azure Cosmos DB, garantindo alta disponibilidade e escalabilidade.

A interface é responsiva, funcionando perfeitamente em dispositivos desktop e móveis, e usa Tailwind CSS para uma estilização elegante e acessível.
🛠️ Tecnologias Utilizadas

Next.js 15.3.2 ⚛️Framework React para construção de aplicações web com renderização híbrida (SSR e SSG). Utilizamos a pasta app/ para roteamento e APIs RESTful.

TypeScript 5 🟦Adiciona tipagem estática ao JavaScript, garantindo maior robustez e manutenibilidade do código.

Tailwind CSS 3.3.0 🎨Framework CSS utilitário para estilização rápida e responsiva, com suporte a temas personalizados e design acessível.

Azure Cosmos DB 4.0.0 ☁️Banco de dados NoSQL distribuído para armazenamento escalável dos chamados, integrado via SDK @azure/cosmos.

Endpoint de Análise de Sentimento 🌐Integração com o endpoint personalizado para análise de sentimento (positivo, negativo ou neutro) das descrições dos chamados.

UUID 🔢Biblioteca para geração de identificadores únicos para os chamados no Cosmos DB.


🚀 Como Configurar e Executar
Pré-requisitos

Node.js (v18 ou superior)
Conta Azure com Cosmos DB configurado

Passos

Clone o repositório:
git clone <URL_DO_REPOSITORIO>
cd my-ticket-app


Instale as dependências:
npm install


Configure as variáveis de ambiente:Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

#segurança
NODE_ENV=development
NEXT_PUBLIC_INTERNAL_APP_KEY=
INTERNAL_APP_KEY=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_IA_URL=
AUTH_URL=
COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DATABASE=
COSMOS_CONTAINER="
SENTIMENT_API_URL="


Configure o Azure Cosmos DB:

Crie um banco de dados TicketsDB e um contêiner Tickets com uma chave de partição (ex.: /category).
Atualize o .env com as credenciais do Cosmos DB.


Inicie o servidor de desenvolvimento:
npm run dev


Acesse a aplicação:Abra o navegador em http://localhost:3000.


🔗 Endpoints da API

GET /api/ticketsRetorna a lista de todos os chamados armazenados no Cosmos DB.

POST /api/ticketsCria um novo chamado. Exemplo de corpo da requisição:
{
  "title": "Problema com impressora",
  "description": "A impressora não está funcionando corretamente.",
  "category": "TI"
}


Validações: title, description e category são obrigatórios.
Integra com o endpoint de análise de sentimento para determinar o sentimento da descrição.


🎨 Funcionalidades da Interface

Formulário de Criação: Permite criar chamados com título, descrição e categoria (TI, RH, Manutenção).
Tabela de Chamados: Exibe todos os chamados com ID, título, descrição, categoria e sentimento, estilizada para ser responsiva e acessível.
Responsividade: Layout ajustado para desktop e mobile usando Tailwind CSS.
Atualização em Tempo Real: A tabela é atualizada automaticamente após a criação de um novo chamado.

📝 Notas Adicionais

Acessibilidade: A interface usa classes Tailwind para garantir contraste e navegação acessível.
Escalabilidade: O uso do Cosmos DB permite lidar com grandes volumes de dados.
Manutenibilidade: TypeScript e a estrutura modular do Next.js facilitam a manutenção do código.
Segurança: Validações no front-end e back-end garantem que os dados sejam consistentes.

🤝 Contribuições
Contribuições são bem-vindas! Para sugerir melhorias:

Faça um fork do repositório.
Crie uma branch (git checkout -b feature/nova-funcionalidade).
Commit suas alterações (git commit -m 'Adiciona nova funcionalidade').
Envie um pull request.


🌟 Desenvolvido com 💻 por LeonardoODSJ
