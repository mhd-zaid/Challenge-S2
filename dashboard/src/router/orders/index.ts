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
        path: '/orders/create',
        name: 'order-create',
        component: () => import('@/views/orders/OrderCreate.vue'),
        meta : {
            title: 'Create Order',
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
    {
        path: '/orders/:id/edit',
        name: 'order-edit',
        component: () => import('@/views/orders/OrderEdit.vue'),
        meta : {
            title: 'Edit Order :id',
            requiresAuthentication: true,
        }
    }
]
