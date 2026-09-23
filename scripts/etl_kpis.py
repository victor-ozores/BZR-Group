"""
ETL do case Home Equity - BZR Group.
Le a aba DataBase, limpa/normaliza, calcula KPIs para Q1 e Q2,
e grava um JSON agregado (idempotente) + log de auditoria + CSV de anomalias
(so com id + tipo de problema, sem nenhuma outra coluna).
Nunca imprime linha bruta no console.
"""
import pandas as pd
import numpy as np
import json
import hashlib
import datetime as dt
import sys

SRC = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/Case_Fintech_2026.xlsx"
OUT_KPIS = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/kpis.json"
OUT_ANOM = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/anomalias.csv"
OUT_LOG = "/sessions/rcw-017vj5jgarcfdvx8ekw458xf/mnt/BZR Group/dados/interim/etl_log.jsonl"

WINDOW = ["2024Q3", "2024Q4", "2025Q1", "2025Q2", "2025Q3", "2025Q4"]

PT_MAP = {
    "apartment": "apartment", "Apartment": "apartment", "APARTMENT": "apartment",
    "apto": "apartment", "Apartamento": "apartment",
    "house": "house", "House": "house", "HOUSE": "house", "casa": "house", "Casa": "house",
    "commercial": "other", "Commercial": "other",
    "land": "other",
}

def file_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()[:16]

def run():
    df = pd.read_excel(SRC, sheet_name="DataBase")
    n_read = len(df)
    anomalies = []

    # --- normalizacao property_type ---
    df["property_type_clean"] = df["property_type"].map(PT_MAP)
    df["property_type_clean"] = df["property_type_clean"].where(df["property_type"].notna(), "NULL")
    df.loc[df["property_type"].notna() & df["property_type_clean"].isna(), "property_type_clean"] = "other"

    # --- closed_at invalido (anterior a credit_approval) ---
    invalid_close_mask = df["closed_at"].notna() & (df["closed_at"] < df["credit_approval"])
    for i in df.loc[invalid_close_mask, "id"]:
        anomalies.append({"id": int(i), "problema": "closed_at anterior a credit_approval"})
    df["is_closed_valid"] = df["closed_at"].notna() & ~invalid_close_mask

    # --- idade invalida ---
    age_invalid_mask = df["customer_age"] < 18
    for i in df.loc[age_invalid_mask, "id"]:
        anomalies.append({"id": int(i), "problema": "customer_age < 18 (invalido para contrato de credito)"})

    # --- LTV > 100% ---
    ltv_mask = df["loan_amount"] > df["property_value"]
    for i in df.loc[ltv_mask, "id"]:
        anomalies.append({"id": int(i), "problema": "loan_amount > property_value (LTV > 100%)"})

    # --- janela de analise ---
    df["quarter"] = df["credit_approval"].dt.to_period("Q").astype(str)
    df["in_window"] = df["quarter"].isin(WINDOW)
    for i in df.loc[~df["in_window"], "id"]:
        anomalies.append({"id": int(i), "problema": f"credit_approval fora da janela do template ({df.loc[df['id']==i,'quarter'].values[0]})"})

    dfw = df[df["in_window"]].copy()

    # --- Q1: credit approved & closed, por trimestre x tipo de imovel ---
    q1 = {}
    pt_rows = ["house", "apartment", "other", "NULL"]
    for q in WINDOW:
        dq = dfw[dfw["quarter"] == q]
        approved_total = float(dq["loan_amount"].sum())
        closed_total = float(dq.loc[dq["is_closed_valid"], "loan_amount"].sum())
        by_pt = {}
        for pt in pt_rows:
            sub = dq[dq["property_type_clean"] == pt]
            amt = float(sub["loan_amount"].sum())
            pct = round(amt / approved_total * 100, 2) if approved_total else 0.0
            by_pt[pt] = {"amount": amt, "pct_of_approved": pct}
        q1[q] = {
            "credit_approved_total": approved_total,
            "by_property_type": by_pt,
            "closed_total": closed_total,
            "pct_closed_over_approved": round(closed_total / approved_total * 100, 2) if approved_total else 0.0,
            "n_deals": int(len(dq)),
        }

    # --- Q2: canal - volume e conversao (base completa, nao restrita a janela) ---
    q2 = {}
    for ch, sub in df.groupby(df["channel"].fillna("nao_informado")):
        n = int(len(sub))
        vol_amount = float(sub["loan_amount"].sum())
        n_closed = int(sub["is_closed_valid"].sum())
        amt_closed = float(sub.loc[sub["is_closed_valid"], "loan_amount"].sum())
        q2[str(ch)] = {
            "n_deals": n,
            "volume_amount": vol_amount,
            "conversion_rate_count_pct": round(n_closed / n * 100, 2) if n else 0.0,
            "conversion_rate_amount_pct": round(amt_closed / vol_amount * 100, 2) if vol_amount else 0.0,
        }

    # --- KPI de processo (Q3): tempo medio aprovacao -> fechamento (dias), so fechamentos validos ---
    valid_closed = df[df["is_closed_valid"]]
    lead_time_days = (valid_closed["closed_at"] - valid_closed["credit_approval"]).dt.days
    q3_kpi = {
        "avg_days_approval_to_close": round(float(lead_time_days.mean()), 1) if len(lead_time_days) else None,
        "median_days_approval_to_close": round(float(lead_time_days.median()), 1) if len(lead_time_days) else None,
        "n_closed_valid": int(len(valid_closed)),
        "n_pending_or_open": int(len(df) - len(valid_closed)),
    }

    result = {
        "generated_at": dt.datetime.now().isoformat(),
        "source_file_hash": file_hash(SRC),
        "n_rows_read": n_read,
        "n_rows_in_window": int(dfw.shape[0]),
        "n_rows_out_of_window": int((~df["in_window"]).sum()),
        "n_anomalies": len(anomalies),
        "window_quarters": WINDOW,
        "q1_summary": q1,
        "q2_channel": q2,
        "q3_process_kpi": q3_kpi,
    }

    with open(OUT_KPIS, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    pd.DataFrame(anomalies).to_csv(OUT_ANOM, index=False)

    log_entry = {
        "timestamp": dt.datetime.now().isoformat(),
        "source_hash": result["source_file_hash"],
        "rows_read": n_read,
        "rows_rejected_from_window": result["n_rows_out_of_window"],
        "anomalies_flagged": len(anomalies),
    }
    with open(OUT_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")

    return result

if __name__ == "__main__":
    r = run()
    # so imprime um resumo agregado, nunca linha bruta
    print(json.dumps({
        "n_rows_read": r["n_rows_read"],
        "n_rows_in_window": r["n_rows_in_window"],
        "n_rows_out_of_window": r["n_rows_out_of_window"],
        "n_anomalies": r["n_anomalies"],
        "source_file_hash": r["source_file_hash"],
    }, indent=2, ensure_ascii=False))
