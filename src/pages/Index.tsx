import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const ParallaxDivider = lazy(() => import("@/components/ParallaxDivider"));
const ProductShowcase = lazy(() => import("@/components/ProductShowcase"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
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
      <Suspense fallback={<div className="h-12" />}>
        <ParallaxDivider text="24KT GOLD · PLATINUM · BESPOKE" />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <ProductShowcase />
      </Suspense>
      <Suspense fallback={<div className="h-12" />}>
        <ParallaxDivider text="ROYAL FONES · DUBAI · ISLAMABAD" />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<div className="h-12" />}>
        <ParallaxDivider text="LIMITED EDITION · HANDCRAFTED" />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
