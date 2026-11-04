import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Link from 'next/link';
import { Navigation } from '../components/Navigation';

export const metadata: Metadata = {
  title: 'AEX · Administração',
  description: 'Plataforma acadêmica de conscientização em segurança da informação.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <div className="app-shell">
          <aside className="sidebar">
            <Link className="brand" href="/">AEX<span>Administração</span></Link>
            <p className="nav-label">ACOMPANHAMENTO</p>
            <Navigation />
            <div className="sidebar-note"><strong>Educação digital</strong><p>Projeto acadêmico<br />Grupo G9 · Poli USP</p></div>
          </aside>
          <div className="workspace">
            <div className="topbar"><span>Painel de acompanhamento educativo</span><span className="demo-badge">Dados demonstrativos</span></div>
            <div className="demo-notice"><strong>Ambiente de demonstração.</strong> Participantes e respostas são fictícios. Este painel não recebe os dados salvos no aplicativo mobile.</div>
            <main id="conteudo" tabIndex={-1}>{children}</main>
            <footer>AEX · Resultados educativos ilustrativos. Nenhum dado foi coletado de participantes reais.</footer>
          </div>
        </div>
      </body>
    </html>
  );
}
