# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa precisa de uma aplicação de previsão do tempo para que usuários consultem rapidamente as condições meteorológicas de uma cidade. O fluxo principal consiste em buscar uma cidade, visualizar o clima atual e consultar a previsão dos próximos cinco dias.

O produto deve atender tanto pessoas que precisam tomar decisões imediatas, como escolher roupa ou decidir se levam guarda-chuva, quanto pessoas que planejam compromissos e viagens. Como o uso em dispositivos móveis foi explicitamente solicitado, a experiência deve ser mobile-first, sem comprometer a utilização em telas maiores.

As decisões de produto para a primeira versão são: aplicação web sem autenticação ou persistência de servidor, interface em pt-BR, dados do Open-Meteo e Celsius como unidade inicial. A previsão de cinco dias considera hoje e os quatro dias seguintes.

## Requisitos Funcionais

- **RF1 — Buscar cidade:** permitir que o usuário pesquise uma cidade por nome e selecione o resultado correto quando houver cidades homônimas, exibindo informações de desambiguação, como estado, país ou região.
- **RF2 — Exibir clima atual:** apresentar, para a cidade selecionada, a temperatura atual e a condição climática correspondente. A definição dos indicadores adicionais deve ser confirmada.
- **RF3 — Exibir previsão de cinco dias:** apresentar a previsão diária para cinco dias, incluindo pelo menos temperatura e condição climática de cada dia.
- **RF4 — Alternar unidade:** permitir alternar entre Celsius e Fahrenheit e atualizar de forma consistente todas as temperaturas exibidas.
- **RF5 — Informar estados da aplicação:** apresentar estados claros de carregamento, resultado vazio, cidade não encontrada e erro de comunicação ou indisponibilidade do serviço.
- **RF6 — Tentar novamente:** oferecer uma ação para repetir a consulta quando houver falha recuperável na busca ou no carregamento da previsão.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** a aplicação deve ser utilizável em dispositivos móveis e adaptar seu layout a diferentes larguras de tela, incluindo telas pequenas e desktops.
- **RNF2 — Acessibilidade:** os fluxos principais devem ser operáveis por teclado, usar HTML semântico, fornecer rótulos para controles e manter contraste suficiente para leitura.
- **RNF3 — Performance:** a interface deve fornecer feedback imediato após uma ação do usuário e carregar os resultados em tempo adequado para uma conexão comum, sem bloquear a interação desnecessariamente.
- **RNF4 — Resiliência:** falhas de rede, respostas inválidas e indisponibilidade temporária da fonte de dados não devem quebrar a aplicação; o usuário deve receber uma mensagem compreensível e uma alternativa de recuperação.
- **RNF5 — Compatibilidade:** a aplicação deve funcionar nos principais navegadores modernos em suas versões correntes.
- **RNF6 — Internacionalização e formato:** textos da interface devem estar em pt-BR, e datas, números e unidades devem seguir formatos compreensíveis para esse público.
- **RNF7 — Segurança:** credenciais e dados sensíveis de serviços externos não devem ser expostos no navegador.
- **RNF8 — Disponibilidade:** a aplicação deve permanecer acessível e informar claramente quando a fonte de dados estiver indisponível.
- **RNF9 — Observabilidade:** falhas de API, timeouts e erros inesperados devem ser registrados para diagnóstico, sem incluir dados sensíveis.
- **RNF10 — Manutenibilidade:** a integração com a API, a conversão de unidades e a apresentação dos dados devem permanecer separadas e testáveis.
- **RNF11 — Escalabilidade:** a solução deve suportar o crescimento esperado de usuários e requisições sem degradação significativa do tempo de resposta.

### Revisão da Classificação

Todos os requisitos funcionais atuais descrevem comportamentos que o sistema deve executar:

- **RF1 — Buscar cidade:** funcional; descreve a pesquisa e a seleção de uma cidade.
- **RF2 — Exibir clima atual:** funcional; descreve os dados apresentados ao usuário.
- **RF3 — Exibir previsão de cinco dias:** funcional; descreve a previsão que deve ser exibida.
- **RF4 — Alternar unidade:** funcional; descreve uma interação e sua consequência.
- **RF5 — Informar estados da aplicação:** funcional; descreve os estados de loading, vazio e erro que devem ser apresentados.
- **RF6 — Tentar novamente:** funcional; descreve a ação de recuperação oferecida ao usuário.

Os requisitos RNF1 a RNF11 são não-funcionais porque definem como a aplicação deve se comportar ou quais qualidades deve atender, como responsividade, acessibilidade, performance, resiliência, segurança e disponibilidade.

O requisito anterior que combinava “não exigir autenticação” com segurança estava parcialmente misturado. A ausência de autenticação é uma decisão de escopo e permanece registrada em **Suposições**; a proteção de credenciais foi mantida como requisito não-funcional de segurança no RNF7.

## Riscos

| Categoria | Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- | --- |
| Técnico | Fonte de dados indisponível, lenta ou sujeita a limite de requisições | Média | Alto | Escolher uma API com limites compatíveis, tratar timeout e erro, informar o usuário e avaliar cache ou fonte alternativa. |
| Produto | Busca retornar cidades ambíguas ou localização incorreta | Alta | Alto | Usar serviço de geocodificação confiável e exibir estado, país e região antes da confirmação. |
| Técnico | Dados meteorológicos incompletos ou inconsistentes | Média | Alto | Definir contrato mínimo de dados, validar respostas e prever estados para campos ausentes. |
| Produto | Experiência inadequada em telas móveis | Média | Alto | Adotar abordagem mobile-first, testar larguras pequenas e validar os fluxos em dispositivos reais ou emuladores. |
| Técnico | Conversão ou arredondamento incorreto entre Celsius e Fahrenheit | Baixa | Médio | Centralizar a conversão em uma função testável e validar valores extremos e casas decimais. |
| Técnico | Latência ou falha de rede interromper a consulta | Média | Médio | Exibir carregamento, timeout, mensagem objetiva e ação de tentar novamente; considerar cache local quando definido. |
| Técnico | Exposição indevida de chave de API ou coleta excessiva de dados | Média | Alto | Preferir fonte sem chave no cliente, manter segredos fora do frontend, minimizar dados coletados e revisar privacidade antes do lançamento. |
| Produto | Escopo indefinido sobre indicadores, granularidade e significado de “cinco dias” | Alta | Alto | Formalizar decisões e critérios de aceite antes do desenvolvimento e validar um protótipo com stakeholders. |
| Produto | Previsão pouco confiável por desatualização, fuso horário ou mapeamento incorreto da condição climática | Média | Alto | Definir política de atualização, usar o fuso da localidade consultada, registrar o horário dos dados e testar o mapeamento de códigos. |
| Produto | Usuários não conseguirem encontrar a cidade desejada ou abandonarem a busca | Média | Médio | Implementar sugestões, estados vazios claros, busca tolerante a variações e medir buscas sem resultado. |
| Técnico | Incompatibilidade entre navegadores ou falhas de acessibilidade | Média | Alto | Definir matriz de suporte, testar teclado e leitor de tela e executar testes em viewports e navegadores prioritários. |
| Produto | Dependência de uma API pública gerar custo, restrição de uso ou mudança contratual inesperada | Média | Alto | Verificar licença e limites, monitorar consumo, encapsular o provedor em um serviço e documentar uma alternativa. |

## Perguntas em Aberto

1. **Fonte de dados:** Qual serviço fornecerá geocodificação e dados meteorológicos? Exige chave, possui custo, limite de requisições ou restrições de uso? **Impacto:** determina arquitetura, orçamento, segurança, licenciamento e disponibilidade.
2. **Escopo geográfico:** A aplicação atenderá cidades do mundo todo ou apenas localidades de um país ou região? **Impacto:** afeta busca, idioma, formatos de endereço, cobertura da API e estratégia de testes.
3. **Critério de seleção:** Como o usuário escolherá uma cidade quando existirem homônimos? Estado, país, região e coordenadas devem aparecer nos resultados? **Impacto:** sem desambiguação, a previsão pode ser exibida para a localidade errada.
4. **Entrada da busca:** A busca aceitará apenas nome de cidade ou também CEP, estado, país e localização atual do dispositivo? **Impacto:** define o escopo funcional, permissões necessárias e complexidade da experiência.
5. **Momento da consulta:** A previsão será carregada somente após o usuário selecionar uma cidade ou haverá uma cidade inicial? **Impacto:** altera a primeira experiência, o número de requisições e o estado vazio da aplicação.
6. **Previsão de cinco dias:** Os cinco dias incluem hoje ou representam os cinco dias completos seguintes? **Impacto:** altera o cálculo da previsão, o layout e os critérios de aceite.
7. **Granularidade:** A previsão será diária ou também exibirá dados por hora? **Impacto:** influencia o contrato da API, a densidade da interface e o volume de dados processados.
8. **Indicadores:** Quais dados devem aparecer no clima atual e na previsão, além de temperatura e condição: mínima, máxima, sensação térmica, chuva, vento, umidade ou pressão? **Impacto:** define o contrato mínimo da API, o layout e o valor percebido do produto.
9. **Condições climáticas:** Como códigos meteorológicos da API serão traduzidos para textos e ícones em pt-BR? **Impacto:** evita descrições inconsistentes e determina a necessidade de um catálogo de mapeamento.
10. **Atualização:** Com que frequência os dados devem ser atualizados e haverá um botão de atualização manual? **Impacto:** afeta atualidade percebida, custo de API, cache e consumo de bateria em dispositivos móveis.
11. **Fuso horário:** As datas e horários serão apresentados no fuso da cidade consultada ou no fuso do usuário? **Impacto:** uma escolha incorreta pode exibir dias e horários meteorológicos enganadores.
12. **Unidades:** A alternância Celsius/Fahrenheit deve converter apenas temperatura ou também vento, pressão e precipitação? **Impacto:** evita uma experiência parcialmente convertida e define regras de formatação.
13. **Preferência de unidade:** Qual deve ser a unidade padrão na primeira visita e a escolha deve ser persistida entre sessões? **Impacto:** afeta a primeira renderização, a consistência e a necessidade de armazenamento local.
14. **Falhas e ausência de dados:** Como a interface deve agir quando a API responder parcialmente, sem previsão ou com cidade não encontrada? **Impacto:** define mensagens, estados de erro, comportamento de fallback e critérios de qualidade.
15. **Offline e cache:** Haverá suporte offline ou visualização do último resultado consultado? Por quanto tempo os dados poderão ser considerados válidos? **Impacto:** altera a estratégia de armazenamento, a resiliência e a complexidade do produto.
16. **Autenticação e personalização:** Haverá login, favoritos, histórico ou sincronização entre dispositivos? **Impacto:** define persistência, modelo de dados, privacidade e esforço de implementação.
17. **Localização automática:** A aplicação poderá usar a geolocalização do dispositivo para sugerir a cidade atual? **Impacto:** exige consentimento, tratamento de permissões negadas e regras adicionais de privacidade.
18. **Público e idiomas:** A interface será somente pt-BR ou precisará suportar outros idiomas e formatos regionais? **Impacto:** influencia arquitetura de internacionalização, conteúdo e formatação de datas e números.
19. **Acessibilidade:** Quais padrões e nível de conformidade são obrigatórios, por exemplo WCAG 2.1 AA? **Impacto:** orienta decisões de design, implementação, testes com teclado e uso de leitores de tela.
20. **Dispositivos e navegadores:** Quais navegadores, versões, tamanhos de tela e condições de conectividade são oficialmente suportados? **Impacto:** direciona compatibilidade, testes e prioridades de design responsivo.
21. **Performance:** Qual é o tempo máximo aceitável para carregar a aplicação, concluir a busca e exibir a previsão? **Impacto:** transforma a expectativa de rapidez em metas verificáveis e orienta cache e otimizações.
22. **Disponibilidade:** Qual percentual de disponibilidade é esperado e existe uma fonte alternativa para indisponibilidade da API? **Impacto:** define investimento em resiliência, monitoramento, fallback e comunicação de incidentes.
23. **Segurança e privacidade:** Quais dados serão coletados, haverá analytics e existem requisitos legais ou corporativos para retenção e consentimento? **Impacto:** influencia arquitetura, política de privacidade, uso de cookies e conformidade.
24. **Métricas de sucesso:** Como será medida a eficácia do produto: buscas concluídas, tempo até visualizar a previsão, retorno de usuários ou outro indicador? **Impacto:** sem métricas, não será possível validar se a solução atende ao objetivo de negócio.
25. **Operação:** Quem será responsável por monitorar a aplicação, atualizar dependências e responder a falhas da fonte de dados? **Impacto:** define observabilidade, suporte, custos recorrentes e sustentabilidade após o lançamento.
26. **Escopo de lançamento:** Existe prazo, orçamento, plataforma de publicação e necessidade de funcionamento em ambientes corporativos com proxy ou bloqueios? **Impacto:** restringe escolhas técnicas e pode alterar o escopo da primeira versão.

## Decisões

- **Fonte de dados: Open-Meteo, sem API key.** A escolha reduz custo e configuração operacional da primeira versão. Resolve a dúvida sobre o provedor meteorológico e permite uma arquitetura web simples, mantendo a necessidade de validar limites e disponibilidade do serviço.
- **“5 dias” = hoje + 4 dias seguintes.** A definição elimina a ambiguidade sobre a janela da previsão e estabelece um critério objetivo para cálculo, ordenação e apresentação dos dias.
- **Unidade padrão: Celsius.** A decisão atende ao público inicial em pt-BR e evita uma escolha indefinida na primeira visita; a alternância para Fahrenheit continua disponível pelo RF4.
- **Sem autenticação e sem persistência de servidor.** A primeira versão prioriza consulta rápida e reduz escopo, custos, tratamento de dados pessoais e complexidade de backend. Favoritos, histórico e sincronização ficam fora do lançamento inicial.
- **Idioma da interface: pt-BR.** A decisão delimita conteúdo, mensagens, datas e números para o público inicial e adia internacionalização para uma evolução futura.

## Personas e Objetivos

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso pessoal |
| --- | --- | --- | --- |
| **Decisor do dia a dia** — pessoa que precisa decidir roupa, deslocamento ou uso de guarda-chuva | Descobrir rapidamente as condições atuais e a previsão do dia | Principalmente mobile, durante a manhã ou antes de sair | Consegue localizar a cidade e visualizar o clima atual em poucos passos, sem precisar repetir a busca. |
| **Viajante planejador** — pessoa organizando viagem, compromissos ou atividades ao longo da semana | Comparar a previsão dos próximos cinco dias para planejar atividades | Mobile e desktop, com uso mais cuidadoso em tela maior | Encontra a cidade correta e consegue interpretar a previsão dos cinco dias em uma única consulta. |
| **Usuário em localidade pouco familiar** — pessoa que não conhece bem estados, países ou cidades homônimas | Confirmar que está consultando a localidade correta | Principalmente mobile, com conectividade variável | Seleciona a cidade correta a partir de resultados desambiguados e recebe uma previsão compreensível. |

## Auto-crítica do Discovery

Antes de iniciar a especificação, ainda precisam ser detalhados:

- O contrato exato do Open-Meteo, incluindo parâmetros, códigos meteorológicos, fuso horário, unidades e comportamento diante de campos ausentes.
- Os indicadores exibidos, a granularidade diária ou horária e os critérios objetivos de atualização dos dados.
- Metas verificáveis de performance e disponibilidade, navegadores suportados e nível de conformidade de acessibilidade.
- Estratégia de timeout, cache, observabilidade e fallback caso o serviço Open-Meteo esteja lento ou indisponível.
- Regras de busca, debounce, sugestões, desambiguação e mensagens para nenhum resultado.
- Critérios de aceite para conversão Celsius/Fahrenheit, arredondamento, datas e condições climáticas.
- Política de privacidade, analytics e eventual necessidade de proxy ou backend, mesmo sem autenticação e sem persistência de servidor.

Esses pontos podem gerar retrabalho se forem deixados para a implementação, especialmente o contrato dos dados, o significado visual dos códigos meteorológicos e os limites de qualidade. Para começar a especificação com segurança, é necessário transformar as decisões acima em requisitos testáveis, validar a disponibilidade e os limites do Open-Meteo e obter aprovação dos stakeholders para o escopo da primeira versão.

## Resumo Executivo

A empresa terá um Weather App web, responsivo e em pt-BR para consultas rápidas de clima.
O usuário buscará uma cidade, verá as condições atuais e consultará hoje mais quatro dias.
Celsius será a unidade inicial, com opção de alternar para Fahrenheit.
Open-Meteo será a fonte de dados, sem autenticação e sem persistência de servidor na v1.
Antes do desenvolvimento, ainda devem ser detalhados o contrato da API, os critérios de qualidade e os critérios de aceite.

## Suposições

- A primeira versão será uma aplicação web responsiva, acessível em navegadores modernos.
- O usuário terá conexão com a internet para buscar cidades e consultar dados atualizados.
- A consulta básica não exigirá autenticação nem cadastro.
- A interface será disponibilizada em pt-BR na primeira versão.
- Celsius será a unidade padrão, com alternância para Fahrenheit.
- A previsão de cinco dias será o dia atual mais os quatro dias seguintes.
- Os dados meteorológicos serão obtidos do Open-Meteo, sem API key.
- Não haverá autenticação nem persistência de servidor na primeira versão; favoritos, histórico e sincronização estão fora do escopo inicial.
- Não haverá geolocalização automática na primeira versão.
- A aplicação exibirá somente dados fornecidos e validados pela fonte, sem tentar produzir previsões próprias.
