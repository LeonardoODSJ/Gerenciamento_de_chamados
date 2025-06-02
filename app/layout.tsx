// app/layout.tsx
'use client';

import './globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <SessionProvider>
          <SidebarProvider>
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoginPage = pathname === '/';

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center text-[var(--text-light)]">Carregando...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar só aparece se estiver logado e não for a tela de login */}
      {session && !isLoginPage && <Sidebar />}

      {/* Botão de abrir a sidebar, visível apenas se ela estiver fechada */}
      {!isSidebarVisible && session && !isLoginPage && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-[var(--secondary-dark)] text-white p-2 rounded shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <main className={`flex-1 transition-all duration-300 ${session && isSidebarVisible && !isLoginPage ? 'ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}

