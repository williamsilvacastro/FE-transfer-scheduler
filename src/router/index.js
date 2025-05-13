import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/agendamentos',
    name: 'ListagemAgendamentos',
    component: () => import('../views/ListagemAgendamentos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/novo-agendamento',
    name: 'AgendamentoTransferencia',
    component: () => import('../views/AgendamentoTransferencia.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = store.state.auth.isLoggedIn

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/agendamentos')
  } else {
    next()
  }
})

export default router 