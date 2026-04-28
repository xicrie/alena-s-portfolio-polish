import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MetricsSection from "@/components/MetricsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CasesSection from "@/components/CasesSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        
        <section id="results">
          <MetricsSection />
        </section>
        
        <section id="experience">
          <ExperienceSection />
        </section>
        
        <section id="cases">
          <CasesSection />
        </section>
        
        <section id="skills">
          <SkillsSection />
        </section>
        
        <section id="resume">
          <ContactSection />
        </section>
      </main>
      
      {/* Новый футер */}
      <Footer />
    </div>
  );
};

export default Index;