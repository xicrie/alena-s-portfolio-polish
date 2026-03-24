import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const groups = [
  {
    title: "Контент и копирайтинг",
    items: ["B2B-статьи и кейсы", "Лендинги", "Email-рассылки", "Презентации", "SEO-тексты", "Сценарии для видео", "PR-материалы"],
  },
  {
    title: "Маркетинг и аналитика",
    items: ["CRM-маркетинг", "Email-воронки", "Таргетированная реклама", "Посевы", "Яндекс.Метрика", "Google Analytics", "Сквозная аналитика"],
  },
  {
    title: "Инструменты",
    items: ["1С-Битрикс", "Tilda", "Figma", "Notion", "n8n", "ChatGPT / AI", "Avito", "Яндекс.Дзен"],
  },
  {
    title: "Отрасли",
    items: ["IT / SaaS", "PropTech", "HRTech", "Retail", "Пищевое производство", "B2B-услуги"],
  },
];

const SkillsSection = () => (
  <section className="py-20 bg-secondary/30" id="skills">
    <div className="container">
      <SectionHeading title="Навыки и инструменты" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl bg-card border border-border p-5 shadow-[var(--shadow-card)]"
          >
            <h3 className="font-display text-lg text-foreground mb-3">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <span
                  key={item}
                  className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
