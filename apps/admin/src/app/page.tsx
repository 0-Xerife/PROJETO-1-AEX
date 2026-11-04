import type { ApplicationInfo } from '@aex/types';

const application: ApplicationInfo = { name: 'AEX', phase: 3 };

export default function HomePage() {
  return (
    <main>
      <header>
        <span className="brand">{application.name}</span>
        <span>Grupo G9 · Poli USP</span>
      </header>
      <section aria-labelledby="title">
        <p className="eyebrow">Conscientização em segurança da informação</p>
        <h1 id="title">
          Aprender a reconhecer.
          <br />
          Agir com mais segurança.
        </h1>
        <p className="intro">
          Uma plataforma de educação e prevenção de golpes, com atenção às pessoas idosas e a
          diferentes níveis de experiência digital.
        </p>
        <div className="status">
          <h2>Base do painel administrativo</h2>
          <p>
            Fase {application.phase}: fundação técnica. A gestão de atividades e participantes será
            construída nas próximas etapas.
          </p>
        </div>
      </section>
      <footer>Projeto acadêmico AEX · Abner, Bruno e Tulio</footer>
    </main>
  );
}
