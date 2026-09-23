# Contrato de dados — aba DataBase

| coluna | tipo esperado | domínio |
|---|---|---|
| id | int | único, 1..1185 |
| credit_approval | datetime | data de aprovação do crédito |
| closed_at | datetime (nullable) | data de fechamento; deve ser >= credit_approval |
| state | string (nullable) | UF brasileira (2 letras) |
| monthly_income | float | > 0 |
| loan_term | float (nullable) | meses: {60,90,120,150,180} |
| credit_score | float (nullable) | escala 0-1000 (padrão Serasa) |
| property_value | float | > 0 |
| loan_amount | float | > 0, idealmente <= property_value |
| property_type | string (nullable) | house / apartment / commercial / land (grafias variadas encontradas) |
| customer_age | int | 18-100 (menor que 18 é inválido p/ contrato de crédito) |
| reason | string (nullable) | categórico |
| channel | string (nullable) | categórico |
| profession_type | string (nullable) | categórico |

Janela de análise pedida no template (aba Q1 - Summary): **Q3-2024 a Q4-2025** (6 trimestres),
por `credit_approval`. Registros fora dessa janela existem na base (3 antes de Q3-2024, 59 em
2026Q1) e são reportados à parte (Q4), não somados nas colunas do template.
