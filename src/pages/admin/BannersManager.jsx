import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import {
  getWelcomePage,
  updateWelcomePage,
  addHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getProducts,
} from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const EMPTY_BANNER = { title: '', subtitle: '', ctaText: 'Découvrir', ctaLink: '/catalogue', active: true, image: null };

export default function BannersManager() {
  const { notify } = useToast();
  const [cms, setCms] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerModal, setBannerModal] = useState(null);
  const [bannerForm, setBannerForm] = useState(EMPTY_BANNER);
  const [savingBanner, setSavingBanner] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [paragraph, setParagraph] = useState({ title: '', highlight: '', content: '' });
  const [promo, setPromo] = useState({ text: '', active: false, link: '/catalogue' });
  const [savingText, setSavingText] = useState(false);
  const [savingFeatured, setSavingFeatured] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [pageData, productsRes] = await Promise.all([getWelcomePage(), getProducts({ limit: 100 })]);
      setCms(pageData);
      setParagraph(pageData.welcomeParagraph || { title: '', highlight: '', content: '' });
      setPromo(pageData.promoMessage || { text: '', active: false, link: '/catalogue' });
      setAllProducts(productsRes.data);
    } catch (err) {
      notify(err.message || 'Impossible de charger la Welcome Page', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const banners = cms?.heroBanners || [];
  const featuredIds = (cms?.featuredProducts || []).map((p) => (typeof p === 'string' ? p : p._id));

  const openAdd = () => {
    setBannerForm(EMPTY_BANNER);
    setBannerModal('add');
  };
  const openEdit = (banner) => {
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      ctaText: banner.ctaText || 'Découvrir',
      ctaLink: banner.ctaLink || '/catalogue',
      active: banner.active,
      image: null,
    });
    setBannerModal({ mode: 'edit', banner });
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    const isAdd = bannerModal === 'add';
    if (isAdd && !bannerForm.image) {
      notify('Une image de bannière est obligatoire', 'error');
      return;
    }
    setSavingBanner(true);
    try {
      const fd = new FormData();
      fd.append('title', bannerForm.title);
      fd.append('subtitle', bannerForm.subtitle);
      fd.append('ctaText', bannerForm.ctaText);
      fd.append('ctaLink', bannerForm.ctaLink);
      fd.append('active', bannerForm.active);
      if (bannerForm.image) fd.append('image', bannerForm.image);
      if (isAdd) await addHeroBanner(fd);
      else await updateHeroBanner(bannerModal.banner._id, fd);
      notify(isAdd ? 'Bannière ajoutée' : 'Bannière mise à jour');
      setBannerModal(null);
      load();
    } catch (err) {
      notify(err.message || 'Enregistrement impossible', 'error');
    } finally {
      setSavingBanner(false);
    }
  };

  const toggleBannerActive = async (banner) => {
    const fd = new FormData();
    fd.append('active', !banner.active);
    try {
      await updateHeroBanner(banner._id, fd);
      load();
    } catch (err) {
      notify(err.message || 'Mise à jour impossible', 'error');
    }
  };

  const handleDeleteBanner = async () => {
    if (!deleting) return;
    try {
      await deleteHeroBanner(deleting._id);
      notify('Bannière supprimée');
      setDeleting(null);
      load();
    } catch (err) {
      notify(err.message || 'Suppression impossible', 'error');
      setDeleting(null);
    }
  };

  const saveTexts = async () => {
    setSavingText(true);
    try {
      await updateWelcomePage({ welcomeParagraph: paragraph, promoMessage: promo });
      notify('Contenus de la Welcome Page enregistrés');
      load();
    } catch (err) {
      notify(err.message || 'Enregistrement impossible', 'error');
    } finally {
      setSavingText(false);
    }
  };

  const toggleFeatured = (productId) => {
    const next = featuredIds.includes(productId)
      ? featuredIds.filter((id) => id !== productId)
      : [...featuredIds, productId];
    setSavingFeatured(true);
    updateWelcomePage({ featuredProducts: next })
      .then(() => {
        notify('Sélection des vedettes mise à jour');
        load();
      })
      .catch((err) => notify(err.message || 'Mise à jour impossible', 'error'))
      .finally(() => setSavingFeatured(false));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Chargement de la Welcome Page...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Welcome Page (CMS)"
        subtitle="Gérez le carrousel, les textes et les produits en avant sur la page d’accueil."
      />

      <div className="grid gap-6">
        <section className="card-nour p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Carrousel de bannières</h2>
              <p className="mt-1 text-sm text-nour-ink/50">{banners.filter((b) => b.active).length} bannière(s) active(s)</p>
            </div>
            <Button onClick={openAdd}>
              <FiPlus size={16} /> Ajouter une bannière
            </Button>
          </div>

          {banners.length === 0 ? (
            <div className="mt-6 rounded-soft border-2 border-dashed border-nour-lavender/40 py-10 text-center">
              <p className="text-nour-ink/50">Aucune bannière. Ajoutez la première pour animer votre accueil.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {banners.map((banner) => (
                <div key={banner._id} className="flex flex-col gap-4 rounded-soft border-2 border-nour-lavender-light/60 bg-nour-cream p-4 sm:flex-row sm:items-center">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Bannière'}
                    className="h-24 w-full rounded-soft object-cover sm:w-40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-nour-ink">{banner.title || 'Sans titre'}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-nour-ink/60">{banner.subtitle || '—'}</p>
                    <p className="mt-1 text-xs text-nour-ink/40">
                      CTA : {banner.ctaText} → {banner.ctaLink}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBannerActive(banner)}
                      aria-label={banner.active ? 'Désactiver' : 'Activer'}
                      className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${banner.active ? 'bg-nour-sage-light text-nour-teal-dark' : 'bg-nour-lavender-light/50 text-nour-ink/50'}`}
                    >
                      {banner.active ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                      {banner.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => openEdit(banner)}
                      aria-label="Modifier"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-nour-lavender-pale text-nour-lavender-dark hover:bg-nour-lavender hover:text-white"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(banner)}
                      aria-label="Supprimer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-nour-terracotta-light text-nour-terracotta hover:bg-nour-terracotta hover:text-white"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Paragraphe de bienvenue</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Titre</span>
                <input
                  value={paragraph.title}
                  onChange={(e) => setParagraph((prev) => ({ ...prev, title: e.target.value }))}
                  className="input-nour"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Texte mis en avant</span>
                <input
                  value={paragraph.highlight}
                  onChange={(e) => setParagraph((prev) => ({ ...prev, highlight: e.target.value }))}
                  className="input-nour"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Contenu</span>
                <textarea
                  rows={5}
                  value={paragraph.content}
                  onChange={(e) => setParagraph((prev) => ({ ...prev, content: e.target.value }))}
                  className="input-nour resize-none"
                />
              </label>
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold">Message promotionnel</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Texte de la promo</span>
                <input
                  value={promo.text}
                  onChange={(e) => setPromo((prev) => ({ ...prev, text: e.target.value }))}
                  className="input-nour"
                  placeholder="Ex : Jusqu’à -20% sur une sélection douce"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Lien du bouton</span>
                <input
                  value={promo.link}
                  onChange={(e) => setPromo((prev) => ({ ...prev, link: e.target.value }))}
                  className="input-nour"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-soft border-2 border-nour-lavender-light bg-nour-cream p-4">
                <input
                  type="checkbox"
                  checked={promo.active}
                  onChange={(e) => setPromo((prev) => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 accent-nour-lavender"
                />
                <span className="text-sm font-medium text-nour-ink/70">Afficher le bandeau promo sur l’accueil</span>
              </label>
            </div>
            <Button className="mt-5 w-full" onClick={saveTexts} disabled={savingText}>
              <FiSave size={16} />
              {savingText ? 'Enregistrement...' : 'Enregistrer les textes'}
            </Button>
          </section>
        </div>

        <section className="card-nour p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <FiStar className="text-nour-lavender" /> Produits en vedette
              </h2>
              <p className="mt-1 text-sm text-nour-ink/50">Cliquez pour sélectionner les produits affichés en carrousel sur l’accueil.</p>
            </div>
            {savingFeatured && <p className="text-sm text-nour-ink/40">Enregistrement...</p>}
          </div>
          {allProducts.length === 0 ? (
            <p className="mt-5 text-sm text-nour-ink/50">Créez d’abord des produits.</p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {allProducts.map((product) => {
                const isSelected = featuredIds.includes(product._id);
                return (
                  <button
                    key={product._id}
                    onClick={() => toggleFeatured(product._id)}
                    className={`flex items-center gap-2 rounded-full border-2 px-3.5 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-nour-lavender bg-nour-lavender-pale text-nour-lavender-dark shadow-doodle'
                        : 'border-nour-lavender-light text-nour-ink/60 hover:border-nour-lavender'
                    }`}
                  >
                    {product.imagesCloudinary?.[0]?.url && (
                      <img src={product.imagesCloudinary[0].url} alt="" className="h-5 w-5 rounded-full object-cover" />
                    )}
                    {product.title}
                    {isSelected && <FiStar className="fill-nour-lavender text-nour-lavender" size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={!!bannerModal}
        title={bannerModal === 'add' ? 'Nouvelle bannière' : 'Modifier la bannière'}
        onClose={() => setBannerModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setBannerModal(null)} disabled={savingBanner}>
              Annuler
            </Button>
            <Button onClick={handleSaveBanner} disabled={savingBanner}>
              {savingBanner ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveBanner} className="space-y-4">
          <SingleImageUploader
            existingUrl={bannerModal && bannerModal !== 'add' ? bannerModal.banner.imageUrl : null}
            file={bannerForm.image}
            onFileChange={(img) => setBannerForm((prev) => ({ ...prev, image: img }))}
            onRemoveExisting={() => setBannerForm((prev) => ({ ...prev, image: null }))}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Titre</span>
            <input value={bannerForm.title} onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))} className="input-nour" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Sous-titre</span>
            <input value={bannerForm.subtitle} onChange={(e) => setBannerForm((prev) => ({ ...prev, subtitle: e.target.value }))} className="input-nour" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Texte du bouton</span>
              <input value={bannerForm.ctaText} onChange={(e) => setBannerForm((prev) => ({ ...prev, ctaText: e.target.value }))} className="input-nour" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Lien du bouton</span>
              <input value={bannerForm.ctaLink} onChange={(e) => setBannerForm((prev) => ({ ...prev, ctaLink: e.target.value }))} className="input-nour" />
            </label>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-soft border-2 border-nour-lavender-light bg-nour-cream p-4">
            <input
              type="checkbox"
              checked={bannerForm.active}
              onChange={(e) => setBannerForm((prev) => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 accent-nour-lavender"
            />
            <span className="text-sm font-medium text-nour-ink/70">Bannière active</span>
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer la bannière"
        message="Voulez-vous vraiment supprimer cette bannière ? L’image sera également retirée de Cloudinary."
        onConfirm={handleDeleteBanner}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
