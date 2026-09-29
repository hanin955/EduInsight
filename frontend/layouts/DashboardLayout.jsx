import { useState } from 'react';
import Header from '../src/components/Header';
import Sidebar from '../src/components/Sidebar';
import { useAuth } from '../src/components/context/AuthContext';
export default function DashboardLayout({ title, subtitle, menus, children }) {
  const { user, logout, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex w-full flex-col lg:flex-row">
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
            lg:static lg:z-auto lg:w-auto lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar
            menus={menus}
            user={user}
            onLogout={logout}
            onUserUpdate={updateUser}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            title={title}
            subtitle={subtitle}
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// fixed inset-0 + overflow-hidden : empêche le scroll global, garde sidebar/header en place
// mobile/tablette (< lg) : sidebar en position fixed, cachée par défaut, ouverte via bouton burger dans Header (onMenuClick)
// desktop (lg+) : sidebar redevient statique et toujours visible, comportement d'origine conservé
// backdrop : ferme la sidebar au clic en dehors, uniquement visible en dessous de lg
// flex-1 : main prend l'espace restant ; overflow-y-auto : seul le contenu scrolle