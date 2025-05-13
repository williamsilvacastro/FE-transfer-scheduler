import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'http://localhost:8081/transfer'

// Configuração global do axios
axios.defaults.withCredentials = true
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8083'
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true'

export default createStore({
  state: {
    auth: {
      isLoggedIn: false,
      contaOrigem: null
    },
    agendamentos: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0
    }
  },
  mutations: {
    'auth/login'(state, contaOrigem) {
      state.auth.isLoggedIn = true
      state.auth.contaOrigem = contaOrigem
    },
    'auth/logout'(state) {
      state.auth.isLoggedIn = false
      state.auth.contaOrigem = null
    },
    'agendamentos/setAgendamentos'(state, agendamentos) {
      state.agendamentos = agendamentos
    },
    'agendamentos/setPagination'(state, pagination) {
      state.pagination = pagination
    }
  },
  actions: {
    async login({ commit }, { contaOrigem }) {
      // Simulação de login - apenas verifica se a conta tem 10 dígitos
      if (contaOrigem && contaOrigem.length === 10 && /^\d+$/.test(contaOrigem)) {
        commit('auth/login', contaOrigem)
        return true
      }
      return false
    },
    async fetchAgendamentos({ commit, state }, { page = 0, size = 10 } = {}) {
      try {
        const response = await axios.get(`${API_URL}/agendamentos`, {
          params: { 
            page, 
            size,
            contaOrigem: state.auth.contaOrigem
          },
          withCredentials: true
        })
        
        if (response.data.content) {
          commit('agendamentos/setAgendamentos', response.data.content)
          commit('agendamentos/setPagination', {
            currentPage: response.data.number,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements
          })
        } else {
          commit('agendamentos/setAgendamentos', response.data)
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
        throw error
      }
    },
    async criarAgendamento({ state }, agendamento) {
      try {
        // Garante que a conta de origem seja a mesma do usuário logado
        const agendamentoComContaOrigem = {
          ...agendamento,
          contaOrigem: state.auth.contaOrigem
        }
        const response = await axios.post(`${API_URL}/agendamentos`, agendamentoComContaOrigem)
        return response.data
      } catch (error) {
        console.error('Erro ao criar agendamento:', error)
        throw error
      }
    },
    async excluirAgendamento(_, id) {
      try {
        await axios.delete(`${API_URL}/agendamentos/${id}`)
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error)
        throw error
      }
    }
  }
}) 