import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/DashboardView.vue'
import {authRoutes} from "@/router/auth";
import {CategoriesRoutes} from "@/router/categories";
import {UserRoutes} from "@/router/users";
import {ModelsRoutes} from "@/router/models";
import {ProductsRoutes} from './products';
import {BrandsRoutes} from './brands';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...CategoriesRoutes,
        ...UserRoutes,
        ...ModelsRoutes,
        ...authRoutes,
        ...ProductsRoutes,
        ...BrandsRoutes,
        {
            path: '/',
            name: 'dashboard',
            component: HomeView,
            meta: {
                title: 'Dashboard',
                requiresAuthentication: true,
            }
        },
    ]
})
router.beforeEach(async (to, from, next) => {
    const token = window.localStorage.getItem("token");
    const loggedIn = !!token;

    if (to.meta.requiresAuthentication && !loggedIn) {
        next({ name: 'login' });
    } else if (!to.meta.requiresAuthentication && loggedIn) {
        next({ name: 'dashboard' });
    } else {
        if (loggedIn) {
            try {
                const response = await fetch(`http://localhost:3000/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem("user");
                    next({ name: 'login' });
                }
            } catch (error) {
                console.error('Error while fetching user', error);
                next({ name: 'login' });
            }
        }
        next();
    }
});


export default router
