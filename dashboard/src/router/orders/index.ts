export const OrderRoutes = [
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/OrdersView.vue'),
        meta : {
            title: 'Orders',
            requiresAuthentication: true,
        }
    },
    {
        path: '/orders/:id',
        name: 'order',
        component: () => import('@/views/orders/OrderView.vue'),
        meta : {
            title: 'Order :id',
            requiresAuthentication: true,
        }
    },
]
