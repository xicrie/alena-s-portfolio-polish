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
    className="mb-12"
  >
    <h2 className="font-display text-3xl md:text-4xl text-foreground">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
    )}
    <div className="mt-4 h-1 w-12 rounded-full bg-accent" />
  </motion.div>
);

export default SectionHeading;
