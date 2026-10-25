import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import ProductCard from '../catalog/ProductCard';
import Doodles from '../layout/Doodles';

export default function FeaturedProducts({ products = [], title = 'Nos produits vedettes', label = 'Sélection du moment' }) {
  const trackRef = useRef(null);

  const scroll = (delta) => {
    trackRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="container-nour relative py-16 sm:py-20">
      <Doodles
        items={[
          { el: 6, top: '-2%', right: '1%', size: 56, opacity: 0.5, rotate: 10 },
          { el: 12, bottom: '4%', left: '-1%', size: 52, opacity: 0.5, rotate: -10 },
        ]}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <SectionTitle label={label} title={title} align="left" className="mb-0" />
        <div className="mb-4 flex gap-2 sm:mb-10">
          <button
            onClick={() => scroll(-360)}
            aria-label="Défiler à gauche"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-nour-lavender-dark shadow-doodle transition-transform hover:scale-110"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll(360)}
            aria-label="Défiler à droite"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-nour-lavender text-white shadow-doodle transition-transform hover:scale-110"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar relative -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:gap-6"
      >
        {products.map((product) => (
          <div key={product._id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
