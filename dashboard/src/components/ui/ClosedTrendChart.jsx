import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area,
  ReferenceArea, LabelList,
} from "recharts";
import { CORES, TOOLTIP_ESTILO } from "../../theme";
import { formatPct } from "../../utils/format";

function TooltipCustom({ active, payload, label, zona }) {
  if (!active || !payload?.length) return null;
  const naZona = zona && (label === zona.inicio || label === zona.fim);
  return (
    <div style={{ ...TOOLTIP_ESTILO, maxWidth: naZona ? 232 : 180 }} className="px-3 py-2">
      <div className="font-semibold text-slate-100 mb-1">{label}</div>
      <div className="text-[11.5px] text-slate-300 tabular-nums">{formatPct(payload[0].value)} fechado</div>
      {naZona && (
        <p className="text-[10.5px] text-amber-300/90 leading-relaxed mt-1.5 pt-1.5 border-t border-line">
          Queda de {zona.antes}% pra {zona.depois}% em 1 trimestre — {zona.quedaPP} p.p., mais que o dobro de qualquer
          queda anterior na série. Parte é efeito de safra, mas o tamanho sugere também uma causa adicional no funil.
        </p>
      )}
    </div>
  );
}

export default function ClosedTrendChart({ porTrimestre }) {
  const data = porTrimestre.map((t) => ({ trimestre: t.trimestre, pct: t.pctFechado }));
  const minIdx = data.reduce((best, d, i) => (d.pct < data[best].pct ? i : best), 0);
  const lastIdx = data.length - 1;
  const inicioQueda = data[Math.max(minIdx - 1, 0)].trimestre;
  const fimQueda = data[minIdx].trimestre;
  const valorAntes = Math.round(data[minIdx - 1]?.pct ?? data[0].pct);
  const valorDepois = Math.round(data[minIdx].pct);
  const quedaPP = valorAntes - valorDepois;
  const zona = { inicio: inicioQueda, fim: fimQueda, antes: valorAntes, depois: valorDepois, quedaPP };

  function renderLabel({ x, y, index, value }) {
    const anchor = index === 0 ? "start" : index === lastIdx ? "end" : "middle";
    const dx = index === 0 ? 6 : index === lastIdx ? -6 : 0;
    return (
      <text x={x + dx} y={y - 14} textAnchor={anchor} style={{ fill: "#e2e8f0", fontSize: 11.5, fontWeight: 700 }}>
        {`${Math.round(value)}%`}
      </text>
    );
  }

  return (
    <div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="fechadoWash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CORES.marca} stopOpacity={0.28} />
                <stop offset="100%" stopColor={CORES.marca} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CORES.grade} vertical={false} />
            <XAxis
              dataKey="trimestre"
              tick={{ fill: CORES.eixo, fontSize: 11 }}
              axisLine={{ stroke: CORES.grade }}
              tickLine={false}
              padding={{ left: 18, right: 18 }}
            />
            <YAxis
              tick={{ fill: CORES.eixo, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
            />
            <ReferenceArea
              x1={inicioQueda}
              x2={fimQueda}
              fill={CORES.atencao}
              fillOpacity={0.16}
              stroke={CORES.atencao}
              strokeOpacity={0.55}
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{ value: "queda atípica", position: "insideTop", fill: CORES.atencao, fontSize: 10.5, fontWeight: 700, dy: 4 }}
            />
            <Tooltip content={<TooltipCustom zona={zona} />} cursor={{ stroke: CORES.grade }} />
            <Area type="monotone" dataKey="pct" stroke="none" fill="url(#fechadoWash)" />
            <Line
              type="monotone"
              dataKey="pct"
              stroke={CORES.marca}
              strokeWidth={2.5}
              dot={{ r: 4, fill: CORES.superficie, stroke: CORES.marca, strokeWidth: 2.5 }}
              activeDot={{ r: 6 }}
            >
              <LabelList dataKey="pct" content={renderLabel} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-500 mt-4 px-1">
        Área sombreada ({inicioQueda}→{fimQueda}): queda abrupta de {valorAntes}% para {valorDepois}% em um único
        trimestre — além do efeito natural de safra ({inicioQueda} ou {fimQueda} no gráfico mostram o porquê ao
        passar o mouse). {data[lastIdx].trimestre} segue baixo ({Math.round(data[lastIdx].pct)}%) por ser o
        trimestre mais recente, ainda dentro do lead time médio — não é um segundo agravamento.
      </p>
    </div>
  );
}
