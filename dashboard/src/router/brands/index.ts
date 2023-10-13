export const BrandsRoutes = [
    {
        path: '/brands',
        name: 'brands',
        component: () => import('@/views/brands/BrandsView.vue'),
        meta: {
            title: 'Brands',
            requiresAuthentication: true,
        }
    },
    {
        path: '/brands/create',
        name: 'create-brand',
        component: import('@/views/brands/BrandsFormView.vue'),
        meta: {
          title: 'Create Brand',
          requiresAuthentication: true
        }
      },
    {
        path: '/brands/:id',
        name: 'brand',
        component: () => import('@/views/brands/BrandView.vue'),
        meta: {
            title: 'Brand',
            requiresAuthentication: true,
        }
    },
    {
        path: '/brands/:id/edit',
        name: 'edit-brand',
        component: () => import('@/views/brands/BrandsFormView.vue'),
        meta: {
            title: 'Edit Brand :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/brands/:id/delete',
        name: 'delete-brand',
        component: () => import('@/views/categories/BrandsView.vue'),
        meta: {
            title: 'Delete Brand',
            requiresAuthentication: true,
        }
    }
];
