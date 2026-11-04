export default function Loading() {
  return <div role="status" aria-live="polite" aria-busy="true"><p className="eyebrow">AEX / Acompanhamento</p><h1>Carregando dados demonstrativos…</h1><p>Preparando indicadores e resultados.</p><div className="metrics" aria-hidden="true">{[1, 2, 3, 4].map((item) => <div className="skeleton" key={item} />)}</div></div>;
}
