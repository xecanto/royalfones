import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroPhone from "@/assets/hero-phone.jpg";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.9]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay"
    >
      {/* Parallax background image with deeper movement */}
      <motion.div
        style={{ y: imageY, scale: imageScale, rotate: imageRotate }}
        className="absolute inset-0 z-0"
      >
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src={heroPhone}
          alt="24KT Gold iPhone by Royal Fones"
          className="w-full h-full object-cover"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"
        />
      </motion.div>

      {/* Floating gold accent orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl z-[1]"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl z-[1]"
      />

      {/* Parallax content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block font-body text-xs sm:text-sm tracking-[0.4em] uppercase text-primary">
            ✦ The Epitome of Luxury ✦
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <motion.span
            className="text-gradient-gold inline-block"
            animate={{ backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Royal
          </motion.span>{" "}
          <span className="text-foreground">Fones</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="font-body text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          24KT Pure Gold · Platinum · Exotic Leather · Bespoke Designs
          <br className="hidden sm:block" />
          Limited Edition Masterpieces for the Discerning Collector
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <motion.a
            href="#collection"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(43 74% 49% / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center px-8 py-4 text-xs font-body font-semibold tracking-[0.3em] uppercase bg-gradient-gold text-primary-foreground transition-all duration-300 shadow-gold"
          >
            View Collection
          </motion.a>
          <motion.a
            href="https://wa.me/971507505279"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, borderColor: "hsl(43 74% 49%)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center px-8 py-4 text-xs font-body font-semibold tracking-[0.3em] uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Book Private Viewing
          </motion.a>
        </motion.div>

        {/* Store locations with staggered entrance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex items-center justify-center gap-6 text-muted-foreground font-body text-xs tracking-widest uppercase"
        >
          {["🇦🇪 Dubai", "🇸🇦 Saudi Arabia", "🇵🇰 Islamabad"].map((loc, i) => (
            <motion.span
              key={loc}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.2 }}
            >
              {i > 0 && <span className="inline-block w-1 h-1 rounded-full bg-primary mr-6" />}
              {loc}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border border-primary/40 rounded-full flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Bottom fade line */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="line-gold" />
      </div>
    </section>
  );
};

export default Hero;
