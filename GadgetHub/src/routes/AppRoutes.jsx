import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Deals from '../pages/Deals';
import About from '../pages/About';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import Contact from '../pages/Contact';
import Terms from '../pages/Terms';
import FAQ from '../pages/FAQ';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/deals" element={<Deals />} />
    <Route path="/about" element={<About />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forget" element={<ForgotPassword />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
