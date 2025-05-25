'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  const [msg, setMsg] = useState('');
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setTokenChecked(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !saldo) {
      setMsg('Preencha nome e saldo');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/adicionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, valor: parseFloat(saldo) }),
      });

      const data = await response.json();
      if (response.ok) {
        setMsg('Registro adicionado com sucesso');
        setNome('');
        setSaldo('');
      } else {
        setMsg(data.msg || 'Erro ao adicionar registro');
      }
    } catch (error) {
      setMsg('Erro na comunicação com o servidor');
    }
  };

  const handleDownloadRelatorio = async () => {
  try {
    const response = await fetch('http://localhost:8000/relatorio');
    if (!response.ok) throw new Error('Erro ao gerar relatório');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // NÃO defina link.download aqui — o navegador usará o nome do header
    link.setAttribute("download", ""); // permite que Content-Disposition seja usado

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    setMsg('Erro ao baixar relatório');
  }
};

  if (!tokenChecked) return null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Saldo"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          step="0.01"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar Registro
        </button>
      </form>

      {msg && <p className="text-sm text-green-600">{msg}</p>}

      <div className="space-y-2 mt-6">
        <button
          onClick={handleDownloadRelatorio}
          className="w-full bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
        >
          Baixar Relatório
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
