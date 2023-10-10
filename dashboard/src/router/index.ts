import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/DashboardView.vue'
import {authRoutes} from "@/router/auth";
import {CategoriesRoutes} from "@/router/categories";
import {UserRoutes} from "@/router/users";
import {ModelsRoutes} from "@/router/models";
import {checkIfAuthenticate} from "@/utils/checkUserAuthentificated";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...CategoriesRoutes,
        ...UserRoutes,
        ...ModelsRoutes,
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
