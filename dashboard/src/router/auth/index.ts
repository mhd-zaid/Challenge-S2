export const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/auth/LoginView.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../../views/auth/RegisterView.vue'),
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../../views/auth/ProfileView.vue'),
    }
];
