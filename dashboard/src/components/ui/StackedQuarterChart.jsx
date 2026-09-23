import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { CATEGORICA, NEUTRO_SEM_DADO, CORES, TOOLTIP_ESTILO } from "../../theme";
import { formatBRL } from "../../utils/format";

const TIPOS = ["Casa", "Apartamento", "Outro (comercial/terreno)", "Sem tipo informado"];
const CORES_TIPO = [CATEGORICA[0], CATEGORICA[1], CATEGORICA[2], NEUTRO_SEM_DADO];

function montarLinhas(porTrimestre) {
  return porTrimestre.map((t) => {
    const row = { trimestre: t.trimestre, total: t.aprovado };
    t.porTipo.forEach((p) => {
      row[p.tipo] = p.valor;
    });
    return row;
  });
}

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div style={TOOLTIP_ESTILO} className="px-3 py-2.5">
      <div className="font-semibold text-slate-100 mb-1.5">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-[11.5px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
            {p.dataKey}
          </span>
          <span className="tabular-nums text-slate-200">{formatBRL(p.value, { compact: true })}</span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 text-[11.5px] mt-1.5 pt-1.5 border-t border-line">
        <span className="text-slate-400">Total</span>
        <span className="tabular-nums font-semibold text-white">{formatBRL(total, { compact: true })}</span>
      </div>
    </div>
  );
}

export default function StackedQuarterChart({ porTrimestre }) {
  const data = montarLinhas(porTrimestre);
  // Legenda acima do gráfico funciona como filtro: clicar isola aquele tipo de
  // imóvel (destaca no gráfico e esmaece o resto); clicar de novo volta a
  // mostrar todos. O total no topo da barra sempre soma os 4 tipos, mesmo com
  // um tipo isolado — a legenda destaca, nunca recalcula o empilhado.
  const [ativos, setAtivos] = useState(() => new Set(TIPOS));

  function alternar(tipo) {
    setAtivos((prev) => {
      if (prev.size === 1 && prev.has(tipo)) return new Set(TIPOS);
      return new Set([tipo]);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-x-1 gap-y-1.5 mb-3 px-0.5" role="group" aria-label="Filtrar por tipo de imóvel">
        {TIPOS.map((tipo, i) => {
          const ativo = ativos.has(tipo);
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => alternar(tipo)}
              className={`inline-flex items-center gap-1.5 text-[11.5px] rounded-md px-2 py-1 transition-opacity hover:opacity-90 ${ativo ? "opacity-100" : "opacity-45"}`}
            >
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CORES_TIPO[i] }} />
              <span className={ativo ? "text-slate-200" : "text-slate-500"}>{tipo}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 28, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CORES.grade} vertical={false} />
            <XAxis dataKey="trimestre" tick={{ fill: CORES.eixo, fontSize: 11 }} axisLine={{ stroke: CORES.grade }} tickLine={false} />
            <YAxis
              tick={{ fill: CORES.eixo, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
              domain={[0, (max) => Math.ceil((max * 1.18) / 5_000_000) * 5_000_000]}
            />
            <Tooltip content={<TooltipCustom />} cursor={{ fill: CORES.hover }} />
            {TIPOS.map((tipo, i) => (
              <Bar
                key={tipo}
                dataKey={tipo}
                stackId="a"
                fill={CORES_TIPO[i]}
                fillOpacity={ativos.has(tipo) ? 1 : 0.18}
                stroke={CORES.superficie}
                strokeWidth={2}
                radius={i === TIPOS.length - 1 ? [3, 3, 0, 0] : 0}
              >
                {i === TIPOS.length - 1 && (
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={(v) => formatBRL(v, { compact: true })}
                    style={{ fill: "#e2e8f0", fontSize: 11, fontWeight: 600 }}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
