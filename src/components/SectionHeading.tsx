import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
    className="mb-14 md:mb-16"
  >
    <div className="mb-5 flex items-center gap-4">
      <span className="h-px w-16 bg-accent" />
      <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
        портфолио
      </span>
    </div>

    <h2 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[0.95] tracking-tight text-foreground max-w-3xl">
      {title}
    </h2>

    {subtitle && (
      <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-2xl">
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;