import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiTruck, FiMapPin, FiUser, FiCreditCard, FiCheck, FiX } from 'react-icons/fi';
import { getOrder, updateOrderStatus, downloadInvoice } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { formatTND } from '../../utils/format';

const FLOW = ['pending', 'confirmed', 'shipped', 'delivered'];
const FLOW_LABELS = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée' };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message || 'Commande introuvable'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const changeStatus = async (status) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order._id, { status });
      notify(`Commande ${order.orderNumber} → ${FLOW_LABELS[status] || status}`);
      load();
    } catch (err) {
      notify(err.message || 'Changement de statut impossible', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Chargement de la commande...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-squishy bg-nour-terracotta-light p-6 text-nour-terracotta">
        <p className="font-display font-semibold">Commande introuvable</p>
        <p className="mt-1 text-sm">{error}</p>
        <Link to="/admin/commandes" className="btn btn-ghost btn-md mt-4">
          <FiArrowLeft size={16} /> Retour aux commandes
        </Link>
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(order.status);
  const nextStep = FLOW[currentIndex + 1];
  const isCancelled = order.status === 'cancelled';

  return (
    <div>
      <PageHeader
        title={`Commande ${order.orderNumber}`}
        subtitle={`Passée le ${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}`}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/admin/commandes')}>
              <FiArrowLeft size={16} /> Retour
            </Button>
            <Button variant="teal" onClick={() => downloadInvoice(order._id)}>
              <FiDownload size={16} /> Facture PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Suivi de la commande</h2>
            <div className="mt-5 flex items-center">
              {FLOW.map((step, index) => {
                const done = currentIndex >= index;
                const isCurrent = currentIndex === index;
                return (
                  <React.Fragment key={step}>
                    {index > 0 && (
                      <div className={`h-1 flex-1 rounded-full ${done ? 'bg-nour-lavender' : 'bg-nour-lavender-light/50'}`} />
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full font-display font-bold transition-colors ${
                          isCancelled && isCurrent
                            ? 'bg-nour-terracotta text-white'
                            : done
                            ? 'bg-nour-lavender text-white'
                            : 'bg-nour-lavender-light/50 text-nour-ink/40'
                        }`}
                      >
                        {done && !isCancelled ? <FiCheck size={18} /> : index + 1}
                      </span>
                      <span className={`text-xs font-medium ${done ? 'text-nour-ink' : 'text-nour-ink/40'}`}>
                        {FLOW_LABELS[step]}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {isCancelled ? (
              <div className="mt-6 flex items-center gap-2 rounded-soft bg-nour-terracotta-light px-4 py-3 text-sm font-medium text-nour-terracotta">
                <FiX size={18} /> Cette commande a été annulée.
              </div>
            ) : nextStep ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => changeStatus(nextStep)} disabled={updating}>
                  <FiTruck size={16} />
                  {updating ? 'Mise à jour...' : `Marquer « ${FLOW_LABELS[nextStep]} »`}
                </Button>
                <Button variant="ghost" onClick={() => changeStatus('cancelled')} disabled={updating}>
                  <FiX size={16} /> Annuler la commande
                </Button>
              </div>
            ) : (
              <div className="mt-6 rounded-soft bg-nour-sage-light px-4 py-3 text-sm font-medium text-nour-teal-dark">
                Commande terminée. Merci ! 🎉
              </div>
            )}
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Articles ({order.items.length})</h2>
            <div className="mt-4 divide-y divide-nour-lavender-light/40">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-14 w-14 rounded-soft object-cover" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-soft bg-nour-lavender-pale text-2xl">📦</span>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-nour-ink">{item.title}</p>
                    <p className="text-xs text-nour-ink/50">
                      {item.variant?.name ? `Option : ${item.variant.name} · ` : ''}× {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-semibold">{formatTND(item.price * item.quantity)}</p>
                    <p className="text-xs text-nour-ink/50">{formatTND(item.price)} / u</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card-nour p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <FiUser className="text-nour-lavender" /> Client
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-nour-ink/50">Nom</dt>
                <dd className="font-medium">{order.customerDetails.fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-nour-ink/50">Téléphone</dt>
                <dd className="font-medium">{order.customerDetails.phone}</dd>
              </div>
              {order.customerDetails.email && (
                <div className="flex justify-between">
                  <dt className="text-nour-ink/50">Email</dt>
                  <dd className="truncate pl-4 font-medium">{order.customerDetails.email}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="card-nour p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <FiMapPin className="text-nour-lavender" /> Livraison
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-nour-ink/50">Gouvernorat</dt>
                <dd className="font-medium">{order.shippingAddress.governorate}</dd>
              </div>
              {order.shippingAddress.city && (
                <div className="flex justify-between">
                  <dt className="text-nour-ink/50">Ville</dt>
                  <dd className="font-medium">{order.shippingAddress.city}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-nour-ink/50">Adresse</dt>
                <dd className="max-w-[60%] text-right font-medium">{order.shippingAddress.address}</dd>
              </div>
            </dl>
          </section>

          <section className="card-nour p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <FiCreditCard className="text-nour-lavender" /> Paiement
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nour-ink/50">Mode</span>
                <StatusBadge status={order.paymentMethod === 'cod' ? 'cod' : order.paymentMethod} />
              </div>
              <div className="flex justify-between">
                <span className="text-nour-ink/50">Statut paiement</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Total</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-nour-ink/70">
                <span>Sous-total</span>
                <span>{formatTND(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-nour-terracotta">
                  <span>Remise ({order.coupon?.code || 'promo'})</span>
                  <span>− {formatTND(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-nour-ink/70">
                <span>Livraison</span>
                <span>{order.shippingCost === 0 ? 'Gratuite' : formatTND(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-nour-lavender-light/60 pt-3 font-display text-xl font-bold text-nour-lavender-dark">
                <span>Total</span>
                <span>{formatTND(order.totalPrice)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
