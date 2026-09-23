import { CORES } from "../../theme";

// Uso padrão (Canais/Operação): titulo + texto corrido em children, uma só
// mensagem — funciona bem quando é um raciocínio único.
// Uso "pontos" (Visão geral): quando há mais de um insight distinto pra não
// virar um parágrafo só com tudo misturado — cada ponto é curto, com um
// destaque em negrito (o "e daí") e um detalhe de apoio opcional.
export default function InsightBanner({ titulo, children, pontos }) {
  if (pontos) {
    return (
      <div className="rounded-lg border border-line bg-base-900/40 px-4 py-3.5">
        {titulo && (
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2.5">{titulo}</div>
        )}
        <div className="flex flex-col gap-2.5">
          {pontos.map((p, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[6.5px]" style={{ background: p.cor || CORES.marca }} />
              <p className="text-[13px] leading-relaxed text-slate-300">
                <span className="font-semibold text-slate-100">{p.destaque}</span>
                {p.texto ? ` ${p.texto}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-base-900/40 px-4 py-3.5 text-[13px] leading-relaxed text-slate-300">
      {titulo && <span className="font-semibold text-slate-100">{titulo} — </span>}
      {children}
    </div>
  );
}
