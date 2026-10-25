import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Doodles from '../layout/Doodles';

export default function PromoBanner({ promo = {} }) {
  if (!promo || !promo.active) return null;
  return (
    <section className="container-nour py-10">
      <div className="relative overflow-hidden rounded-squishy bg-gradient-to-r from-nour-lavender via-nour-lavender to-nour-teal p-6 text-white shadow-doodle-lg sm:p-10">
        <Doodles
          className="hidden sm:block"
          items={[
            { el: 1, top: '-10%', right: '5%', size: 110, opacity: 0.9, rotate: 12 },
            { el: 11, bottom: '-14%', left: '28%', size: 100, opacity: 0.85, rotate: -12 },
          ]}
        />
        <div className="relative">
          <Badge tone="blush" className="bg-white/20 text-white">
            Promo en cours
          </Badge>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            {promo.text || 'Jusqu’à -20% sur une sélection douce'}
          </h2>
          <p className="mt-2 max-w-md text-white/85">
            Profitez de nos offres exclusives avant épuisement du stock.
          </p>
          <Link to={promo.link || '/catalogue?promo=true'}>
            <Button variant="terracotta" size="lg" className="mt-6">
              J’en profite
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
