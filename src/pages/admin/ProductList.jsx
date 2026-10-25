import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { formatTND } from '../../utils/format';

const LIMIT = 12;

export default function ProductList() {
  const { notify } = useToast();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const debounceRef = useRef(null);

  const fetchData = (page, search) => {
    setLoading(true);
    getProducts({ page, limit: LIMIT, q: search || undefined })
      .then((res) => {
        setProducts(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => notify(err.message || 'Impossible de charger les produits', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(pagination.page, q);
  }, []);

  const handleSearch = (value) => {
    setQ(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(1, value), 350);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProduct(deleting._id);
      notify(`« ${deleting.title} » supprimé`);
      setDeleting(null);
      fetchData(pagination.page, q);
    } catch (err) {
      notify(err.message || 'Suppression impossible', 'error');
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Produits"
        subtitle={`${pagination.total} produit(s) enregistré(s)`}
        actions={
          <Link to="/admin/produits/nouveau" className="btn btn-primary btn-md">
            <FiPlus size={16} /> Nouveau produit
          </Link>
        }
      />

      <div className="card-nour mb-5 flex items-center gap-3 p-4">
        <FiSearch className="text-nour-lavender" />
        <input
          type="search"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher un produit par titre..."
          className="input-nour flex-1"
        />
      </div>

      <div className="card-nour overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b-2 border-nour-lavender-light/60 bg-nour-cream text-xs uppercase tracking-wider text-nour-ink/50">
            <tr>
              <th className="px-5 py-3">Produit</th>
              <th className="px-5 py-3">Prix</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Dispo</th>
              <th className="px-5 py-3">Vedette</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-nour-ink/50">
                  Chargement...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-nour-ink/50">
                  Aucun produit trouvé.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const lowStock = product.stock <= product.lowStockThreshold;
                return (
                  <tr key={product._id} className="border-b border-nour-lavender-light/40 last:border-0 hover:bg-nour-cream/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {product.imagesCloudinary?.[0]?.url ? (
                          <img src={product.imagesCloudinary[0].url} alt="" className="h-12 w-12 rounded-soft object-cover" />
                        ) : (
                          <span className="flex h-12 w-12 items-center justify-center rounded-soft bg-nour-lavender-pale">📦</span>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/produits/${product._id}`}
                            className="block max-w-xs truncate font-medium text-nour-ink hover:text-nour-lavender-dark"
                          >
                            {product.title}
                          </Link>
                          <p className="text-xs text-nour-ink/50">{product.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold">
                      {formatTND(product.price)}
                      {product.compareAtPrice > product.price && (
                        <span className="ml-2 text-xs text-nour-ink/40 line-through">{formatTND(product.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`chip ${product.stock <= 0 ? 'bg-nour-terracotta-light text-nour-terracotta' : lowStock ? 'bg-nour-blush-light text-nour-terracotta' : 'bg-nour-sage-light text-nour-teal-dark'}`}>
                        {product.stock <= 0 ? 'Épuisé' : `${product.stock} en stock`}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-nour-ink/70">
                      {product.availability === 'preorder' ? 'Précommande' : product.availability === 'in_stock' ? 'En stock' : 'Hors ligne'}
                    </td>
                    <td className="px-5 py-3">{product.isFeatured ? '⭐' : '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/produits/${product._id}`}
                          aria-label="Modifier"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-nour-lavender-pale text-nour-lavender-dark transition-colors hover:bg-nour-lavender hover:text-white"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleting(product)}
                          aria-label="Supprimer"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-nour-terracotta-light text-nour-terracotta transition-colors hover:bg-nour-terracotta hover:text-white"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchData(pagination.page - 1, q)}
            disabled={pagination.page <= 1}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="px-3 text-sm text-nour-ink/60">
            Page {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => fetchData(pagination.page + 1, q)}
            disabled={pagination.page >= pagination.pages}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer « ${deleting?.title} » ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
