import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PiggyBank, CheckCircle } from 'lucide-react';

const vantagens = [
  'Sem juros — apenas taxa de administração',
  'Parcelas que cabem no seu bolso',
  'Contemplação por lance ou sorteio',
  'Imóveis, veículos e serviços',
  'Flexibilidade de crédito',
];

export default function SeguroConsorcio() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Consórcio</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Planeje suas conquistas com consórcios inteligentes e parcelas acessíveis.
        </p>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Vantagens</h2>
          <ul className="space-y-3">
            {vantagens.map((v) => (
              <li key={v} className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />{v}
              </li>
            ))}
          </ul>
        </div>
        <Button size="lg" asChild>
          <Link to="/cotacao/consorcio">Solicitar Cotação Gratuita</Link>
        </Button>
      </div>
    </div>
  );
}
