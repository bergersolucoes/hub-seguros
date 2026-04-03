import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const produtoLabels: Record<string, string> = {
  auto: 'Seguro Auto',
  saude: 'Seguro Saude Empresarial',
  consorcio: 'Consorcio',
};

export default function Cotacao() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProduct, setIsCheckingProduct] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setIsCheckingProduct(true);

      if (!slug) {
        if (!active) return;
        setProductId(null);
        setProductName(null);
        setIsCheckingProduct(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('public_page_enabled', true)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setProductId(null);
        setProductName(null);
      } else {
        setProductId(data.id);
        setProductName(data.name);
      }

      setIsCheckingProduct(false);
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!productId) {
        throw new Error('Este produto nao esta disponivel para cotacao no momento.');
      }

      const { error: leadError } = await supabase.from('leads').insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: message.trim() || null,
        product_id: productId,
        source: 'site_publico',
        status: 'novo',
      });

      if (leadError) throw leadError;

      navigate('/obrigado');
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Nao foi possivel enviar sua solicitacao agora.';
      toast({
        title: 'Erro ao enviar cotacao',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingProduct) {
    return (
      <div className="py-16">
        <div className="container max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Carregando cotacao</CardTitle>
              <CardDescription>Estamos verificando a disponibilidade do produto selecionado.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="py-16">
        <div className="container max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Produto indisponivel</CardTitle>
              <CardDescription>
                O produto solicitado nao esta disponivel para cotacao no momento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/seguros">Voltar para selecao de produtos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Cotacao</CardTitle>
            <CardDescription>
              {productName || produtoLabels[slug || ''] || 'Produto'} - Preencha seus dados para receber uma cotacao personalizada.
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
                {isLoading ? 'Enviando...' : 'Enviar Solicitacao'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
