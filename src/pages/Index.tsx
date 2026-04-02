import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Car, HeartPulse, PiggyBank, ArrowRight, CheckCircle } from 'lucide-react';

const produtos = [
  { title: 'Seguro Auto', desc: 'Proteção completa para seu veículo com as melhores coberturas.', icon: Car, slug: 'auto', color: 'text-blue-600' },
  { title: 'Seguro Saúde', desc: 'Planos empresariais e individuais com ampla rede credenciada.', icon: HeartPulse, slug: 'saude', color: 'text-emerald-600' },
  { title: 'Consórcio', desc: 'Realize seus objetivos com parcelas que cabem no seu bolso.', icon: PiggyBank, slug: 'consorcio', color: 'text-amber-600' },
];

const beneficios = [
  'Cotação rápida e sem compromisso',
  'Comparação entre diversas corretoras',
  'Atendimento personalizado',
  'Melhores preços do mercado',
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Encontre o seguro ideal para você
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Compare cotações de corretoras parceiras e contrate o melhor seguro em minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/cotacao/auto">Solicitar Cotação <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/seguros">Ver Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-10 text-foreground">Nossos Produtos</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {produtos.map((p) => (
              <Card key={p.slug} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <p.icon className={`h-10 w-10 mx-auto ${p.color}`} />
                  <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/seguro/${p.slug}`}>Saiba mais</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Por que escolher o Hub Seguros?</h2>
          <ul className="space-y-4">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
