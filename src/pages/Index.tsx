import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ParallaxDivider from "@/components/ParallaxDivider";
import ProductShowcase from "@/components/ProductShowcase";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const GoldParticlesBackground = lazy(
  () => import("@/components/GoldParticlesBackground")
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <GoldParticlesBackground />
      </Suspense>
      <Navbar />
      <Hero />
      <ParallaxDivider text="24KT GOLD · PLATINUM · BESPOKE" />
      <ProductShowcase />
      <ParallaxDivider text="ROYAL FONES · DUBAI · ISLAMABAD" />
      <AboutSection />
      <ParallaxDivider text="LIMITED EDITION · HANDCRAFTED" />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
