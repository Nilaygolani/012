import React from 'react';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';

function ProductCatalogModule() {
  return (
    <>
      <ProductGrid />
      <QuickViewModal />
    </>
  );
}

export default {
  id: 'product-catalog',
  name: 'Product Catalog & Bestsellers',
  slot: 'product-showcase',
  order: 50,
  component: ProductCatalogModule
};

