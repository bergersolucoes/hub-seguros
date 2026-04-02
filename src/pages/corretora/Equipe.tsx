import { useState } from 'react';
import { PageShell } from '@/components/PageShell';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useBrokerTeam } from '@/hooks/useBrokerPanel';
import { useRole } from '@/hooks/useRole';
import { Users, Plus, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function CorretoraEquipe() {
  const { isDonoCorretora } = useRole();
  const { data: team, isLoading } = useBrokerTeam();
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'broker_operator' });
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: !currentActive })
      .eq('id', userId);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      qc.invalidateQueries({ queryKey: ['broker_team'] });
      toast({ title: currentActive ? 'Usuário desativado' : 'Usuário ativado' });
    }
  };

  return (
    <PageShell
      title="Equipe"
      description="Gerencie os operadores da sua corretora."
      actions={
        isDonoCorretora ? (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> Novo Operador
          </Button>
        ) : undefined
      }
    >
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              {isDonoCorretora && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !team?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum membro na equipe.
                </TableCell>
              </TableRow>
            ) : (
              team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{member.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {member.role === 'broker_owner' ? 'Dono' : 'Operador'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? 'default' : 'secondary'} className={member.is_active ? 'bg-emerald-500' : ''}>
                      {member.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  {isDonoCorretora && (
                    <TableCell className="text-right">
                      {member.role !== 'broker_owner' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(member.id, member.is_active ?? true)}
                        >
                          {member.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog - placeholder for invite flow */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Operador</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Nome</label>
              <Input value={newUser.name} onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input type="email" value={newUser.email} onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Telefone</label>
              <Input value={newUser.phone} onChange={(e) => setNewUser((u) => ({ ...u, phone: e.target.value }))} />
            </div>
            <p className="text-xs text-muted-foreground">
              O operador receberá um convite por email para criar sua conta e terá acesso ao painel da corretora.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
              <Button disabled>
                Enviar Convite (em breve)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
