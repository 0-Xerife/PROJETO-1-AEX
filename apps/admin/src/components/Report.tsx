import Link from 'next/link';
import type { AdminReport, ExerciseRow, ParticipantRow } from '../services/adminService';

export const percentage = (value: number | null) => value === null ? '—' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
export const statusLabels = { completed: 'Concluído', started: 'Em andamento', pending: 'Não iniciado' };

export function PageHeading({ title, description, section }: { title: string; description: string; section: string }) {
  return <header className="page-heading"><p className="eyebrow">AEX / {section}</p><h1>{title}</h1><p>{description}</p></header>;
}

export function EmptyState({ title = 'Nenhum resultado disponível', description = 'Não há respostas demonstrativas para apresentar neste recorte.' }: { title?: string; description?: string }) {
  return <div className="empty-state"><span aria-hidden="true">—</span><h2>{title}</h2><p>{description}</p></div>;
}

export function Metrics({ report }: { report: AdminReport }) {
  const { metrics } = report;
  const cards = [
    { title: 'Participantes', value: metrics.participants, note: `${metrics.active} com respostas registradas` },
    { title: 'Respostas registradas', value: metrics.responses, note: 'Inclui novas tentativas do mesmo exercício' },
    { title: 'Percentual de acertos', value: percentage(metrics.accuracy), note: `${metrics.correct} corretas · ${metrics.incorrect} incorretas` },
    { title: 'Percurso concluído', value: metrics.completed, note: `Conclusão das ${metrics.simulations} simulações disponíveis` },
  ];
  return <div className="metrics">{cards.map((card) => <article className="metric" key={card.title}><h2>{card.title}</h2><strong>{card.value}</strong><p>{card.note}</p></article>)}</div>;
}

export function ResultsChart({ rows }: { rows: readonly ExerciseRow[] }) {
  if (!rows.some((row) => row.metrics.responses > 0)) return <EmptyState />;
  return <figure className="chart">
    <figcaption>Distribuição das respostas por exercício</figcaption>
    <p className="legend"><span><i className="correct-dot" />Corretas</span><span><i className="incorrect-dot" />Incorretas</span></p>
    {rows.map(({ exercise, metrics }) => <div className="chart-row" key={exercise.id}>
      <div className="chart-label"><span>{exercise.title}</span><strong>{percentage(metrics.accuracy)}</strong></div>
      <div className="bar-track" aria-hidden="true"><div className="bar-correct" style={{ width: `${metrics.responses ? metrics.correct / metrics.responses * 100 : 0}%` }} /><div className="bar-incorrect" style={{ width: `${metrics.responses ? metrics.incorrect / metrics.responses * 100 : 0}%` }} /></div>
      <p>{metrics.correct} corretas / {metrics.incorrect} incorretas · {metrics.responses} respostas</p>
    </div>)}
    <p className="caption">Percentuais calculados sobre todas as respostas, incluindo repetições.</p>
  </figure>;
}

export function ParticipationChart({ report }: { report: AdminReport }) {
  if (report.participants.length === 0) return <EmptyState title="Nenhum participante disponível" />;
  return <figure className="chart"><figcaption>Situação dos participantes</figcaption>
    {(['completed', 'started', 'pending'] as const).map((status) => {
      const count = report.participants.filter((participant) => participant.status === status).length;
      return <div className="chart-row" key={status}><div className="chart-label"><span>{statusLabels[status]}</span><strong>{count}</strong></div>
        <div className="bar-track" aria-hidden="true"><div className="bar-neutral" style={{ width: `${count / report.participants.length * 100}%` }} /></div></div>;
    })}<p className="caption">Conclusão indica participação nas atividades, não certificação de segurança.</p>
  </figure>;
}

export function ParticipantsTable({ rows }: { rows: readonly ParticipantRow[] }) {
  if (!rows.length) return <EmptyState title="Nenhum participante encontrado" description="Ajuste a busca ou o filtro de situação para consultar os exemplos disponíveis." />;
  return <div className="table-scroll" role="region" aria-label="Tabela de participantes" tabIndex={0}><table>
    <caption>Participantes fictícios e resultados demonstrativos</caption>
    <thead><tr>{['Participante', 'Turma', 'Situação', 'Concluídos', 'Respostas', 'Corretas', 'Incorretas', 'Acertos'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
    <tbody>{rows.map((row) => <tr key={row.id}><th scope="row"><span className="person-name">{row.name}</span><small>{row.id}</small></th><td>{row.group}</td><td><span className={`status ${row.status}`}>{statusLabels[row.status]}</span></td><td>{row.summary.completed} de {row.summary.total}</td><td>{row.responses}</td><td>{row.correct}</td><td>{row.incorrect}</td><td>{percentage(row.accuracy)}</td></tr>)}</tbody>
  </table></div>;
}

export function ExerciseTable({ rows }: { rows: readonly ExerciseRow[] }) {
  if (!rows.length) return <EmptyState title="Nenhuma simulação disponível" />;
  return <div className="table-scroll" role="region" aria-label="Resultados por exercício" tabIndex={0}><table>
    <caption>Desempenho demonstrativo por exercício</caption><thead><tr>{['Exercício', 'Participantes', 'Respostas', 'Corretas', 'Incorretas', 'Acertos'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
    <tbody>{rows.map(({ exercise, metrics, participants }) => <tr key={exercise.id}><th scope="row">{exercise.title}</th><td>{participants}</td><td>{metrics.responses}</td><td>{metrics.correct}</td><td>{metrics.incorrect}</td><td>{percentage(metrics.accuracy)}</td></tr>)}</tbody>
  </table></div>;
}

export function MethodNote() {
  return <aside className="method-note"><h2>Como interpretar estes dados</h2><p>Acertos = respostas corretas ÷ total de respostas. Repetições entram nessa conta; conclusões são contadas uma vez por exercício e participante. Sem respostas, o percentual aparece como “—”. Nenhum indicador comprova segurança digital na vida real.</p><Link href="/simulacoes">Consultar as simulações <span aria-hidden="true">→</span></Link></aside>;
}
