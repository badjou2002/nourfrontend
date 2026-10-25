import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import Doodles from '../layout/Doodles';

const FALLBACK_CATEGORIES = [
  { name: 'Mugs', slug: 'mugs', emoji: '☕', bg: 'bg-nour-blush-light', color: '#c85347' },
  { name: 'Bloc-notes', slug: 'bloc-notes', emoji: '📓', bg: 'bg-nour-lavender-pale', color: '#a09ece' },
  { name: 'Planners', slug: 'planners', emoji: '🗓️', bg: 'bg-nour-teal-light', color: '#3fa0a4' },
  { name: 'Marque-pages', slug: 'marque-pages', emoji: '🔖', bg: 'bg-nour-sage-light', color: '#adc7a6' },
  { name: 'Duos', slug: 'duos', emoji: '🎁', bg: 'bg-nour-blush-light', color: '#80a7d9' },
  { name: 'Accessoires', slug: 'accessoires', emoji: '✏️', bg: 'bg-nour-lavender-pale', color: '#a09ece' },
];

export default function CategoryGrid({ categories = [] }) {
  const data = categories.length ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="relative bg-doodle-grid py-16 sm:py-20">
      <Doodles
        items={[
          { type: 'sparkle', top: '6%', left: '5%', size: 30 },
          { type: 'heart', bottom: '8%', right: '6%', size: 34 },
          { el: 4, top: '4%', right: '3%', size: 56, opacity: 0.55, rotate: -12 },
          { el: 9, bottom: '5%', left: '3%', size: 60, opacity: 0.5, rotate: 14 },
        ]}
      />
      <div className="container-nour relative">
        <SectionTitle
          label="Nos univers"
          title="Une catégorie pour chaque envie"
          subtitle="Explorez nos collections pensées pour organiser, décorer et inspirer votre quotidien."
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {data.slice(0, 6).map((category, index) => {
            const fallback = FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length];
            const emoji = fallback.emoji;
            const bg = category.bg || fallback.bg;
            return (
              <Link
                key={category._id || category.slug}
                to={`/catalogue?category=${category.slug}`}
                className="card-nour group flex flex-col items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-doodle-lg sm:p-5"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-blob text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-wiggle sm:h-24 sm:w-24 sm:text-5xl ${bg}`}
                >
                  {category.imageCloudinaryUrl ? (
                    <img
                      src={category.imageCloudinaryUrl}
                      alt={category.name}
                      className="h-full w-full rounded-blob object-cover"
                    />
                  ) : (
                    <span>{emoji}</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-display text-sm font-semibold text-nour-ink">{category.name}</h3>
                  <p className="mt-1 text-xs text-nour-ink/40">
                    {category.productCount != null ? `${category.productCount} article(s)` : 'Découvrir'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
