export default function ProcessStepper({ etapas }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {etapas.map((e, i) => (
        <div key={e.n} className="relative rounded-xl border border-line bg-base-900/50 p-4">
          <span className="text-[10.5px] font-bold tracking-wide text-marca">ETAPA {e.n}</span>
          <h3 className="text-[13.5px] font-semibold text-white mt-1">{e.titulo}</h3>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-1.5">{e.desc}</p>
          {i < etapas.length - 1 && (
            <span className="hidden lg:block absolute -right-[18px] top-1/2 -translate-y-1/2 text-slate-600 text-sm">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
