import Header from '../src/components/Header';
import Sidebar from '../src/components/Sidebar';
import { useAuth } from '../src/components/context/AuthContext';
export default function DashboardLayout({ title, subtitle, menus, children }) {
  const { user, logout } = useAuth();
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="flex w-full flex-col lg:flex-row">
        <Sidebar menus={menus} user={user} onLogout={logout} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
// fixed inset-0 avec overflow-hidden pour fixé sidebare et header,empêche le scroll (sidebare tout visible sans scroll)
//flex-1 Prend tout l'espace vertical disponible
//overflow-y-auto pour le contenu de main peut scroll