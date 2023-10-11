export const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/auth/LoginView.vue'),
        meta : {
            title: 'Login',
            requiresAuthentication: false,
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../../views/auth/RegisterView.vue'),
        meta : {
            title: 'Register',
            requiresAuthentication: false,
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../../views/auth/ProfileView.vue'),
        meta : {
            title: 'Profile',
            requiresAuthentication: true,
        }
    }
];
