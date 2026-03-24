import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { ExternalLink, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseItem {
  title: string;
  company: string;
  type: string;
  industry: string;
  image: string;
  summary: string;
  link?: string;
  linkLabel?: string;
  details?: string[];
}

const cases: CaseItem[] = [
  {
    title: "PropTech кейс: личный кабинет брокера LEGENDA",
    company: "KTS",
    type: "Упаковка кейсов",
    industry: "IT, PropTech",
    image: "/images/chatgpt-cover.png",
    summary:
      "Упаковка кейса внедрения для IT‑компании в PropTech на примере LEGENDA: превращаю продуктовую разработку личного кабинета брокера в ясную B2B‑историю с ключевыми сценариями, интеграциями и выгодами для бизнеса.",
    linkLabel: "Релиз ожидается весной 2026",
    details: [
      "Агентский портал LEGENDA — цельная система, выверенная по сценариям и визуальному языку бренда",
      "Встречи без долгого согласования: портал учитывает график работы и занятость в Outlook-календарях",
      "Формирование презентации по конкретному лоту: данные подставляются автоматически",
      "Единый раздел партнёрства: документы, регламенты, контакты и обучение",
      "Шахматка: визуальная схема лотов на этаже с фильтрами и статусами",
      "Автоматическая проверка на уникальность через 1С, синхронизация статусов в реальном времени",
    ],
  },
  {
    title: "Аналитическая статья о PropTech‑трендах 2026",
    company: "KTS",
    type: "Статьи",
    industry: "IT, PropTech",
    image: "/images/case-article.png",
    summary:
      "Как девелоперам усилить продажи, стройку и эксплуатацию через цифровые продукты и автоматизацию. Практичный список решений, которые можно запустить за 2–4 недели.",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать статью",
    details: [
      "Усиление продаж через AI-чат-боты, ЛК брокера, VR-туры",
      "Цифровизация строительства: BIM, IoT, контроль подрядчиков",
      "Сервисы и эксплуатация: приложения для резидентов, умный дом, СКУД",
      "Быстрые решения: ЛК брокера за 3-4 недели, AI-бот за 2 недели",
    ],
  },
  {
    title: "Email-рассылка: автоматизация без долгих внедрений",
    company: "KTS",
    type: "Тексты рассылок",
    industry: "IT, PropTech",
    image: "/images/case-email-2.png",
    summary:
      "Рассылка по тёплой базе для IT-компании. Рассказываем, как запустить автоматизацию с коробочного решения или MVP за 2–3 месяца и получить эффект уже на старте.",
    details: [
      "Кейс FORMA: агентская сеть выросла в 4,5 раза, заявки в 2 раза",
      "Кейс STONE: ручная работа сокращена в 10 раз, экономия 30 часов/неделю",
      "Фокус на MVP и бизнес-результате, а не объёме функционала",
    ],
  },
  {
    title: "Email-рассылка: что девелоперы автоматизируют первыми",
    company: "KTS",
    type: "Тексты рассылок",
    industry: "IT, PropTech",
    image: "/images/case-email-1.png",
    summary:
      "Рассылка по тёплой базе с анализом PropTech-рынка: топ направлений автоматизации, дорожная карта увеличения заявок с агентского канала в 2 раза.",
    details: [
      "Продажи и CRM, цифровое строительство, сервисы для клиентов — главные треки",
      "Цифровизация агентского канала — от 60% всех продаж у заказчиков",
      "Дорожная карта: от заявки до сделки с метриками успеха",
    ],
  },
];

const CasesSection = () => {
  const [selected, setSelected] = useState<CaseItem | null>(null);

  return (
    <section className="py-20 bg-background" id="cases">
      <div className="container">
        <SectionHeading title="Портфолио" subtitle="Кейсы и примеры работ" />
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-xl bg-card border border-border overflow-hidden cursor-pointer shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all"
              onClick={() => setSelected(c)}
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{c.type}</span>
                  <span className="text-xs text-muted-foreground">{c.company} · {c.industry}</span>
                </div>
                <h3 className="font-display text-xl text-foreground mb-2 leading-snug">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{c.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[var(--shadow-elevated)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[16/9] overflow-hidden rounded-t-2xl bg-muted">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-3 h-3 text-accent" />
                      <span className="text-xs text-muted-foreground">{selected.type} · {selected.company}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{selected.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5">{selected.summary}</p>
                {selected.details && (
                  <div className="space-y-2 mb-5">
                    <p className="text-sm font-medium text-foreground">Что сделано:</p>
                    {selected.details.map((d, i) => (
                      <div key={i} className="flex gap-2 text-sm text-foreground/80">
                        <span className="text-accent mt-0.5">▸</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selected.link && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={selected.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      {selected.linkLabel || "Открыть"}
                    </a>
                  </Button>
                )}
                {!selected.link && selected.linkLabel && (
                  <p className="text-xs text-muted-foreground italic">{selected.linkLabel}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CasesSection;
