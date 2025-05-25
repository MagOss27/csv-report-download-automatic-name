'use client';
import React, { useState } from 'react';

export default function Sobre() {
  const [baixando, setBaixando] = useState(false);

  const handleDownload = async () => {
    setBaixando(true);
    try {
      const response = await fetch('http://localhost:8000/relatorio');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.csv';
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao baixar o relatório');
      console.error(err);
    }
    setBaixando(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">Sobre o App</h1>

      {/* 🔽 Botão de download */}
      <button
        onClick={handleDownload}
        disabled={baixando}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {baixando ? 'Baixando...' : 'Baixar Relatório'}
      </button>
    </div>
  );
}
