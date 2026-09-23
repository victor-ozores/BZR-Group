import { motion } from "framer-motion";
import { RiMoneyDollarCircleLine, RiCheckDoubleLine, RiTimerLine, RiStackLine } from "@remixicon/react";
import KpiCard from "../ui/KpiCard";
import InsightBanner from "../ui/InsightBanner";
import StackedQuarterChart from "../ui/StackedQuarterChart";
import ClosedTrendChart from "../ui/ClosedTrendChart";
import { formatBRL, formatPct, formatInt } from "../../utils/format";
import { statusPctFechado, CORES, ICONE } from "../../theme";

export default function VisaoGeral({ resumo, porTrimestre }) {
  const primeiro = porTrimestre[0];
  const ultimo = porTrimestre[porTrimestre.length - 1];
  const crescimentoPct = ((ultimo.aprovado - primeiro.aprovado) / primeiro.aprovado) * 100;
  const statusFechado = statusPctFechado(resumo.pctFechadoValor);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={RiMoneyDollarCircleLine}
          iconColor={ICONE.dinheiro}
          label="Crédito aprovado na janela (Q3-24–Q4-25)"
          value={formatBRL(resumo.totalAprovado, { compact: true })}
          sub={`${formatInt(resumo.nOperacoesJanela)} operações`}
          delta={`${crescimentoPct >= 0 ? "+" : ""}${crescimentoPct.toFixed(0)}% desde ${primeiro.trimestre}`}
          deltaBom={crescimentoPct >= 0}
          delay={0}
        />
        <KpiCard
          icon={RiCheckDoubleLine}
          label="Fechado com data válida, mesma janela"
          value={formatBRL(resumo.totalFechado, { compact: true })}
          sub={`${formatPct(resumo.pctFechadoValor)} do valor aprovado`}
          status={statusFechado}
          delay={0.05}
        />
        <KpiCard
          icon={RiTimerLine}
          iconColor={ICONE.tempo}
          label="Lead time aprovação → fechamento"
          value={`${resumo.leadTimeMedioDias.toFixed(1).replace(".", ",")} dias`}
          sub={`mediana: ${resumo.leadTimeMedianoDias.toFixed(0)} dias`}
          delay={0.1}
        />
        <KpiCard
          icon={RiStackLine}
          iconColor={ICONE.pipeline}
          label="Pipeline aprovado ainda sem fechamento"
          value={formatInt(resumo.pipelineAberto)}
          sub="de 1.185 operações (base completa)"
          delay={0.15}
        />
      </div>

      <section className="rounded-xl border border-line bg-base-900/30 p-5">
        <div className="mb-1">
          <h2 className="text-[14px] font-semibold text-white">Crédito aprovado por trimestre e tipo de imóvel</h2>
          <p className="text-[12px] text-slate-500">Barras empilhadas em R$ · rótulo no topo é o total do trimestre (ou da seleção, se filtrado) · clique na legenda para filtrar (pode selecionar mais de um)</p>
        </div>
        <StackedQuarterChart porTrimestre={porTrimestre} />
      </section>

      <section className="rounded-xl border border-line bg-base-900/30 p-5">
        <div className="mb-1">
          <h2 className="text-[14px] font-semibold text-white">% do valor aprovado já fechado, por trimestre de aprovação</h2>
          <p className="text-[12px] text-slate-500">Queda parcialmente natural (safra recente), mas persiste além do esperado em Q3-25</p>
        </div>
        <ClosedTrendChart porTrimestre={porTrimestre} />
      </section>

      <InsightBanner
        titulo="Conclusão"
        pontos={[
          {
            cor: CORES.bom,
            destaque: "Crédito aprovado cresceu ~7x em 6 trimestres (R$ 9,0M → R$ 62,9M).",
            texto: `Puxado por apartamentos (45–58%) e casas (35–43%); "sem tipo informado" caiu de 3,0% para 0% do volume — cadastro melhorando.`,
          },
          {
            cor: CORES.atencao,
            destaque: "% fechado caindo além do esperado por efeito de safra.",
            texto: `Mediana de ${resumo.leadTimeMedianoDias.toFixed(0)} dias para fechar explica parte da queda, mas ela persiste em Q3-25 — sinal de desaceleração real no funil, não só maturação recente.`,
          },
          {
            cor: ICONE.info,
            destaque: 'Leitura de "fechado" tem uma limitação de qualidade de dado.',
            texto: "Ver seção Qualidade de dados para o detalhe.",
          },
        ]}
      />
    </motion.div>
  );
}
