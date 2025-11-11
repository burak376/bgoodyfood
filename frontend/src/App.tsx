import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'
import { ErrorHandlerInit } from '@/components/error-handler-init'
import Layout from '@/components/layout'
import HomePage from '@/pages/home'
import ProductsPage from '@/pages/products'
import CategoriesPage from '@/pages/categories'
import CategoryDetailPage from '@/pages/category-detail'
import ProductDetailPage from '@/pages/product-detail'
import CartPage from '@/pages/cart'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import ContactPage from '@/pages/contact'
import AboutPage from '@/pages/about'

function App() {
  return (
    <ErrorBoundary>
      <ErrorHandlerInit />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App