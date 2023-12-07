export const UserRoutes = [
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/UsersView.vue'),
        meta : {
            title: 'Users',
            requiresAuthentication: true,
            role: 'ROLE_ADMIN'
        }
    },
    {
        path: '/users/:id',
        name: 'user',
        component: () => import('@/views/users/UserView.vue'),
        meta : {
            title: 'User :id',
            requiresAuthentication: true,
            role: 'ROLE_ADMIN'
        }
    },
]
