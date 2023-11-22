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
        path: '/brands/:id',
        name: 'brand',
        component: () => import('@/views/brands/BrandView.vue'),
        meta: {
            title: 'Brand',
            requiresAuthentication: true,
        }
    },
];
