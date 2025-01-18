import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/ProductListView.vue'),
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('../views/ProductDetailView.vue'),
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('../views/CartView.vue'),
        },
        {
          path: 'manage',
          name: 'manage',
          component: () => import('../views/ManageView.vue'),
          children: [
            {
              path: 'account-settings',
              name: 'account-settings',
              component: () => import('../components/AccountSettings.vue'),
            },
            {
              path: 'orders',
              name: 'orders',
              // component: () => import('../components/OrdersView.vue'),
            },
            {
              path: 'transactions',
              name: 'transactions',
              component: () => import('../views/TransactionsView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/LoginForm.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../components/RegisterForm.vue'),
        },
      ],
    },
  ],
})

export default router
