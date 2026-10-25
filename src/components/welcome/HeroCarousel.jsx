import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../ui/Button';
import Doodles from '../layout/Doodles';
import logo from '../../assets/logo.svg';

export default function HeroCarousel({ banners = [] }) {
  const activeBanners = banners.filter((b) => b.active);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next');

  const goTo = useCallback(
    (index) => {
      if (!activeBanners.length) return;
      setDirection(index > current || (index === 0 && current === activeBanners.length - 1) ? 'next' : 'prev');
      setCurrent((index + activeBanners.length) % activeBanners.length);
    },
    [activeBanners.length, current]
  );

  useEffect(() => {
    if (!activeBanners.length) return;
    const timer = setInterval(() => {
      setDirection('next');
      setCurrent((c) => (c + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (!activeBanners.length) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-nour-lavender-pale via-white to-nour-blush-light">
      <Doodles
        className="hidden sm:block"
        items={[
          { type: 'sparkle', top: '12%', left: '6%', size: 34 },
          { type: 'heart', top: '20%', right: '8%', size: 40 },
          { type: 'star', bottom: '14%', left: '18%', size: 30, color: '#c85347', opacity: 0.18 },
          { type: 'squiggle', bottom: '22%', right: '22%', size: 60 },
          { el: 15, top: '6%', right: '3%', size: 76, opacity: 0.5, rotate: 10 },
          { el: 2, bottom: '6%', left: '3%', size: 68, opacity: 0.5, rotate: -8 },
        ]}
      />

      <div className="container-nour relative flex h-[560px] items-center overflow-hidden sm:h-[540px] lg:h-[560px]">
        <div className="relative h-full w-full">
          {activeBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className={`absolute inset-0 flex items-center transition-all duration-700 ease-out ${
                index === current ? 'translate-x-0 opacity-100' : 'pointer-events-none opacity-0'
              } ${direction === 'prev' ? '-translate-x-8' : 'translate-x-8'}`}
              aria-hidden={index !== current}
            >
              <div className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-2">
                <div className={`order-2 text-center lg:order-1 lg:text-left ${index === current ? 'animate-fade-up' : ''}`}>
                  <p className="section-label mb-3 text-nour-teal">Papeterie créative</p>
                  <h1 className="font-display text-3xl font-bold leading-tight text-nour-ink sm:text-5xl lg:text-6xl">
                    {banner.title || 'Créez, organisez, rêvez.'}
                  </h1>
                  <p className="mx-auto mt-4 max-w-md text-sm text-nour-ink/60 sm:text-lg lg:mx-0">
                    {banner.subtitle ||
                      'Planners, bloc-notes et accessoires dessinés avec douceur pour rendre chaque journée plus belle.'}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-7 lg:justify-start">
                    <Link to={banner.ctaLink || '/catalogue'}>
                      <Button size="lg" className="animate-wiggle">
                        {banner.ctaText || 'Découvrir'}
                      </Button>
                    </Link>
                    <Link to="/catalogue">
                      <Button size="lg" variant="outline">
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative order-1 flex justify-center lg:order-2">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Bannière NOUR'}
                    className="h-32 w-32 rounded-blob object-cover shadow-doodle sm:h-44 sm:w-44 lg:h-80 lg:w-80 lg:shadow-doodle-lg"
                  />
                  <span className="absolute -bottom-4 -left-6 hidden h-20 w-20 animate-float-slow items-center justify-center rounded-full bg-white p-3 shadow-doodle-teal lg:flex">
                    <img src={logo} alt="NOUR" className="h-auto w-full" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeBanners.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-4 pb-6">
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Bannière précédente"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-nour-lavender-dark shadow-doodle transition-transform hover:scale-110 sm:h-11 sm:w-11"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {activeBanners.map((banner, index) => (
              <button
                key={banner._id || index}
                onClick={() => goTo(index)}
                aria-label={`Aller à la bannière ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === current ? 'w-8 bg-nour-lavender' : 'w-2.5 bg-nour-lavender/30 hover:bg-nour-lavender/60'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Bannière suivante"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-nour-lavender text-white shadow-doodle transition-transform hover:scale-110 sm:h-11 sm:w-11"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
