export const ModelsRoutes = [
    {
        path: '/models',
        name: 'models',
        component: () => import('@/views/models/ModelsView.vue'),
        meta: {
            title: 'Models',
            requiresAuthentication: true,
        }
    },
    {
        path: '/models/:id',
        name: 'model',
        component: () => import('@/views/models/ModelView.vue'),
        meta: {
            title: 'Model :id',
            requiresAuthentication: true,
        }
    },
];
