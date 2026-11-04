'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="panel empty-state" role="alert"><h1>Não foi possível carregar esta página</h1><p>Tente novamente para consultar os dados demonstrativos.</p><button onClick={reset}>Tentar novamente</button></section>;
}
