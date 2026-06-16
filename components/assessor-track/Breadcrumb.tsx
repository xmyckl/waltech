import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav className="at-crumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'contents' }}>
          {i > 0 && <span style={{ opacity: 0.4 }} aria-hidden="true">›</span>}
          {item.href
            ? <Link href={item.href}>{item.label}</Link>
            : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
