import {
  LayoutDashboard, Users, FileText, Building2, Package, DollarSign,
  BarChart3, ClipboardList, UserCog, Settings, ScrollText, Shield,
  Briefcase, UserCircle,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';

const dispatcherItems = [
  { title: 'Dashboard', url: '/dispatcher/dashboard', icon: LayoutDashboard },
  { title: 'Leads', url: '/dispatcher/leads', icon: ClipboardList },
  { title: 'Oportunidades', url: '/dispatcher/oportunidades', icon: FileText },
  { title: 'Corretoras', url: '/dispatcher/corretoras', icon: Building2 },
  { title: 'Produtos', url: '/dispatcher/produtos', icon: Package },
  { title: 'Financeiro', url: '/dispatcher/financeiro', icon: DollarSign },
  { title: 'Relatórios', url: '/dispatcher/relatorios', icon: BarChart3 },
];

const corretoraItems = [
  { title: 'Dashboard', url: '/corretora/dashboard', icon: LayoutDashboard },
  { title: 'Oportunidades', url: '/corretora/oportunidades', icon: FileText },
  { title: 'Clientes', url: '/corretora/clientes', icon: Users },
  { title: 'Financeiro', url: '/corretora/financeiro', icon: DollarSign },
  { title: 'Equipe', url: '/corretora/equipe', icon: UserCog },
  { title: 'Perfil', url: '/corretora/perfil', icon: UserCircle },
];

const adminItems = [
  { title: 'Usuários', url: '/admin/usuarios', icon: UserCog },
  { title: 'Produtos', url: '/admin/produtos', icon: Package },
  { title: 'Regras', url: '/admin/regras', icon: Settings },
  { title: 'Fees', url: '/admin/fees', icon: DollarSign },
  { title: 'Logs', url: '/admin/logs', icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { isAdmin, isDispatcher, isCorretora } = useRole();

  const renderGroup = (label: string, items: typeof dispatcherItems) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="hover:bg-muted/50"
                  activeClassName="bg-muted text-primary font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="font-bold text-foreground">Hub Seguros</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isDispatcher && renderGroup('Dispatcher', dispatcherItems)}
        {isCorretora && renderGroup('Corretora', corretoraItems)}
        {isAdmin && renderGroup('Administração', adminItems)}
      </SidebarContent>
    </Sidebar>
  );
}
