import { RiFileExcel2Line } from "@remixicon/react";

const TITULOS = {
  "visao-geral": ["Visão geral", "Crédito aprovado e fechado por trimestre e tipo de imóvel"],
  canais: ["Canais", "Volume e conversão por canal de aquisição"],
  operacao: ["Operação", "Processo de ponta a ponta e indicadores de controle"],
  qualidade: ["Qualidade de dados", "O que a base tinha de inconsistente e como foi tratado"],
};

export default function Header({ secaoAtiva, nLinhas }) {
  const [titulo, subtitulo] = TITULOS[secaoAtiva] ?? ["", ""];

  return (
    <header className="h-16 shrink-0 border-b border-line bg-base-950/80 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[15px] font-semibold text-white leading-tight truncate">{titulo}</h1>
        <p className="text-[12px] text-slate-500 truncate">{subtitulo}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
          <RiFileExcel2Line size={13} />
          Case_Fintech_2026.xlsx · {nLinhas ?? "—"} registros
        </span>
      </div>
    </header>
  );
}
