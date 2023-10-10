export const UserRoutes = [
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/UsersView.vue'),
    },
    {
        path: '/users/create',
        name: 'user-create',
        component: () => import('@/views/users/UserCreate.vue'),
    },
    {
        path: '/users/:id',
        name: 'user',
        component: () => import('@/views/users/UserView.vue'),
    },
    {
        path: '/users/:id/edit',
        name: 'user-edit',
        component: () => import('@/views/users/UserEdit.vue'),
    }
]
