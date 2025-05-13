# Sistema de Agendamento de Transferências

Este é um sistema front-end desenvolvido em Vue.js para gerenciar agendamentos de transferências financeiras.

## Funcionalidades

- Login de usuário (simulado)
- Agendamento de transferências
- Listagem de agendamentos
- Exclusão de agendamentos
- Cálculo automático de taxas
- Paginação de resultados

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd fe-transfer-scheduler
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
Edite o arquivo `src/store/index.js` e atualize a constante `API_URL` com a URL do seu backend.

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run serve
```

O projeto estará disponível em `http://localhost:8080`

## Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist`.

## Estrutura do Projeto

```
src/
  ├── views/              # Componentes de página
  │   ├── Login.vue
  │   ├── AgendamentoTransferencia.vue
  │   └── ListagemAgendamentos.vue
  ├── store/             # Gerenciamento de estado (Vuex)
  │   └── index.js
  ├── router/            # Configuração de rotas
  │   └── index.js
  ├── App.vue            # Componente raiz
  └── main.js            # Ponto de entrada
```

## Tecnologias Utilizadas

- Vue.js 3
- Vue Router
- Vuex
- Axios
- Composition API

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 