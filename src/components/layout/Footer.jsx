import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-nour-lavender-dark to-nour-lavender text-white">
      <div className="container-nour grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex rounded-softer bg-white/95 px-3 py-2 shadow-soft">
            <img src={logo} alt="NOUR" className="h-10 w-auto" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Papeterie créative pensée avec douceur pour rythmer vos journées : planners, bloc-notes, mugs
            et accessoires qui illuminent votre quotidien.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Boutique</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/catalogue" className="hover:text-white">Tout le catalogue</Link></li>
            <li><Link to="/catalogue?sort=popular" className="hover:text-white">Meilleures ventes</Link></li>
            <li><Link to="/catalogue?sort=price_asc" className="hover:text-white">Petits prix</Link></li>
            <li><Link to="/catalogue?availability=preorder" className="hover:text-white">Précommandes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Aide</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/aide/livraison" className="hover:text-white">Livraison en Tunisie</Link></li>
            <li><Link to="/aide/retours" className="hover:text-white">Retours &amp; échanges</Link></li>
            <li><Link to="/aide/paiement" className="hover:text-white">Moyens de paiement</Link></li>
            <li><Link to="/contact" className="hover:text-white">Nous contacter</Link></li>
          </ul>
        </div>

      <div>
        <h4 className="font-display text-lg font-semibold">Suivez-nous</h4>
        <ul className="mt-4 space-y-3 text-sm text-white/80">
          <li className="flex items-center gap-2">
            <FiMapPin /> Tunis, Tunisie
          </li>
          <li className="flex items-center gap-2">
            <FiPhone /> +216 44 496 777
          </li>
          <li className="flex items-center gap-2">
            <FiMail /> nawarty2024@gmail.com
          </li>
        </ul>
        <div className="mt-5 flex gap-3">
          <a href="https://www.instagram.com/nouraesthetic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de NOUR" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30">
            <FiInstagram size={18} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61556062874425" target="_blank" rel="noopener noreferrer" aria-label="Facebook de NOUR" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30">
            <FiFacebook size={18} />
          </a>
        </div>
      </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} NOUR — Papeterie créative. Tous droits réservés. Fait avec ♥ en Tunisie.
      </div>
    </footer>
  );
}
