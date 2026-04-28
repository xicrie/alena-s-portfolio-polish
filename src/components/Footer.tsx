"use client";

import { motion } from "framer-motion";
import { 
  ArrowUp, 
  Cpu, 
  Globe, 
  Lightbulb
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
            <footer className="relative w-full overflow-hidden pt-20 pb-10 font-sans text-slate-900">
      {/* Single clean separator — no gradient veils */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-6 max-w-[1150px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Блок 1: Бренд */}
          <div className="md:col-span-5 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-6 group cursor-default">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 shadow-[0_4px_16px_rgba(234,179,8,0.30)] transition-transform group-hover:rotate-6">
                <Lightbulb className="w-5 h-5 text-white fill-white/20" />
              </div>
              <span className="font-bold text-[1.2rem] tracking-tight">
                Степанова<span className="text-amber-500">.</span>
              </span>
            </div>
                        <p className="text-slate-500 text-[0.95rem] leading-relaxed max-w-[320px]">
              B2B маркетинг для IT, SaaS и сложных продуктов. От смыслов — до лидов.
            </p>
          </div>

          {/* Блок 2: Навигация */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">Навигация</span>
            <a href="#experience" className="text-[0.9rem] font-medium text-slate-600 hover:text-amber-600 transition-colors w-fit">Опыт работы</a>
            <a href="#portfolio" className="text-[0.9rem] font-medium text-slate-600 hover:text-amber-600 transition-colors w-fit">Портфолио</a>
            <a href="#skills" className="text-[0.9rem] font-medium text-slate-600 hover:text-amber-600 transition-colors w-fit">Стек и AI</a>
            <a href="#results" className="text-[0.9rem] font-medium text-slate-600 hover:text-amber-600 transition-colors w-fit">Результаты</a>
          </div>

          {/* Блок 3: Engine Status */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">Ecosystem Status</span>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[0.8rem] font-bold text-slate-700">
                  <Cpu className="w-3.5 h-3.5 text-violet-500" />
                  AI Stack
                </div>
                <span className="text-[0.7rem] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["ChatGPT", "Claude", "n8n", "Cursor", "Notion AI"].map((tool) => (
                  <span key={tool} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500 font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя плашка */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="text-[0.8rem] font-medium text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} Алёна Степанова · B2B Content & Digital Marketing
            </span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />
            <span className="flex items-center gap-1.5 text-[0.8rem] font-medium text-slate-400">
              <Globe className="w-3 h-3" />
              Москва, Химки / Remote
            </span>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-amber-200 transition-all shadow-sm"
          >
            <span className="text-[0.75rem] font-bold uppercase tracking-widest">В начало</span>
            <div className="p-1 rounded-full bg-slate-50 group-hover:bg-amber-50 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            </div>
          </button>
        </div>
      </div>
      
      {/* Декоративный номер версии */}
      <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[8rem] font-bold leading-none">v.2026</span>
      </div>
    </footer>
  );
}