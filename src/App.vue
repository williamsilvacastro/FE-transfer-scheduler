<template>
  <div id="app">
    <nav v-if="isLoggedIn">
      <router-link to="/agendamentos">Agendamentos</router-link> |
      <router-link to="/novo-agendamento">Novo Agendamento</router-link> |
      <a href="#" @click.prevent="logout">Sair</a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn)

    const logout = () => {
      store.commit('auth/logout')
      router.push('/login')
    }

    return {
      isLoggedIn,
      logout
    }
  }
}
</script>

<style>
@import './assets/variables.css';

body {
  margin: 0;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

nav {
  padding: 0 var(--spacing-xl);
  height: 64px;
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
}

nav a {
  font-weight: bold;
  color: var(--text-secondary);
  text-decoration: none;
  margin: 0 var(--spacing-lg);
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  transition: color 0.3s;
  padding: 8px 0;
}

nav a:hover {
  color: var(--primary);
}

nav a.router-link-exact-active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  padding-bottom: 6px;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  margin-top: 0;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--bg-secondary);
}

.btn-danger {
  background-color: var(--danger);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: var(--danger-hover);
}

.form-control {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  width: 100%;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.error-message {
  color: var(--danger);
  font-size: 0.9em;
  margin-top: var(--spacing-xs);
}

.loading {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
}

.empty-state {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  margin: var(--spacing-lg) 0;
}
</style> 