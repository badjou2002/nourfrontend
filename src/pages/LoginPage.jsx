import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Doodles from '../components/layout/Doodles';
import logo from '../assets/logo.svg';

export default function LoginPage() {
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const logged = await login(email, password);
      if (logged.role !== 'admin') {
        logout();
        setError('Cet espace est réservé aux administrateurs.');
        setLoading(false);
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-doodle-grid px-4">
      <Doodles
        items={[
          { type: 'sparkle', top: '15%', left: '12%', size: 36 },
          { type: 'heart', top: '20%', right: '14%', size: 40 },
          { type: 'star', bottom: '18%', left: '20%', size: 30, color: '#c85347', opacity: 0.2 },
          { type: 'squiggle', bottom: '22%', right: '18%', size: 60 },
          { el: 2, top: '10%', right: '6%', size: 56, opacity: 0.5, rotate: 12 },
          { el: 13, bottom: '10%', left: '8%', size: 60, opacity: 0.5, rotate: -10 },
        ]}
      />

      <div className="relative w-full max-w-md">
        <div className="card-nour p-8">
          <div className="mb-6 text-center">
            <img src={logo} alt="NOUR" className="mx-auto mb-4 h-14 w-auto" />
            <h1 className="font-display text-2xl font-bold">Espace administration</h1>
            <p className="mt-1 text-sm text-nour-ink/60">Connectez-vous pour gérer la boutique NOUR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nour.tn"
                className="input-nour"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-nour"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-soft bg-nour-terracotta-light px-4 py-3 text-sm font-medium text-nour-terracotta">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <FiLogIn size={18} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-nour-ink/50 transition-colors hover:text-nour-lavender-dark"
          >
            <FiArrowLeft size={16} /> Retour à la boutique
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-nour-ink/40">
          Compte de démonstration : admin@nour.tn / nour123456 (après lancement de <code>npm run seed</code>)
        </p>
      </div>
    </div>
  );
}
