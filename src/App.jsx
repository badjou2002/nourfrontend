import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AccountLoginPage from './pages/account/LoginPage';
import RegisterPage from './pages/account/RegisterPage';
import AccountPage from './pages/account/AccountPage';
import AdminRoutes from './admin/AdminRoutes';

export default function App() {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPage />} />
          <Route path="/produit/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/compte" element={<AccountPage />} />
          <Route path="/compte/connexion" element={<AccountLoginPage />} />
          <Route path="/compte/inscription" element={<RegisterPage />} />
          {AdminRoutes()}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isAdminArea && <Footer />}
      <CartDrawer />
    </div>
  );
}
