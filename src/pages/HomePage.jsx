import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/welcome/HeroCarousel';
import WelcomeStory from '../components/welcome/WelcomeStory';
import CategoryGrid from '../components/welcome/CategoryGrid';
import PromoBanner from '../components/welcome/PromoBanner';
import FeaturedProducts from '../components/welcome/FeaturedProducts';
import { fetchWelcomePage, fetchFeaturedProducts } from '../services/welcomePage';
import logo from '../assets/logo.svg';

export default function HomePage() {
  const [cms, setCms] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pageData, featuredData] = await Promise.all([fetchWelcomePage(), fetchFeaturedProducts()]);
        if (cancelled) return;
        setCms(pageData);
        setFeatured(featuredData);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Impossible de charger la page d’accueil');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="NOUR" className="h-16 w-auto animate-float-slow" />
          <p className="font-display text-nour-ink/60">La papeterie se prépare...</p>
        </div>
      </div>
    );
  }

  if (error && !cms) {
    return (
      <div className="container-nour py-20 text-center">
        <p className="font-display text-2xl text-nour-terracotta">Oups, une erreur est survenue.</p>
        <p className="mt-2 text-nour-ink/60">{error}</p>
      </div>
    );
  }

  return (
    <>
      <HeroCarousel banners={cms?.heroBanners || []} />
      <WelcomeStory paragraph={cms?.welcomeParagraph || {}} />
      <CategoryGrid categories={cms?.categories || []} />
      <PromoBanner promo={cms?.promoMessage || {}} />
      <FeaturedProducts products={featured} />
    </>
  );
}
