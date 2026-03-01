import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import type { Currency, Product } from "@/lib/database.types";
import { formatPrice, currencySymbols } from "@/lib/database.types";
import CollectionBackground from "./CollectionBackground";

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-sm overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-secondary" />
    <div className="p-5 space-y-3">
      <div className="h-2 bg-secondary rounded w-1/3" />
      <div className="h-4 bg-secondary rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-3 bg-secondary rounded w-16" />
        <div className="h-3 bg-secondary rounded w-20" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-secondary rounded w-24" />
        <div className="h-8 bg-secondary rounded w-20" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────
const ProductCard = ({
  product,
  currency,
  index,
}: {
  product: Product;
  currency: Currency;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.93, 1, 1, 0.96]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotateX, scale, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Luxury border glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-primary/40 via-transparent to-primary/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]" />

      <div className="relative bg-card border border-border rounded-sm overflow-hidden hover:border-primary/40 transition-all duration-500">
        {/* ── Clickable area: image + info ── */}
        <Link to={`/collection/${product.id}`} className="block">
          {/* ── Image ── */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/20 to-transparent" />

            {/* Gold sweep shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            {/* Edition + negotiable badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <span className="px-3 py-1 text-[9px] font-body font-bold tracking-[0.25em] uppercase bg-gradient-gold text-primary-foreground shadow-gold-sm">
                {product.edition}
              </span>
              {product.is_negotiable && (
                <span className="px-2 py-1 text-[9px] font-body tracking-[0.2em] uppercase border border-primary/50 text-primary backdrop-blur-sm bg-background/40">
                  Negotiable
                </span>
              )}
            </div>

            {/* Ultra-rare badge */}
            {product.limited_qty != null && product.limited_qty <= 10 && (
              <div className="absolute bottom-4 right-4">
                <span className="flex items-center gap-1 px-2 py-1 text-[9px] font-body tracking-widest uppercase text-primary">
                  <Sparkles size={8} />
                  Only {product.limited_qty} Left
                </span>
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="p-5 sm:p-6 pb-3">
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary/80 mb-1">
              {product.subtitle}
            </p>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3 leading-tight">
              {product.name}
            </h3>

            {/* Material chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.materials.map((mat) => (
                <span
                  key={mat}
                  className="px-2 py-0.5 text-[9px] font-body tracking-wider uppercase border border-border/60 text-muted-foreground group-hover:border-primary/30 transition-colors duration-300"
                >
                  {mat}
                </span>
              ))}
            </div>

            <p className="font-display text-xl font-bold text-foreground">
              {formatPrice(product.base_price_aed, currency)}
            </p>
          </div>
        </Link>

        {/* ── Actions ── */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-2">
          <Link
            to={`/collection/${product.id}`}
            className="group/btn relative px-4 py-2 text-[9px] font-body font-bold tracking-[0.25em] uppercase overflow-hidden border border-primary/40 text-primary hover:border-primary hover:text-primary-foreground transition-colors duration-300"
          >
            <span className="relative z-10">View</span>
            <span className="absolute inset-0 bg-gradient-gold scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300" />
          </Link>

          <a
            href={`https://wa.me/971507505279?text=I'm interested in the ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2 text-[9px] font-body font-bold tracking-[0.25em] uppercase bg-gradient-gold text-primary-foreground shadow-gold-sm hover:opacity-90 transition-opacity duration-300"
          >
            Inquire
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────
const ProductShowcase = () => {
  const [currency, setCurrency] = useState<Currency>("AED");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [0.92, 1]);

  const { data: products = [], isLoading } = useProducts();
  const showcaseProducts = products.slice(0, 6);
  const hasMore = products.length > 6;

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative py-24 sm:py-36 bg-background overflow-hidden"
    >
      {/* ── Animated Collection Background ── */}
      <CollectionBackground />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity, scale: headerScale }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-r from-transparent to-primary/60"
              style={{ width: 80 }}
            />
            <span className="font-body text-[10px] tracking-[0.5em] uppercase text-primary whitespace-nowrap">
              ✦ Exclusive Collection ✦
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-l from-transparent to-primary/60"
              style={{ width: 80 }}
            />
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-bold text-foreground mb-5 leading-tight">
            Masterpieces in{" "}
            <motion.span
              className="text-gradient-gold inline-block"
              animate={{ backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Gold
            </motion.span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Each piece is meticulously handcrafted using the finest materials on earth —
            a truly unique expression of luxury, culture, and artistry.
          </p>

          {/* Currency toggle */}
          <div className="mt-10 inline-flex items-center gap-0 border border-border">
            {(Object.keys(currencySymbols) as Currency[]).map((c, i) => (
              <motion.button
                key={c}
                onClick={() => setCurrency(c)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2.5 text-[10px] font-body font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
                  i > 0 ? "border-l border-border" : ""
                } ${
                  currency === c
                    ? "bg-gradient-gold text-primary-foreground shadow-gold-sm"
                    : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : showcaseProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  index={i}
                />
              ))}
        </div>

        {/* ── Explore More CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground whitespace-nowrap">
              {hasMore ? `${products.length - 6} more pieces await` : "Discover more"}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
          </div>

          <Link
            to="/collection"
            className="group inline-flex items-center gap-4 px-12 py-5 font-body text-xs font-bold tracking-[0.35em] uppercase border border-primary text-primary hover:bg-gradient-gold hover:text-primary-foreground hover:border-transparent transition-all duration-400 shadow-gold hover:shadow-gold"
          >
            Explore Full Collection
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </Link>

          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mt-5">
            Private viewings available · Worldwide shipping · Bespoke commissions
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
