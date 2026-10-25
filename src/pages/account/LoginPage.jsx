import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { FiLogIn, FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Doodles from '../../components/layout/Doodles';
import logo from '../../assets/logo.svg';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/compte';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-doodle-grid px-4 py-12">
      <Doodles
        items={[
          { type: 'sparkle', top: '12%', left: '10%', size: 34 },
          { type: 'heart', top: '18%', right: '12%', size: 38 },
          { type: 'squiggle', bottom: '18%', left: '22%', size: 60 },
          { el: 4, top: '8%', right: '6%', size: 54, opacity: 0.55, rotate: 12 },
          { el: 11, bottom: '8%', left: '6%', size: 58, opacity: 0.55, rotate: -10 },
        ]}
      />

      <div className="relative w-full max-w-md">
        <div className="card-nour p-8">
          <div className="mb-6 text-center">
            <img src={logo} alt="NOUR" className="mx-auto mb-4 h-14 w-auto" />
            <h1 className="font-display text-2xl font-bold">Bon retour parmi nous</h1>
            <p className="mt-1 text-sm text-nour-ink/60">Connectez-vous pour suivre vos commandes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.tn"
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

          <div className="mt-6 border-t-2 border-nour-lavender-light/60 pt-5 text-center">
            <p className="text-sm text-nour-ink/60">Pas encore de compte ?</p>
            <Link to={`/compte/inscription${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>
              <Button variant="teal" size="sm" className="mt-3">
                <FiUserPlus size={16} /> Créer un compte
              </Button>
            </Link>
          </div>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-nour-ink/50 transition-colors hover:text-nour-lavender-dark"
          >
            <FiArrowLeft size={16} /> Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
