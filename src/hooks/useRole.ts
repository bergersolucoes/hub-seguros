import { useAuth } from '@/contexts/AuthContext';
import type { AppRole } from '@/types/roles';

export function useRole() {
  const { roles } = useAuth();

  const hasRole = (role: AppRole) => roles.includes(role);
  const hasAnyRole = (checkRoles: AppRole[]) => checkRoles.some((r) => roles.includes(r));
  const isAdmin = hasRole('admin');
  const isDispatcher = hasRole('dispatcher');
  const isCorretora = hasAnyRole(['dono_corretora', 'operador_corretora']);
  const isDonoCorretora = hasRole('dono_corretora');

  return { roles, hasRole, hasAnyRole, isAdmin, isDispatcher, isCorretora, isDonoCorretora };
}
