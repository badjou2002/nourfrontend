import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLogOut, FiPackage, FiUser, FiMapPin, FiPhone, FiMail, FiArrowRight, FiEdit2, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { fetchMyOrders, cancelOrder } from '../../services/orders';
import StatusBadge from '../../components/admin/StatusBadge';
import Button from '../../components/ui/Button';
import Doodles from '../../components/layout/Doodles';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { formatTND } from '../../utils/format';

export default function AccountPage() {
  const { user, loading, logout, updateProfile } = useAuth();
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', password: '' });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const openProfile = () => {
    setProfileForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      password: '',
    });
    setProfileOpen(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password.length < 6) {
      notify('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    setProfileSaving(true);
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
        password: profileForm.password || undefined,
      });
      notify('Informations mises à jour');
      setProfileOpen(false);
    } catch (err) {
      notify(err.message || 'Mise à jour impossible', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelling) return;
    setCancelLoading(true);
    try {
      const updated = await cancelOrder(cancelling._id);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      notify('Commande annulée');
      setCancelling(null);
    } catch (err) {
      notify(err.message || 'Annulation impossible', 'error');
      setCancelling(null);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/compte/connexion" replace />;

  return (
    <div className="relative bg-doodle-grid min-h-screen">
      <Doodles
        items={[
          { type: 'sparkle', top: '5%', right: '8%', size: 30 },
          { type: 'heart', top: '12%', left: '45%', size: 36 },
          { el: 5, bottom: '10%', left: '2%', size: 56, opacity: 0.45, rotate: 10 },
          { el: 8, top: '8%', left: '1%', size: 50, opacity: 0.45, rotate: -12 },
        ]}
      />
      <div className="container-nour relative py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label mb-2 text-nour-teal">Mon compte</p>
            <h1 className="font-display text-3xl font-bold">Bonjour, {user.name} 👋</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <FiLogOut size={16} /> Se déconnecter
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-6">
            <div className="card-nour p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-nour-lavender-dark">
                  <FiUser className="text-nour-lavender" /> Mes informations
                </h2>
                <button
                  onClick={openProfile}
                  className="flex items-center gap-1.5 rounded-full bg-nour-lavender-pale px-3 py-1.5 text-xs font-semibold text-nour-lavender-dark transition-colors hover:bg-nour-lavender hover:text-white"
                >
                  <FiEdit2 size={13} /> Modifier
                </button>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-nour-ink/70">
                <li className="flex items-start gap-3">
                  <FiMail className="mt-0.5 text-nour-lavender" />
                  <span className="break-all">{user.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiPhone className="mt-0.5 text-nour-lavender" />
                  <span>{user.phone || 'Non renseigné'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 text-nour-lavender" />
                  <span>{user.address || 'Non renseignée'}</span>
                </li>
              </ul>
            </div>

            <div className="card-nour p-6">
              <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">Besoin d'aide ?</h2>
              <p className="mt-2 text-sm text-nour-ink/60">
                Modifiez vos informations depuis « Mes informations » et retrouvez le suivi de vos commandes sur cette
                page.
              </p>
              <Link to="/catalogue" className="mt-4 block">
                <Button variant="teal" size="sm" className="w-full">
                  Découvrir le catalogue <FiArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </aside>

          <section>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-nour-lavender-dark">
              <FiPackage className="text-nour-lavender" /> Mes commandes
            </h2>

            {ordersLoading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="card-nour h-28 animate-pulse bg-nour-lavender-pale/60" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="card-nour mt-6 flex flex-col items-center p-10 text-center">
                <span className="mb-3 text-5xl">📦</span>
                <p className="font-display text-lg font-semibold">Aucune commande pour le moment</p>
                <p className="mt-1 max-w-sm text-sm text-nour-ink/60">
                  Vos commandes apparaîtront ici dès que vous passerez par le panier.
                </p>
                <Link to="/catalogue" className="mt-5">
                  <Button variant="teal">Explorer le catalogue</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <article key={order._id} className="card-nour p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-display font-bold text-nour-lavender-dark">{order.orderNumber}</p>
                        <p className="mt-0.5 text-xs text-nour-ink/50">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')} · {order.items.length} article(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <span className="font-display text-lg font-bold">{formatTND(order.totalPrice)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t-2 border-nour-lavender-light/60 pt-4">
                      {order.items.slice(0, 4).map((item) => (
                        <span key={item._id} className="rounded-full bg-nour-lavender-pale px-3 py-1 text-xs font-medium text-nour-lavender-dark">
                          {item.title}
                          {item.variant?.name ? ` (${item.variant.name})` : ''} × {item.quantity}
                        </span>
                      ))}
                      {order.items.length > 4 && (
                        <span className="rounded-full bg-nour-lavender-light/50 px-3 py-1 text-xs font-medium text-nour-ink/60">
                          +{order.items.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-nour-lavender-light/60 pt-4">
                      <span className="text-xs text-nour-ink/50">
                        {order.paymentMethod === 'cod' ? 'Paiement à la livraison' : order.paymentMethod}
                      </span>
                      {['pending', 'confirmed'].includes(order.status) ? (
                        <button
                          onClick={() => setCancelling(order)}
                          className="flex items-center gap-2 rounded-soft border-2 border-nour-terracotta-light bg-nour-terracotta-light px-3.5 py-1.5 text-xs font-semibold text-nour-terracotta transition-colors hover:border-nour-terracotta hover:bg-nour-terracotta hover:text-white"
                        >
                          <FiXCircle size={14} /> Annuler la commande
                        </button>
                      ) : (
                        <span className="text-xs text-nour-ink/40">Aucune action disponible</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={!!cancelling}
        title="Annuler la commande"
        message={
          cancelling
            ? `Voulez-vous vraiment annuler la commande ${cancelling.orderNumber} ? Cette action est définitive.`
            : ''
        }
        onConfirm={handleCancel}
        onCancel={() => setCancelling(null)}
        loading={cancelLoading}
        confirmLabel="Oui, annuler"
        loadingText="Annulation..."
      />

      <Modal
        open={profileOpen}
        title="Modifier mes informations"
        onClose={() => setProfileOpen(false)}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setProfileOpen(false)} disabled={profileSaving}>
              Annuler
            </Button>
            <Button onClick={handleProfileSave} disabled={profileSaving}>
              {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Nom complet *</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              className="input-nour"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Téléphone</label>
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+216 ..."
              className="input-nour"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-nour-ink/70">Adresse</label>
            <input
              value={profileForm.address}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Adresse, ville, gouvernorat"
              className="input-nour"
              autoComplete="street-address"
            />
          </div>
          <div className="rounded-soft bg-nour-lavender-pale px-4 py-3">
            <p className="text-xs font-medium text-nour-lavender-dark">
              Laissez vide pour conserver votre mot de passe actuel.
            </p>
            <label className="mt-2 block">
              <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Nouveau mot de passe</span>
              <input
                type="password"
                value={profileForm.password}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="input-nour"
                autoComplete="new-password"
              />
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
