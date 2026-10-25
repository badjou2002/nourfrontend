import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatTND } from '../../utils/format';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const LIMIT = 15;

export default function OrdersList() {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = (status, page = 1) => {
    setLoading(true);
    getOrders({
      ...(status && status !== 'all' ? { status } : {}),
      page,
      limit: LIMIT,
    })
      .then((res) => {
        setOrders(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => notify(err.message || 'Impossible de charger les commandes', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(tab, 1);
  }, [tab]);

  const handleQuickStatus = async (order, status) => {
    try {
      await updateOrderStatus(order._id, { status });
      notify(`Commande ${order.orderNumber} → ${status}`);
      fetchData(tab, pagination.page);
    } catch (err) {
      notify(err.message || 'Changement de statut impossible', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Commandes" subtitle={`${pagination.total} commande(s)`} />

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
              tab === status
                ? 'bg-nour-lavender text-white shadow-doodle'
                : 'bg-white text-nour-ink/60 hover:bg-nour-lavender-pale'
            }`}
          >
            {status === 'all' ? 'Toutes' : <StatusBadge status={status} />}
          </button>
        ))}
      </div>

      <div className="card-nour overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b-2 border-nour-lavender-light/60 bg-nour-cream text-xs uppercase tracking-wider text-nour-ink/50">
            <tr>
              <th className="px-5 py-3">Commande</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Gouvernorat</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Paiement</th>
              <th className="px-5 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-nour-ink/50">Chargement...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-nour-ink/50">Aucune commande.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-nour-lavender-light/40 last:border-0 hover:bg-nour-cream/60">
                  <td className="px-5 py-3">
                    <Link to={`/admin/commandes/${order._id}`} className="font-display font-semibold text-nour-lavender-dark hover:underline">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-nour-ink/50">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-nour-ink">{order.customerDetails.fullName}</p>
                    <p className="text-xs text-nour-ink/50">{order.customerDetails.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-nour-ink/70">{order.shippingAddress.governorate}</td>
                  <td className="px-5 py-3 font-semibold">{formatTND(order.totalPrice)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.paymentMethod === 'cod' ? 'cod' : order.paymentStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/commandes/${order._id}`}>
                        <StatusBadge status={order.status} />
                      </Link>
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatus(order, e.target.value)}
                        aria-label="Changer le statut"
                        className="rounded-soft border-2 border-nour-lavender-light bg-white px-2 py-1.5 text-xs"
                      >
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchData(tab, pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="px-3 text-sm text-nour-ink/60">Page {pagination.page} / {pagination.pages}</span>
          <button
            onClick={() => fetchData(tab, pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
