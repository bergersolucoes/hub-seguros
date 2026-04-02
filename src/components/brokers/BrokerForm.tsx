import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Broker } from '@/hooks/useBrokers';

type BrokerFormData = Omit<Broker, 'id' | 'created_at' | 'updated_at'>;

type BrokerFormState = {
  company_name: string;
  trade_name: string;
  cnpj: string;
  contact_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  address: string;
  is_active: boolean;
  priority_level: number;
  weekly_capacity: number;
  accepts_auto_distribution: boolean;
  accepts_manual_distribution: boolean;
  notes: string;
};

interface BrokerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broker?: Broker | null;
  onSubmit: (data: BrokerFormData) => void;
  isLoading?: boolean;
}

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export function BrokerForm({ open, onOpenChange, broker, onSubmit, isLoading }: BrokerFormProps) {
  const [form, setForm] = useState<BrokerFormState>({
    company_name: '',
    trade_name: '',
    cnpj: '',
    contact_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    state: '',
    address: '',
    is_active: true,
    priority_level: 0,
    weekly_capacity: 0,
    accepts_auto_distribution: false,
    accepts_manual_distribution: true,
    notes: '',
  });

  useEffect(() => {
    if (broker) {
      setForm({
        company_name: broker.company_name || '',
        trade_name: broker.trade_name || '',
        cnpj: broker.cnpj || '',
        contact_name: broker.contact_name || '',
        email: broker.email || '',
        phone: broker.phone || '',
        whatsapp: broker.whatsapp || '',
        city: broker.city || '',
        state: broker.state || '',
        address: broker.address || '',
        is_active: broker.is_active ?? true,
        priority_level: broker.priority_level ?? 0,
        weekly_capacity: broker.weekly_capacity ?? 0,
        accepts_auto_distribution: broker.accepts_auto_distribution ?? false,
        accepts_manual_distribution: broker.accepts_manual_distribution ?? true,
        notes: broker.notes || '',
      });
    } else {
      setForm({
        company_name: '', trade_name: '', cnpj: '', contact_name: '', email: '', phone: '', whatsapp: '',
        city: '', state: '', address: '', is_active: true, priority_level: 0, weekly_capacity: 0,
        accepts_auto_distribution: false, accepts_manual_distribution: true, notes: '',
      });
    }
  }, [broker, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const set = <K extends keyof BrokerFormState>(key: K, value: BrokerFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{broker ? 'Editar Corretora' : 'Nova Corretora'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="dados" className="mt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="dados">Dados</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="config">Configuração</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Razão Social *</Label>
                  <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <Input value={form.trade_name} onChange={(e) => set('trade_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contato" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.state} onChange={(e) => set('state', e.target.value)}>
                    <option value="">Selecione</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço</Label>
                  <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Input type="number" value={form.priority_level} onChange={(e) => set('priority_level', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Capacidade Semanal</Label>
                  <Input type="number" value={form.weekly_capacity} onChange={(e) => set('weekly_capacity', Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativa</Label>
                  <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Aceita distribuição automática</Label>
                  <Switch checked={form.accepts_auto_distribution} onCheckedChange={(v) => set('accepts_auto_distribution', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Aceita distribuição manual</Label>
                  <Switch checked={form.accepts_manual_distribution} onCheckedChange={(v) => set('accepts_manual_distribution', v)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
