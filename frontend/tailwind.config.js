/** @type {import('tailwindcss').Config} */
// Define o tipo do arquivo como configuração do Tailwind para melhor autocomplete e validação.

module.exports = {
  // Define quais arquivos o Tailwind deve analisar para encontrar classes CSS utilizadas
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // Inclui todos os arquivos JS/TS/JSX/TSX dentro da pasta 'app'
    "./pages/**/*.{js,ts,jsx,tsx}",      // Inclui todos os arquivos nas rotas da pasta 'pages' (se usada)
    "./components/**/*.{js,ts,jsx,tsx}", // Inclui todos os arquivos na pasta 'components'
  ],
  theme: {
    extend: {
      // Aqui você pode adicionar ou sobrescrever estilos padrão do Tailwind
      // Exemplo: cores personalizadas, fontes, espaçamentos, etc.
    },
  },
  plugins: [
    // Lista de plugins Tailwind para funcionalidades adicionais
    // Ex: require('@tailwindcss/forms'), etc.
  ],
};