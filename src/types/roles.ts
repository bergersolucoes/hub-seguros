export type AppRole = 'admin' | 'dispatcher' | 'dono_corretora' | 'operador_corretora';

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  dispatcher: 'Dispatcher',
  dono_corretora: 'Dono da Corretora',
  operador_corretora: 'Operador da Corretora',
};

export const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-destructive text-destructive-foreground',
  dispatcher: 'bg-primary text-primary-foreground',
  dono_corretora: 'bg-accent text-accent-foreground',
  operador_corretora: 'bg-secondary text-secondary-foreground',
};
