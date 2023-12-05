import {createRouter, createWebHistory} from 'vue-router'
import {policiesRoutes} from "@/router/Policies";
// @ts-ignore
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...policiesRoutes,
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('@/views/ProductsView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/products/:id',
            name: 'product',
            component: () => import('@/views/ProductView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        // Todo: make the requires auth dynamic
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/CartView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/wishlist',
            name: 'wishlist',
            component: () => import('@/views/WichlistView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('@/views/CheckoutView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/payment/success',
            name: 'payment-success',
            component: () => import('@/views/PaymentSuccessView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/payment/failed',
            name: 'payment-failed',
            component: () => import('@/views/PaymentFailedView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/RegisterView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/auth/ProfileView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/faq',
            name: 'faq',
            component: () => import('@/views/FaqView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/exchange-policy',
            name: 'exchange-policy',
            component: () => import('@/views/policies/ExchangePolicyView.vue'),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: {
                requiresAuth: false
            }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    },
})

router.beforeEach(async (to, from, next) => {
    const token = window.localStorage.getItem('token')
    const loggedIn = !!token

    if (to.meta.requiresAuth && !loggedIn) {
        next({name: 'login'})
    } else {
        if (loggedIn) {
            try {
                const response = await fetch(`http://localhost:3000/auth/check-if-authenticated`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    window.localStorage.removeItem('token')
                    window.localStorage.removeItem('user')
                    next({name: 'login'})
                }
            } catch (error) {
                console.error('Error while fetching user', error)
                next({name: 'login'})
            }
        }
        next()
    }
})
export default router
