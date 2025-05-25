'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasAccess(!!token);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao App de Finanças</h1>
      <button onClick={() => router.push('/sobre')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sobre</button>
      <button onClick={() => router.push('/login')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Login</button>
      <button
        onClick={() => hasAccess && router.push('/dashboard')}
        disabled={!hasAccess}
        className={`px-4 py-2 rounded ${hasAccess ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
      >
        Dashboard
      </button>
    </div>
  );
}
