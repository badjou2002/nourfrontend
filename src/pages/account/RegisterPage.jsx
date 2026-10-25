import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { FiUserPlus, FiArrowLeft, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Doodles from '../../components/layout/Doodles';
import logo from '../../assets/logo.svg';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/compte';
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password });
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Impossible de créer le compte');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-doodle-grid px-4 py-12">
      <Doodles
        items={[
          { type: 'star', top: '10%', right: '14%', size: 32, color: '#c85347', opacity: 0.25 },
          { type: 'heart', bottom: '14%', left: '12%', size: 36 },
          { type: 'squiggle', top: '16%', left: '30%', size: 50 },
          { el: 6, top: '8%', left: '5%', size: 54, opacity: 0.55, rotate: -12 },
          { el: 15, bottom: '8%', right: '6%', size: 58, opacity: 0.55, rotate: 10 },
        ]}
      />

      <div className="relative w-full max-w-md">
        <div className="card-nour p-8">
          <div className="mb-6 text-center">
            <img src={logo} alt="NOUR" className="mx-auto mb-4 h-14 w-auto" />
            <h1 className="font-display text-2xl font-bold">Rejoignez NOUR</h1>
            <p className="mt-1 text-sm text-nour-ink/60">Créez votre compte pour suivre vos commandes et gagner du temps</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Nom complet *</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Votre nom et prénom" className="input-nour" autoComplete="name" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Email *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="vous@exemple.tn" className="input-nour" autoComplete="email" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Téléphone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+216 ..." className="input-nour" autoComplete="tel" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Adresse</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Adresse, ville, gouvernorat" className="input-nour" autoComplete="street-address" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Mot de passe *</label>
                <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className="input-nour" autoComplete="new-password" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Confirmer *</label>
                <input name="confirm" type="password" required value={form.confirm} onChange={handleChange} placeholder="••••••••" className="input-nour" autoComplete="new-password" />
              </div>
            </div>

            {error && (
              <div className="rounded-soft bg-nour-terracotta-light px-4 py-3 text-sm font-medium text-nour-terracotta">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <FiUserPlus size={18} />
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 border-t-2 border-nour-lavender-light/60 pt-5 text-center">
            <p className="text-sm text-nour-ink/60">Déjà inscrit ?</p>
            <Link to={`/compte/connexion${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>
              <Button variant="outline" size="sm" className="mt-3">
                <FiLogIn size={16} /> Se connecter
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
