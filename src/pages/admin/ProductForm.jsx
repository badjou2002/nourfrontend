import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getProduct, createProduct, updateProduct, getCategories } from '../../services/admin';
import { MultipleImageUploader } from '../../components/admin/ImageUploader';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const EMPTY_VARIANT = { name: '', price: '', stock: 0, attributes: { format: '', binding: '', color: '' } };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    stock: 0,
    lowStockThreshold: 5,
    availability: 'in_stock',
    format: '',
    binding: '',
    paper: '',
    weight: '',
    dimensions: '',
    colors: '',
    isFeatured: false,
    isPromo: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    getCategories(true)
      .then((cats) => setCategories(cats))
      .catch(() => {});
    if (!isEdit) return;
    getProduct(id)
      .then((product) => {
        setForm({
          title: product.title || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          price: product.price ?? '',
          compareAtPrice: product.compareAtPrice ?? '',
          category: product.category?._id || '',
          stock: product.stock ?? 0,
          lowStockThreshold: product.lowStockThreshold ?? 5,
          availability: product.availability || 'in_stock',
          format: product.attributes?.format || '',
          binding: product.attributes?.binding || '',
          paper: product.attributes?.paper || '',
          weight: product.attributes?.weight || '',
          dimensions: product.attributes?.dimensions || '',
          colors: (product.attributes?.colors || []).join(', '),
          isFeatured: product.isFeatured,
          isPromo: product.isPromo,
        });
        setExistingImages(product.imagesCloudinary || []);
        setVariants((product.variants || []).map((v) => ({ ...v, price: v.price ?? '' })));
      })
      .catch((err) => setError(err.message || 'Produit introuvable'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addVariant = () => setVariants((prev) => [...prev, { ...EMPTY_VARIANT, _tempId: Date.now() }]);
  const updateVariant = (index, field, value) => {
    setVariants((prev) => prev.map((v, i) => {
      if (i !== index) return v;
      if (field.startsWith('attr.')) {
        const attrKey = field.split('.')[1];
        return { ...v, attributes: { ...v.attributes, [attrKey]: value } };
      }
      return { ...v, [field]: value };
    }));
  };
  const removeVariant = (index) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('shortDescription', form.shortDescription);
    fd.append('description', form.description);
    fd.append('price', form.price);
    if (form.compareAtPrice !== '') fd.append('compareAtPrice', form.compareAtPrice);
    fd.append('category', form.category);
    fd.append('stock', form.stock);
    fd.append('lowStockThreshold', form.lowStockThreshold);
    fd.append('availability', form.availability);
    fd.append('format', form.format);
    fd.append('binding', form.binding);
    fd.append('paper', form.paper);
    fd.append('weight', form.weight);
    fd.append('dimensions', form.dimensions);
    fd.append('colors', JSON.stringify(form.colors.split(',').map((c) => c.trim()).filter(Boolean)));
    fd.append('isFeatured', form.isFeatured);
    fd.append('isPromo', form.isPromo);
    fd.append(
      'variants',
      JSON.stringify(
        variants.map((v) => ({
          name: v.name,
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
          attributes: {
            format: v.attributes?.format || '',
            binding: v.attributes?.binding || '',
            color: v.attributes?.color || '',
          },
        }))
      )
    );
    files.forEach((file) => fd.append('images', file));
    if (imagesToDelete.length) fd.append('imagesToDelete', imagesToDelete.join(','));
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.price || !form.category) {
      setError('Titre, prix et catégorie sont obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = buildFormData();
      if (isEdit) await updateProduct(id, fd);
      else await createProduct(fd);
      notify(isEdit ? 'Produit mis à jour' : 'Produit créé');
      navigate('/admin/produits');
    } catch (err) {
      setError(err.message || 'Impossible d’enregistrer le produit');
      notify(err.message || 'Erreur lors de l’enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}
        subtitle={isEdit ? 'Mettez à jour les informations et les images.' : 'Créez un produit et téléversez ses images sur Cloudinary.'}
        actions={
          <Link to="/admin/produits" className="btn btn-ghost btn-md">
            <FiArrowLeft size={16} /> Retour
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Informations générales</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Titre *</span>
                <input value={form.title} onChange={(e) => setField('title', e.target.value)} className="input-nour" placeholder="Ex : Planner Annuel A5" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Prix (TND) *</span>
                <input type="number" step="0.001" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Prix barré (promo)</span>
                <input type="number" step="0.001" min="0" value={form.compareAtPrice} onChange={(e) => setField('compareAtPrice', e.target.value)} className="input-nour" placeholder="Optionnel" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Catégorie *</span>
                <select value={form.category} onChange={(e) => setField('category', e.target.value)} className="input-nour">
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Courte description</span>
                <input value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} className="input-nour" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Description détaillée</span>
                <textarea rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} className="input-nour resize-none" />
              </label>
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Stock &amp; disponibilité</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Quantité en stock</span>
                <input type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Seuil d’alerte</span>
                <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setField('lowStockThreshold', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Disponibilité</span>
                <select value={form.availability} onChange={(e) => setField('availability', e.target.value)} className="input-nour">
                  <option value="in_stock">En stock</option>
                  <option value="preorder">Précommande</option>
                  <option value="out_of_stock">Épuisé</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-nour-ink/70">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField('isFeatured', e.target.checked)} className="h-4 w-4 accent-nour-lavender" />
                Produit vedette (Welcome Page)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-nour-ink/70">
                <input type="checkbox" checked={form.isPromo} onChange={(e) => setField('isPromo', e.target.checked)} className="h-4 w-4 accent-nour-terracotta" />
                En promotion
              </label>
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Images (Cloudinary)</h2>
            <p className="mt-1 text-xs text-nour-ink/50">Jusqu’à 10 images, téléversées et optimisées automatiquement.</p>
            <div className="mt-4">
              <MultipleImageUploader
                existing={existingImages}
                files={files}
                onExistingRemove={(publicId) => {
                  setImagesToDelete((prev) => [...prev, publicId]);
                  setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
                }}
                onFilesChange={setFiles}
              />
            </div>
          </section>

          <section className="card-nour p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Variantes</h2>
              <Button type="button" variant="ghost" size="sm" onClick={addVariant}>
                <FiPlus size={14} /> Ajouter une variante
              </Button>
            </div>
            {variants.length === 0 ? (
              <p className="mt-3 text-sm text-nour-ink/50">Aucune variante. Le produit sera vendu au prix principal.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {variants.map((variant, index) => (
                  <div key={variant._id || variant._tempId} className="rounded-soft border-2 border-nour-lavender-light/60 bg-nour-cream p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)} className="input-nour" placeholder="Nom (ex : Lavande)" />
                      <input type="number" min="0" step="0.001" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} className="input-nour" placeholder="Prix (TND)" />
                      <input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} className="input-nour" placeholder="Stock" />
                      <input value={variant.attributes?.color || ''} onChange={(e) => updateVariant(index, 'attr.color', e.target.value)} className="input-nour" placeholder="Couleur" />
                      <input value={variant.attributes?.format || ''} onChange={(e) => updateVariant(index, 'attr.format', e.target.value)} className="input-nour" placeholder="Format (A5/A6)" />
                      <div className="flex items-center gap-2">
                        <input value={variant.attributes?.binding || ''} onChange={(e) => updateVariant(index, 'attr.binding', e.target.value)} className="input-nour" placeholder="Reliure" />
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          aria-label="Supprimer la variante"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-soft bg-nour-terracotta-light text-nour-terracotta hover:bg-nour-terracotta hover:text-white"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <aside className="card-nour sticky top-24 p-6">
            <h2 className="font-display text-lg font-semibold">Spécifications</h2>
            <div className="mt-4 grid gap-4">
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Format</span>
                <select value={form.format} onChange={(e) => setField('format', e.target.value)} className="input-nour">
                  <option value="">—</option>
                  {['A5', 'A6', 'A4', 'A7', 'Autre'].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Reliure</span>
                <input value={form.binding} onChange={(e) => setField('binding', e.target.value)} className="input-nour" placeholder="Ex : Reliure spirale" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Papier</span>
                <input value={form.paper} onChange={(e) => setField('paper', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Grammage</span>
                <input value={form.weight} onChange={(e) => setField('weight', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Dimensions</span>
                <input value={form.dimensions} onChange={(e) => setField('dimensions', e.target.value)} className="input-nour" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Couleurs (séparées par des virgules)</span>
                <input value={form.colors} onChange={(e) => setField('colors', e.target.value)} className="input-nour" placeholder="Lavande, Blush, Sage" />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-soft bg-nour-terracotta-light px-4 py-3 text-sm font-medium text-nour-terracotta">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
              <FiSave size={18} />
              {submitting ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
            </Button>
          </aside>
        </div>
      </form>
    </div>
  );
}
