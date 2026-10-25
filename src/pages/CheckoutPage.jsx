import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Doodles from '../components/layout/Doodles';
import { formatTND } from '../utils/format';
import client from '../api/client';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, setIsOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [governorates, setGovernorates] = useState([]);
  const [freeThreshold, setFreeThreshold] = useState(150);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', governorate: '', city: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsOpen(false);
    client
      .get('/orders/shipping-rates')
      .then((res) => {
        setGovernorates(res.data.data.governorates);
        setFreeThreshold(res.data.data.freeShippingThreshold);
      })
      .catch(() => {});
  }, [setIsOpen]);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  const shippingCost = useMemo(() => {
    if (subtotal >= freeThreshold) return 0;
    const gov = governorates.find((g) => g.name === form.governorate);
    return gov ? gov.shipping : null;
  }, [form.governorate, governorates, subtotal, freeThreshold]);

  const total = useMemo(() => subtotal + (shippingCost ?? 0), [subtotal, shippingCost]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (shippingCost === null) {
      setError('Sélectionnez votre gouvernorat pour calculer la livraison.');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        customerDetails: { fullName: form.fullName, phone: form.phone, email: form.email },
        shippingAddress: { governorate: form.governorate, city: form.city, address: form.address },
        paymentMethod,
        notes: form.notes,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variant?._id,
          variant: item.variant ? { name: item.variant.name, attributes: item.variant.attributes } : undefined,
        })),
      };
      const res = await client.post('/orders', payload);
      setPlacedOrder(res.data.data);
      clearCart();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err.message || 'Impossible de passer la commande.');
    } finally {
      setPlacing(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container-nour flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-nour-sage-light text-5xl">
          <FiCheckCircle className="text-nour-teal" />
        </span>
        <h1 className="font-display text-3xl font-bold">Commande confirmée !</h1>
        <p className="mt-3 max-w-md text-nour-ink/60">
          Merci {placedOrder.customerDetails.fullName} ! Votre commande
          <span className="font-semibold text-nour-lavender-dark"> {placedOrder.orderNumber} </span>
          d’un montant de <span className="font-semibold">{formatTND(placedOrder.totalPrice)}</span> a bien été
          enregistrée{placedOrder.paymentMethod === 'cod' ? ' (paiement à la livraison)' : ''}.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/catalogue">
            <Button variant="teal">Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-nour flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h1 className="font-display text-2xl font-bold">Connectez-vous pour commander</h1>
        <p className="mt-3 max-w-md text-nour-ink/60">
          Pour finaliser votre commande, vous devez être connecté à votre compte NOUR.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/compte/connexion?redirect=/checkout">
            <Button variant="teal">Se connecter</Button>
          </Link>
          <Link to="/compte/inscription?redirect=/checkout">
            <Button variant="outline">Créer un compte</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-nour flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-6xl">🛒</span>
        <h1 className="font-display text-2xl font-bold">Votre panier est vide</h1>
        <Link to="/catalogue" className="mt-6">
          <Button variant="teal">Explorer le catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-nour relative py-10">
      <Doodles
        items={[
          { el: 12, top: '3%', right: '-1%', size: 54, opacity: 0.45, rotate: 10 },
          { el: 3, bottom: '10%', left: '-2%', size: 58, opacity: 0.45, rotate: -10 },
        ]}
      />
      <h1 className="mb-8 text-center font-display text-3xl font-bold sm:text-4xl">Finaliser ma commande</h1>

      <form onSubmit={handleSubmit} className="relative grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">1. Vos informations</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Nom complet *" className="input-nour" />
              <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Téléphone *" className="input-nour" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email (optionnel)" className="input-nour sm:col-span-2" />
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">2. Adresse de livraison</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select
                name="governorate"
                required
                value={form.governorate}
                onChange={handleChange}
                className="input-nour sm:col-span-2"
              >
                <option value="">Gouvernorat *</option>
                {governorates.map((gov) => (
                  <option key={gov.name} value={gov.name}>
                    {gov.name} — {gov.shipping} DT{subtotal >= freeThreshold ? ` (gratuite dès ${freeThreshold} DT)` : ''}
                  </option>
                ))}
              </select>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Ville" className="input-nour" />
              <input name="address" required value={form.address} onChange={handleChange} placeholder="Adresse détaillée *" className="input-nour" />
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">3. Mode de paiement</h2>
            <div className="mt-4 space-y-3">
              {[
                { value: 'cod', label: 'Paiement à la livraison (Cash on Delivery)', emoji: '💵' },
                { value: 'card', label: 'Carte bancaire en ligne', emoji: '💳', disabled: true },
                { value: 'edinar', label: 'e-Dinar', emoji: '📱', disabled: true },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 rounded-soft border-2 p-4 transition-colors ${
                    option.disabled
                      ? 'cursor-not-allowed border-nour-lavender-light/60 opacity-60'
                      : paymentMethod === option.value
                        ? 'cursor-pointer border-nour-lavender bg-nour-lavender-pale'
                        : 'cursor-pointer border-nour-lavender-light hover:border-nour-lavender'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    disabled={option.disabled}
                    className="h-4 w-4 accent-nour-lavender"
                  />
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-display text-sm font-medium">{option.label}</span>
                  {option.disabled && (
                    <span className="ml-auto rounded-full bg-nour-lavender-light px-2.5 py-1 text-xs font-medium text-nour-lavender-dark">
                      Bientôt disponible
                    </span>
                  )}
                </label>
              ))}
              <p className="text-xs text-nour-ink/50">
                Le paiement en ligne (carte bancaire et e-Dinar) sera disponible prochainement.
              </p>
            </div>
          </section>

          <section className="card-nour p-6">
            <h2 className="font-display text-lg font-semibold text-nour-lavender-dark">4. Note (optionnel)</h2>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Une précision pour votre commande ?"
              className="input-nour mt-4 resize-none"
            />
          </section>

          {error && (
            <div className="rounded-soft bg-nour-terracotta-light px-4 py-3 text-sm font-medium text-nour-terracotta">
              {error}
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card-nour p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <FiShoppingBag className="text-nour-lavender" /> Récapitulatif
            </h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-3 text-sm">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-12 w-12 rounded-soft object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-soft bg-nour-lavender-pale text-xl">📦</span>
                  )}
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{item.title}</p>
                    <p className="text-xs text-nour-ink/50">
                      {item.variant?.name ? `${item.variant.name} · ` : ''}× {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">{formatTND(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t-2 border-nour-lavender-light/60 pt-4 text-sm">
              <div className="flex justify-between text-nour-ink/70">
                <span>Sous-total</span>
                <span>{formatTND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-nour-ink/70">
                <span>Livraison</span>
                <span>{shippingCost === null ? 'À sélectionner' : shippingCost === 0 ? 'Gratuite 🎉' : formatTND(shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-nour-lavender-light/60 pt-3 font-display text-lg font-bold text-nour-lavender-dark">
                <span>Total</span>
                <span>{shippingCost === null ? formatTND(subtotal) : formatTND(total)}</span>
              </div>
              {subtotal < freeThreshold && shippingCost !== null && (
                <p className="text-xs text-nour-ink/50">
                  Plus que <span className="font-semibold text-nour-teal">{formatTND(freeThreshold - subtotal)}</span> pour la livraison gratuite !
                </p>
              )}
            </div>

            <Button size="lg" className="mt-5 w-full" disabled={placing}>
              {placing ? 'Envoi en cours...' : 'Confirmer la commande'}
            </Button>
            <p className="mt-3 text-center text-xs text-nour-ink/50">
              En confirmant, vous acceptez nos conditions de vente.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
