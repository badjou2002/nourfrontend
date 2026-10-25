import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Price from '../ui/Price';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const image = product.imagesCloudinary?.[0]?.url;
  const discount = product.discountPercent;
  const preorder = product.availability === 'preorder';
  const soldOut = product.availability === 'out_of_stock' || product.stock <= 0;

  return (
    <article className="card-nour group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-doodle-lg">
      <Link to={`/produit/${product.slug}`} className="relative block aspect-square overflow-hidden bg-nour-lavender-pale">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">📦</div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="terracotta">-{discount}%</Badge>}
          {preorder && <Badge tone="teal">Précommande</Badge>}
          {soldOut && <Badge tone="lavender">Épuisé</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.category?.name && (
          <p className="text-xs text-nour-teal">{product.category.name}</p>
        )}
        <Link
          to={`/produit/${product.slug}`}
          className="mt-1 font-display text-base font-semibold leading-snug text-nour-ink transition-colors hover:text-nour-lavender-dark"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-3">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          <button
            onClick={() => {
              if (soldOut) {
                navigate(`/produit/${product.slug}`);
                return;
              }
              addItem(product, { quantity: 1 });
            }}
            disabled={soldOut}
            aria-label={`Ajouter ${product.title} au panier`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-nour-lavender-pale text-nour-lavender-dark transition-all hover:bg-nour-lavender hover:text-white disabled:opacity-50"
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
