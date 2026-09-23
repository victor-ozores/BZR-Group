export function formatBRL(v, { compact = false } = {}) {
  if (compact) {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace(".", ",")}M`;
    if (abs >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}mil`;
  }
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function formatPct(v, casas = 1) {
  return `${v.toFixed(casas).replace(".", ",")}%`;
}

export function formatInt(v) {
  return v.toLocaleString("pt-BR");
}
