import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!slug) {
        throw new Error('Produto inválido para cotação.');
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('public_page_enabled', true)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) {
        throw new Error('Este produto não está disponível para cotação no momento.');
      }

      const { error: leadError } = await supabase.from('leads').insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: message.trim() || null,
        product_id: product.id,
        source: 'site_publico',
        status: 'novo',
      });

      if (leadError) throw leadError;

      navigate('/obrigado');
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Não foi possível enviar sua solicitação agora.';
      toast({
        title: 'Erro ao enviar cotação',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
                <Input id="nome" required placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" required placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem">Detalhes adicionais</Label>
                <Textarea id="mensagem" placeholder="Conte mais sobre o que precisa..." rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
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
