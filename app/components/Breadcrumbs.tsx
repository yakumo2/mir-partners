"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "": "Home",
  "legendary-partners": "Partners Home",
  dashboard: "Dashboard",
  ecosystem: "Ecosystem",
  simulation: "Simulation",
  "simulation-custom": "Simulation · Custom",
  "simulation-custom-full": "Simulation · Custom Full"
};

function getLabel(segment: string) {
  return LABELS[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname === "/" ? [] : pathname.split("/").filter(Boolean);

  const crumbs = [
    { href: "/", label: "Home" },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return { href, label: getLabel(segment) };
    })
  ];

  if (!segments.length && pathname === "/") {
    return (
      <div className="breadcrumbBar">
        <nav>
          <span>Home</span>
        </nav>
      </div>
    );
  }

  return (
    <div className="breadcrumbBar">
      <nav>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={crumb.href} className="breadcrumbItem">
              {isLast ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
              {!isLast ? <span className="breadcrumbSeparator">›</span> : null}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
