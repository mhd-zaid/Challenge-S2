export const ProductsRoutes = [
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/products/ProductsView.vue'),
    meta: {
      title: 'Products',
      requiresAuthentication: true
    }
  },
  {
    path: '/products/:id',
    name: 'product',
    component: () => import('@/views/products/ProductView.vue'),
    meta: {
      title: 'Product',
      requiresAuthentication: true,
    }
  },
]
