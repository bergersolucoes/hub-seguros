import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartPulse, CheckCircle } from 'lucide-react';

const beneficios = [
  'Ampla rede de hospitais e clínicas',
  'Cobertura nacional',
  'Planos PME a partir de 2 vidas',
  'Telemedicina inclusa',
  'Sem carência para urgências',
];

export default function SeguroSaude() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Seguro Saúde Empresarial</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Planos de saúde para empresas de todos os portes com condições especiais.
        </p>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Benefícios</h2>
          <ul className="space-y-3">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />{b}
              </li>
            ))}
          </ul>
        </div>
        <Button size="lg" asChild>
          <Link to="/cotacao/saude">Solicitar Cotação Gratuita</Link>
        </Button>
      </div>
    </div>
  );
}
