export const metadata = {
  title: 'App Finanças',
  description: 'Controle suas finanças',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
