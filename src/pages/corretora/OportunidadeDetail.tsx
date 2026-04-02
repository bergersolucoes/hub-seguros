import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityStatusBadge } from '@/components/leads/OpportunityStatusBadge';
import { useBrokerOpportunity, useOpportunityHistory, useUpdateOpportunityStatus } from '@/hooks/useBrokerPanel';
import { useLeadAnswers } from '@/hooks/useLeads';
import type { OpportunityStatus } from '@/hooks/useOpportunities';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, XCircle, Phone, Mail, MapPin, Clock, History } from 'lucide-react';

const progressStatuses: { value: OpportunityStatus; label: string }[] = [
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'contato_realizado', label: 'Contato Realizado' },
  { value: 'proposta_emitida', label: 'Proposta Emitida' },
  { value: 'negociacao', label: 'Negociação' },
];

export default function OportunidadeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: opp, isLoading } = useBrokerOpportunity(id);
  const { data: history } = useOpportunityHistory(id);
  const { data: answers } = useLeadAnswers(opp?.lead_id);
  const updateStatus = useUpdateOpportunityStatus();

  const [showLostDialog, setShowLostDialog] = useState(false);
  const [lostReason, setLostReason] = useState('');
  const [notes, setNotes] = useState('');
  const [progressStatus, setProgressStatus] = useState<OpportunityStatus | ''>('');

  if (isLoading) return <PageShell title="Carregando..."><Skeleton className="h-64 w-full" /></PageShell>;
  if (!opp) return <PageShell title="Oportunidade não encontrada"><Button variant="outline" onClick={() => navigate('/corretora/oportunidades')}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button></PageShell>;

  const handleAccept = () => updateStatus.mutate({ id: opp.id, currentStatus: opp.status, newStatus: 'aceita' });
  const handleRefuse = () => updateStatus.mutate({ id: opp.id, currentStatus: opp.status, newStatus: 'recusada' });
  const handleClose = () => updateStatus.mutate({ id: opp.id, currentStatus: opp.status, newStatus: 'fechada' });
  const handleLost = () => {
    if (!lostReason.trim()) return;
    updateStatus.mutate({ id: opp.id, currentStatus: opp.status, newStatus: 'perdida', lostReason });
    setShowLostDialog(false);
  };
  const handleProgress = () => {
    if (!progressStatus) return;
    updateStatus.mutate({ id: opp.id, currentStatus: opp.status, newStatus: progressStatus, internalNotes: notes || undefined });
    setProgressStatus('');
    setNotes('');
  };

  const canAcceptRefuse = opp.status === 'enviada';
  const canProgress = ['aceita', 'em_atendimento', 'contato_realizado', 'proposta_emitida', 'negociacao'].includes(opp.status);
  const canClose = ['em_atendimento', 'contato_realizado', 'proposta_emitida', 'negociacao'].includes(opp.status);
  const canLose = ['aceita', 'em_atendimento', 'contato_realizado', 'proposta_emitida', 'negociacao'].includes(opp.status);

  return (
    <PageShell
      title={`Oportunidade — ${opp.leads?.full_name || 'Lead'}`}
      description={`Criada em ${format(new Date(opp.created_at), 'dd/MM/yyyy HH:mm')}`}
      actions={<Button variant="outline" onClick={() => navigate('/corretora/oportunidades')}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Lead data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Dados do Lead
                <OpportunityStatusBadge status={opp.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Nome</dt><dd className="font-medium">{opp.leads?.full_name || '—'}</dd></div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />Email</dt>
                  <dd>{opp.leads?.email || '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />Telefone</dt>
                  <dd>{opp.leads?.phone || '—'}</dd>
                </div>
                <div><dt className="text-muted-foreground">WhatsApp</dt><dd>{opp.leads?.whatsapp || '—'}</dd></div>
                <div><dt className="text-muted-foreground">CPF/CNPJ</dt><dd>{opp.leads?.cpf_cnpj || '—'}</dd></div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Cidade/UF</dt>
                  <dd>{[opp.leads?.city, opp.leads?.state].filter(Boolean).join('/') || '—'}</dd>
                </div>
                <div><dt className="text-muted-foreground">Produto</dt><dd>{opp.products?.name || '—'}</dd></div>
                <div><dt className="text-muted-foreground">Melhor horário</dt><dd>{opp.leads?.best_contact_time || '—'}</dd></div>
              </dl>
              {opp.leads?.notes && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  <strong>Observações do lead:</strong> {opp.leads.notes}
                </div>
              )}
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

          {/* SLA info */}
          {opp.sla_accept_until && opp.status === 'enviada' && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>SLA de aceite: <strong>{format(new Date(opp.sla_accept_until), 'dd/MM/yyyy HH:mm')}</strong></span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal notes */}
          {opp.internal_notes && (
            <Card>
              <CardHeader><CardTitle>Notas Internas</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{opp.internal_notes}</p></CardContent>
            </Card>
          )}

          {/* History */}
          {history && history.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-4 w-4" />Histórico</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-start gap-3 text-sm border-b last:border-0 pb-3 last:pb-0">
                      <div className="shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {h.previous_status && <Badge variant="outline" className="text-xs">{h.previous_status}</Badge>}
                          {h.previous_status && <span className="text-muted-foreground">→</span>}
                          <Badge variant="secondary" className="text-xs">{h.new_status}</Badge>
                        </div>
                        {h.note && <p className="text-muted-foreground mt-1">{h.note}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(h.created_at), 'dd/MM/yyyy HH:mm')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions sidebar */}
        <div className="space-y-6">
          {canAcceptRefuse && (
            <Card>
              <CardHeader><CardTitle>Responder</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleAccept} disabled={updateStatus.isPending}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Aceitar Oportunidade
                </Button>
                <Button className="w-full" variant="destructive" onClick={handleRefuse} disabled={updateStatus.isPending}>
                  <XCircle className="h-4 w-4 mr-2" /> Recusar
                </Button>
              </CardContent>
            </Card>
          )}

          {canProgress && (
            <Card>
              <CardHeader><CardTitle>Atualizar Andamento</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={progressStatus} onValueChange={(v) => setProgressStatus(v as OpportunityStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    {progressStatuses
                      .filter((s) => {
                        const order = ['aceita', 'em_atendimento', 'contato_realizado', 'proposta_emitida', 'negociacao'];
                        return order.indexOf(s.value) > order.indexOf(opp.status);
                      })
                      .map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Observação (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                <Button className="w-full" onClick={handleProgress} disabled={!progressStatus || updateStatus.isPending}>
                  Atualizar Status
                </Button>
              </CardContent>
            </Card>
          )}

          {canClose && (
            <Card>
              <CardHeader><CardTitle>Finalizar</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleClose} disabled={updateStatus.isPending}>
                  🏆 Marcar como Fechada
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setShowLostDialog(true)} disabled={updateStatus.isPending}>
                  Marcar como Perdida
                </Button>
              </CardContent>
            </Card>
          )}

          {canLose && !canClose && (
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full" variant="outline" onClick={() => setShowLostDialog(true)} disabled={updateStatus.isPending}>
                  Marcar como Perdida
                </Button>
              </CardContent>
            </Card>
          )}

          {opp.lost_reason && (
            <Card>
              <CardHeader><CardTitle>Motivo da Perda</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{opp.lost_reason}</p></CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lost dialog */}
      <Dialog open={showLostDialog} onOpenChange={setShowLostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Perdida</DialogTitle>
            <DialogDescription>Informe o motivo da perda desta oportunidade.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo da perda (obrigatório)..."
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLostDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleLost} disabled={!lostReason.trim() || updateStatus.isPending}>
              Confirmar Perda
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
