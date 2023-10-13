export const ProductsRoutes = [
  {
    path: '/products',
    name: 'products',
    component: import('@/views/products/ProductsView.vue'),
    meta: {
      title: 'Products',
      requiresAuthentication: true
    }
  },
  {
    path: '/products/create',
    name: 'create-product',
    component: import('@/views/products/ProductsFormView.vue'),
    meta: {
      title: 'Create Product',
      requiresAuthentication: true
    }
  },
  {
    path: '/products/:id',
    name: 'product',
    component: import('@/views/products/ProductView.vue'),
    meta : {
      title: 'Product',
      requiresAuthentication: true,
    }
  },
  {
    path: '/products/:id/edit',
    name: 'edit-product',
    component: import('@/views/products/ProductsFormView.vue'),
    meta: {
      title: 'Edit Product',
      requiresAuthentication: true
    }
  },
  {
    path: '/products/:id/delete',
    name: 'delete-product',
    component: import('@/views/products/ProductsFormView.vue'),
    meta: {
      title: 'Delete Product',
      requiresAuthentication: true
    }
  }
]
