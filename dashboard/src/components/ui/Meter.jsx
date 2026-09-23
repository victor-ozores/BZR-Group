export default function Meter({ label, valor, total, corPreenchido, formatador, icon: Icon }) {
  const pct = total > 0 ? (valor / total) * 100 : 0;
  const exibir = (v) => (formatador ? formatador(v) : v);
  return (
    <div className="rounded-xl border border-line bg-base-900/50 px-4 py-3.5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${corPreenchido}1f`, color: corPreenchido }}
            >
              <Icon size={15} />
            </span>
          )}
          <span className="text-[11.5px] text-slate-400 leading-snug pt-1">{label}</span>
        </div>
        <span className="text-[15px] font-bold text-white tabular-nums shrink-0">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: `${corPreenchido}26` }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: corPreenchido }} />
      </div>
      <span className="text-[11px] text-slate-500 tabular-nums">
        {exibir(valor)} de {exibir(total)} operações
      </span>
    </div>
  );
}
