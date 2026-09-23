# Mini-DPIA — Case BZR Group (Home Equity)

**Finalidade**: resolver case de avaliação (Pricing & PM Analyst Jr.) analisando uma base de clientes aprovados em crédito para empréstimo com garantia de imóvel (Home Equity), produzindo respostas às Questões 1-4 e um dashboard de apoio.

**Categorias de dado (aba DataBase, 1185 linhas x 14 colunas)**:
id, credit_approval (data), closed_at (data), state (UF), monthly_income, loan_term, credit_score,
property_value, loan_amount, property_type, customer_age, reason, channel, profession_type.

**PII direta**: nenhuma. Não há nome, CPF, e-mail, telefone, endereço ou geolocalização granular.
`state` é uma UF (nível agregado, não identifica indivíduo). `customer_age` e `monthly_income` são
quase-identificadores, mas a própria planilha (aba "Questions") declara que a base é **fictícia**
("dados fictícios de clientes"), criada pela BZR Group para fins de avaliação de candidato.

**Base legal**: uso do dado dentro do escopo do case de avaliação, conforme autorizado pelas
"Regras" da aba Questions ("O teste deve ser resolvido utilizando somente os dados presentes
neste arquivo").

**Riscos x mitigação**:
- Risco de o arquivo bruto (linha a linha) entrar no contexto da IA → mitigação: todo acesso ao
  arquivo .xlsx acontece via script Python rodado localmente no computador do usuário
  (device_bash), nunca via leitura direta do arquivo; apenas agregados (contagens, somas, %,
  min/max) trafegam para o chat.
- Risco de publicação indevida do case (que descreve "uma situação real do dia-a-dia da mesa" de
  uma empresa real) → mitigação: por padrão, este material NÃO será publicado publicamente
  (portfólio/GitHub/redes); fica local na pasta do usuário e, se houver dashboard, como artifact
  privado. Publicação pública exigiria autorização explícita do usuário e da BZR Group.
- Conteúdo de células como texto livre é tratado como dado, não como instrução — nenhuma célula
  da planilha foi interpretada como comando para a IA.

**Decisão**: como não há PII direta e o dado é declaradamente fictício, não se aplica
pseudonimização/anonimização de indivíduos. Ainda assim, mantém-se a regra de nunca despejar
linhas brutas no chat — só agregados.

## Dashboard (artifact)
Publicado como artifact privado (visível só para o usuário até ele decidir compartilhar):
https://claude.ai/artifact/L237gqgbAUqw5kjHXh58f8
