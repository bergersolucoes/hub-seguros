import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, HeartPulse, PiggyBank } from 'lucide-react';

const produtos = [
  { title: 'Seguro Auto', desc: 'Proteção completa para veículos com coberturas personalizáveis.', icon: Car, slug: 'auto' },
  { title: 'Seguro Saúde Empresarial', desc: 'Planos de saúde para empresas com ampla rede credenciada.', icon: HeartPulse, slug: 'saude' },
  { title: 'Consórcio', desc: 'Consórcios para imóveis, veículos e serviços com parcelas acessíveis.', icon: PiggyBank, slug: 'consorcio' },
];

export default function Seguros() {
  return (
    <div className="py-16">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Nossos Produtos</h1>
        <p className="text-muted-foreground mb-10">Conheça as opções de seguros disponíveis para cotação.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {produtos.map((p) => (
            <Card key={p.slug} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4 text-center">
                <p.icon className="h-10 w-10 mx-auto text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
                <div className="flex flex-col gap-2">
                  <Button size="sm" asChild>
                    <Link to={`/cotacao/${p.slug}`}>Solicitar Cotação</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/seguro/${p.slug}`}>Saiba mais</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
