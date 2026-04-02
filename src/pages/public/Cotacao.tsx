import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const produtoLabels: Record<string, string> = {
  auto: 'Seguro Auto',
  saude: 'Seguro Saúde Empresarial',
  consorcio: 'Consórcio',
};

export default function Cotacao() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Integrar com tabela de leads
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    navigate('/obrigado');
  };

  return (
    <div className="py-16">
      <div className="container max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Cotação</CardTitle>
            <CardDescription>
              {produtoLabels[slug || ''] || 'Produto'} — Preencha seus dados para receber uma cotação personalizada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" required placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" required placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem">Detalhes adicionais</Label>
                <Textarea id="mensagem" placeholder="Conte mais sobre o que precisa..." rows={3} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
