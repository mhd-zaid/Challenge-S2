export const ProductsRoutes = [
  {
    path: '/products',
    name: 'products',
    component: import('@/views/products/ProductsView.vue'),
  },
  {
    path: '/products/create',
    name: 'create-product',
    component: import('@/views/products/ProductsFormView.vue'),
  },
  {
    path: '/products/:id',
    name: 'product',
    component: import('@/views/products/ProductsView.vue'),
  },
  {
    path: '/products/:id/edit',
    name: 'edit-product',
    component: import('@/views/products/ProductsFormView.vue'),
  },
  {
    path: '/products/:id/delete',
    name: 'delete-product',
    component: import('@/views/products/ProductsFormView.vue'),
  }
]
