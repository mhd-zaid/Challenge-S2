import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/DashboardView.vue'
import {authRoutes} from "@/router/auth";
import {checkIfAuthenticate} from "@/utils/checkUserAuthentificated";

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
    const isLoggedIn = checkIfAuthenticate();
    if (to.name !== 'login' && !isLoggedIn)
        next({name: 'login'});
    else if (to.name === 'login' && isLoggedIn)
        next({name: 'dashboard'});
    else
        next();
});

export default router
