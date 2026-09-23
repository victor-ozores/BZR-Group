import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RiErrorWarningLine, RiFlagLine, RiAlarmWarningLine, RiShieldCheckLine } from "@remixicon/react";
import DataQualityRow from "../ui/DataQualityRow";
import KpiCard from "../ui/KpiCard";
import { CORES, ICONE } from "../../theme";
import { formatInt } from "../../utils/format";

const SEVERIDADES = [
  { chave: "critical", label: "Crítico", cor: CORES.ruim },
  { chave: "warning", label: "Atenção", cor: CORES.atencao },
  { chave: "info", label: "Info", cor: ICONE.info },
];

export default function QualidadeDados({ itens }) {
  const [filtro, setFiltro] = useState("todos");

  const contagens = useMemo(() => {
    const c = { critical: 0, warning: 0, info: 0 };
    itens.forEach((i) => {
      c[i.severidade] = (c[i.severidade] || 0) + 1;
    });
    return c;
  }, [itens]);

  const totalOcorrencias = useMemo(() => itens.reduce((s, i) => s + i.qtd, 0), [itens]);

  const visiveis = filtro === "todos" ? itens : itens.filter((i) => i.severidade === filtro);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={RiErrorWarningLine}
          iconColor={ICONE.info}
          label="Tipos de problema"
          value={itens.length}
          sub="encontrados na base"
          delay={0}
        />
        <KpiCard
          icon={RiFlagLine}
          iconColor={ICONE.info}
          label="Ocorrências sinalizadas"
          value={formatInt(totalOcorrencias)}
          sub="linhas, com possível sobreposição"
          delay={0.05}
        />
        <KpiCard
          icon={RiAlarmWarningLine}
          label="Problemas críticos"
          value={contagens.critical || 0}
          sub="todos sinalizados e tratados"
          status="ruim"
          delay={0.1}
        />
        <KpiCard
          icon={RiShieldCheckLine}
          label="Linhas excluídas da base"
          value="0"
          sub="tudo tratado, nada removido"
          status="bom"
          delay={0.15}
        />
      </section>

      <section className="rounded-xl border border-line bg-base-900/30 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-semibold text-white">Qualidade de dados encontrada na base</h2>
            <p className="text-[12px] text-slate-500">
              Todas as contagens abaixo também existem como fórmulas vivas na planilha de resposta do case.
            </p>
          </div>
          <div className="inline-flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por severidade">
            <button
              type="button"
              onClick={() => setFiltro("todos")}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${filtro === "todos" ? "bg-marca border-marca text-white" : "border-line text-slate-400 hover:text-slate-200"}`}
            >
              Todos ({itens.length})
            </button>
            {SEVERIDADES.map((s) => (
              <button
                key={s.chave}
                type="button"
                onClick={() => setFiltro(s.chave)}
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${filtro === s.chave ? "bg-marca border-marca text-white" : "border-line text-slate-400 hover:text-slate-200"}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.cor }} />
                {s.label} ({contagens[s.chave] || 0})
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {visiveis.map((item) => (
            <DataQualityRow key={item.titulo} item={item} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
