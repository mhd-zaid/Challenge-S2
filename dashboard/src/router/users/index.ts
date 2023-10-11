export const UserRoutes = [
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/UsersView.vue'),
        meta : {
            title: 'Users',
            requiresAuthentication: true,
        }
    },
    {
        path: '/users/create',
        name: 'user-create',
        component: () => import('@/views/users/UserCreate.vue'),
        meta : {
            title: 'Create User',
            requiresAuthentication: true,
        }
    },
    {
        path: '/users/:id',
        name: 'user',
        component: () => import('@/views/users/UserView.vue'),
        meta : {
            title: 'User :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/users/:id/edit',
        name: 'user-edit',
        component: () => import('@/views/users/UserEdit.vue'),
        meta : {
            title: 'Edit User :id',
            requiresAuthentication: true,
        }
    }
]
