"""
Reshape de dados/interim/kpis.json (ja calculado e testado por etl_kpis.py)
para o formato que o dashboard React consome. Nao recalcula nada do zero -
so reorganiza o que ja foi validado, para nunca haver divergencia entre
Excel/pipeline/dashboard.
"""
import json

SRC = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/kpis.json"
OUT = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dashboard/public/data/dashboard_data.json"

k = json.load(open(SRC, encoding="utf-8"))

PT_LABEL = {"house": "Casa", "apartment": "Apartamento", "other": "Outro (comercial/terreno)", "NULL": "Sem tipo informado"}
Q_LABEL = {"2024Q3": "Q3-24", "2024Q4": "Q4-24", "2025Q1": "Q1-25", "2025Q2": "Q2-25", "2025Q3": "Q3-25", "2025Q4": "Q4-25"}

por_trimestre = []
total_aprovado = 0
total_fechado = 0
for q in k["window_quarters"]:
    d = k["q1_summary"][q]
    total_aprovado += d["credit_approved_total"]
    total_fechado += d["closed_total"]
    por_trimestre.append({
        "trimestre": Q_LABEL[q],
        "aprovado": round(d["credit_approved_total"]),
        "fechado": round(d["closed_total"]),
        "pctFechado": d["pct_closed_over_approved"],
        "nOperacoes": d["n_deals"],
        "porTipo": [
            {"tipo": PT_LABEL[t], "valor": round(d["by_property_type"][t]["amount"]), "pct": d["by_property_type"][t]["pct_of_approved"]}
            for t in ["house", "apartment", "other", "NULL"]
        ],
    })

CH_LABEL = {
    "organic": "Orgânico", "offline": "Offline", "social_media": "Redes sociais",
    "other": "Outro", "affiliates": "Afiliados", "remarketing": "Remarketing",
    "nao_informado": "Não informado",
}
canais = []
for ch, label in CH_LABEL.items():
    d = k["q2_channel"][ch]
    canais.append({
        "canal": label,
        "chave": ch,
        "nOperacoes": d["n_deals"],
        "volume": round(d["volume_amount"]),
        "conversaoQtd": d["conversion_rate_count_pct"],
        "conversaoValor": d["conversion_rate_amount_pct"],
    })
canais.sort(key=lambda c: -c["volume"])

data = {
    "meta": {
        "gerado_em": k["generated_at"],
        "fonte_hash": k["source_file_hash"],
        "n_linhas_total": k["n_rows_read"],
        "n_linhas_janela": k["n_rows_in_window"],
        "n_linhas_fora_janela": k["n_rows_out_of_window"],
        "janela": "Q3-2024 a Q4-2025",
    },
    "resumo": {
        "totalAprovado": round(total_aprovado),
        "totalFechado": round(total_fechado),
        "pctFechadoValor": round(total_fechado / total_aprovado * 100, 2),
        "nOperacoesJanela": k["n_rows_in_window"],
        "leadTimeMedioDias": k["q3_process_kpi"]["avg_days_approval_to_close"],
        "leadTimeMedianoDias": k["q3_process_kpi"]["median_days_approval_to_close"],
        "pipelineAberto": k["q3_process_kpi"]["n_pending_or_open"],
        "taxaConversaoGeral": round(k["q3_process_kpi"]["n_closed_valid"] / k["n_rows_read"] * 100, 2),
    },
    "porTrimestre": por_trimestre,
    "canais": canais,
    "operacao": {
        "etapas": [
            {"n": 1, "titulo": "Aprovação de crédito", "desc": "Análise de crédito aprova o cliente (credit_approval); imóvel em garantia é cadastrado."},
            {"n": 2, "titulo": "Due diligence do imóvel", "desc": "Avaliação (laudo de garantia), checagem de matrícula/ônus e documentação do cliente."},
            {"n": 3, "titulo": "Formalização e assinatura", "desc": "Contrato elaborado, assinado pelas partes e gravame registrado em cartório."},
            {"n": 4, "titulo": "Liberação de recursos", "desc": "Transferência do valor ao cliente (closed_at), após confirmação do registro."},
        ],
        "kpis": [
            {"label": "Lead time médio (aprovação → fechamento)", "valor": f'{k["q3_process_kpi"]["avg_days_approval_to_close"]:.1f} dias'},
            {"label": "Lead time mediano", "valor": f'{k["q3_process_kpi"]["median_days_approval_to_close"]:.0f} dias'},
            {"label": "Taxa de conversão aprovação → fechamento", "valor": f'{round(k["q3_process_kpi"]["n_closed_valid"] / k["n_rows_read"] * 100, 1)}%'},
            {"label": "Pipeline aprovado, ainda em aberto", "valor": f'{k["q3_process_kpi"]["n_pending_or_open"]} operações'},
        ],
        "indicadoresSugeridos": [
            "SLA por etapa (dias entre aprovação → avaliação → assinatura → liberação)",
            "Taxa de desistência/cancelamento pós-aprovação",
            "Aging do pipeline aberto (há quanto tempo cada operação pendente está parada)",
        ],
    },
    "qualidadeDados": [
        {"severidade": "info", "qtd": 17, "titulo": "Grafia/idioma inconsistente em property_type", "detalhe": "\"Apartment\", \"APARTMENT\", \"apto\", \"Apartamento\", \"casa\", \"Casa\" misturados com o padrão em inglês.", "tratamento": "Coluna auxiliar normaliza tudo para apartment/house/other antes de qualquer soma."},
        {"severidade": "critical", "qtd": 11, "titulo": "closed_at anterior a credit_approval", "detalhe": "Fechamento registrado antes da aprovação — logicamente impossível.", "tratamento": "Sinalizado como \"não fechado\" em todos os cálculos, nunca excluído da base."},
        {"severidade": "critical", "qtd": 1, "titulo": "customer_age menor que 18 anos", "detalhe": "Inválido para contrato de crédito — provável erro de digitação.", "tratamento": "Mantido na base; não afeta os KPIs pedidos (nenhum agrega por idade)."},
        {"severidade": "warning", "qtd": 62, "titulo": "Registros fora da janela do case", "detalhe": "3 antes de jul/2024 e 59 em 2026 (até 28/mar/2026).", "tratamento": "Não somados nas 6 colunas da janela pedida; contados à parte."},
        {"severidade": "warning", "qtd": 18, "titulo": "loan_amount maior que property_value", "detalhe": "LTV acima de 100% — atípico para crédito com garantia real.", "tratamento": "Não alterado (pode ser legítimo); sinalizado para revisão de underwriting."},
        {"severidade": "info", "qtd": 486, "titulo": "Alta proporção de nulos em loan_term/credit_score", "detalhe": "41,0% e 41,4% em branco, quase as mesmas linhas nas duas colunas.", "tratamento": "Categoria \"não informado\" nas quebras; hipótese: etapa do funil sem underwriting completo."},
        {"severidade": "info", "qtd": 19, "titulo": "state em branco", "detalhe": "1,6% das linhas sem UF preenchida.", "tratamento": "Mantido como \"não informado\"; não afeta os KPIs pedidos."},
    ],
}

import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("OK ->", OUT)
print("total_aprovado", total_aprovado, "total_fechado", total_fechado)
