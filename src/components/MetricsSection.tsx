"use client";

import { motion, Variants } from "framer-motion";
import { Mail, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";
import type { ElementType } from "react";

type Metric = {
  value: string;
  valueNote?: string;
  headline: string;
  context: string;
  badge?: string;
  icon: ElementType;
  accent?: boolean;
};

const metrics: Metric[] = [
  {
    value: "47",
    valueNote: "лидов",
    headline: "B2B-лидогенерация",
    context:
      "Из 888 холодных писем получила 47 целевых откликов с потенциалом сделок от 7,5 млн ₽. Конверсия 5,39% — мой лучший результат в холодном сегменте.",
    badge: "Топ-кейс",
    icon: Mail,
    accent: true,
  },
  {
    value: "+34%",
    headline: "SEO и органика",
    context:
      "Устойчивый рост органического трафика на 24–34% ежемесячно за счет чистой работы со структурой и смыслами, без вложений в рекламу.",
    icon: TrendingUp,
  },
  {
    value: "+27%",
    headline: "Входящие заявки",
    context:
      "Рост конверсии за квартал после запуска 3 корпоративных сайтов и 30+ лендингов для B2B-продуктов за 1,5 месяца.",
    icon: ArrowUpRight,
  },
  {
    value: "500+",
    valueNote: "кампаний",
    headline: "Email-маркетинг",
    context:
      "Выстроила систему прогрева. Повысила открываемость (Open Rate) на 18% и кликабельность (CTR) на 12%.",
    icon: BarChart3,
  },
];

// Мягкое, спокойное зажигание без агрессивного оранжевого
const warmUpCard: Variants = {
  initial: { 
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderColor: "rgba(226, 232, 240, 0.6)",
    boxShadow: "0 0 0px rgba(245, 158, 11, 0)"
  },
  visible: {
    backgroundColor: [
      "rgba(255, 255, 255, 0.4)",   
      "rgba(254, 243, 199, 0.4)",   // Мягкая, тусклая вспышка (светло-желтый)
      "rgba(255, 255, 255, 0.5)",   
      "rgba(255, 251, 235, 0.8)"    // Итоговый нежный, спокойный свет
    ],
    borderColor: [
      "rgba(226, 232, 240, 0.6)",
      "rgba(253, 230, 138, 0.6)",
      "rgba(226, 232, 240, 0.6)",
      "rgba(253, 230, 138, 0.5)"     // Очень легкая теплая рамка
    ],
    boxShadow: [
      "0 0 0px rgba(245, 158, 11, 0)",
      "0 0 25px rgba(251, 191, 36, 0.15)", // Едва уловимый ореол при анимации
      "0 0 0px rgba(245, 158, 11, 0)",
      "0 12px 40px rgba(245, 158, 11, 0.05)" // Итоговая спокойная тень
    ],
    transition: { delay: 0.2, duration: 1.2, times: [0, 0.3, 0.5, 1], ease: "easeOut" }
  }
};

const warmUpIcon: Variants = {
  initial: { color: "rgba(15, 23, 42, 0.03)" },
  visible: {
    color: [
      "rgba(15, 23, 42, 0.03)",
      "rgba(251, 191, 36, 0.4)",     // Иконка загорается нежно, без "вырвиглазного" эффекта
      "rgba(245, 158, 11, 0.1)",     
      "rgba(245, 158, 11, 0.25)"     // Итоговый спокойный теплый цвет
    ],
    transition: { delay: 0.2, duration: 1.2, times: [0, 0.3, 0.5, 1], ease: "easeOut" }
  }
};

const MetricsSection = () => {
  return (
    // Секция прозрачная, чтобы фон сайта просвечивал постепенно и красиво
    <section id="results" className="relative z-10 py-24 md:py-32 bg-transparent">
      <div className="container mx-auto px-5 md:px-8">
        
        {/* СТРОГОЕ ВЫРАВНИВАНИЕ ЗАГОЛОВКА: классы скопированы из других экранов один-в-один */}
        <div className="mb-14 max-w-2xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-16 bg-accent" />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              результаты
            </span>
          </div>

          <h2 className="font-display text-[2.55rem] leading-[0.96] tracking-tight text-foreground md:text-[3.3rem]">
            Кейсы в цифрах
          </h2>

          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground md:text-[1.12rem]">
            Реальные показатели и рост, который я обеспечила B2B-проектам через точную продуктовую упаковку и воронки.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2">
          {metrics.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.headline}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex h-full"
              >
                <motion.div
                  variants={item.accent ? warmUpCard : undefined}
                  initial={item.accent ? "initial" : undefined}
                  whileInView={item.accent ? "visible" : undefined}
                  viewport={{ once: true }}
                  className={[
                    "relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border p-7 md:p-9 transition-transform duration-500 hover:-translate-y-1",
                    !item.accent && "border-slate-200/60 bg-white/40 shadow-sm"
                  ].filter(Boolean).join(" ")}
                >
                  <motion.div 
                    variants={item.accent ? warmUpIcon : undefined}
                    initial={item.accent ? "initial" : undefined}
                    whileInView={item.accent ? "visible" : undefined}
                    className="pointer-events-none absolute -bottom-8 -right-8 select-none z-0"
                  >
                    <Icon
                      className={[
                        "h-40 w-40 transition-transform duration-500 group-hover:scale-110",
                        !item.accent && "text-slate-900/[0.03]"
                      ].filter(Boolean).join(" ")}
                      strokeWidth={1.1}
                    />
                  </motion.div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-baseline gap-2">
                      <span className="font-display text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground">
                        {item.value}
                      </span>
                      {item.valueNote && (
                        <span className="text-base md:text-lg font-semibold text-muted-foreground">
                          {item.valueNote}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                        {item.headline}
                      </h3>
                      <p className="mt-2 md:mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                        {item.context}
                      </p>
                    </div>

                    {item.badge && (
                      <div className="mt-auto pt-8">
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;