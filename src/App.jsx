import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="categoria/:slug" element={<CatalogPage />} />
        <Route path="colecao/:slug" element={<CatalogPage />} />
        <Route path="produto/:slug" element={<ProductPage />} />
        <Route path="favoritos" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
