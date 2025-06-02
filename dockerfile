FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG NEXT_PUBLIC_INTERNAL_APP_KEY

COPY . .
RUN npm run build

FROM node:18-slim

# Instala o bash, curl e sudo, se necessário
RUN apt-get update && apt-get install -y bash curl sudo

# Instala o Azure Dev CLI (executado como root)
RUN curl -fsSL https://aka.ms/install-azd.sh | bash

# Cria um usuário não-root para maior segurança
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app
COPY --from=builder /app .

COPY start.sh /start.sh
RUN chmod +x /start.sh && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
ENV NODE_ENV=production
CMD ["/start.sh"]
