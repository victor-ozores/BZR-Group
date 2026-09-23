import { motion } from "framer-motion";
import InsightBanner from "../ui/InsightBanner";
import ChannelChart from "../ui/ChannelChart";

export default function Canais({ canais }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-base-900/30 p-5">
        <div className="mb-4">
          <h2 className="text-[14px] font-semibold text-white">Volume aprovado e conversão por canal</h2>
          <p className="text-[12px] text-slate-500">Base completa (1.185 operações, não restrita à janela do template) · clique num canal para isolá-lo</p>
        </div>
        <ChannelChart canais={canais} />
      </section>

      <InsightBanner titulo="Leitura e recomendação">
        "Orgânico" é disparado o canal mais relevante em volume (760 operações, R$ 126,1M, ~64% do total), com
        conversão sólida (30,9%). "Outro" (40,6%/45,8%) e "Redes sociais" (39,2% em R$) convertem melhor, mas
        com volume bem menor — bons candidatos a teste de investimento incremental antes de escalar.
        "Remarketing" é o mais fraco nos dois critérios e o de menor volume. Como Strategic Planner, eu manteria
        "Orgânico" como base (reforçando SEO/indicação), testaria aumento controlado em Redes sociais/Outro/
        Afiliados e reduziria Remarketing — sempre cruzando com CAC real por canal antes de mudar orçamento de
        verdade (não disponível nesta base).
      </InsightBanner>
    </motion.div>
  );
}
