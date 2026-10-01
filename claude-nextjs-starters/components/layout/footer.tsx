import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Container from "./container";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <Container>
        <div className="py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg">{siteConfig.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm">링크</h4>
              <ul className="mt-3 space-y-2">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm">소셜</h4>
              <ul className="mt-3 space-y-2">
                {Object.entries(siteConfig.links).map(([name, url]) => (
                  <li key={name}>
                    <Link
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="mt-8" />

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 {siteConfig.name}. 모든 권리 보유.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">
                개인정보 보호
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
