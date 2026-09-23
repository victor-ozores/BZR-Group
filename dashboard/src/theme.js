// Paleta derivada da identidade visual real da BZR Group (bzr.group: fundo
// navy #040a22, azul de marca #081e6e/#074DC8) — os 6 tons categóricos foram
// re-calibrados a partir das cores extraídas do site para passar no validador
// de acessibilidade do método de dataviz (contraste, separação por daltonismo).
// Tema único escuro (a marca não tem versão clara consistente).

export const CORES = {
  marca: "#375eff", // azul de marca (destaque principal, fundo escuro)
  marcaForte: "#074DC8", // azul do logo — usado em botões/ações primárias
  neutro: "#64748b",
  neutroForte: "#94a3b8",

  hover: "rgba(255, 255, 255, 0.06)",

  bom: "#22c55e",
  atencao: "#f59e0b",
  ruim: "#ef4444",

  texto: "#f8fafc",
  textoSecundario: "#9ca3af",
  textoMuted: "#6b7280",

  grade: "rgba(255,255,255,0.08)",
  eixo: "#8892b0",
  tooltipBg: "#0d1a47",
  tooltipBorda: "#22305f",
  superficie: "#0a1530", // cor de "vazio" — usada nos gaps de 2px entre segmentos empilhados
};

// Paleta categórica validada (6 slots, ordem fixa — nunca reordenar por
// ranking; a cor segue a entidade, não a posição). Validada com
// scripts/validate_palette.js do skill dataviz: banda de luminosidade,
// separação CVD (protan/deutan/tritan) e contraste contra o fundo #0a1530 —
// todas as checagens passaram nesta ordem.
export const CATEGORICA = [
  "#375eff", // 1 azul  — marca
  "#c96a2e", // 2 laranja
  "#1f9e8f", // 3 verde-azulado
  "#ad8f1f", // 4 dourado
  "#7d4fc2", // 5 roxo
  "#c9548a", // 6 rosa
];
// Bem mais claro que o cinza original (#5b6685 -> #98a3c9 -> aqui): fundo é
// azul-marinho escuro, então um cinza "seguro" de dia (médio) ainda lê fraco
// de noite. Validado contra o fundo real (#040a22): contraste 12.3:1 (mínimo
// do skill é 3:1) — folga grande de propósito, porque a fatia dessa
// categoria costuma ser pequena (poucos % de uma barra) e precisa sobrar
// visível mesmo fina.
export const NEUTRO_SEM_DADO = "#c7cce3"; // "sem informação" — cinza claro, fora da paleta categórica de propósito

// Acentos de ÍCONE (KPI cards, Meter) — não são cores de dado (essas ficam em
// CATEGORICA/status); são identidade de UI. O fundo do dashboard já é
// azul-marinho, então ícone azul (marca) em cima dele quase some — por isso
// nenhum acento aqui usa a família azul. Cada cor carrega um significado
// fixo, reaproveitado em toda a base: verde = dinheiro/crescimento, laranja =
// tempo/prazo, teal = conversão/funil, roxo = pipeline/fila, dourado =
// contagem informativa neutra. Todas >=4.5:1 de contraste contra #040a22.
export const ICONE = {
  dinheiro: "#22c55e", // verde — valores em R$, crescimento
  tempo: "#c96a2e", // laranja — lead time, prazos
  conversao: "#1f9e8f", // teal — taxas, funil
  pipeline: "#9b73dd", // roxo (mais claro que o CATEGORICA[4], p/ legibilidade em ícone pequeno)
  info: "#ad8f1f", // dourado — contagens neutras/informativas
};

export const TOOLTIP_ESTILO = {
  backgroundColor: CORES.tooltipBg,
  border: `1px solid ${CORES.tooltipBorda}`,
  borderRadius: 8,
  fontSize: 12,
  color: CORES.texto,
};

export function statusPctFechado(pct) {
  if (pct >= 45) return "bom";
  if (pct >= 25) return "atencao";
  return "ruim";
}

export function statusCorHex(status) {
  return { bom: CORES.bom, atencao: CORES.atencao, ruim: CORES.ruim }[status];
}
