import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crown, Shield, Gem, Globe, Trophy, Sparkles } from "lucide-react";

const features = [
  {
    icon: Crown,
    title: "Pakistan's First",
    description: "Proudly Pakistan's first luxury phones store — pioneering Gulf-level opulence in South Asia since day one.",
  },
  {
    icon: Shield,
    title: "Certified 24KT Gold",
    description: "Authentic 24 Karat pure gold plating, platinum, rhodium, and exotic materials — verified and hallmarked.",
  },
  {
    icon: Gem,
    title: "Rarest Materials",
    description: "Nile crocodile leather, VS-clarity diamonds, Italian marble, carbon fiber — only the extraordinary makes the cut.",
  },
  {
    icon: Trophy,
    title: "Celebrity Endorsed",
    description: "Trusted by Pakistan Super League stars, Lahore Qalandars, Shaheen Shah Afridi, and global collectors.",
  },
  {
    icon: Sparkles,
    title: "World's First Editions",
    description: "We regularly debut \"never seen before\" creations — often the world's first — limited to as few as 7 pieces.",
  },
  {
    icon: Globe,
    title: "Dubai & Islamabad",
    description: "Physical stores in Dubai (UAE) and Islamabad (Pakistan), serving clients across the Gulf and South Asia.",
  },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.35], [-120, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.35], [120, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ["0%", "100%"]);

  return (
<>
    <div className="line-gold w-full" />
    <section ref={sectionRef} id="about" className="relative py-20 sm:py-32 bg-secondary overflow-hidden">
      
      {/* Parallax background glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - parallax from left */}
          <motion.div style={{ x: leftX, opacity: sectionOpacity }}>
            <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Pakistan's First{" "}
              <span className="text-gradient-gold">Luxury</span> Phones Store
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Royal Fones redefines luxury in mobile technology. We specialize in transforming flagship Apple devices —
              iPhone 17 Pro Max, Apple Watch Ultra, AirPods Pro — into unparalleled works of art using authentic
              24KT pure gold, platinum, rhodium, exotic crocodile leather, diamonds, and marble finishes.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Proudly Pakistan's first luxury phones store, with physical locations in Islamabad and Dubai,
              we bring Gulf-level opulence to South Asia and beyond. From bespoke one-of-one commissions to strictly
              numbered limited editions — some as rare as 7 pieces worldwide — every Royal Fones piece is
              crafted for those who demand exclusivity.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              We have collaborated with legends like Shaheen Shah Afridi and the Lahore Qalandars, and our
              signature editions have debuted as \"world's first\" creations on the global stage.
              We don't just customise phones — we create heirlooms.
            </p>
            <motion.div style={{ width: lineWidth }} className="h-px bg-gradient-to-r from-primary/60 to-transparent" />
          </motion.div>

          {/* Right - Features, parallax from right */}
          <motion.div style={{ x: rightX, opacity: sectionOpacity }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, borderColor: "hsl(43 74% 49% / 0.5)", transition: { duration: 0.3 } }}
                className="p-6 bg-card border border-border rounded-sm transition-all duration-300 group"
              >
                <div>
                  <feature.icon
                    size={28}
                    className="text-primary mb-4 group-hover:glow-gold transition-all duration-300"
                  />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    <div className="line-gold w-full" />
    </>
  );
};

export default AboutSection;
