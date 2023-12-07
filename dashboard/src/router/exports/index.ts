export const ExportsRoutes = [
    {
        path: '/exports',
        name: 'exports',
        component: () => import('@/views/exports/ExportsView.vue'),
        meta: {
            title: 'Exports',
            requiresAuthentication: true,
        }
    },
];
