# Backlog Técnico — Weather App

## Convenções

- **Prioridade:** P0 é essencial para o fluxo principal, P1 é importante para a primeira entrega e P2 é melhoria ou hardening complementar.
- **Tamanho:** P representa uma tarefa pequena, M uma tarefa média e G uma tarefa grande que deve ser dividida antes de implementar.
- Cada tarefa abaixo está limitada a uma responsabilidade testável e declara suas dependências diretas.

## Entrega 1 — Base e contratos

### T-01 — Inicializar a base do app React + TypeScript
- Descrição curta: preparar a estrutura inicial do projeto Vite + React + TypeScript conforme o plano técnico.
- Rastreio: pré-condição arquitetural para FR1-FR6; NFR10.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - `pnpm install` e `pnpm dev` concluem sem erro de boot;
  - existem as pastas `src/components`, `src/hooks`, `src/services`, `src/lib`, `src/types` e `src/styles`;
  - a aplicação renderiza um placeholder inicial em tela.
- Dependências: nenhuma.
- Arquivos prováveis: `package.json`, `vite.config.ts`, `src/App.tsx`, `src/styles/global.css`
- Tipo: Infra

### T-02 — Definir tipos e contratos de domínio
- Descrição curta: criar os tipos de cidade, clima atual, previsão e estado global.
- Rastreio: FR1, FR2, FR3, FR4, FR5.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `AppState` existem em `src/types`;
  - `City` inclui `id`, `name`, `country`, `admin1`, `admin2`, `latitude`, `longitude`, `timezone` e `label`;
  - `AppState` inclui `status` com `idle | loading | success | error | empty` e `unit` com `C | F`;
  - os campos cobrem o mínimo necessário para geocoding e forecast da Open-Meteo.
- Dependências: T-01.
- Arquivos prováveis: `src/types/city.ts`, `src/types/weather.ts`, `src/types/api.ts`
- Tipo: Data

## Entrega 2 — Funções puras

### T-03 — Implementar conversão de temperatura
- Descrição curta: centralizar a conversão Celsius/Fahrenheit em funções puras.
- Rastreio: FR4; NFR10.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - existem `celsiusToFahrenheit` e `fahrenheitToCelsius`;
  - as funções aplicam as fórmulas padrão e retornam números;
  - o arredondamento é definido em um único ponto;
  - a fonte do domínio permanece em Celsius.
- Dependências: T-02.
- Arquivos prováveis: `src/lib/temperature.ts`
- Tipo: Data

### T-04 — Implementar mapeamento de clima e data
- Descrição curta: traduzir `weather_code` e formatar datas em pt-BR sem efeitos colaterais.
- Rastreio: FR2, FR3; NFR6, NFR10.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - `mapWeatherCode(code)` retorna descrição em pt-BR para códigos conhecidos;
  - código desconhecido retorna um fallback definido;
  - `formatDayLabel(date)` produz texto legível em pt-BR;
  - as funções não dependem de estado, renderização ou `window`.
- Dependências: T-02.
- Arquivos prováveis: `src/lib/weatherCodeMapper.ts`, `src/lib/dateFormatting.ts`
- Tipo: Data

## Entrega 3 — Services de dados

### T-05 — Definir cliente HTTP base da Open-Meteo
- Descrição curta: encapsular URLs, query params, `fetch` e erros comuns da API.
- Rastreio: FR1, FR2, FR3, FR5; NFR4, NFR7.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - existe um cliente único com URLs declaradas em constantes;
  - o cliente expõe um helper `get` reutilizável;
  - respostas HTTP não bem-sucedidas, rede indisponível e timeout produzem `Error` estruturado;
  - o cliente não contém lógica de UI nem credenciais.
- Dependências: T-02.
- Arquivos prováveis: `src/services/openMeteoClient.ts`
- Tipo: Data

### T-06 — Implementar service de geocoding
- Descrição curta: buscar cidades e normalizar os resultados para seleção.
- Rastreio: FR1, FR5.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - `searchCities(query: string)` retorna `City[]` normalizado;
  - cada resultado inclui os campos de desambiguação e o `label`;
  - resposta sem resultados retorna `[]`;
  - resposta inválida produz erro de domínio sem lançar `TypeError` cru.
- Dependências: T-02, T-05.
- Arquivos prováveis: `src/services/geocodingService.ts`
- Tipo: Data

### T-07 — Implementar service de forecast
- Descrição curta: buscar clima atual e cinco dias de previsão, validando a resposta.
- Rastreio: FR2, FR3, FR5.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - a função aceita latitude, longitude e timezone;
  - valida a presença de `current` e `daily`;
  - exige exatamente cinco registros diários;
  - resposta parcial produz erro de domínio e não retorna dados incompletos.
- Dependências: T-02, T-04, T-05.
- Arquivos prováveis: `src/services/forecastService.ts`
- Tipo: Data

## Entrega 4 — Hooks e estado

### T-08 — Criar hook de busca de cidade
- Descrição curta: encapsular busca, loading, resultados, vazio e erro do geocoding.
- Rastreio: FR1, FR5.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - expõe `cities`, `status`, `errorMessage` e `search(query)`;
  - query vazia ou composta por espaços não dispara request;
  - resposta vazia define status `empty` e limpa resultados anteriores;
  - falha define status `error` com mensagem em pt-BR.
- Dependências: T-06.
- Arquivos prováveis: `src/hooks/useCitySearch.ts`
- Tipo: UI

### T-09 — Criar hook de dados meteorológicos
- Descrição curta: consultar forecast após a seleção e preservar os parâmetros para retry.
- Rastreio: FR2, FR3, FR5, FR6.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - aceita `selectedCity` e consulta o service de forecast;
  - define `loading` durante a consulta e `success` ao receber dados válidos;
  - em falha expõe mensagem clara e `retry()`;
  - `retry()` repete a consulta com os mesmos parâmetros.
- Dependências: T-07, T-08.
- Arquivos prováveis: `src/hooks/useWeatherSearch.ts`
- Tipo: UI

### T-10 — Criar hook de unidade
- Descrição curta: controlar Celsius/Fahrenheit e derivar valores para apresentação sem nova consulta.
- Rastreio: FR4.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - expõe `unit` inicializada como `C` e `toggleUnit()`;
  - deriva valores a partir de Celsius;
  - alternar unidade não chama nenhum service;
  - a mesma unidade é aplicada aos valores atual e diários.
- Dependências: T-03.
- Arquivos prováveis: `src/hooks/useTemperatureUnit.ts`
- Tipo: UI

## Entrega 5 — Componentes

### T-11 — Construir busca e seleção de cidade
- Descrição curta: renderizar formulário, validação, resultados e seleção acessível.
- Rastreio: FR1, FR5; NFR2.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - campo tem label acessível e aceita submissão por teclado;
  - resultados exibem `label` e dados de desambiguação;
  - query vazia mostra validação e não dispara request;
  - lista vazia mostra estado de cidade não encontrada.
- Dependências: T-08.
- Arquivos prováveis: `src/components/SearchCityForm.tsx`, `src/components/CitySelector.tsx`
- Tipo: UI

### T-12 — Construir card do clima atual
- Descrição curta: exibir cidade, temperatura, unidade e condição atual.
- Rastreio: FR2, FR4, FR5.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - exibe cidade, temperatura, unidade e descrição pt-BR quando há dados;
  - usa a unidade ativa;
  - dado ausente mostra estado de erro ou indisponibilidade;
  - não exibe temperatura inventada.
- Dependências: T-04, T-09, T-10.
- Arquivos prováveis: `src/components/WeatherCurrentCard.tsx`
- Tipo: UI

### T-13 — Construir lista da previsão
- Descrição curta: exibir hoje e os quatro dias seguintes em ordem cronológica.
- Rastreio: FR3, FR4, FR5.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - renderiza exatamente cinco itens válidos;
  - cada item exibe data, mínima, máxima, unidade e condição pt-BR;
  - preserva a ordem recebida pelo service;
  - previsão incompleta mostra indisponibilidade sem preencher dados fictícios.
- Dependências: T-04, T-09, T-10.
- Arquivos prováveis: `src/components/ForecastList.tsx`
- Tipo: UI

## Entrega 6 — Integração vertical

### T-14 — Integrar tela principal e estados operacionais
- Descrição curta: conectar busca, seleção, clima atual, previsão, unidade, loading, erro e retry.
- Rastreio: FR1, FR2, FR3, FR4, FR5, FR6; NFR1, NFR2, NFR3.
- Prioridade: P0
- Tamanho: G
- Critérios de aceite:
  - o fluxo busca → seleção → forecast funciona na tela principal;
  - loading, vazio, erro e sucesso são visualmente distinguíveis;
  - retry repete a intenção anterior;
  - toggle altera todas as temperaturas sem novo request;
  - layout e controles permanecem utilizáveis em viewport mobile e desktop.
- Dependências: T-09, T-10, T-11, T-12, T-13.
- Arquivos prováveis: `src/App.tsx`, `src/components/UnitToggle.tsx`, `src/components/ErrorState.tsx`, `src/components/LoadingState.tsx`
- Tipo: UI

## Entrega 7 — Testes explícitos

### T-15 — Testar conversão de unidade
- Descrição curta: cobrir as funções puras de Celsius/Fahrenheit com casos normais, negativos e arredondamento.
- Rastreio: FR4; NFR10.
- Prioridade: P0
- Tamanho: P
- Critérios de aceite:
  - verifica `0 C = 32 F` e `32 F = 0 C`;
  - cobre temperatura negativa e valor decimal;
  - verifica o arredondamento definido pelo contrato;
  - roda de forma determinística com `pnpm test -- temperature`.
- Dependências: T-03.
- Arquivos prováveis: `tests/lib/temperature.test.ts`
- Tipo: Test

### T-16 — Testar services com mock de fetch
- Descrição curta: validar geocoding e forecast isoladamente usando respostas controladas de `fetch`.
- Rastreio: FR1, FR2, FR3, FR5; NFR4.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - cobre geocoding válido, vazio e resposta inválida;
  - cobre forecast válido, parcial e com menos de cinco dias;
  - simula sucesso, erro de rede e timeout com `fetch` mockado;
  - verifica mensagens de erro de domínio sem depender de API real.
- Dependências: T-05, T-06, T-07.
- Arquivos prováveis: `tests/services/geocodingService.test.ts`, `tests/services/forecastService.test.ts`
- Tipo: Test

### T-17 — Testar componentes nos estados loading/erro/vazio
- Descrição curta: validar os estados visíveis e a acessibilidade dos componentes principais.
- Rastreio: FR1, FR2, FR3, FR5, FR6; NFR2.
- Prioridade: P0
- Tamanho: M
- Critérios de aceite:
  - loading exibe indicador compreensível;
  - erro exibe mensagem em pt-BR e botão de retry;
  - vazio exibe cidade não encontrada sem previsão anterior;
  - sucesso exibe clima atual e cinco itens de previsão;
  - busca, seleção, retry e toggle são encontrados por nome acessível.
- Dependências: T-11, T-12, T-13, T-14.
- Arquivos prováveis: `tests/components/SearchCityForm.test.tsx`, `tests/components/WeatherCurrentCard.test.tsx`, `tests/components/ForecastList.test.tsx`, `tests/components/App.test.tsx`
- Tipo: Test

### T-18 — Testar E2E do fluxo principal em desktop e mobile
- Descrição curta: validar o percurso completo com Playwright, incluindo viewport mobile.
- Rastreio: FR1, FR2, FR3, FR4, FR5, FR6; NFR1, NFR2.
- Prioridade: P1
- Tamanho: M
- Critérios de aceite:
  - cenário desktop cobre busca, seleção e clima atual com previsão de cinco dias;
  - cenário cobre cidade não encontrada;
  - cenário cobre falha recuperável e retry;
  - ao menos um cenário usa viewport mobile e verifica ausência de perda de conteúdo;
  - a API é interceptada no teste para manter o fluxo determinístico.
- Dependências: T-14.
- Arquivos prováveis: `tests/e2e/weather-app.spec.ts`
- Tipo: Test

## Entrega 8 — Hardening

### T-19 — Executar validação final e hardening
- Descrição curta: verificar qualidade, compatibilidade básica, resiliência e manutenção antes da entrega.
- Rastreio: NFR1, NFR2, NFR3, NFR4, NFR5, NFR6, NFR7, NFR8, NFR9, NFR10.
- Prioridade: P1
- Tamanho: M
- Critérios de aceite:
  - `pnpm lint`, `pnpm build` e `pnpm test` passam sem erros;
  - `pnpm test:e2e` passa nos cenários principais;
  - respostas inválidas, timeout e falha de rede não quebram a aplicação;
  - não há credenciais no bundle e as mensagens/formatos permanecem em pt-BR;
  - uma revisão manual confirma foco, contraste, estados de feedback e ausência de dados fictícios.
- Dependências: T-15, T-16, T-17, T-18.
- Arquivos prováveis: `package.json`, `src/**`, `tests/**`
- Tipo: Infra

## Matriz de rastreabilidade funcional

| Requisito | Tarefas que implementam ou validam | Cobertura |
|---|---|---|
| FR1 — Search and Select a City | T-06, T-08, T-11, T-14, T-16, T-17, T-18 | Coberto |
| FR2 — Display Current Weather | T-07, T-09, T-12, T-14, T-16, T-17, T-18 | Coberto |
| FR3 — Display a Five-Day Forecast | T-07, T-09, T-13, T-14, T-16, T-17, T-18 | Coberto |
| FR4 — Switch Temperature Unit | T-03, T-10, T-12, T-13, T-14, T-15, T-17, T-18 | Coberto |
| FR5 — Communicate Application States | T-05, T-06, T-07, T-08, T-09, T-11, T-12, T-13, T-14, T-16, T-17, T-18 | Coberto |
| FR6 — Allow Retry | T-09, T-14, T-17, T-18 | Coberto |

Não há requisito funcional sem tarefa correspondente. Os requisitos não funcionais estão associados nos campos de rastreio das tarefas e são verificados principalmente por T-17, T-18 e T-19.

## Sequência de entrega em fatias verticais

1. **Fundação:** T-01 → T-02. Entrega o app inicial compilável e os contratos compartilhados.
2. **Primeira fatia visível, busca:** T-05 → T-06 → T-08 → T-11. Entrega busca de cidade, resultados, estados vazio/erro e seleção.
3. **Clima atual:** T-04 → T-07 → T-09 → T-12. Ao selecionar uma cidade, exibe a condição atual real.
4. **Previsão e unidade:** T-10 → T-13. Completa os cinco dias e alternância Celsius/Fahrenheit.
5. **Fluxo integrado:** T-14. Conecta a experiência inteira com loading, retry e layout responsivo.
6. **Confiança:** T-15 → T-16 → T-17 → T-18. Cobre funções, services, estados de UI e fluxo E2E.
7. **Pronto para entrega:** T-19. Executa hardening e validações finais.

## Prompt para o Coding Agent — T-01

Implemente a tarefa **T-01 — Inicializar a base do app React + TypeScript** no repositório `sdd-weather-app-air-polesi`.

### Contexto

O projeto segue o fluxo SDD e já possui a especificação em `specs/weather-app-spec.md`, o plano técnico em `plans/weather-app-plan.md` e este backlog em `tasks/weather-app-tasks.md`. A stack obrigatória é React + Vite + TypeScript strict, Tailwind CSS e pnpm. A aplicação será um Weather App frontend-only em pt-BR, usando Open-Meteo nas tarefas posteriores.

### Escopo

- preparar ou ajustar a base executável do app;
- preservar configurações existentes compatíveis com a stack;
- criar a estrutura inicial de diretórios `src/components`, `src/hooks`, `src/services`, `src/lib`, `src/types` e `src/styles`;
- garantir que `src/App.tsx` renderize um placeholder mínimo;
- configurar o estilo global inicial sem implementar funcionalidades de busca ou API.

### Critérios de aceite

1. `pnpm install` conclui sem erro.
2. `pnpm dev` inicia o Vite sem erro de boot.
3. `pnpm build` conclui com sucesso.
4. As seis pastas de `src` listadas acima existem.
5. A aplicação renderiza um placeholder visível ao abrir a rota principal.
6. Nenhuma chamada à Open-Meteo, busca de cidade ou lógica de previsão é adicionada nesta tarefa.

### Arquivos prováveis

- `package.json`
- `vite.config.ts`
- `src/App.tsx`
- `src/main.tsx`
- `src/styles/global.css`
- `src/components/`
- `src/hooks/`
- `src/services/`
- `src/lib/`
- `src/types/`

### Restrições

- use identificadores de código em inglês e narrativa/comentários em pt-BR;
- siga as instruções aplicáveis em `.github/instructions/`;
- não altere a spec, o plano ou o backlog;
- não faça refatorações não relacionadas;
- ao terminar, execute a validação mais estreita disponível e informe os comandos executados e seus resultados.

## Ordenação final

T-01 → T-02 → T-03 → T-04 → T-05 → T-06 → T-07 → T-08 → T-09 → T-10 → T-11 → T-12 → T-13 → T-14 → T-15 → T-16 → T-17 → T-18 → T-19