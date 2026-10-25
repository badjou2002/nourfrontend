import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatTND } from '../../utils/format';
import Button from '../ui/Button';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, count } = useCart();
  const navigate = useNavigate();

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-nour-ink/30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-nour-cream shadow-doodle-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b-2 border-nour-lavender-light/60 px-6 py-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <FiShoppingBag className="text-nour-lavender" />
            Mon panier {count > 0 && <span className="text-nour-teal">({count})</span>}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le panier"
            className="flex h-9 w-9 items-center justify-center rounded-full text-nour-ink/60 hover:bg-nour-lavender-pale"
          >
            <FiX size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-6xl">🛍️</span>
            <h3 className="font-display text-lg font-semibold">Votre panier est vide</h3>
            <p className="text-sm text-nour-ink/60">Découvrez nos douceurs papeterie et ajoutez vos coups de cœur.</p>
            <Link to="/catalogue">
              <Button variant="teal" onClick={() => setIsOpen(false)}>
                Explorer le catalogue
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 rounded-soft bg-white p-3 shadow-soft">
                  {item.image ? (
                    <Link to={`/produit/${item.slug}`} onClick={() => setIsOpen(false)}>
                      <img src={item.image} alt={item.title} className="h-20 w-20 rounded-soft object-cover" />
                    </Link>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-soft bg-nour-lavender-pale text-3xl">📦</div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/produit/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-display text-sm font-semibold leading-snug text-nour-ink hover:text-nour-lavender-dark"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.key)}
                        aria-label="Retirer du panier"
                        className="text-nour-ink/40 transition-colors hover:text-nour-terracotta"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    {item.variant?.name && (
                      <p className="mt-0.5 text-xs text-nour-ink/50">Option : {item.variant.name}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border-2 border-nour-lavender-light">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="h-8 w-8 text-nour-ink/60 hover:text-nour-lavender-dark"
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="h-8 w-8 text-nour-ink/60 hover:text-nour-lavender-dark"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display font-semibold text-nour-lavender-dark">
                        {formatTND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t-2 border-nour-lavender-light/60 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold">Sous-total</span>
                <span className="font-display text-xl font-bold text-nour-lavender-dark">{formatTND(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-nour-ink/50">
                Livraison calculée à l’étape suivante selon votre gouvernorat.
              </p>
              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/checkout');
                }}
              >
                Passer la commande
              </Button>
              <Link
                to="/catalogue"
                onClick={() => setIsOpen(false)}
                className="mt-3 block text-center text-sm text-nour-ink/50 hover:text-nour-lavender-dark"
              >
                Continuer mes achats
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
