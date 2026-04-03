import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const { signIn, user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!pendingRedirect || loading || !user) return;

    if (roles.includes('admin')) {
      navigate('/admin/usuarios', { replace: true });
      return;
    }

    if (roles.includes('dispatcher')) {
      navigate('/dispatcher/dashboard', { replace: true });
      return;
    }

    if (roles.includes('dono_corretora') || roles.includes('operador_corretora')) {
      navigate('/corretora/dashboard', { replace: true });
      return;
    }

    toast({
      title: 'Acesso não configurado',
      description: 'Seu usuário está autenticado, mas não possui um perfil válido para acessar o painel.',
      variant: 'destructive',
    });
    setPendingRedirect(false);
    setIsLoading(false);
    navigate('/', { replace: true });
  }, [loading, navigate, pendingRedirect, roles, toast, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setIsLoading(false);
      setPendingRedirect(false);
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
    } else {
      setPendingRedirect(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Acesse o Hub de Oportunidades de Seguros</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
