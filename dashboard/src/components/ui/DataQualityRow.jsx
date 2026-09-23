const BADGE_STYLE = {
  critical: "bg-red-500/15 text-red-300",
  warning: "bg-amber-500/15 text-amber-300",
  info: "bg-marca/15 text-[#9db2ff]",
};

export default function DataQualityRow({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-base-900/40 px-4 py-3">
      <span
        className={`shrink-0 min-w-[52px] text-center rounded-md px-2 py-1 text-[13px] font-bold tabular-nums ${BADGE_STYLE[item.severidade]}`}
      >
        {item.qtd}
      </span>
      <div className="text-[13px] leading-relaxed">
        <b className="text-slate-100">{item.titulo}</b>
        <p className="text-slate-400 mt-0.5">{item.detalhe}</p>
        <p className="text-slate-500 text-[12px] mt-1">
          <span className="text-slate-400 font-medium">Tratamento: </span>
          {item.tratamento}
        </p>
      </div>
    </div>
  );
}
