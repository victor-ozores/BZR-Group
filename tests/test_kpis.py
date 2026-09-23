"""
Testes de sanidade dos KPIs gerados pelo etl_kpis.py.
Cada teste compara contra um valor esperado calculado de forma independente
(soma bruta via pandas, nao reaproveitando a logica do pipeline).
"""
import pandas as pd
import json

SRC = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/Case_Fintech_2026.xlsx"
KPIS = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/kpis.json"

df = pd.read_excel(SRC, sheet_name="DataBase")
kpis = json.load(open(KPIS, encoding="utf-8"))

erros = []

# 1) total de linhas lidas bate com o arquivo
if kpis["n_rows_read"] != len(df):
    erros.append(f"n_rows_read {kpis['n_rows_read']} != {len(df)}")

# 2) janela + fora da janela = total
if kpis["n_rows_in_window"] + kpis["n_rows_out_of_window"] != kpis["n_rows_read"]:
    erros.append("janela + fora_da_janela != total")

# 3) para cada trimestre, soma das categorias de property_type bate com o total do trimestre
for q, dados in kpis["q1_summary"].items():
    soma_categorias = sum(v["amount"] for v in dados["by_property_type"].values())
    if abs(soma_categorias - dados["credit_approved_total"]) > 0.01:
        erros.append(f"{q}: soma categorias {soma_categorias} != total {dados['credit_approved_total']}")

# 4) recalculo independente do total aprovado na janela (Q3-2024 a Q4-2025) via pandas puro
WINDOW = ["2024Q3", "2024Q4", "2025Q1", "2025Q2", "2025Q3", "2025Q4"]
q_series = df["credit_approval"].dt.to_period("Q").astype(str)
esperado_total_janela = float(df.loc[q_series.isin(WINDOW), "loan_amount"].sum())
total_pipeline = sum(v["credit_approved_total"] for v in kpis["q1_summary"].values())
if abs(esperado_total_janela - total_pipeline) > 0.01:
    erros.append(f"total credit_approved janela: esperado {esperado_total_janela} != pipeline {total_pipeline}")

# 5) soma de n_deals por canal (Q2) bate com total de linhas da base (nao restrito a janela)
soma_canais = sum(v["n_deals"] for v in kpis["q2_channel"].values())
if soma_canais != len(df):
    erros.append(f"soma n_deals canais {soma_canais} != {len(df)}")

# 6) recalculo independente de conversao do canal organico
sub = df[df["channel"] == "organic"]
closed_valido = sub["closed_at"].notna() & (sub["closed_at"] >= sub["credit_approval"])
esperado_conv = round(closed_valido.sum() / len(sub) * 100, 2)
obtido_conv = kpis["q2_channel"]["organic"]["conversion_rate_count_pct"]
if abs(esperado_conv - obtido_conv) > 0.01:
    erros.append(f"conversao organic: esperado {esperado_conv} != obtido {obtido_conv}")

if erros:
    print("FALHOU:")
    for e in erros:
        print(" -", e)
    raise SystemExit(1)
else:
    print(f"OK: 6/6 testes passaram")
