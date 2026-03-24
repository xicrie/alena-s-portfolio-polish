import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Briefcase } from "lucide-react";

const jobs = [
  {
    company: "KTS",
    role: "Контент-маркетолог (PropTech)",
    period: "2025 — настоящее время",
    description:
      "Аккредитованная IT-компания и цифровой интегратор. Разрабатывает сложные цифровые продукты для PropTech, Retail, HRTech.",
    tasks: [
      "Глубокая проработка направления PropTech: анализ ЦА, подготовка статей, кейсов и презентаций",
      "Контент для всей воронки продаж: лендинги, презентации, каталоги, рейтинги, креативы, рассылки",
      "SEO-описания, сценарии для видео, постановка ТЗ дизайнерам",
      "Верстка и размещение материалов через CMS, координация с PR и SMM",
    ],
  },
  {
    company: "DiAR",
    role: "Маркетолог",
    period: "2024 — 2025",
    description:
      "Производитель и дистрибьютор пищевого оборудования. Собственный софт для маркировки «Честный Знак». На рынке России и СНГ более 12 лет.",
    tasks: [
      "Запуск корпоративного сайта на 1С-Битрикс за 6 недель → рост посещаемости +34%",
      "Серия целевых лендингов под спецтехнику → устойчивый прирост органики",
      "Продюсирование Дзен-канала → 6,3% трафика на сайт ежемесячно",
      "B2B-витрина на Avito → первая продажа сложного оборудования через 27 дней",
      "Холодные email-цепочки: 888 писем → 47 лидов (3,27%), потенциал 7,5 млн ₽",
    ],
  },
];

const ExperienceSection = () => (
  <section className="py-20 bg-secondary/30" id="experience">
    <div className="container">
      <SectionHeading title="Опыт работы" />
      <div className="space-y-8 max-w-3xl">
        {jobs.map((job, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative pl-8 border-l-2 border-accent/30"
          >
            <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-accent" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
              <h3 className="font-display text-2xl text-foreground">{job.company}</h3>
              <span className="text-sm text-muted-foreground">{job.period}</span>
            </div>
            <p className="text-accent font-medium text-sm mb-2">{job.role}</p>
            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{job.description}</p>
            <ul className="space-y-1.5">
              {job.tasks.map((t, j) => (
                <li key={j} className="text-sm text-foreground/80 flex gap-2">
                  <span className="text-accent mt-0.5">▸</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
