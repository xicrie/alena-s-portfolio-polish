import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => (
  <section className="py-20 bg-background" id="resume">
    <div className="container">
      <SectionHeading title="Контакты и резюме" />
      <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3 text-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>Москва · удалённо</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Mail className="w-4 h-4 text-accent" />
            <a href="mailto:xicrie@gmail.com" className="hover:text-accent transition-colors">
              xicrie@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Send className="w-4 h-4 text-accent" />
            <a
              href="https://t.me/xicrie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              @xicrie
            </a>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Phone className="w-4 h-4 text-accent" />
            <a href="tel:+79777085836" className="hover:text-accent transition-colors">
              +7 (977) 708-58-36
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl bg-card border border-border p-6 shadow-[var(--shadow-card)] flex flex-col items-start gap-4"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            Открыта к предложениям по контент-маркетингу, CRM-коммуникациям и AI-автоматизации процессов в B2B.
          </p>
          <Button variant="default" size="lg" className="gap-2" asChild>
            <a href="https://t.me/xicrie" target="_blank" rel="noopener noreferrer">
              <Send className="w-4 h-4" />
              Написать в Telegram
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Материалы портфолио адаптированы из Notion-экспорта.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
