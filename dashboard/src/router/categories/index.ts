export const CategoriesRoutes = [
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/CategoriesView.vue'),
        meta: {
            title: 'Categories',
            requiresAuthentication: true,
        }
    },
    {
        path: '/categories/create',
        name: 'create-category',
        component: import('@/views/categories/CategoriesSidebarForm.vue'),
        meta: {
          title: 'Create Category',
          requiresAuthentication: true
        }
      },
    {
        path: '/categories/:id',
        name: 'category',
        component: () => import('@/views/categories/CategoryView.vue'),
        meta: {
            title: 'Category :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/categories/:id/edit',
        name: 'edit-category',
        component: () => import('@/views/categories/CategoriesSidebarForm.vue'),
        meta: {
            title: 'Edit Category :id',
            requiresAuthentication: true,
        }
    },
    {
        path: '/categories/:id/delete',
        name: 'delete-category',
        component: () => import('@/views/categories/CategoriesView.vue'),
        meta: {
            title: 'Delete Category',
            requiresAuthentication: true,
        }
    }
];
