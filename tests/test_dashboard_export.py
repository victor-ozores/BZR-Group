"""Confere que o reshape para o dashboard nao alterou nenhum numero do kpis.json."""
import json

KPIS = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/kpis.json"
DASH = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dashboard/public/data/dashboard_data.json"

k = json.load(open(KPIS, encoding="utf-8"))
d = json.load(open(DASH, encoding="utf-8"))

erros = []

if d["meta"]["n_linhas_total"] != k["n_rows_read"]:
    erros.append("n_linhas_total diverge")

soma_aprovado_dash = sum(t["aprovado"] for t in d["porTrimestre"])
soma_aprovado_kpi = round(sum(v["credit_approved_total"] for v in k["q1_summary"].values()))
if abs(soma_aprovado_dash - soma_aprovado_kpi) > 1:
    erros.append(f"soma aprovado diverge: {soma_aprovado_dash} != {soma_aprovado_kpi}")

if d["resumo"]["totalAprovado"] != soma_aprovado_dash:
    erros.append("resumo.totalAprovado diverge da soma por trimestre")

soma_canais = sum(c["nOperacoes"] for c in d["canais"])
if soma_canais != k["n_rows_read"]:
    erros.append(f"soma canais {soma_canais} != {k['n_rows_read']}")

soma_qualidade = sum(item["qtd"] for item in d["qualidadeDados"])
esperado_qualidade = 17 + 11 + 1 + 62 + 18 + 486 + 19
if soma_qualidade != esperado_qualidade:
    erros.append(f"soma qualidadeDados {soma_qualidade} != {esperado_qualidade}")

if erros:
    print("FALHOU:")
    for e in erros:
        print(" -", e)
    raise SystemExit(1)
print(f"OK: reshape do dashboard consistente com kpis.json")
