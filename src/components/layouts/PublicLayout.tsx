import { Outlet, Link } from 'react-router-dom';
import { Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Hub Seguros</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/seguros" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Produtos
            </Link>
            <Link to="/seguro/auto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Auto
            </Link>
            <Link to="/seguro/saude" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Saúde
            </Link>
            <Link to="/seguro/consorcio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Consórcio
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/seguros">Solicitar Cotação</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/50 py-12">
        <div className="container grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Hub Seguros</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Central de oportunidades de seguros para corretoras parceiras.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Produtos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/seguro/auto" className="hover:text-foreground">Seguro Auto</Link></li>
              <li><Link to="/seguro/saude" className="hover:text-foreground">Seguro Saúde</Link></li>
              <li><Link to="/seguro/consorcio" className="hover:text-foreground">Consórcio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (11) 9999-9999</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@hubseguros.com</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
