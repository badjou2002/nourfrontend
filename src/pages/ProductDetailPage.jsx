import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { fetchProductBySlug, fetchSimilarProducts } from '../services/products';
import { useCart } from '../context/CartContext';
import Price from '../components/ui/Price';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Doodles from '../components/layout/Doodles';
import ProductCard from '../components/catalog/ProductCard';
import SectionTitle from '../components/ui/SectionTitle';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarProductsLoading, setSimilarProductsLoading] = useState(true);
  const [similarProductsError, setSimilarProductsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSimilarProducts([]);
    setSimilarProductsLoading(true);
    setSimilarProductsError(null);
    setActiveImage(0);
    setSelectedVariant(null);
    setQuantity(1);
    fetchProductBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setLoading(false);
        fetchSimilarProducts(slug)
          .then((products) => {
            if (!cancelled) setSimilarProducts(products);
          })
          .catch((err) => {
            if (!cancelled) setSimilarProductsError(err.message || 'Impossible de charger les produits similaires');
          })
          .finally(() => {
            if (!cancelled) setSimilarProductsLoading(false);
          });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Produit introuvable');
          setLoading(false);
        }
      });
    window.scrollTo({ top: 0 });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-display text-nour-ink/60">Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-nour flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-6xl">😢</span>
        <h1 className="font-display text-2xl font-semibold">Produit introuvable</h1>
        <p className="mt-2 text-nour-ink/60">{error}</p>
        <Link to="/catalogue" className="mt-6">
          <Button variant="teal">Retour au catalogue</Button>
        </Link>
      </div>
    );
  }

  const images = product.imagesCloudinary || [];
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompare = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const preorder = product.availability === 'preorder';
  const soldOut = product.availability === 'out_of_stock' || product.stock <= 0;

  const handleAdd = () => {
    addItem(product, { quantity, variant: selectedVariant || undefined });
  };

  return (
    <div className="container-nour relative py-10">
      <Doodles
        items={[
          { el: 5, top: '2%', left: '-2%', size: 56, opacity: 0.45, rotate: -12 },
          { el: 8, top: '40%', right: '-1%', size: 60, opacity: 0.45, rotate: 10 },
        ]}
      />
      <nav className="relative mb-6 flex items-center gap-2 text-sm text-nour-ink/50">
        <Link to="/catalogue" className="flex items-center gap-1 hover:text-nour-lavender-dark">
          <FiArrowLeft /> Catalogue
        </Link>
        {product.category?.name && (
          <>
            <span>/</span>
            <Link to={`/catalogue?category=${product.category.slug}`} className="hover:text-nour-lavender-dark">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-nour-ink/80">{product.title}</span>
      </nav>

      <div className="relative grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="relative aspect-square overflow-hidden rounded-squishy bg-nour-lavender-pale shadow-soft"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            {images[activeImage] ? (
              <img
                src={images[activeImage].url}
                alt={product.title}
                className={`h-full w-full object-cover transition-transform duration-500 ${zoom ? 'scale-150 cursor-zoom-in' : 'cursor-zoom-in'}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">📦</div>
            )}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.discountPercent > 0 && <Badge tone="terracotta">-{product.discountPercent}%</Badge>}
              {preorder && <Badge tone="teal">Précommande</Badge>}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, index) => (
                <button
                  key={img.public_id}
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-20 overflow-hidden rounded-soft border-2 transition-colors ${
                    activeImage === index ? 'border-nour-lavender' : 'border-transparent hover:border-nour-lavender-light'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="section-label mb-2 text-nour-teal">{product.category?.name || 'NOUR'}</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.title}</h1>

          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-nour-terracotta">{"★".repeat(Math.round(product.rating))}</span>
              <span className="text-nour-ink/50">({product.numReviews} avis)</span>
            </div>
          )}

          <div className="mt-4">
            <Price price={displayPrice} compareAtPrice={displayCompare} className="text-2xl" />
          </div>

          <p className="mt-5 leading-relaxed text-nour-ink/70">{product.description}</p>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-sm font-semibold">Options disponibles</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant?._id === variant._id
                        ? 'border-nour-lavender bg-nour-lavender-pale text-nour-lavender-dark'
                        : 'border-nour-lavender-light text-nour-ink/60 hover:border-nour-lavender'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border-2 border-nour-lavender-light">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-lg text-nour-ink/60 hover:text-nour-lavender-dark"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-8 text-center font-display font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-lg text-nour-ink/60 hover:text-nour-lavender-dark"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={soldOut}
              onClick={handleAdd}
            >
              <FiShoppingBag size={18} />
              {soldOut ? 'Épuisé' : 'Ajouter au panier'}
            </Button>
          </div>

          <div className="mt-8 grid gap-3 rounded-squishy bg-white p-5 shadow-soft sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nour-teal-light text-nour-teal-dark">
                <FiTruck size={20} />
              </span>
              <p className="text-xs text-nour-ink/60">
                Livraison partout en Tunisie selon le gouvernorat
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nour-sage-light text-nour-teal-dark">
                <FiShield size={20} />
              </span>
              <p className="text-xs text-nour-ink/60">Paiement à la livraison ou par carte / e-Dinar</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nour-blush-light text-nour-terracotta">
                💝
              </span>
              <p className="text-xs text-nour-ink/60">Emballage soigné &amp; papier recyclé</p>
            </div>
          </div>

          {product.attributes && (
            <div className="mt-6 rounded-squishy bg-nour-lavender-pale p-5">
              <h3 className="font-display text-sm font-semibold text-nour-lavender-dark">Spécifications</h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {product.attributes.format && (
                  <div className="flex justify-between border-b border-nour-lavender-light pb-1">
                    <dt className="text-nour-ink/50">Format</dt>
                    <dd className="font-medium">{product.attributes.format}</dd>
                  </div>
                )}
                {product.attributes.binding && (
                  <div className="flex justify-between border-b border-nour-lavender-light pb-1">
                    <dt className="text-nour-ink/50">Reliure</dt>
                    <dd className="font-medium">{product.attributes.binding}</dd>
                  </div>
                )}
                {product.attributes.paper && (
                  <div className="flex justify-between border-b border-nour-lavender-light pb-1">
                    <dt className="text-nour-ink/50">Papier</dt>
                    <dd className="font-medium">{product.attributes.paper}</dd>
                  </div>
                )}
                {product.attributes.weight && (
                  <div className="flex justify-between border-b border-nour-lavender-light pb-1">
                    <dt className="text-nour-ink/50">Grammage</dt>
                    <dd className="font-medium">{product.attributes.weight}</dd>
                  </div>
                )}
                {product.attributes.dimensions && (
                  <div className="flex justify-between border-b border-nour-lavender-light pb-1">
                    <dt className="text-nour-ink/50">Dimensions</dt>
                    <dd className="font-medium">{product.attributes.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>

      <section className="relative mt-16">
        <SectionTitle label="À découvrir" title="Vous aimerez aussi" align="left" />
        {similarProductsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card-nour h-72 animate-pulse bg-nour-lavender-pale/60" />
            ))}
          </div>
        ) : similarProductsError ? (
          <p className="text-sm text-nour-terracotta">{similarProductsError}</p>
        ) : similarProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct._id} product={similarProduct} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-nour-ink/60">Aucun produit similaire pour le moment.</p>
        )}
      </section>
    </div>
  );
}
