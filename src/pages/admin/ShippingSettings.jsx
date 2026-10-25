import React, { useEffect, useState } from 'react';
import { FiSave, FiRotateCcw } from 'react-icons/fi';
import { getShippingSettings, updateShippingSettings } from '../../services/admin';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function ShippingSettings() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState(150);
  const [rates, setRates] = useState([]);

  const fetchSettings = () => {
    setLoading(true);
    getShippingSettings()
      .then((data) => {
        setThreshold(data.freeShippingThreshold);
        setRates(data.governorates);
      })
      .catch((err) => notify(err.message || 'Impossible de charger les frais de livraison', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchSettings, []);

  const setRate = (index, value) =>
    setRates((prev) => prev.map((g, i) => (i === index ? { ...g, shipping: value } : g)));

  const handleSave = async () => {
    const parsed = rates.map((g) => ({ name: g.name, shipping: Number(g.shipping) }));
    if (parsed.some((g) => !Number.isFinite(g.shipping) || g.shipping < 0)) {
      notify('Les frais de livraison doivent être un nombre positif', 'error');
      return;
    }
    const parsedThreshold = Number(threshold);
    if (!Number.isFinite(parsedThreshold) || parsedThreshold < 0) {
      notify('Le seuil de livraison gratuite est invalide', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateShippingSettings({ governorates: parsed, freeShippingThreshold: parsedThreshold });
      notify('Frais de livraison enregistrés');
      fetchSettings();
    } catch (err) {
      notify(err.message || 'Enregistrement impossible', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Livraison"
        subtitle="Définissez les frais de livraison par gouvernorat et le seuil de livraison gratuite."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchSettings} disabled={saving}>
              <FiRotateCcw size={16} /> Réinitialiser les modifications
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              <FiSave size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-nour-ink/50">Chargement...</p>
      ) : (
        <div className="space-y-6">
          <div className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">
              Seuil de livraison gratuite
            </h2>
            <p className="mt-1 text-sm text-nour-ink/60">
              Les commandes dont le sous-total dépasse ce montant bénéficient de la livraison offerte.
            </p>
            <label className="mt-4 block max-w-xs">
              <span className="mb-1.5 block text-sm font-medium text-nour-ink/70">Montant (TND)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="input-nour"
              />
            </label>
          </div>

          <div className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">
              Frais par gouvernorat
            </h2>
            <p className="mt-1 text-sm text-nour-ink/60">
              Ces tarifs s’affichent dans le sélecteur « Gouvernorat » du checkout.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rates.map((gov, index) => (
                <div
                  key={gov.name}
                  className="flex items-center justify-between gap-3 rounded-soft border-2 border-nour-lavender-light/60 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-nour-ink">{gov.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={gov.shipping}
                      onChange={(e) => setRate(index, e.target.value)}
                      className="w-20 rounded-soft border-2 border-nour-lavender-light px-2 py-1 text-right text-sm focus:border-nour-lavender focus:outline-none"
                    />
                    <span className="text-xs text-nour-ink/50">DT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
