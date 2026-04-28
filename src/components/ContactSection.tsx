"use client";

import { motion } from "framer-motion";
import { 
  Send, 
  Mail, 
  MapPin, 
  Phone, 
  FileText, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export default function PremiumContactSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32 font-sans text-slate-900 z-10" id="resume">

      <div className="container relative z-20 mx-auto px-6 max-w-[1150px]">
        
        {/* Хедер секции с возвращенным описанием */}
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-12 bg-amber-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
              Связь и резюме
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.2rem] leading-[1.1] text-slate-900">
            Поговорим <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">о задаче</span>
          </h2>
          <p className="mt-5 text-[1.1rem] leading-relaxed text-slate-600 max-w-2xl">
            Если вам нужен маркетинг который работает на результат — напишите. Отвечу быстро,
            разберёмся в задаче и предложу конкретный план.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* ЛЕВАЯ КАРТОЧКА: Персональные данные */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col rounded-[2.5rem] border border-white/60 bg-white/50 p-7 md:p-9 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.04)]"
          >
            {/* Блок с левитирующим фото и Именем */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              
              {/* Анимация левитации ("дыхания") */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="shrink-0 relative"
              >
                {/* Мягкая аура за фотографией */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400/30 to-violet-500/30 blur-xl scale-110" />
                
                <div className="relative w-32 h-32 rounded-3xl border-[3px] border-white shadow-lg overflow-hidden bg-slate-100 z-10">
                  <img 
                    src="/images/alena-hero.png" 
                    alt="Алёна Степанова" 
                    className="w-full h-full object-cover"
                  />
                  {/* Легкий глянцевый блик поверх фото */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
                </div>
              </motion.div>
              
              <div className="text-center sm:text-left flex flex-col justify-center h-full pt-2">
                {/* Имя + Индикатор онлайн перед ним */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <div className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-none">Алёна Степанова</h3>
                </div>
                
                {/* Плашка профессии */}
                <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-100/80 text-[0.8rem] font-bold text-amber-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  B2B Контент-маркетолог
                </div>
              </div>
            </div>

            {/* Контактная информация */}
            <div className="flex flex-col gap-3 w-full mt-auto">
              <a href="mailto:xicrie@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-white transition-all hover:bg-white hover:shadow-sm hover:border-amber-100 group">
                <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-amber-50 transition-colors">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Email</span>
                  <span className="text-[0.95rem] font-bold text-slate-700 truncate">xicrie@gmail.com</span>
                </div>
              </a>

              <a href="tel:+79777085836" className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-white transition-all hover:bg-white hover:shadow-sm hover:border-violet-100 group">
                <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-violet-50 transition-colors">
                  <Phone className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Телефон</span>
                  <span className="text-[0.95rem] font-bold text-slate-700 truncate">+7 (977) 708-58-36</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-white">
                <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Локация</span>
                  <span className="text-[0.95rem] font-bold text-slate-700 truncate">Москва, Химки / Удалённо</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ПРАВАЯ ЧАСТЬ: Telegram и Резюме */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* CTA Блок: Telegram (С градиентной кнопкой и отступами) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-10 gap-8 rounded-[2.5rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_15px_45px_rgba(15,23,42,0.03)]"
            >
              <div className="relative z-10 flex flex-col gap-3 max-w-[340px]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 shrink-0">
                    <Send className="w-5 h-5 ml-[-2px]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Telegram</h3>
                </div>
                <p className="text-[0.95rem] font-medium text-slate-600 leading-relaxed">
                  Предпочитаю общаться через Telegram. Объясню задачу — предложу подход и стоимость.
                </p>
              </div>

              <a 
                href="https://t.me/xicrie" 
                target="_blank" 
                rel="noopener noreferrer"
                // Кнопка стала сочной, фиолетово-фуксиевой, не сливается с черным текстом и имеет пространство
                className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold shadow-lg hover:shadow-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all hover:-translate-y-1 active:scale-95"
              >
                Написать Алёне
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </a>
            </motion.div>

            {/* Блок Резюме */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-7 md:p-8 gap-6 rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm transition-all hover:bg-white/60"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[1.1rem] font-bold text-slate-900 mb-0.5">Официальное резюме</h4>
                  <span className="text-[0.85rem] font-medium text-slate-500">Headhunter · Полный стек</span>
                </div>
              </div>

              <a 
                href="https://hh.ru/resume/15e56b8aff0f7041830039ed1f773150357a65" 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 w-full sm:w-auto rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-amber-300 hover:text-amber-600 transition-all shadow-sm hover:shadow-md"
              >
                Посмотреть на HH
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}