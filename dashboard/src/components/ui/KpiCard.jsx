import { motion } from "framer-motion";
import { CORES, statusCorHex } from "../../theme";

export default function KpiCard({ label, value, sub, delta, deltaBom = true, status, icon: Icon, iconColor, delay = 0 }) {
  const corStatus = status ? statusCorHex(status) : null;
  const corDelta = deltaBom ? CORES.bom : CORES.ruim;
  // Nunca cai no azul de marca por padrão — o fundo do dashboard já é
  // azul-marinho, então ícone azul em cima dele quase desaparece. Sem
  // status nem iconColor explícitos, usa um cinza neutro simples.
  const corIcone = corStatus ?? iconColor ?? CORES.neutroForte;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-line bg-base-900/50 px-4 py-3.5 flex flex-col gap-1"
    >
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${corIcone}1f`, color: corIcone }}
          >
            <Icon size={15} />
          </span>
        )}
        <span className="text-[12px] text-slate-400 leading-snug pt-1">{label}</span>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        {corStatus && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: corStatus }} />}
        <span className="text-[22px] font-bold text-white tabular-nums">{value}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {sub && <span className="text-[11.5px] text-slate-500">{sub}</span>}
        {delta && (
          <span className="text-[11px] font-semibold tabular-nums" style={{ color: corDelta }}>
            {delta}
          </span>
        )}
      </div>
    </motion.div>
  );
}
