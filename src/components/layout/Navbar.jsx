import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/catalogue?category=planners', label: 'Planners' },
  { to: '/catalogue?category=mugs', label: 'Mugs' },
  { to: '/catalogue?category=accessoires', label: 'Accessoires' },
];

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = form.get('q');
    navigate(q ? `/catalogue?q=${encodeURIComponent(q)}` : '/catalogue');
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-nour-lavender-light/60 bg-nour-cream/90 backdrop-blur">
      <div className="container-nour flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="NOUR" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
                  isActive ? 'bg-nour-lavender-pale text-nour-lavender-dark' : 'text-nour-ink/70 hover:bg-nour-lavender-pale/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSubmit} className="hidden items-center md:flex">
            <input
              name="q"
              type="search"
              placeholder="Rechercher un produit..."
              className="input-nour w-52 rounded-full pr-3 transition-all focus:w-64"
            />
          </form>

          <button
            onClick={() => navigate('/catalogue')}
            aria-label="Rechercher"
            className="flex h-11 w-11 items-center justify-center rounded-full text-nour-ink/70 transition-colors hover:bg-nour-lavender-pale md:hidden"
          >
            <FiSearch size={20} />
          </button>

          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              aria-label="Mon compte"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-nour-ink/70 transition-colors hover:bg-nour-lavender-pale"
            >
              <FiUser size={20} />
              {user && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-nour-cream bg-nour-sage" />
              )}
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-squishy border-2 border-nour-lavender-light/60 bg-white shadow-doodle-lg">
                {user ? (
                  <>
                    <div className="border-b-2 border-nour-lavender-light/60 bg-nour-lavender-pale/50 px-4 py-3">
                      <p className="truncate font-display font-semibold text-nour-lavender-dark">{user.name}</p>
                      <p className="truncate text-xs text-nour-ink/50">{user.email}</p>
                    </div>
                    <nav className="p-2">
                      <Link
                        to="/compte"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-soft px-3 py-2 text-sm text-nour-ink/80 hover:bg-nour-lavender-pale"
                      >
                        <FiUser size={16} /> Mes commandes
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 rounded-soft px-3 py-2 text-sm text-nour-ink/80 hover:bg-nour-lavender-pale"
                        >
                          <FiSettings size={16} /> Espace administration
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-soft px-3 py-2 text-left text-sm text-nour-terracotta hover:bg-nour-terracotta-light"
                      >
                        <FiLogOut size={16} /> Se déconnecter
                      </button>
                    </nav>
                  </>
                ) : (
                  <nav className="p-2">
                    <Link
                      to="/compte/connexion"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-soft px-3 py-2.5 text-sm font-medium text-nour-lavender-dark hover:bg-nour-lavender-pale"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/compte/inscription"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-soft px-3 py-2.5 text-sm font-medium text-nour-ink/80 hover:bg-nour-lavender-pale"
                    >
                      Créer un compte
                    </Link>
                  </nav>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Panier"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-nour-lavender text-white shadow-doodle transition-all hover:-translate-y-0.5 hover:bg-nour-lavender-dark"
          >
            <FiShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-nour-terracotta px-1 font-display text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-nour-ink/70 hover:bg-nour-lavender-pale lg:hidden"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t-2 border-nour-lavender-light/60 bg-nour-cream px-4 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-soft px-4 py-3 font-display font-medium text-nour-ink/80 hover:bg-nour-lavender-pale"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t-2 border-nour-lavender-light/60 pt-2">
            {user ? (
              <>
                <Link
                  to="/compte"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-soft px-4 py-3 font-display font-medium text-nour-ink/80 hover:bg-nour-lavender-pale"
                >
                  Mes commandes
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-soft px-4 py-3 font-display font-medium text-nour-ink/80 hover:bg-nour-lavender-pale"
                  >
                    Espace administration
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-soft px-4 py-3 text-left font-display font-medium text-nour-terracotta hover:bg-nour-terracotta-light"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/compte/connexion"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-soft px-4 py-3 font-display font-medium text-nour-lavender-dark hover:bg-nour-lavender-pale"
                >
                  Se connecter
                </Link>
                <Link
                  to="/compte/inscription"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-soft px-4 py-3 font-display font-medium text-nour-ink/80 hover:bg-nour-lavender-pale"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
