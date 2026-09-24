import { ITENS } from "./navItems";

export default function MobileTabBar({ secaoAtiva, onSelecionar }) {
  return (
    <nav
      className="flex md:hidden items-stretch border-t border-line bg-base-900/90 backdrop-blur shrink-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação principal"
    >
      {ITENS.map(({ id, short, label, icon: Icon }) => {
        const ativo = secaoAtiva === id;
        return (
          <button
            key={id}
            onClick={() => onSelecionar(id)}
            aria-current={ativo ? "page" : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors
              ${ativo ? "text-white" : "text-slate-500"}`}
          >
            <Icon size={19} className={ativo ? "text-[#7d9bff]" : "text-slate-500"} />
            <span className="leading-none">{short ?? label}</span>
          </button>
        );
      })}
    </nav>
  );
}
