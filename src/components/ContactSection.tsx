import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [8, 0]);

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 sm:py-32 bg-background overflow-hidden">
      {/* Background parallax glow */}
      <motion.div
        style={{ scale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          style={{ scale, opacity, rotateX, transformPerspective: 1200 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Begin Your <span className="text-gradient-gold">Journey</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Ready to own a masterpiece? Visit our stores in Dubai or Islamabad, or reach out directly
            on WhatsApp for private viewings, bespoke commissions, and exclusive orders.
          </p>
        </motion.div>

        {/* Store Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {[
            {
              flag: "🇦🇪",
              city: "Dubai, UAE",
              role: "Gulf's Premier Luxury Customization",
              phone: "+971 50 750 5279",
              wa: "https://wa.me/971507505279?text=Hello%2C%20I'd%20like%20to%20inquire%20about%20Royal%20Fones",
            },
            {
              flag: "🇵🇰",
              city: "Islamabad, Pakistan",
              role: "Pakistan's First Luxury Phones Store",
              phone: "+92 315 0151831",
              wa: "https://wa.me/923150151831?text=Hello%2C%20I'd%20like%20to%20inquire%20about%20Royal%20Fones",
            },
          ].map((store, i) => (
            <motion.div
              key={store.city}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px hsl(43 74% 49% / 0.18)", transition: { duration: 0.3 } }}
              className="p-8 bg-card border border-border rounded-sm text-center group hover:border-primary/30 transition-all"
            >
              <div className="text-4xl mb-4">{store.flag}</div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-1">{store.city}</h3>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-5">{store.role}</p>
              <a
                href={store.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 font-body text-xs font-bold tracking-[0.25em] uppercase bg-gradient-gold text-primary-foreground shadow-gold-sm hover:opacity-90 transition-opacity mb-3"
              >
                <MessageCircle size={13} />
                WhatsApp Us
              </a>
              <p className="font-body text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Phone size={11} className="text-primary" />
                {store.phone}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto p-8 bg-card border border-border rounded-sm text-center hover:border-primary/30 transition-all"
        >
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Follow the Journey</p>
          <div className="flex items-center justify-center flex-wrap gap-4">
            {[
              { label: "Instagram", href: "https://www.instagram.com/royalfones", handle: "@royalfones" },
              { label: "TikTok", href: "https://www.tiktok.com/@royalfones", handle: "@royalfones" },
              { label: "Threads", href: "https://www.threads.com/@royalfones", handle: "@royalfones" },
              { label: "Facebook", href: "https://www.facebook.com/royallfones", handle: "Royal Fones" },
              { label: "X / Twitter", href: "https://twitter.com/royalfones", handle: "@royalfones" },
              { label: "IG Channel", href: "https://www.instagram.com/channel/AbYU6UMvxUlm8EV4/", handle: "Join Now" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 px-4 py-3 border border-border hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-300 min-w-[90px]"
              >
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{s.label}</span>
                <span className="font-body text-[9px] text-muted-foreground">{s.handle}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
