'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(30);
  const router = useRouter();

  const BLOCK_TIME = 30 * 1000; // 30 segundos em milissegundos

  useEffect(() => {
    // Verificar localStorage ao carregar a página
    const storedAttempts = Number(localStorage.getItem('loginAttempts')) || 0;
    const blockUntil = Number(localStorage.getItem('blockUntil')) || 0;
    const now = Date.now();

    if (blockUntil && now < blockUntil) {
      const remaining = Math.ceil((blockUntil - now) / 1000);
      setIsBlocked(true);
      setTimer(remaining);
      startCountdown(remaining);
    } else {
      setAttempts(storedAttempts);
      localStorage.removeItem('blockUntil');
    }
  }, []);

  const startCountdown = (initialTime = 30) => {
    let timeLeft = initialTime;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsBlocked(false);
        setAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('blockUntil');
        setTimer(30);
      }
    }, 1000);
  };

  const handleLogin = () => {
    if (isBlocked) return;

    if (password === '1234') {
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('blockUntil');
      localStorage.setItem('token', 'meu-token-secreto');
      router.push('/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');
      localStorage.setItem('loginAttempts', newAttempts);

      if (newAttempts >= 3) {
        const blockUntil = Date.now() + BLOCK_TIME;
        localStorage.setItem('blockUntil', blockUntil);
        setIsBlocked(true);
        startCountdown(30);
      } else {
        alert(`Senha incorreta! Tentativas restantes: ${3 - newAttempts}`);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="password"
        placeholder="Digite a senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isBlocked}
        className="border px-2 py-1 mr-2"
      />
      <button
        onClick={handleLogin}
        disabled={isBlocked}
        className={`px-4 py-2 rounded ${isBlocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'}`}
      >
        {isBlocked ? `Aguarde ${timer}s` : 'Entrar'}
      </button>
    </div>
  );
}
