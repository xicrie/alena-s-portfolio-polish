import { motion } from "framer-motion";
import { ArrowDown, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 bg-secondary/40" />
    <div className="container relative z-10 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            Портфолио
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6">
            Алена
            <br />
            Степанова
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-body mb-3">
            B2B контент- и CRM-маркетолог
          </p>
          <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
            6+ лет помогаю IT‑интеграторам, SaaS и производственным компаниям превращать сложные продукты в понятные лендинги, рассылки и контент, которые приводят заявки. Рутину перевожу в AI‑сценарии на n8n.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="#cases">
                <ArrowDown className="w-4 h-4" />
                Посмотреть кейсы
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="https://t.me/xicrie" target="_blank" rel="noopener noreferrer">
                <Send className="w-4 h-4" />
                Написать в Telegram
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href="#resume">
                <FileText className="w-4 h-4" />
                Скачать резюме
              </a>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex justify-center"
        >
          <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
            <img
              src="/images/photo-alena.jpg"
              alt="Алена Степанова"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
