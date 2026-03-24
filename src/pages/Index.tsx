import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MetricsSection from "@/components/MetricsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CasesSection from "@/components/CasesSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => (
  <>
    <Navbar />
    <main className="pt-14">
      <HeroSection />
      <MetricsSection />
      <ExperienceSection />
      <CasesSection />
      <SkillsSection />
      <ContactSection />
    </main>
    <footer className="py-6 border-t border-border">
      <div className="container text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Алена Степанова · Портфолио
      </div>
    </footer>
  </>
);

export default Index;
