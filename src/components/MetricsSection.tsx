import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const metrics = [
  { value: "+34%/мес.", label: "Рост органики после запуска сайта" },
  { value: "47 лидов", label: "Из холодной email‑воронки с потенциалом в 7,5 млн ₽" },
  { value: "500+", label: "Email‑кампаний (Open Rate +18%, CTR +12%)" },
  { value: "×4,5", label: "Рост агентской сети у клиента после внедрения ЛК" },
];

const MetricsSection = () => (
  <section className="py-20 bg-background" id="results">
    <div className="container">
      <SectionHeading title="Ключевые результаты" subtitle="Измеримые достижения из реальных проектов" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border border-border"
          >
            <p className="font-display text-3xl text-accent mb-2">{m.value}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MetricsSection;
