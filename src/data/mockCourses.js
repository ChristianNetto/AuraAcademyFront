export const mockCourses = [
  {
    id: 'react-adv',
    titulo: 'React.js e TypeScript: Do Zero ao Avançado',
    instrutor: 'Lucas Silveira',
    categoria: 'Desenvolvimento Web',
    progresso: 65,
    totalAulas: 12,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    descricaoCurta: 'Domine a biblioteca frontend mais popular do mercado com TypeScript estruturado, testes unitários, Zustand e performance extrema.',
    modulos: [
      {
        id: 'm1',
        titulo: 'Módulo 1: Fundamentos Avançados e TypeScript',
        descricao: 'Neste módulo, revisamos conceitos estruturais do React com tipagem estrita no TypeScript. Abordaremos Generics, Polymorphic Components e padrões de tipagem avançados.',
        aulas: [
          { id: 'a1-1', titulo: '1. Introdução ao Curso e Configuração do Setup', duracao: '10:15', videoId: 'dQw4w9WgXcQ' },
          { id: 'a1-2', titulo: '2. Arquitetando Aplicações com Vite e TS Estrito', duracao: '15:30', videoId: '9bZkp7q19f0' },
          { id: 'a1-3', titulo: '3. Tipando Hooks Personalizados Avançados', duracao: '18:45', videoId: '2g811aNGE1E' }
        ]
      },
      {
        id: 'm2',
        titulo: 'Módulo 2: Gerenciamento de Estado de Alta Performance',
        descricao: 'Aprofunde-se nas soluções de gerenciamento de estado moderno. Vamos comparar Context API com Zustand, focar em performance, re-renderizações desnecessárias e persistência.',
        aulas: [
          { id: 'a2-1', titulo: '4. Context API vs Zustand: Quando usar?', duracao: '14:20', videoId: '30hPtGZ4m4U' },
          { id: 'a2-2', titulo: '5. Implementando Zustand com Middlewares', duracao: '22:10', videoId: 'asDf1234ghJ' },
          { id: 'a2-3', titulo: '6. Otimizando Seletores de Estado e Performance', duracao: '16:05', videoId: 'zXyW9876vUt' }
        ]
      },
      {
        id: 'm3',
        titulo: 'Módulo 3: Padrões de Design de Componentes (Design Patterns)',
        descricao: 'Aprenda os padrões de design mais consolidados como Compound Components, Render Props e Higher-Order Components para criar elementos infinitamente reutilizáveis.',
        aulas: [
          { id: 'a3-1', titulo: '7. Dominando Compound Components', duracao: '25:40', videoId: 'comp123' },
          { id: 'a3-2', titulo: '8. O padrão Control Props no React 18', duracao: '20:15', videoId: 'ctrl456' },
          { id: 'a3-3', titulo: '9. React Portals e Acessibilidade em Modais', duracao: '17:50', videoId: 'portal789' }
        ]
      }
    ]
  },
  {
    id: 'spring-api',
    titulo: 'Spring Boot 3 & REST APIs: Do Básico ao Deploy',
    instrutor: 'Ana Beatriz',
    categoria: 'Desenvolvimento Backend',
    progresso: 30,
    totalAulas: 10,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1484417894907-623942c8ea29?auto=format&fit=crop&w=1600&q=80',
    descricaoCurta: 'Construa APIs de nível corporativo seguras com Spring Security 6, JWT, Spring Data JPA, testes integrados e deploy no AWS ECS.',
    modulos: [
      {
        id: 'sb-m1',
        titulo: 'Módulo 1: Inicializando o Ecossistema Spring Boot 3',
        descricao: 'Entenda os conceitos principais do ecossistema Spring: Dependency Injection, Spring Initializr, propriedades externas e configurações de perfis de desenvolvimento.',
        aulas: [
          { id: 'sb-a1-1', titulo: '1. Introdução ao ecossistema Java moderno', duracao: '12:35', videoId: 'java101' },
          { id: 'sb-a1-2', titulo: '2. Criando o primeiro CRUD completo', duracao: '24:10', videoId: 'crud202' },
          { id: 'sb-a1-3', titulo: '3. Tratamento de Exceções Global com ControllerAdvice', duracao: '19:40', videoId: 'err303' }
        ]
      },
      {
        id: 'sb-m2',
        titulo: 'Módulo 2: Autenticação de Segurança Avançada com Spring Security',
        descricao: 'Segurança não é opcional. Aprenda a configurar o Spring Security 6 a nível de rotas e métodos, gerar tokens JWT robustos e gerenciar sessões.',
        aulas: [
          { id: 'sb-a2-1', titulo: '4. Arquitetura do Spring Security e Filtros', duracao: '20:15', videoId: 'sec404' },
          { id: 'sb-a2-2', titulo: '5. Implementando Autenticação Stateless por JWT', duracao: '32:00', videoId: 'jwt505' },
          { id: 'sb-a2-3', titulo: '6. Protegendo Endpoints por Roles e Autorizações', duracao: '15:50', videoId: 'role606' }
        ]
      }
    ]
  },
  {
    id: 'ux-ui-premium',
    titulo: 'UX/UI Design: Interfaces Premium de Alta Conversão',
    instrutor: 'Carlos Eduardo',
    categoria: 'Design & Produto',
    progresso: 90,
    totalAulas: 9,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1600&q=80',
    descricaoCurta: 'Aprenda a projetar produtos digitais de tirar o fôlego usando Figma avançado, princípios de psicologia visual, testes de usabilidade e Design Systems.',
    modulos: [
      {
        id: 'ux-m1',
        titulo: 'Módulo 1: Fundamentos da Psicologia Aplicada ao Design',
        descricao: 'Abordamos as leis da Gestalt, Lei de Hick, Efeito Fitts e outros vieses psicológicos que guiam as tomadas de decisões dos usuários ao interagir com uma interface.',
        aulas: [
          { id: 'ux-a1-1', titulo: '1. Introdução à Psicologia Cognitiva no Design', duracao: '14:20', videoId: 'ux11' },
          { id: 'ux-a1-2', titulo: '2. Aplicando a Lei de Hick na Redução de Atrito', duracao: '18:10', videoId: 'ux12' },
          { id: 'ux-a1-3', titulo: '3. A Importância da Hierarquia Visual e Cores', duracao: '22:45', videoId: 'ux13' }
        ]
      },
      {
        id: 'ux-m2',
        titulo: 'Módulo 2: Figma Avançado e Design Systems Modernos',
        descricao: 'Crie componentes atômicos escaláveis usando Auto Layout 5.0, Variáveis de Design, Componentes Variantes e conexões lógicas de prototipagem responsiva.',
        aulas: [
          { id: 'ux-a2-1', titulo: '4. Dominando Auto Layout e Flexibilidade', duracao: '26:50', videoId: 'figma21' },
          { id: 'ux-a2-2', titulo: '5. Criando Design Tokens no Figma', duracao: '21:30', videoId: 'figma22' }
        ]
      }
    ]
  },
  {
    id: 'node-clean-arch',
    titulo: 'Node.js e Clean Architecture: Escalando Aplicações',
    instrutor: 'Julia Ramos',
    categoria: 'Desenvolvimento Backend',
    progresso: 0,
    totalAulas: 8,
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80',
    descricaoCurta: 'Construa serviços desacoplados e de alta escalabilidade com Node.js, TypeScript, DDD, Clean Architecture, Docker e testes automatizados.',
    modulos: [
      {
        id: 'node-m1',
        titulo: 'Módulo 1: Fundamentos de Arquitetura Limpa e Domain-Driven Design',
        descricao: 'Compreenda a separação de responsabilidades em camadas lógicas puras. Entenda como desacoplar regras de negócio das ferramentas e frameworks.',
        aulas: [
          { id: 'node-a1-1', titulo: '1. Introdução à Clean Architecture no Node.js', duracao: '15:20', videoId: 'node11' },
          { id: 'node-a1-2', titulo: '2. Estruturando o Domínio com Entidades e Casos de Uso', duracao: '28:10', videoId: 'node12' },
          { id: 'node-a1-3', titulo: '3. Repositories e Adapters com TypeScript', duracao: '20:45', videoId: 'node13' }
        ]
      }
    ]
  }
];
