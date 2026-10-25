import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Doodles from '../layout/Doodles';

export default function WelcomeStory({ paragraph = {} }) {
  const title = paragraph.title || 'La douceur, le fil rouge de NOUR';
  const highlight = paragraph.highlight || '';
  const content =
    paragraph.content ||
    'NOUR est née d’une envie simple : transformer l’organisation du quotidien en un moment de plaisir. Chaque carnet, chaque mug, chaque accessoire est choisi avec soin pour apporter de la couleur, de la joie et de la créativité dans votre vie.';

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Doodles
        className="hidden lg:block"
        items={[
          { type: 'circle', top: '8%', right: '10%', size: 26, color: '#3fa0a4', opacity: 0.2 },
          { type: 'plus', bottom: '12%', left: '8%', size: 22, color: '#c85347', opacity: 0.25 },
          { type: 'star', top: '40%', left: '45%', size: 20, opacity: 0.3 },
          { el: 7, top: '64%', right: '4%', size: 62, opacity: 0.55, rotate: 8 },
          { el: 13, top: '10%', left: '42%', size: 54, opacity: 0.45, rotate: -14 },
        ]}
      />
      <div className="container-nour relative grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-64 sm:w-80">
          <div className="flex h-72 w-64 items-end justify-center rounded-blob bg-gradient-to-br from-nour-blush via-nour-blush-light to-white p-5 shadow-doodle sm:h-80 sm:w-80 sm:p-6">
            <div className="mb-4 grid grid-cols-2 gap-3">
              {['✏️', '📓', '☕', '🗓️'].map((emoji) => (
                <span
                  key={emoji}
                  className="flex h-20 w-20 animate-float-slow items-center justify-center rounded-soft bg-white/80 text-3xl shadow-soft sm:h-24 sm:w-24 sm:text-4xl"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
          <span className="absolute -right-6 top-6 hidden h-16 w-16 animate-float-slower items-center justify-center rounded-full bg-nour-sage text-xl shadow-doodle sm:flex">
            ✨
          </span>
          <span className="absolute -left-5 bottom-4 hidden h-14 w-14 animate-float-slow items-center justify-center rounded-full bg-nour-teal text-lg text-white shadow-doodle-teal sm:flex">
            ❤
          </span>
        </div>

        <div className="text-center lg:text-left">
          <p className="section-label mb-3 text-nour-lavender">Notre histoire</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            {title}
            {highlight && (
              <span className="block bg-gradient-to-r from-nour-teal to-nour-lavender bg-clip-text text-transparent">
                {highlight}
              </span>
            )}
          </h2>
          <p className="mt-5 max-w-lg text-nour-ink/60 sm:text-lg">{content}</p>
          <div className="mt-8 flex justify-center gap-3 lg:justify-start">
            <Link to="/catalogue">
              <Button variant="teal" size="lg">
                Explorer la collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
