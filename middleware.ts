import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const requireAuth: string[] = [
  "/Home",
  "/api",
  "/reporting",
  "/unauthorized",
  "/chamados",
];
const requireAdmin: string[] = ["/reporting"];

export async function middleware(request: NextRequest) {
  console.log("🚀 Iniciando middleware para a requisição:", request.url);

  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  console.log("📂 Pathname da requisição:", pathname);

  // 📌 **Verificação de Autenticação**
  const isAuthRequired = requireAuth.some((path) => pathname.startsWith(path));
  console.log(`🔒 A rota "${pathname}" requer autenticação:`, isAuthRequired);

  if (isAuthRequired) {
    console.log("🔍 Tentando obter o token de autenticação.");
    const token = await getToken({
      req: request,
    });
    console.log("🔑 Token obtido:", token ? "Presente" : "Ausente");

    // Verifica se o usuário não está logado
    if (!token) {
      console.warn("⚠️ Token ausente. Redirecionando para a página inicial.");
      const url = new URL(`/`, request.url);
      console.log("🔄 URL de redirecionamento:", url.href);
      return NextResponse.redirect(url);
    }

    // 📌 **Verificação de Permissão de Administrador**
    const isAdminRoute = requireAdmin.some((path) => pathname.startsWith(path));
    console.log(`👮‍♂️ A rota "${pathname}" requer privilégios de administrador:`, isAdminRoute);

    if (isAdminRoute) {
      console.log("🔍 Verificando privilégios de administrador do token.");
      if (!token.isAdmin) {
        console.warn("⚠️ Usuário não é administrador. Reescrevendo para /unauthorized.");
        const url = new URL(`/unauthorized`, request.url);
        console.log("🔄 URL de reescrita:", url.href);
        return NextResponse.rewrite(url);
      } else {
        console.log("✅ Usuário possui privilégios de administrador.");
      }
    } else {
      console.log("ℹ️ A rota não requer privilégios de administrador.");
    }
  } else {
    console.log("ℹ️ A rota atual não requer autenticação.");
  }

  console.log("✅ Middleware concluído. Prosseguindo com a requisição.");
  return res;
}

// 📌 **Configuração do Middleware**
export const config = {
  matcher: [
    "/unauthorized/:path*",
    "/reporting/:path*",
    "/api/Home:path*",
    "/api/images:path*",
    "/Home/:path*",
    "/projeto/:path*",
    "/speech/:path*",
    "/api/download/:path*",
    "/api/speech"
    // "/Home/sandbox:/api/download:path*",
  ],
};
