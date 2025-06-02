"use client";
import { signIn } from "next-auth/react";
import { FC } from "react";

interface LoginProps {
  isDevMode: boolean;
}

export const LogIn: FC<LoginProps> = (props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 animate-gradient-bg">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 w-full max-w-md shadow-xl border border-blue-300/30 transition-all duration-500 hover:scale-105">
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-3xl -z-10 animate-pulse" />
        
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
            Bem-vindo
          </h1>
          <p className="text-blue-200 text-center mb-4 text-lg font-medium">
            Gerenciamento de Chamados de Serviço
          </p>
          <p className="text-blue-300 text-center mb-8 text-sm">
            Faça login com sua conta Microsoft
          </p>
          <button
            onClick={() => signIn('azure-ad')}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.04c-5.5 0-10 4.5-10 10 0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12.55L15.5 12 11 16.55V12H7v-1.5h4V7.45zm2 5.05v1.5h4v1.5h-4v1.5l4.5-4.55L13 9.5z" />
            </svg>
            Login com Microsoft
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-bg {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-bg 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};