import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { DispatchModal } from '@/components/leads/DispatchModal';
import { useLead, useLeadAnswers, useLeadMutations, type LeadStatus } from '@/hooks/useLeads';
import { useSuggestedBrokers } from '@/hooks/useOpportunities';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, XCircle, Send, RefreshCw, Building2, TrendingUp, Zap, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: lead, isLoading } = useLead(id);
  const { data: answers } = useLeadAnswers(id);
  const { data: suggestedBrokers } = useSuggestedBrokers(
    lead && ['qualificado', 'aguardando_despacho', 'redistribuicao'].includes(lead.status) ? id : undefined
  );
  const { updateStatus } = useLeadMutations();
  const [notes, setNotes] = useState('');
  const [showDispatch, setShowDispatch] = useState(false);

  if (isLoading) {
    return (
      <PageShell title="Carregando...">
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (!lead) {
    return (
      <PageShell title="Lead não encontrado">
        <Button variant="outline" onClick={() => navigate('/dispatcher/leads')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </PageShell>
    );
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    await updateStatus.mutateAsync({ id: lead.id, status: newStatus, notes: notes || undefined });
    toast({ title: `Lead atualizado para "${newStatus}"` });
  };

  const canQualify = ['novo', 'em_triagem'].includes(lead.status);
  const canDiscard = ['novo', 'em_triagem'].includes(lead.status);
  const canDispatch = ['qualificado', 'aguardando_despacho', 'redistribuicao'].includes(lead.status);
  const canTriagem = lead.status === 'novo';
  const canRedistribute = lead.status === 'despachado';

  return (
    <PageShell
      title={lead.full_name}
      description={`Lead criado em ${format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm')}`}
      actions={
        <Button variant="outline" onClick={() => navigate('/dispatcher/leads')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Dados do Lead
                <LeadStatusBadge status={lead.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Nome</dt><dd className="font-medium">{lead.full_name}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd>{lead.email || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Telefone</dt><dd>{lead.phone || '—'}</dd></div>
                <div><dt className="text-muted-foreground">WhatsApp</dt><dd>{lead.whatsapp || '—'}</dd></div>
                <div><dt className="text-muted-foreground">CPF/CNPJ</dt><dd>{lead.cpf_cnpj || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Cidade/UF</dt><dd>{[lead.city, lead.state].filter(Boolean).join('/') || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Produto</dt><dd>{lead.products?.name || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Origem</dt><dd>{lead.source || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Melhor horário</dt><dd>{lead.best_contact_time || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Score</dt><dd>{lead.qualification_score ?? '—'}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {/* Answers */}
          {answers && answers.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Respostas do Formulário</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {answers.map((a) => (
                    <div key={a.id}>
                      <dt className="text-muted-foreground">{a.field_key}</dt>
                      <dd className="font-medium">{a.answer_text || JSON.stringify(a.answer_json) || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Observações Internas</CardTitle></CardHeader>
            <CardContent>
              {lead.notes && <p className="text-sm text-muted-foreground mb-3">{lead.notes}</p>}
              <Textarea
                placeholder="Adicionar observação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions + Suggestions sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {canTriagem && (
                <Button className="w-full justify-start" variant="outline" onClick={() => handleStatusChange('em_triagem')}>
                  📋 Iniciar Triagem
                </Button>
              )}
              {canQualify && (
                <Button className="w-full justify-start" variant="outline" onClick={() => handleStatusChange('aguardando_despacho')}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Qualificar
                </Button>
              )}
              {canDiscard && (
                <Button className="w-full justify-start" variant="outline" onClick={() => handleStatusChange('descartado')}>
                  <XCircle className="h-4 w-4 mr-2" /> Descartar
                </Button>
              )}
              {canDispatch && (
                <Button className="w-full justify-start" onClick={() => setShowDispatch(true)}>
                  <Send className="h-4 w-4 mr-2" /> Despachar
                </Button>
              )}
              {canRedistribute && (
                <Button className="w-full justify-start" variant="outline" onClick={() => handleStatusChange('redistribuicao')}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Redistribuir
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Suggested brokers */}
          {canDispatch && suggestedBrokers && suggestedBrokers.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Corretoras Elegíveis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {suggestedBrokers.slice(0, 5).map((b, idx) => (
                  <div key={b.broker_id} className="text-sm space-y-1 pb-3 last:pb-0 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{b.company_name}</span>
                      {idx === 0 && <span className="text-xs text-amber-600 font-semibold">★ Top</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground ml-5">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />P:{b.priority_level}</span>
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{b.current_capacity_used}/{b.weekly_capacity || '∞'}</span>
                      {b.region_match && <span className="flex items-center gap-1 text-emerald-600"><MapPin className="h-3 w-3" />Região</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DispatchModal
        open={showDispatch}
        onOpenChange={setShowDispatch}
        leadId={lead.id}
        leadName={lead.full_name}
        productId={lead.product_id}
        onSuccess={() => navigate('/dispatcher/leads')}
      />
    </PageShell>
  );
}
