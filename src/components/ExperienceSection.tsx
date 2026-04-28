"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties, FC } from "react";

// --- ТИПЫ И ДАННЫЕ ---
// Оставили только 2 тона для идеального чередования
type JobTone = "warm" | "cool";

type Job = {
  company: string;
  role: string;
  period: string;
  domain: string;
  description: string;
  points: string[];
  tone: JobTone;
};

const jobs: Job[] = [
  {
    company: "KTS",
    role: "Контент-маркетолог",
    period: "2025 — 2026",
    domain: "IT · PropTech",
    description:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и PropTech-направления.",
    points: [
      "Анализ аудитории, упаковка продукта, кейсы и экспертные материалы",
      "Контент для всей воронки: лендинги, презентации, каталоги, email и PR",
      "SEO-описания, сценарии для видео и постановка ТЗ дизайнерам",
    ],
    tone: "warm", // Желтый
  },
  {
    company: "DiAR",
    role: "Контент-маркетолог",
    period: "2024 — 2025",
    domain: "B2B · Промышленное оборудование",
    description:
      "Производитель и дистрибьютор пищевого оборудования, плюс собственный софт для маркировки.",
    points: [
      "Новый корпоративный сайт за 6 недель. Рост посещаемости на 34%",
      "Холодная B2B-цепочка: 888 писем → 47 лидов с потенциалом от 7,5 млн ₽",
      "Первая продажа оборудования через Avito за 27 дней",
    ],
    tone: "cool", // Лавандовый
  },
  {
    company: "ВИАНТ",
    role: "Маркетолог",
    period: "2023 — 2024",
    domain: "IT-интегратор",
    description:
      "Интегратор IT-решений для бизнеса. Комплексная автоматизация и цифровизация процессов.",
    points: [
      "3 корпоративных сайта и 30+ лендингов. Рост входящих заявок на 27%",
      "Запуск магазинов на Ozon и Яндекс.Маркете. Рост продаж на 38%",
      "SEO и контент с инженерами. Стабильный рост органики и переходов",
    ],
    tone: "warm", // Желтый
  },
  {
    company: "PINALL",
    role: "Контент-менеджер",
    period: "2020 — 2023",
    domain: "CRM · SaaS · Автоматизация",
    description:
      "IT-компания по внедрению CRM, интеграциям веб-сервисов и автоматизации бизнес-процессов.",
    points: [
      "500+ email-кампаний. Рост Open Rate на 18% и CTR на 12%",
      "100+ посадочных страниц. Рост конверсии и стабилизация потока лидов",
      "200+ вебинаров. Рост регистраций и вовлеченности",
    ],
    tone: "cool", // Лавандовый
  },
  {
    company: "Ранний опыт",
    role: "Контент, сайты, редактура",
    period: "до 2020",
    domain: "Контент · Администрирование",
    description:
      "Работа с сайтами, редактурой и публикациями. База, из которой вырос системный маркетинговый подход.",
    points: [
      "Контент-редактура и администрирование сайта",
      "Анализ аудитории и вакансий",
      "Работа с публикациями, структурой материалов и процессами",
    ],
    tone: "warm", // Желтый (The End)
  },
];

const toneStyles: Record<
  JobTone,
  {
    cardBackground: string;
    edgeTint: string;
    fullLight: string;
    coreLight: string;
    hoverShadow: string;
    innerGlow: string;
    roleColor: string;
    dotCore: string;
    dotGlow: string;
    dotFlash: string;
  }
> = {
  warm: {
    cardBackground: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,252,245,0.88) 100%)",
    edgeTint: "linear-gradient(180deg, rgba(255,214,120,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    fullLight: "linear-gradient(180deg, rgba(255,208,78,0.25) 0%, rgba(255,248,230,0.05) 100%)",
    coreLight: "linear-gradient(180deg, rgba(255,222,130,0.15) 0%, rgba(255,255,255,0.02) 100%)",
    hoverShadow: "0 24px 72px rgba(251,191,36,0.14)",
    innerGlow: "inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 44px rgba(251,191,36,0.12)",
    roleColor: "#d97706",
    dotCore: "#f59e0b",
    dotGlow: "rgba(251, 191, 36, 0.4)",
    dotFlash: "rgba(253, 230, 138, 0.6)",
  },
  cool: {
    // Очень мягкий, пастельный лавандовый оттенок (не кричащий синий!)
    cardBackground: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,250,255,0.88) 100%)",
    edgeTint: "linear-gradient(180deg, rgba(167,139,250,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    fullLight: "linear-gradient(180deg, rgba(167,139,250,0.15) 0%, rgba(245,243,255,0.05) 100%)",
    coreLight: "linear-gradient(180deg, rgba(196,181,253,0.12) 0%, rgba(255,255,255,0.02) 100%)",
    hoverShadow: "0 24px 72px rgba(167,139,250,0.12)",
    innerGlow: "inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 44px rgba(167,139,250,0.1)",
    roleColor: "#8b5cf6",
    dotCore: "#a78bfa",
    dotGlow: "rgba(167, 139, 250, 0.3)",
    dotFlash: "rgba(221, 214, 254, 0.5)",
  },
};

const edgeMaskStyle: CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 4%, rgba(0,0,0,0.72) 10%, #000 16%, #000 84%, rgba(0,0,0,0.72) 90%, rgba(0,0,0,0.18) 96%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 4%, rgba(0,0,0,0.72) 10%, #000 16%, #000 84%, rgba(0,0,0,0.72) 90%, rgba(0,0,0,0.18) 96%, transparent 100%)",
};

// --- УМНЫЙ ФОН (Меняет цвет в зависимости от карточки) ---
const FluidAuroraBackground: FC<{ activeTone: JobTone }> = ({ activeTone }) => {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 720);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 450);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 40 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 40 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const lightX = useTransform(smoothX, (x) => (x / (typeof window !== "undefined" ? window.innerWidth : 1440)) * 150 - 75);
  const lightY = useTransform(smoothY, (y) => (y / (typeof window !== "undefined" ? window.innerHeight : 900)) * 150 - 75);
  const oppLightX = useTransform(lightX, (x) => typeof x === 'number' ? x * -0.6 : 0);
  const oppLightY = useTransform(lightY, (y) => typeof y === 'number' ? y * -0.6 : 0);

  // Динамические цвета для фона в зависимости от текущей карточки
  const primaryLightColor = activeTone === "warm" ? "rgba(251,191,36,0.12)" : "rgba(167,139,250,0.12)";
  const secondaryLightColor = activeTone === "warm" ? "rgba(245,158,11,0.06)" : "rgba(139,92,246,0.06)";

        return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Tone-aware glow blobs — purely additive light over transparent section */}
      <motion.div
        animate={{ backgroundColor: primaryLightColor }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full blur-[130px]"
        style={{ x: lightX, y: lightY }}
      />
      <motion.div
        animate={{ backgroundColor: secondaryLightColor }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute right-[15%] bottom-[20%] h-[380px] w-[380px] rounded-full blur-[110px]"
        style={{ x: oppLightX, y: oppLightY }}
      />
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const ExperienceSection = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const snapTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = scroller.querySelectorAll<HTMLElement>("[data-exp-card]");
    const el = cards[index];
    if (!el) return;

    const left = el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2;

    scroller.scrollTo({
      left,
      behavior: "smooth",
    });
  };

  const next = () => {
    const nextIndex = Math.min(activeIndex + 1, jobs.length - 1);
    setActiveIndex(nextIndex);
    snapTo(nextIndex);
  };

  const prev = () => {
    const nextIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(nextIndex);
    snapTo(nextIndex);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const cards = Array.from(
          scroller.querySelectorAll<HTMLElement>("[data-exp-card]")
        );

        const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const center = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(center - scrollerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
        ticking = false;
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scroller.scrollBy({
          left: e.deltaY * 0.92,
          behavior: "smooth",
        });
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    onScroll();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
    };
  }, []);

  const progress = useMemo(
    () => `${activeIndex + 1} / ${jobs.length}`,
    [activeIndex]
  );

  // Получаем тон текущей активной карточки для фона
  const activeTone = jobs[activeIndex].tone;

  return (
    <section className="relative overflow-visible py-24 md:py-32">
      <style>{`
        .exp-no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .exp-no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes bulletPulse {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          30% {
            transform: scale(1.6);
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .exp-card:hover .bullet-pulse {
          animation: bulletPulse 0.5s ease-out forwards;
        }
      `}</style>

      {/* Передаем активный тон в бэкграунд */}
      <FluidAuroraBackground activeTone={activeTone} />

      <div className="container relative z-10">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-16 bg-accent" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                карьера
              </span>
            </div>

                        <h2 className="font-display text-[2.55rem] leading-[0.96] tracking-tight text-foreground md:text-[3.3rem]">
              Карьера и компании
            </h2>

            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground md:text-[1.12rem]">
              6+ лет в IT, SaaS и B2B. В каждом проекте — измеримый вклад в продажи и рост.
            </p>
          </div>

          <div className="hidden items-center gap-3 pb-5 md:flex">
            <div className="tabular-nums text-sm text-muted-foreground">
              {progress}
            </div>

            <button
              type="button"
              onClick={prev}
              disabled={activeIndex === 0}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/60 backdrop-blur-xl shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Прокрутить влево"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <button
              type="button"
              onClick={next}
              disabled={activeIndex === jobs.length - 1}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/60 backdrop-blur-xl shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Прокрутить вправо"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <div className="mx-auto max-w-[1380px] overflow-visible">
          <div className="overflow-visible" style={edgeMaskStyle}>
            <div
              ref={scrollerRef}
              className="exp-no-scrollbar flex snap-x snap-mandatory gap-7 overflow-x-auto overflow-y-visible px-[5vw] pt-[30px] pb-[68px] scroll-smooth md:px-[120px]"
            >
              {jobs.map((job, index) => {
                const isActive = index === activeIndex;
                const tone = toneStyles[job.tone];

                return (
                  <motion.article
                    key={`${job.company}-${job.period}`}
                    data-exp-card
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.46, delay: index * 0.05 }}
                    className={[
                      "exp-card group relative shrink-0 snap-center overflow-hidden rounded-[2rem]",
                      "w-[86vw] sm:w-[480px] md:w-[520px]",
                      "p-7 md:p-9 backdrop-blur-[26px]",
                      "border border-white/60",
                      isActive
                        ? "scale-[1.01] opacity-100"
                        : "scale-[0.992] opacity-[0.96]",
                      "transition-all duration-500 hover:-translate-y-1",
                    ].join(" ")}
                    style={{
                      transformOrigin: "center center",
                      background: tone.cardBackground,
                      boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 18px 50px rgba(15,23,42,0.06), ${tone.hoverShadow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 18px 50px rgba(15,23,42,0.06)";
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-[4%] rounded-[1.7rem] opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{
                        background: tone.fullLight,
                        filter: "blur(14px)",
                      }}
                    />

                    <div
                      className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{
                        boxShadow: tone.innerGlow,
                      }}
                    />

                    <div className="relative">
                      <div className="mb-7 flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <div className="text-[2.15rem] font-semibold leading-none tracking-tight text-foreground md:text-[2.25rem]">
                            {job.company}
                          </div>

                          <div
                            className="mt-4 text-[0.95rem] font-medium"
                            style={{ color: tone.roleColor }}
                          >
                            {job.role}
                          </div>
                        </div>

                        <div className="shrink-0 rounded-full bg-white/60 px-4 py-1.5 text-[0.76rem] whitespace-nowrap text-muted-foreground shadow-[0_8px_18px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                          {job.period}
                        </div>
                      </div>

                      <div className="mb-5 text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground/82">
                        {job.domain}
                      </div>

                      <p className="min-h-[74px] text-[1rem] leading-relaxed text-muted-foreground md:text-[1.02rem]">
                        {job.description}
                      </p>

                      <div className="mt-6 h-px w-full bg-white/22" />

                      <ul className="mt-6 space-y-4">
                        {job.points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-[1rem] leading-relaxed text-foreground"
                          >
                            <span className="relative mt-[0.58rem] block h-2 w-2 shrink-0">
                              <span
                                className="absolute inset-0 rounded-full transition-all duration-200 group-hover:opacity-100"
                                style={{ background: tone.dotCore }}
                              />
                              <span
                                className="absolute inset-[-3px] rounded-full opacity-0 blur-[2px] transition-opacity duration-200 group-hover:opacity-100"
                                style={{ background: tone.dotGlow }}
                              />
                              <span
                                className="absolute inset-[-5px] rounded-full opacity-0 blur-[3px] bullet-pulse"
                                style={{ background: tone.dotFlash }}
                              />
                            </span>

                            <span className="block">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-2 flex items-center justify-center gap-2 md:hidden">
        {jobs.map((_, index) => {
          // Динамический цвет точек пагинации на мобилках
          const dotColor = jobs[index].tone === "warm" ? "bg-amber-400" : "bg-violet-400";
          return (
            <button
              key={index}
              type="button"
              onClick={() => snapTo(index)}
              aria-label={`Перейти к карточке ${index + 1}`}
              className={[
                "h-2.5 rounded-full transition-all duration-300",
                index === activeIndex ? `w-8 ${dotColor}` : "w-2.5 bg-black/12",
              ].join(" ")}
            />
          )
        })}
      </div>
    </section>
  );
};

export default ExperienceSection;