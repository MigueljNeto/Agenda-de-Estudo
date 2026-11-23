# 📚 Agenda de Estudos

Organizador de tarefas para estudantes, com um toque de jogo: cada entrega rende XP, você sobe de nível, mantém sequências de dias produtivos e desbloqueia conquistas.

Começou como um gerenciador de tarefas simples feito para fins academicos e evoluiu para uma agenda de estudos gamificada, construída com React.

## Funcionalidades

### Organização
- **Tarefas com matéria, prazo e prioridade**: a cor da borda indica a prioridade (alta, média ou baixa).
- **Visão "Esta semana"**: as tarefas pendentes são agrupadas em *Atrasadas*, *Hoje*, *Próximos 7 dias*, *Mais adiante* e *Sem prazo*, além do que já foi feito no dia.
- **Visão "Todas"**: filtros por situação (todas, pendentes, concluídas) e por matéria, com barra de progresso.
- **Matérias**: cadastro de disciplinas com cor própria e contagem de tarefas pendentes e feitas.
- **Edição rápida**: Enter adiciona, duplo clique (ou ✏️) edita, Esc cancela, 🗑️ exclui.
- **Salvamento automático** no navegador (`localStorage`): nada se perde ao recarregar a página.
- **Tema escuro** automático, seguindo a preferência do sistema.

### Gamificação
- **XP por tarefa concluída**, de acordo com a prioridade:

  | Prioridade | XP base |
  |------------|---------|
  | Baixa      | 10      |
  | Média      | 20      |
  | Alta       | 35      |

  Entregar **dentro do prazo** dá +50% de XP; entregar **atrasado** vale metade. Cada tarefa pendente mostra quanto XP vale.
- **Níveis**: a barra no topo mostra o progresso até o próximo nível (100 XP para o nível 2, mais 200 para o 3, e assim por diante).
- **🔥 Sequência**: dias seguidos concluindo pelo menos uma tarefa.
- **Conquistas**: 9 medalhas, como *Primeiro passo*, *Pontual*, *Semana perfeita* e *Veterano*, cada uma com barra de progresso.
- **Avisos animados** ao ganhar XP, subir de nível ou desbloquear uma conquista.

Desmarcar uma tarefa devolve o XP ganho com ela, então não dá para acumular pontos marcando e desmarcando.

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
git clone https://github.com/MigueljNeto/gerenciado-de-Tarefa.git
cd gerenciado-de-Tarefa
npm install
npm start
```

O app abre em [http://localhost:3000](http://localhost:3000).

### Outros comandos

| Comando         | O que faz                                    |
|-----------------|----------------------------------------------|
| `npm test`      | Roda os testes automatizados                 |
| `npm run build` | Gera a versão otimizada para publicação em `build/` |

## Estrutura do projeto

```
src/
├── App.js              # Componente principal: abas, avisos e conquistas
├── estado.js           # Reducer, contexto e salvamento no localStorage
├── jogo.js             # Regras de XP, níveis, sequência e conquistas
├── datas.js            # Funções de data (prazos, diferença de dias)
├── componentes/
│   ├── Cabecalho.js    # Nível, barra de XP e sequência
│   ├── FormTarefa.js   # Formulário de criar/editar tarefa
│   ├── Tarefas.js      # Lista e item de tarefa
│   ├── Visoes.js       # Visões "Esta semana" e "Todas"
│   ├── Materias.js     # Cadastro de matérias
│   └── Conquistas.js   # Painel de conquistas
├── index.css           # Estilos (com tema claro e escuro)
└── App.test.js         # Testes
```

## Tecnologias

- [React 19](https://react.dev/) com `useReducer` e Context API para o estado global
- [Create React App](https://create-react-app.dev/) para build e ambiente de desenvolvimento
- [Testing Library](https://testing-library.com/) e Jest para os testes
- CSS puro com variáveis para os temas
