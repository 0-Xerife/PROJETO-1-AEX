'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/participantes', label: 'Participantes', icon: '◎' },
  { href: '/simulacoes', label: 'Simulações', icon: '▤' },
  { href: '/resultados', label: 'Resultados', icon: '▥' },
] as const;

export function Navigation() {
  const pathname = usePathname();
  return <nav aria-label="Navegação principal">{links.map((link) => (
    <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
      <span aria-hidden="true">{link.icon}</span>{link.label}
    </Link>
  ))}</nav>;
}
