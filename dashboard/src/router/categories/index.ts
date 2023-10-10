export const CategoriesRoutes = [
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/CategoriesView.vue'),
    },
    {
        path: '/categories/:id',
        name: 'category',
        component: () => import('@/views/categories/CategoryView.vue'),
    }
];
