"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Опыт", href: "#experience" },
  { label: "Портфолио", href: "#cases" },
  { label: "Навыки", href: "#skills" },
  { label: "Результаты", href: "#results" },
];

export default function PremiumNavbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Логика: прячем при скролле вниз, показываем при скролле вверх
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    // 1. Абсолютно прозрачный хедер. Никаких фонов и рамок!
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-120%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] pt-6 pointer-events-none bg-transparent border-none outline-none"
    >
      {/* 2. Используем класс "container", чтобы ширина ИДЕАЛЬНО совпала с HeroSection */}
      <div className="container mx-auto flex justify-center">
        
        {/* 3. Сама парящая капсула (pointer-events-auto делает её кликабельной) */}
        <nav
          className={cn(
            "pointer-events-auto relative flex w-full items-center justify-between p-2 pl-6 md:pl-8 rounded-[2rem] transition-all duration-500",
            "bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(235,215,185,0.4)]"
          )}
        >
          
          {/* ЛОГОТИП: Лампочка */}
          <a href="#" className="flex items-center gap-4 group outline-none shrink-0 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/50 blur-[20px] rounded-full scale-150 animate-pulse" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br from-amber-400 to-orange-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <Lightbulb className="w-6 h-6 text-white fill-white/20" />
              </div>
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[1.2rem] tracking-tight text-slate-900">
                Степанова<span className="text-amber-500">.</span>
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-slate-400 font-bold mt-1">
                B2B Content & Digital
              </span>
            </div>
          </a>

          {/* ЦЕНТР: Меню (Десктоп) */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-5 py-2 text-[0.8rem] font-bold uppercase tracking-wider text-slate-500 hover:text-amber-600 transition-all duration-300 rounded-xl hover:bg-amber-50/80 cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Кнопка CTA */}
          <div className="flex items-center gap-3 relative z-10">
            <a
              href="#resume"
              className="hidden sm:flex items-center gap-2 px-7 py-3 rounded-[1.2rem] bg-white border border-[#dcd3c6] text-amber-600 text-[0.85rem] font-bold hover:bg-amber-50 hover:border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              Связаться
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </a>

            {/* Бургер меню для телефонов */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Выпадает вниз) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-[95px] left-0 right-0 pointer-events-auto md:hidden px-4"
          >
            <div className="container mx-auto">
              <div className="flex flex-col p-5 rounded-[2rem] bg-white/95 backdrop-blur-3xl border border-white shadow-2xl">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="px-6 py-4 text-[1.1rem] font-bold text-slate-800 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <div className="h-px w-full bg-[#dcd3c6]/40 my-3" />
                <a
                  href="#resume"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  Связаться <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}