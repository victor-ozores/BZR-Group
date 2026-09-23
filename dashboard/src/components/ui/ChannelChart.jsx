import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { CATEGORICA, NEUTRO_SEM_DADO, CORES, TOOLTIP_ESTILO } from "../../theme";
import { formatBRL, formatInt, formatPct } from "../../utils/format";

const COR_POR_CANAL = {
  organic: CATEGORICA[0],
  offline: CATEGORICA[1],
  social_media: CATEGORICA[2],
  other: CATEGORICA[3],
  affiliates: CATEGORICA[4],
  remarketing: CATEGORICA[5],
  nao_informado: NEUTRO_SEM_DADO,
};

const ORDENACOES = [
  { chave: "volume", label: "Volume (R$)" },
  { chave: "conversaoValor", label: "Conversão (R$)" },
];

function TooltipCustom({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={TOOLTIP_ESTILO} className="px-3 py-2">
      <div className="font-semibold text-slate-100 mb-1">{d.canal}</div>
      <div className="text-[11.5px] text-slate-300 tabular-nums">{formatBRL(d.volume, { compact: true })} · {formatInt(d.nOperacoes)} operações</div>
    </div>
  );
}

export default function ChannelChart({ canais }) {
  const [ordenarPor, setOrdenarPor] = useState("volume");
  // Clicar num canal na legenda isola ele no gráfico e na tabela (mesmo
  // padrão de interação do gráfico de barras empilhadas da Visão geral).
  const [isolado, setIsolado] = useState(null);

  const visiveis = useMemo(
    () => canais.filter((c) => c.chave !== "nao_informado").slice().sort((a, b) => b[ordenarPor] - a[ordenarPor]),
    [canais, ordenarPor]
  );
  const semInfo = canais.find((c) => c.chave === "nao_informado");

  function alternarIsolamento(chave) {
    setIsolado((atual) => (atual === chave ? null : chave));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-1 gap-y-1.5" role="group" aria-label="Filtrar por canal">
          {visiveis.map((c) => {
            const ativo = !isolado || isolado === c.chave;
            return (
              <button
                key={c.chave}
                type="button"
                onClick={() => alternarIsolamento(c.chave)}
                className={`inline-flex items-center gap-1.5 text-[11.5px] rounded-md px-2 py-1 transition-opacity hover:opacity-90 ${ativo ? "opacity-100" : "opacity-45"}`}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COR_POR_CANAL[c.chave] }} />
                <span className={ativo ? "text-slate-300" : "text-slate-500"}>{c.canal}</span>
              </button>
            );
          })}
        </div>
        <div className="inline-flex rounded-lg border border-line p-0.5 shrink-0" role="group" aria-label="Ordenar canais">
          {ORDENACOES.map((o) => (
            <button
              key={o.chave}
              type="button"
              onClick={() => setOrdenarPor(o.chave)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${ordenarPor === o.chave ? "bg-marca text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visiveis} layout="vertical" margin={{ top: 4, right: 60, left: 8, bottom: 4 }}>
              <CartesianGrid stroke={CORES.grade} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="canal"
                width={100}
                tick={{ fill: CORES.eixo, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<TooltipCustom />} cursor={{ fill: CORES.hover }} />
              <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={22} isAnimationActive={false}>
                {visiveis.map((c) => (
                  <Cell key={c.chave} fill={COR_POR_CANAL[c.chave]} fillOpacity={!isolado || isolado === c.chave ? 1 : 0.18} />
                ))}
                <LabelList
                  dataKey="volume"
                  position="right"
                  formatter={(v) => formatBRL(v, { compact: true })}
                  style={{ fill: "#e2e8f0", fontSize: 11.5, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:w-[360px] shrink-0">
          <table className="w-full text-[12.5px] tabular-nums">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-500 border-b border-line">
                <th className="py-2 font-medium">Canal</th>
                <th className="py-2 font-medium text-right">Operações</th>
                <th className="py-2 font-medium text-right">Conv. qtd</th>
                <th className="py-2 font-medium text-right">Conv. R$</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((c) => {
                const ativo = !isolado || isolado === c.chave;
                return (
                  <tr key={c.chave} className={`border-b border-line/60 transition-opacity ${ativo ? "" : "opacity-40"}`}>
                    <td className="py-2 flex items-center gap-2 text-slate-200">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: COR_POR_CANAL[c.chave] }} />
                      {c.canal}
                    </td>
                    <td className="py-2 text-right text-slate-300">{formatInt(c.nOperacoes)}</td>
                    <td className="py-2 text-right text-slate-300">{formatPct(c.conversaoQtd)}</td>
                    <td className="py-2 text-right text-slate-300">{formatPct(c.conversaoValor)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {semInfo && (
            <p className="text-[11px] text-slate-500 mt-2">
              + {semInfo.nOperacoes} operações sem canal registrado (não somadas acima).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
