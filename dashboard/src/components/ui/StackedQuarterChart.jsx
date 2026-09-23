import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { RiCloseLine } from "@remixicon/react";
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
      {payload.length > 1 && (
        <div className="flex items-center justify-between gap-4 text-[11.5px] mt-1.5 pt-1.5 border-t border-line">
          <span className="text-slate-400">Total</span>
          <span className="tabular-nums font-semibold text-white">{formatBRL(total, { compact: true })}</span>
        </div>
      )}
    </div>
  );
}

export default function StackedQuarterChart({ porTrimestre }) {
  // Legenda acima do gráfico funciona como filtro de seleção múltipla:
  // clicar adiciona/remove aquele tipo de imóvel do filtro. Com algum tipo
  // selecionado, as barras dos demais somem e o rótulo no topo passa a
  // somar só os tipos selecionados; sem nenhum selecionado, mostra os 4
  // empilhados com o total geral do trimestre.
  const [selecionados, setSelecionados] = useState(() => new Set());
  const filtrado = selecionados.size > 0;
  const tiposVisiveis = filtrado ? TIPOS.filter((t) => selecionados.has(t)) : TIPOS;

  const dataBase = montarLinhas(porTrimestre);
  const data = filtrado
    ? dataBase.map((r) => ({
        ...r,
        _totalFiltrado: tiposVisiveis.reduce((s, t) => s + (r[t] || 0), 0),
      }))
    : dataBase;

  function alternar(tipo) {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(tipo)) novo.delete(tipo);
      else novo.add(tipo);
      return novo;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 mb-3 px-0.5" role="group" aria-label="Filtrar por tipo de imóvel (seleção múltipla)">
        {TIPOS.map((tipo, i) => {
          const selecionado = selecionados.has(tipo);
          const apagado = filtrado && !selecionado;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => alternar(tipo)}
              aria-pressed={selecionado}
              className={`inline-flex items-center gap-1.5 text-[11.5px] rounded-md px-2 py-1 transition-colors ${selecionado ? "bg-white/10 text-slate-100" : apagado ? "text-slate-600 opacity-50 hover:opacity-80" : "text-slate-200 hover:bg-white/5"}`}
            >
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CORES_TIPO[i] }} />
              {tipo}
            </button>
          );
        })}
        {filtrado && (
          <button
            type="button"
            onClick={() => setSelecionados(new Set())}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium rounded-md pl-1.5 pr-2.5 py-1 border border-marca/50 bg-marca/15 text-slate-100 hover:bg-marca/25 transition-colors ml-1"
          >
            <RiCloseLine className="w-3.5 h-3.5" />
            Limpar filtro{selecionados.size > 1 ? ` (${selecionados.size})` : ""}
          </button>
        )}
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
            {tiposVisiveis.map((tipo, i) => {
              const isLast = i === tiposVisiveis.length - 1;
              return (
                <Bar
                  key={tipo}
                  dataKey={tipo}
                  stackId="a"
                  fill={CORES_TIPO[TIPOS.indexOf(tipo)]}
                  stroke={CORES.superficie}
                  strokeWidth={2}
                  radius={isLast ? [3, 3, 0, 0] : 0}
                >
                  {isLast && (
                    <LabelList
                      dataKey={filtrado ? "_totalFiltrado" : "total"}
                      position="top"
                      formatter={(v) => formatBRL(v, { compact: true })}
                      style={{ fill: "#e2e8f0", fontSize: 11, fontWeight: 600 }}
                    />
                  )}
                </Bar>
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
