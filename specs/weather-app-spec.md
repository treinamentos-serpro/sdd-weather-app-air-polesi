# Product Specification — Weather App

## Overview

O Weather App é uma aplicação web responsiva para consulta rápida das
condições meteorológicas de uma cidade. O produto atende tanto decisões do
dia a dia, como escolher roupa ou levar guarda-chuva, quanto o planejamento de
compromissos e viagens.

### Objectives

- Permitir encontrar e confirmar uma cidade de forma clara, inclusive quando
  houver cidades homônimas.
- Exibir o clima atual da localidade selecionada.
- Apresentar uma previsão diária de cinco dias, composta por hoje e pelos
  quatro dias seguintes.
- Permitir visualizar temperaturas em Celsius ou Fahrenheit.
- Comunicar claramente carregamento, ausência de resultados, falhas e formas
  de recuperação.

### Release Scope

- Aplicação web mobile-first, com interface em pt-BR.
- Dados meteorológicos e de geocodificação fornecidos pelo Open-Meteo, sem
  chave de API na primeira versão.
- Consulta sem autenticação e sem persistência de servidor.
- Celsius como unidade padrão na primeira visita.

## Functional Requirements

### FR1 — Search and Select a City

O sistema deve permitir que a pessoa usuária informe o nome de uma cidade,
execute a busca e selecione a localidade desejada. Cada resultado deve
apresentar informação suficiente para distinguir cidades homônimas, incluindo,
quando disponível, estado ou região, país e uma referência geográfica útil.

### FR2 — Display Current Weather

Depois da seleção de uma cidade, o sistema deve exibir a temperatura atual e
uma descrição compreensível da condição climática correspondente, em pt-BR.
O sistema deve identificar visualmente a cidade consultada e indicar a unidade
da temperatura.

### FR3 — Display a Five-Day Forecast

Para uma cidade selecionada, o sistema deve exibir cinco registros diários em
ordem cronológica: o dia atual e os quatro dias seguintes. Cada registro deve
conter a data, a temperatura e a condição climática correspondente, em pt-BR.

### FR4 — Switch Temperature Unit

O sistema deve permitir alternar entre Celsius e Fahrenheit. A unidade ativa
deve estar sempre identificada, e toda temperatura visível no clima atual e na
previsão deve ser atualizada de forma consistente após a alternância.

### FR5 — Communicate Application States

O sistema deve comunicar estados de carregamento, busca sem resultados,
cidade não encontrada, erro de comunicação e indisponibilidade temporária do
serviço. As mensagens devem ser compreensíveis para o público em pt-BR e não
devem sugerir que dados foram carregados quando isso não ocorreu.

### FR6 — Allow Retry

Quando uma busca ou o carregamento da previsão falhar de maneira recuperável,
o sistema deve oferecer uma ação explícita para tentar novamente. A nova
tentativa deve preservar a intenção da consulta sempre que os dados
necessários ainda estiverem disponíveis.

## User Stories

### US1 — Daily Decision-Maker

Como decisor do dia a dia, quero buscar minha cidade e ver rapidamente a
condição atual para decidir como me preparar para sair.

### US2 — User in an Unfamiliar Location

Como usuário em uma localidade pouco familiar, quero distinguir cidades com o
mesmo nome antes de consultar a previsão para evitar uma informação sobre o
local errado.

### US3 — Travel Planner

Como viajante planejador, quero consultar hoje e os quatro dias seguintes para
organizar compromissos e atividades.

### US4 — User with a Unit Preference

Como usuário com preferência de unidade, quero alternar entre Celsius e
Fahrenheit para interpretar as temperaturas no formato que conheço.

### US5 — User on an Unstable Connection

Como usuário em uma conexão instável, quero entender quando a consulta está
carregando ou falhou e poder tentar novamente para recuperar o resultado.

## Acceptance Criteria

### US1 and FR1 Criteria

- Dado que a aplicação está disponível, quando a pessoa informa um nome de
  cidade e solicita a busca, então o sistema apresenta os resultados
  correspondentes ou um estado de ausência de resultados.
- Quando a busca retorna mais de uma localidade com o mesmo nome, então cada
  resultado mostra dados de desambiguação, como estado ou região e país,
  quando fornecidos pela fonte.
- Quando a pessoa seleciona um resultado, então a aplicação identifica a
  cidade selecionada e inicia a consulta de seus dados meteorológicos.
- Enquanto a busca está em andamento, então a interface informa que os
  resultados estão sendo carregados e evita apresentar resultados antigos como
  se fossem da nova consulta.
- Quando o campo de busca está vazio ou contém apenas espaços, então o sistema
  não executa uma consulta e informa que é necessário fornecer uma cidade.

### US1 and FR2 Criteria

- Dado que uma cidade foi selecionada e os dados estão disponíveis, então a
  aplicação exibe a cidade correta, a temperatura atual, sua unidade e uma
  descrição da condição climática em pt-BR.
- A condição climática exibida corresponde ao dado recebido para a cidade e
  não é substituída por uma descrição genérica quando houver um mapeamento
  compreensível disponível.
- Quando o dado de clima atual não estiver disponível, então a aplicação
  comunica a ausência ou falha sem exibir uma temperatura inventada.

### US3 and FR3 Criteria

- Dado que a previsão foi carregada, então são apresentados exatamente cinco
  dias em ordem cronológica, começando pelo dia atual da localidade consultada.
- Cada dia apresenta uma data compreensível em pt-BR, temperatura e condição
  climática.
- A previsão não inclui o quinto dia seguinte: sua janela é hoje mais os
  quatro dias seguintes.
- Se a fonte não fornecer os cinco dias necessários, então o sistema informa
  que a previsão está incompleta ou indisponível e não preenche dias com dados
  fictícios.

### US4 and FR4 Criteria

- Na primeira visita, as temperaturas são exibidas em Celsius e a unidade fica
  identificada.
- Quando a pessoa alterna para Fahrenheit, então a temperatura atual e todas
  as temperaturas dos cinco dias passam a usar Fahrenheit.
- Quando a pessoa retorna para Celsius, então todos os valores voltam a usar
  Celsius de maneira consistente.
- A conversão mantém precisão suficiente para uso cotidiano e aplica a mesma
  regra de arredondamento a todos os valores equivalentes.

### US5, FR5, and FR6 Criteria

- Enquanto qualquer consulta estiver em andamento, então há uma indicação
  visível de carregamento e os controles permanecem compreensíveis e
  utilizáveis conforme o estado da operação.
- Quando uma busca não encontrar cidades, então a interface apresenta um
  estado vazio específico, sem mostrar uma previsão anterior como resultado da
  busca atual.
- Quando ocorrer erro de rede, timeout ou indisponibilidade do serviço, então
  a interface apresenta uma mensagem em pt-BR que descreve a falha em termos
  compreensíveis.
- Quando uma falha for recuperável, então existe uma ação identificável de
  tentar novamente.
- Quando a pessoa aciona tentar novamente, então o sistema repete a operação
  com os parâmetros da consulta que falhou, quando possível.
- Se a nova tentativa falhar, então a mensagem de erro permanece clara e a
  pessoa pode tentar novamente sem recarregar a página inteira.

## Non-Functional Requirements

### NFR1 — Responsiveness

O produto deve ser utilizável em telas pequenas de dispositivos móveis e em
desktops, sem perda de conteúdo, leitura ou acesso aos fluxos principais.

### NFR2 — Accessibility

Os fluxos de busca, seleção, alternância de unidade e nova tentativa devem ser
operáveis por teclado. Controles e resultados devem possuir nomes acessíveis,
estrutura semântica, foco perceptível e contraste suficiente para leitura.

### NFR3 — Performance

A interface deve fornecer feedback imediato após ações do usuário e não deve
bloquear desnecessariamente a interação enquanto aguarda a fonte de dados. A
meta objetiva de tempo para busca e previsão permanece uma questão em aberto.

### NFR4 — Resilience

Falhas de rede, timeout, respostas inválidas, campos ausentes e
indisponibilidade temporária do Open-Meteo não devem quebrar a aplicação. O
produto deve apresentar um estado compreensível e uma alternativa de
recuperação quando aplicável.

### NFR5 — Compatibility

O produto deve funcionar nos principais navegadores modernos em suas versões
correntes. A matriz oficial de navegadores e versões ainda deve ser definida.

### NFR6 — Formats and Language

Textos, descrições, datas, números e unidades devem ser apresentados de forma
compreensível para pt-BR, respeitando o fuso horário associado à localidade
consultada quando esse dado estiver disponível.

### NFR7 — Security and Privacy

O produto não deve expor credenciais ou chaves de serviços externos no
navegador, não deve exigir dados pessoais para a consulta e deve coletar
somente os dados necessários ao fluxo definido.

### NFR8 — Availability

Quando a aplicação estiver acessível, ela deve informar claramente se a fonte
de dados estiver indisponível. A meta de disponibilidade e a existência de uma
fonte alternativa ainda devem ser definidas.

### NFR9 — Observability

Falhas de API, timeouts e erros inesperados devem ser registrados para
diagnóstico sem incluir dados sensíveis. A política operacional de retenção e
acesso aos registros permanece em aberto.

### NFR10 — Maintainability

As responsabilidades de busca, dados meteorológicos, conversão de unidades e
apresentação devem poder ser validadas de forma independente, sem alterar o
escopo ou o contrato público do produto.

### NFR11 — Scalability

A solução deve suportar o crescimento esperado de usuários e requisições sem
degradação significativa. Os volumes esperados e a estratégia para limites do
provedor ainda devem ser definidos.

## Edge Cases

- Nome de cidade vazio, composto apenas por espaços ou com caracteres
  inesperados.
- Cidade inexistente, grafia alternativa, acentos ou variações de capitalização.
- Muitas cidades homônimas, incluindo localidades em países diferentes.
- Resultado selecionado sem algum dado opcional de estado, região ou país.
- Usuário inicia uma nova busca enquanto a anterior ainda está carregando.
- Usuário tenta selecionar um resultado depois que a busca foi substituída.
- Resposta lenta, timeout, falha de DNS, perda de conexão ou serviço fora do ar.
- Resposta da fonte malformada, vazia, parcial ou com valores meteorológicos
  ausentes ou fora do intervalo esperado.
- Código meteorológico sem descrição ou ícone correspondente em pt-BR.
- Mudança de data ou fuso horário fazendo a localidade cruzar o dia local.
- Temperaturas negativas, zero, muito altas, decimais e valores próximos do
  ponto de arredondamento durante a conversão de unidade.
- Previsão com menos de cinco dias ou com dias duplicados ou fora de ordem.
- Viewport estreito, orientação alterada, zoom do navegador ou texto ampliado.
- Navegação por teclado, foco perdido durante carregamento ou ação de tentar
  novamente repetida rapidamente.
- Open-Meteo atingir limite de requisições ou alterar o contrato de resposta.

## Assumptions

- O usuário possui conexão com a internet para realizar novas buscas e obter
  dados atuais.
- O Open-Meteo permanece disponível, possui cobertura adequada e pode ser
  usado sem chave na primeira versão, respeitando seus limites e termos.
- A consulta básica não exige login, cadastro ou consentimento de localização.
- A aplicação não usa geolocalização automática, favoritos, histórico ou
  sincronização entre dispositivos no lançamento inicial.
- A primeira versão atende ao público em pt-BR e usa Celsius como padrão.
- “Cinco dias” significa o dia atual mais os quatro dias seguintes da
  localidade consultada.
- A previsão é diária; dados por hora não fazem parte do escopo definido.
- A aplicação exibe dados fornecidos e validados pela fonte, sem gerar
  previsões próprias.
- Informações extras além de temperatura e condição climática só serão
  incluídas após decisão de produto.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Open-Meteo ficar lento, indisponível ou limitar requisições | Média | Alto | Definir timeout, estados de erro, nova tentativa e monitoramento; avaliar cache ou provedor alternativo. |
| Cidade homônima ou geocodificação incorreta | Alta | Alto | Exigir desambiguação e confirmar a localidade antes de consultar a previsão. |
| Dados incompletos, inválidos ou códigos climáticos sem tradução | Média | Alto | Validar o contrato mínimo, tratar campos ausentes e manter catálogo de descrições em pt-BR. |
| Erros de conversão, arredondamento ou unidade | Baixa | Médio | Definir regra única de conversão e validar valores extremos e decimais. |
| Datas exibidas no fuso incorreto | Média | Alto | Usar o fuso da localidade e definir política de atualização antes da implementação. |
| Experiência inadequada em telas pequenas ou para teclado | Média | Alto | Adotar mobile-first e verificar responsividade e acessibilidade nos fluxos principais. |
| Mudança de contrato, custo ou termos do provedor | Média | Alto | Acompanhar limites e termos, encapsular a dependência e documentar alternativa. |
| Metas de qualidade não definidas gerarem expectativas conflitantes | Alta | Alto | Aprovar as questões abertas de performance, disponibilidade, suporte e indicadores antes do desenvolvimento. |

## Out of Scope

- Autenticação, cadastro, contas ou perfis.
- Persistência de servidor, favoritos, histórico e sincronização entre
  dispositivos.
- Geolocalização automática e solicitação de permissão de localização.
- Previsão por hora, alertas, notificações e avisos meteorológicos.
- Dados adicionais como sensação térmica, umidade, pressão, vento e volume de
  chuva, até que sejam aprovados como requisitos.
- Suporte a idiomas diferentes de pt-BR na primeira versão.
- Alteração manual da localidade por CEP ou coordenadas sem busca por nome.
- Geração ou correção própria de previsões quando a fonte não fornecer dados.
- Modo offline e exibição garantida do último resultado armazenado.
- Analytics, personalização e métricas de comportamento, até que haja decisão
  de privacidade e produto.

## Open Questions

1. Qual é a matriz oficial de navegadores, versões, tamanhos de tela e
   condições de conectividade suportadas?
2. Qual é o tempo máximo aceitável para concluir a busca e exibir a previsão?
3. Qual nível de conformidade de acessibilidade é obrigatório, como WCAG 2.1
   AA?
4. Quais indicadores adicionais, se houver, devem ser exibidos além de
   temperatura e condição climática?
5. Como devem ser mapeados todos os códigos meteorológicos do Open-Meteo para
   descrições e ícones em pt-BR?
6. Com que frequência os dados devem ser atualizados e deve existir uma ação
   de atualização manual?
7. A escolha de Celsius ou Fahrenheit deve ser persistida localmente entre
   sessões, ou deve voltar a Celsius em cada visita?
8. A alternância de unidade deve afetar apenas temperatura ou também vento,
   pressão e precipitação caso esses indicadores sejam aprovados?
9. Qual política deve ser adotada para cache, dados parcialmente disponíveis,
   modo offline e último resultado consultado?
10. Qual percentual de disponibilidade é esperado e existe uma fonte de
    dados alternativa para incidentes do Open-Meteo?
11. Quais dados de observabilidade e analytics serão permitidos, por quanto
    tempo serão retidos e quais requisitos legais ou corporativos se aplicam?
12. Quem será responsável por monitorar o produto, atualizar dependências e
    responder a falhas do provedor após o lançamento?
13. Quais volumes de usuários e requisições representam o crescimento
    esperado, e quais limites do Open-Meteo precisam ser considerados?
14. Existe necessidade de funcionar em ambientes corporativos com proxy,
    bloqueios de rede ou restrições específicas de publicação?
15. Quais métricas de sucesso serão usadas para validar o produto, como buscas
    concluídas e tempo até visualizar a previsão?