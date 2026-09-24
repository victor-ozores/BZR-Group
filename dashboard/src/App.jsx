import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDashboardData } from "./hooks/useDashboardData";
import Sidebar from "./components/shell/Sidebar";
import Header from "./components/shell/Header";
import MobileTabBar from "./components/shell/MobileTabBar";
import VisaoGeral from "./components/sections/VisaoGeral";
import Canais from "./components/sections/Canais";
import Operacao from "./components/sections/Operacao";
import QualidadeDados from "./components/sections/QualidadeDados";

export default function App() {
  const { data, error } = useDashboardData();
  const [secaoAtiva, setSecaoAtiva] = useState("visao-geral");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-base-950">
        Erro ao carregar dados: {error.message}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-base-950">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      <Sidebar secaoAtiva={secaoAtiva} onSelecionar={setSecaoAtiva} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header secaoAtiva={secaoAtiva} nLinhas={data.meta.n_linhas_total} />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5 scroll-panel">
          <AnimatePresence mode="wait">
            {secaoAtiva === "visao-geral" && (
              <VisaoGeral key="visao-geral" resumo={data.resumo} porTrimestre={data.porTrimestre} />
            )}
            {secaoAtiva === "canais" && <Canais key="canais" canais={data.canais} />}
            {secaoAtiva === "operacao" && (
              <Operacao key="operacao" operacao={data.operacao} resumo={data.resumo} meta={data.meta} />
            )}
            {secaoAtiva === "qualidade" && <QualidadeDados key="qualidade" itens={data.qualidadeDados} />}
          </AnimatePresence>
        </main>
        <MobileTabBar secaoAtiva={secaoAtiva} onSelecionar={setSecaoAtiva} />
      </div>
    </div>
  );
}
