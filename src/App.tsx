import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { AuthenticatedLayout } from "@/components/layouts/AuthenticatedLayout";

// Public pages
import Index from "./pages/Index";
import Seguros from "./pages/public/Seguros";
import SeguroAuto from "./pages/public/SeguroAuto";
import SeguroSaude from "./pages/public/SeguroSaude";
import SeguroConsorcio from "./pages/public/SeguroConsorcio";
import Cotacao from "./pages/public/Cotacao";
import Obrigado from "./pages/public/Obrigado";

// Auth pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dispatcher pages
import DispatcherDashboard from "./pages/dispatcher/Dashboard";
import DispatcherLeads from "./pages/dispatcher/Leads";
import DispatcherOportunidades from "./pages/dispatcher/Oportunidades";
import DispatcherCorretoras from "./pages/dispatcher/Corretoras";
import DispatcherProdutos from "./pages/dispatcher/Produtos";
import DispatcherCorretoraDetail from "./pages/dispatcher/CorretoraDetail";
import DispatcherProdutoDetail from "./pages/dispatcher/ProdutoDetail";
import DispatcherFinanceiro from "./pages/dispatcher/Financeiro";
import DispatcherRelatorios from "./pages/dispatcher/Relatorios";

// Corretora pages
import CorretoraDashboard from "./pages/corretora/Dashboard";
import CorretoraOportunidades from "./pages/corretora/Oportunidades";
import CorretoraClientes from "./pages/corretora/Clientes";
import CorretoraFinanceiro from "./pages/corretora/Financeiro";
import CorretoraPerfil from "./pages/corretora/Perfil";

// Admin pages
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminProdutos from "./pages/admin/Produtos";
import AdminRegras from "./pages/admin/Regras";
import AdminFees from "./pages/admin/Fees";
import AdminLogs from "./pages/admin/Logs";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/seguros" element={<Seguros />} />
              <Route path="/seguro/auto" element={<SeguroAuto />} />
              <Route path="/seguro/saude" element={<SeguroSaude />} />
              <Route path="/seguro/consorcio" element={<SeguroConsorcio />} />
              <Route path="/cotacao/:slug" element={<Cotacao />} />
              <Route path="/obrigado" element={<Obrigado />} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dispatcher routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'dispatcher']}><AuthenticatedLayout /></ProtectedRoute>}>
              <Route path="/dispatcher/dashboard" element={<DispatcherDashboard />} />
              <Route path="/dispatcher/leads" element={<DispatcherLeads />} />
              <Route path="/dispatcher/oportunidades" element={<DispatcherOportunidades />} />
              <Route path="/dispatcher/corretoras" element={<DispatcherCorretoras />} />
              <Route path="/dispatcher/produtos" element={<DispatcherProdutos />} />
              <Route path="/dispatcher/financeiro" element={<DispatcherFinanceiro />} />
              <Route path="/dispatcher/relatorios" element={<DispatcherRelatorios />} />
            </Route>

            {/* Corretora routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'dono_corretora', 'operador_corretora']}><AuthenticatedLayout /></ProtectedRoute>}>
              <Route path="/corretora/dashboard" element={<CorretoraDashboard />} />
              <Route path="/corretora/oportunidades" element={<CorretoraOportunidades />} />
              <Route path="/corretora/clientes" element={<CorretoraClientes />} />
              <Route path="/corretora/financeiro" element={<CorretoraFinanceiro />} />
              <Route path="/corretora/perfil" element={<CorretoraPerfil />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']}><AuthenticatedLayout /></ProtectedRoute>}>
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/produtos" element={<AdminProdutos />} />
              <Route path="/admin/regras" element={<AdminRegras />} />
              <Route path="/admin/fees" element={<AdminFees />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
