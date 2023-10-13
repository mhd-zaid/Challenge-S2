export const ModelsRoutes = [
    {
        path: '/models',
        name: 'models',
        component: () => import('@/views/models/ModelsView.vue'),
        meta : {
            title: 'Models',
            requiresAuthentication: true,
        }
    },
    {
        path: '/models/:id',
        name: 'model-details',
        component: () => import('@/views/models/ModelView.vue'),
        meta : {
            title: 'Model :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/models/:id/edit',
        name: 'edit-model',
        component: () => import('@/views/models/ModelsFormView.vue'),
        meta : {
            title: 'Edit Model :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/models/:id/delete',
        name: 'delete-model',
        component: () => import('@/views/models/ModelsView.vue'),
        meta : {
            title: 'Delete Model',
            requiresAuthentication: true,
        }
    },
    {
        path: '/models/create',
        name: 'create-model',
        component: () => import('@/views/models/ModelsFormView.vue'),
        meta : {
            title: 'Create Model',
            requiresAuthentication: true,
        }
    }
];
