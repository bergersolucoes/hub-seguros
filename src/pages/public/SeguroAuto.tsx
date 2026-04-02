import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, CheckCircle } from 'lucide-react';

const coberturas = [
  'Colisão, roubo e furto',
  'Danos a terceiros',
  'Assistência 24h',
  'Carro reserva',
  'Vidros e retrovisores',
];

export default function SeguroAuto() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Seguro Auto</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Proteção completa para seu veículo com coberturas flexíveis e preços competitivos.
        </p>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Coberturas incluídas</h2>
          <ul className="space-y-3">
            {coberturas.map((c) => (
              <li key={c} className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />{c}
              </li>
            ))}
          </ul>
        </div>
        <Button size="lg" asChild>
          <Link to="/cotacao/auto">Solicitar Cotação Gratuita</Link>
        </Button>
      </div>
    </div>
  );
}
