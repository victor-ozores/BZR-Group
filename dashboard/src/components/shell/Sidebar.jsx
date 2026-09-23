import { RiPieChart2Line, RiShareForwardLine, RiFlowChart, RiShieldCheckLine } from "@remixicon/react";
import logo from "../../assets/bzr-logo.svg";

const ITENS = [
  { id: "visao-geral", label: "Visão geral", icon: RiPieChart2Line },
  { id: "canais", label: "Canais", icon: RiShareForwardLine },
  { id: "operacao", label: "Operação", icon: RiFlowChart },
  { id: "qualidade", label: "Qualidade de dados", icon: RiShieldCheckLine },
];

export default function Sidebar({ secaoAtiva, onSelecionar }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-base-900/60 border-r border-line">
      <div className="h-16 flex items-center justify-center px-5 border-b border-line">
        <img src={logo} alt="BZR Group" className="h-7 w-auto" />
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {ITENS.map(({ id, label, icon: Icon }) => {
          const ativo = secaoAtiva === id;
          return (
            <button
              key={id}
              onClick={() => onSelecionar(id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left
                ${ativo ? "bg-marca/15 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
              style={ativo ? { color: "#dbe4ff" } : undefined}
            >
              <Icon size={18} className={ativo ? "text-[#7d9bff]" : "text-slate-500"} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
