import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiPackage, FiAlertTriangle, FiTruck } from 'react-icons/fi';
import { getStats } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import { formatTND } from '../../utils/format';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmées',
  shipped: 'Expédiées',
  delivered: 'Livrées',
  cancelled: 'Annulées',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Impossible de charger les statistiques'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Calcul des statistiques...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-squishy bg-nour-terracotta-light p-6 text-nour-terracotta">
        <p className="font-display font-semibold">Impossible de charger les statistiques.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  const { summary, ordersByStatus, topProducts, categorySales, dailySales, lowStockProducts, recentOrders } = stats;

  const kpis = [
    { label: 'Chiffre d’affaires', value: formatTND(summary.totalRevenue), icon: FiTrendingUp, tone: 'bg-nour-lavender-pale text-nour-lavender-dark' },
    { label: 'Commandes', value: summary.totalOrders, icon: FiShoppingBag, tone: 'bg-nour-teal-light text-nour-teal-dark' },
    { label: 'Panier moyen', value: formatTND(summary.averageOrderValue), icon: FiTruck, tone: 'bg-nour-sage-light text-nour-teal-dark' },
    { label: 'Clients', value: summary.totalCustomers, icon: FiUsers, tone: 'bg-nour-blush-light text-nour-terracotta' },
    { label: 'Produits', value: summary.totalProducts, icon: FiPackage, tone: 'bg-nour-lavender-pale text-nour-lavender-dark' },
  ];

  const maxDailyRevenue = Math.max(1, ...dailySales.map((d) => d.revenue));
  const statusTotal = Object.values(ordersByStatus).reduce((a, b) => a + b, 0);
  const maxCategoryRevenue = Math.max(1, ...categorySales.map((c) => c.revenue));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Vue d’ensemble des performances de la boutique"
        actions={
          <Link to="/admin/produits/nouveau" className="btn btn-primary btn-md">
            + Nouveau produit
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card-nour p-5">
            <span className={`flex h-11 w-11 items-center justify-center rounded-soft ${kpi.tone}`}>
              <kpi.icon size={20} />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-nour-ink">{kpi.value}</p>
            <p className="text-xs font-medium text-nour-ink/50">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-nour p-6">
          <h2 className="font-display text-lg font-semibold">Ventes des 14 derniers jours</h2>
          {dailySales.length === 0 ? (
            <p className="mt-4 text-sm text-nour-ink/50">Aucune vente sur cette période.</p>
          ) : (
            <div className="mt-5 flex h-48 items-end gap-1.5">
              {dailySales.map((day) => (
                <div key={day._id} className="group relative flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="hidden text-[10px] font-semibold text-nour-lavender-dark group-hover:block">
                    {formatTND(day.revenue)}
                  </span>
                  <div
                    className="w-full rounded-t-soft bg-gradient-to-t from-nour-lavender to-nour-lavender-light transition-all hover:from-nour-teal hover:to-nour-teal-light"
                    style={{ height: `${Math.max(4, (day.revenue / maxDailyRevenue) * 100)}%` }}
                  />
                  <span className="text-[9px] text-nour-ink/40">
                    {new Date(`${day._id}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card-nour p-6">
          <h2 className="font-display text-lg font-semibold">Statut des commandes</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(ordersByStatus).map(([status, count]) => {
              const pct = statusTotal ? Math.round((count / statusTotal) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-28">
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 overflow-hidden rounded-full bg-nour-lavender-light/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-nour-lavender to-nour-teal"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right font-display text-sm font-semibold text-nour-ink">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold">Ventes par catégorie</h2>
          {categorySales.length === 0 ? (
            <p className="mt-3 text-sm text-nour-ink/50">Aucune donnée pour le moment.</p>
          ) : (
            <div className="mt-4 space-y-2.5">
              {categorySales.map((cat) => (
                <div key={cat._id} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm font-medium text-nour-ink/70">{cat._id}</span>
                  <div className="flex-1">
                    <div className="h-2.5 overflow-hidden rounded-full bg-nour-lavender-light/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-nour-blush to-nour-terracotta"
                        style={{ width: `${Math.max(4, (cat.revenue / maxCategoryRevenue) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-semibold text-nour-ink">{formatTND(cat.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card-nour p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Produits les plus vendus</h2>
            <Link to="/admin/produits" className="text-sm font-medium text-nour-lavender-dark hover:underline">
              Voir tout →
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-nour-ink/50">Aucune vente pour le moment.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {topProducts.map((p, index) => (
                <div key={String(p._id)} className="flex items-center gap-4 rounded-soft bg-nour-cream p-3">
                  <span className="font-display text-lg font-bold text-nour-lavender">{index + 1}</span>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-soft object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-soft bg-nour-lavender-pale text-xl">📦</span>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-nour-ink">{p.title}</p>
                    <p className="text-xs text-nour-ink/50">{p.quantity} unité(s) vendue(s)</p>
                  </div>
                  <span className="font-display font-semibold text-nour-lavender-dark">{formatTND(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card-nour p-6">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-nour-terracotta" />
            <h2 className="font-display text-lg font-semibold">Stock faible</h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="mt-4 text-sm text-nour-ink/50">Aucun stock faible. 👍</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStockProducts.map((p) => (
                <li key={p._id} className="flex items-center gap-3">
                  {p.imagesCloudinary?.[0]?.url ? (
                    <img src={p.imagesCloudinary[0].url} alt="" className="h-10 w-10 rounded-soft object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-soft bg-nour-lavender-pale">📦</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link to={`/admin/produits/${p._id}`} className="block truncate text-sm font-medium text-nour-ink hover:text-nour-lavender-dark">
                      {p.title}
                    </Link>
                    <p className="text-xs text-nour-ink/50">{p.category?.name}</p>
                  </div>
                  <span
                    className={`chip ${p.stock <= 0 ? 'bg-nour-terracotta-light text-nour-terracotta' : 'bg-nour-blush-light text-nour-terracotta'}`}
                  >
                    {p.stock <= 0 ? 'Épuisé' : `${p.stock} restant(s)`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card-nour mt-6 overflow-x-auto">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-display text-lg font-semibold">Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-sm font-medium text-nour-lavender-dark hover:underline">
            Toutes les commandes →
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-y-2 border-nour-lavender-light/60 bg-nour-cream text-xs uppercase tracking-wider text-nour-ink/50">
            <tr>
              <th className="px-6 py-3">Commande</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-nour-ink/50">
                  Aucune commande pour le moment.
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-nour-lavender-light/40 last:border-0">
                  <td className="px-6 py-3">
                    <Link to={`/admin/commandes/${order._id}`} className="font-display font-semibold text-nour-lavender-dark hover:underline">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-nour-ink/50">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="px-6 py-3 text-nour-ink/80">{order.customerDetails.fullName}</td>
                  <td className="px-6 py-3 font-semibold">{formatTND(order.totalPrice)}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
