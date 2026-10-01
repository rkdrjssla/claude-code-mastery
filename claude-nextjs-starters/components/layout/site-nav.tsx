import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function SiteNav() {
  return (
    <nav className="flex gap-6">
      {siteConfig.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
