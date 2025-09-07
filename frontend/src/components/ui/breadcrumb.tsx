import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`text-sm text-gray-500 mb-6 ${className}`} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={item.label}>
          {item.href && !item.active ? (
            <Link href={item.href} className="hover:underline text-gray-500">{item.label}</Link>
          ) : (
            <span className={item.active ? "text-gray-800 font-medium" : "text-gray-500"}>{item.label}</span>
          )}
          {idx < items.length - 1 && <span> / </span>}
        </span>
      ))}
    </nav>
  );
}
