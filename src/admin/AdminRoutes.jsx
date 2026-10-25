import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProductList from '../pages/admin/ProductList';
import ProductForm from '../pages/admin/ProductForm';
import CategoryList from '../pages/admin/CategoryList';
import BannersManager from '../pages/admin/BannersManager';
import OrdersList from '../pages/admin/OrdersList';
import OrderDetail from '../pages/admin/OrderDetail';
import ShippingSettings from '../pages/admin/ShippingSettings';

export default function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="produits" element={<ProductList />} />
      <Route path="produits/nouveau" element={<ProductForm />} />
      <Route path="produits/:id" element={<ProductForm />} />
      <Route path="categories" element={<CategoryList />} />
      <Route path="bannieres" element={<BannersManager />} />
      <Route path="commandes" element={<OrdersList />} />
      <Route path="commandes/:id" element={<OrderDetail />} />
      <Route path="livraison" element={<ShippingSettings />} />
    </Route>
  );
}
