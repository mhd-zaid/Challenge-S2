export const CategoriesRoutes = [
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/CategoriesView.vue'),
        meta: {
            title: 'Categories',
            requiresAuthentication: true,
        }
    },
    {
        path: '/categories/:id',
        name: 'category',
        component: () => import('@/views/categories/CategoryView.vue'),
        meta: {
            title: 'Category :id',
            requiresAuthentication: true,
        }
    },
];
