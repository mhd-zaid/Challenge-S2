export const policiesRoutes = [
    {
        path: '/cgv',
        name: 'cgv',
        component: () => import('@/views/policies/CgvView.vue'),
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
        path: '/cgu',
        name:'cgu',
        component: () => import('@/views/policies/CguView.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: () => import('@/views/policies/PrivacyPolicyView.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/delete-policy',
        name: 'delete-policy',
        component: () => import('@/views/policies/DeletionPolicy.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/warranty-policy',
        name: 'warranty-policy',
        component: () => import('@/views/policies/WarrantyPolicyView.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/refund-policy',
        name: 'refund-policy',
        component: () => import('@/views/policies/RefundPolicyView.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/delivery-policy',
        name: 'delivery-policy',
        component: () => import('@/views/policies/DeliveryPolicyView.vue'),
        meta: {
            requiresAuth: false
        }
    },
];