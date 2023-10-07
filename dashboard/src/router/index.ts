import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/DashboardView.vue'
import {authRoutes} from "@/router/auth";
import {useUserStore} from "@/stores/user";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...authRoutes,
        {
            path: '/',
            name: 'dashboard',
            component: HomeView
        },
    ]
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isLoggedIn = userStore.isLoggedIn;

    if (to.name !== 'login' && !isLoggedIn) {
        next({name: 'login'});
    }

    if (to.name === 'login' && isLoggedIn) {
        next({name: 'dashboard'});
    }

    next();
});

export default router
