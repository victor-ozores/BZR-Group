import { motion } from "framer-motion";
import { RiTimerLine, RiTimeLine, RiPercentLine, RiStackLine, RiBarChartBoxLine } from "@remixicon/react";
import ProcessStepper from "../ui/ProcessStepper";
import InsightBanner from "../ui/InsightBanner";
import KpiCard from "../ui/KpiCard";
import Meter from "../ui/Meter";
import { ICONE } from "../../theme";
import { formatInt } from "../../utils/format";

function iconeParaKpi(label) {
  if (label.includes("Lead time médio")) return RiTimerLine;
  if (label.includes("Lead time mediano")) return RiTimeLine;
  if (label.includes("conversão")) return RiPercentLine;
  return RiBarChartBoxLine;
}

function corParaKpi(label) {
  if (label.includes("Lead time")) return ICONE.tempo;
  if (label.includes("conversão")) return ICONE.conversao;
  return ICONE.info;
}

export default function Operacao({ operacao, resumo, meta }) {
  const kpisSemPipeline = operacao.kpis.filter((k) => !k.label.startsWith("Pipeline"));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-base-900/30 p-5">
        <h2 className="text-[14px] font-semibold text-white mb-4">Processo: aprovação até liberação de recursos</h2>
        <ProcessStepper etapas={operacao.etapas} />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpisSemPipeline.map((k, i) => (
          <KpiCard
            key={k.label}
            icon={iconeParaKpi(k.label)}
            iconColor={corParaKpi(k.label)}
            label={k.label}
            value={k.valor}
            delay={i * 0.05}
          />
        ))}
        <Meter
          label="Pipeline aprovado ainda em aberto"
          icon={RiStackLine}
          valor={resumo.pipelineAberto}
          total={meta.n_linhas_total}
          corPreenchido={ICONE.pipeline}
          formatador={formatInt}
        />
      </section>

      <InsightBanner titulo="Indicadores adicionais sugeridos">
        Não calculáveis só com esta base, mas relevantes para controlar a operação:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {operacao.indicadoresSugeridos.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </InsightBanner>
    </motion.div>
  );
}
