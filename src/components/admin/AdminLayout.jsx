import React, { useState } from 'react';
import { Navigate, NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiPackage, FiFolder, FiImage, FiShoppingBag, FiLogOut, FiMenu, FiX, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: FiBarChart2, end: true },
  { to: '/admin/produits', label: 'Produits', icon: FiPackage },
  { to: '/admin/categories', label: 'Catégories', icon: FiFolder },
  { to: '/admin/bannieres', label: 'Welcome Page', icon: FiImage },
  { to: '/admin/commandes', label: 'Commandes', icon: FiShoppingBag },
  { to: '/admin/livraison', label: 'Livraison', icon: FiTruck },
];

function SidebarNav({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-soft px-4 py-2.5 font-display text-sm font-medium transition-colors ${
              isActive
                ? 'bg-nour-lavender-pale text-nour-lavender-dark'
                : 'text-nour-ink/70 hover:bg-nour-lavender-pale/50 hover:text-nour-ink'
            }`
          }
        >
          <link.icon size={18} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nour-cream">
        <p className="font-display text-nour-ink/60">Vérification de la session...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nour-cream px-4 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="font-display text-2xl font-bold">Accès réservé aux administrateurs</h1>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="btn btn-primary btn-md"
        >
          Retour à l’accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nour-cream">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r-2 border-nour-lavender-light/60 bg-white lg:flex">
        <Link to="/" className="flex items-center gap-3 border-b-2 border-nour-lavender-light/60 px-6 py-5">
          <img src={logo} alt="NOUR" className="h-9 w-auto" />
          <span className="rounded-full bg-nour-lavender-pale px-2.5 py-0.5 text-xs font-semibold text-nour-lavender-dark">
            Admin
          </span>
        </Link>
        <SidebarNav />
        <div className="border-t-2 border-nour-lavender-light/60 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-nour-lavender-pale font-display text-sm font-bold text-nour-lavender-dark">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-nour-ink">{user.name}</p>
              <p className="truncate text-xs text-nour-ink/50">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-soft bg-nour-terracotta-light px-4 py-2 text-sm font-medium text-nour-terracotta transition-colors hover:bg-nour-terracotta hover:text-white"
          >
            <FiLogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-nour-lavender-light/60 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-nour-ink/70 hover:bg-nour-lavender-pale lg:hidden"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <Link to="/" className="font-display text-sm font-semibold text-nour-ink/50 hover:text-nour-lavender-dark">
              Voir la boutique →
            </Link>
          </div>
          <p className="hidden font-display text-sm text-nour-ink/50 sm:block">
            Bienvenue, <span className="font-semibold text-nour-ink">{user.name}</span>
          </p>
        </header>

        {mobileOpen && (
          <div className="border-b-2 border-nour-lavender-light/60 bg-white px-4 py-3 lg:hidden">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        )}

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
