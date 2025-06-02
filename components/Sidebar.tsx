'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, X } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarVisible, toggleSidebar } = useSidebar(); // pegando toggle também

  const navItems = [
    { href: '/Home', label: 'Home' },
    { href: '/chamados', label: 'Chamados ' },
  ];

  return (
    <div className={`fixed z-50 top-0 left-0 w-64 h-screen bg-[var(--secondary-dark)] p-4 text-[var(--text-light)] transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Chamados - CNI </h2>
        <button
          onClick={toggleSidebar}
          className="text-[var(--text-light)] hover:text-white"
          aria-label="Fechar Sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-2 px-4 rounded transition-colors duration-200 ${pathname === item.href ? 'bg-[var(--primary-dark)]' : 'hover:bg-[var(--primary-dark)]'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2 py-2 px-4 rounded bg-[var(--accent-orange)] text-white hover:bg-orange-600 transition-colors duration-300"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );
}
