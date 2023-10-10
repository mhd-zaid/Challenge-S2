export const ModelsRoutes = [
    {
        path: '/models',
        name: 'models',
        component: () => import('@/views/models/ModelsView.vue'),
    },
    {
        path: '/models/:id',
        name: 'model-details',
        component: () => import('@/views/models/ModelView.vue'),
    }
];
