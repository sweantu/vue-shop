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
              component: () => import('../views/AccountSettingsView.vue'),
            },
            {
              path: 'orders',
              name: 'orders',
              component: () => import('../views/OrdersView.vue'),
            },
            {
              path: 'orders/:id',
              name: 'order-detail',
              component: () => import('../views/OrderDetailView.vue'),
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
      path: '/login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/google-oauth/callback',
      component: () => import('../views/GoogleOAuthCallbackView.vue'),
    },
  ],
})

export default router
