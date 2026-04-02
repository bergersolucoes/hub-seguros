import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function Obrigado() {
  return (
    <div className="py-20">
      <div className="container max-w-md mx-auto text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">Obrigado!</h1>
        <p className="text-muted-foreground">
          Sua solicitação foi recebida. Uma corretora parceira entrará em contato em breve.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
