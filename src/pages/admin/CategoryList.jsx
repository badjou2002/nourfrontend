import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const EMPTY_FORM = { name: '', description: '', displayOrder: 0, isActive: true, image: null };

export default function CategoryList() {
  const { notify } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchData = () => {
    setLoading(true);
    getCategories(true)
      .then(setCategories)
      .catch((err) => notify(err.message || 'Impossible de charger les catégories', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description || '',
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive,
      image: null,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('displayOrder', form.displayOrder);
      fd.append('isActive', form.isActive);
      if (form.image) fd.append('image', form.image);
      if (editing) {
        await updateCategory(editing._id, fd);
        notify('Catégorie mise à jour');
      } else {
        await createCategory(fd);
        notify('Catégorie créée');
      }
      setEditing(null);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      notify(err.message || 'Enregistrement impossible', 'error');
    } finally {
      setSaving(false);
    }
  };

  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    try {
      await reorderCategories(next.map((c) => c._id));
      fetchData();
    } catch (err) {
      notify(err.message || 'Réordonnancement impossible', 'error');
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteCategory(deleting._id);
      notify(`Catégorie « ${deleting.name} » supprimée`);
      setDeleting(null);
      fetchData();
    } catch (err) {
      notify(err.message || 'Suppression impossible', 'error');
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Catégories"
        subtitle="Organisez vos univers et leur ordre d’affichage."
        actions={
          <Button onClick={openCreate}>
            <FiPlus size={16} /> Nouvelle catégorie
          </Button>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-nour-ink/50">Chargement...</p>
      ) : categories.length === 0 ? (
        <div className="card-nour flex flex-col items-center gap-4 py-14 text-center">
          <span className="text-5xl">📁</span>
          <p className="text-nour-ink/60">Aucune catégorie. Créez la première !</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div key={category._id} className="card-nour flex flex-col p-4">
              <div className="flex items-center gap-3">
                {category.imageCloudinaryUrl ? (
                  <img src={category.imageCloudinaryUrl} alt={category.name} className="h-14 w-14 rounded-soft object-cover" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-soft bg-nour-lavender-pale text-2xl">📁</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-nour-ink">{category.name}</p>
                  <p className="text-xs text-nour-ink/50">/{category.slug}</p>
                </div>
                {!category.isActive && (
                  <span className="chip bg-nour-lavender-light text-nour-lavender-dark">Masquée</span>
                )}
              </div>
              <p className="mt-3 line-clamp-2 min-h-8 text-sm text-nour-ink/60">{category.description || '—'}</p>
              <div className="mt-3 flex items-center justify-between border-t-2 border-nour-lavender-light/40 pt-3">
                <span className="text-xs text-nour-ink/50">
                  {category.productCount ?? 0} article(s) · Ordre {category.displayOrder}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    aria-label="Monter"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-nour-ink/60 hover:bg-nour-lavender-pale"
                  >
                    <FiChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    aria-label="Descendre"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-nour-ink/60 hover:bg-nour-lavender-pale"
                  >
                    <FiChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => openEdit(category)}
                    aria-label="Modifier"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-nour-lavender-pale text-nour-lavender-dark hover:bg-nour-lavender hover:text-white"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleting(category)}
                    aria-label="Supprimer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-nour-terracotta-light text-nour-terracotta hover:bg-nour-terracotta hover:text-white"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? `Modifier « ${editing.name} »` : 'Nouvelle catégorie'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                setEditing(null);
              }}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <SingleImageUploader
            existingUrl={editing?.imageCloudinaryUrl}
            file={form.image}
            onFileChange={(img) => setForm((prev) => ({ ...prev, image: img }))}
            onRemoveExisting={() => setForm((prev) => ({ ...prev, image: null }))}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Nom *</span>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="input-nour"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="input-nour resize-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Ordre d’affichage</span>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
                className="input-nour"
              />
            </label>
            <label className="flex cursor-pointer items-end gap-2 pb-2 text-sm font-medium text-nour-ink/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 accent-nour-lavender"
              />
              Visible dans la boutique
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer la catégorie"
        message={`Voulez-vous vraiment supprimer « ${deleting?.name} » ? Les catégories contenant des produits ne peuvent pas être supprimées.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
