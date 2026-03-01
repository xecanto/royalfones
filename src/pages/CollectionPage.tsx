import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollectionBackground from "@/components/CollectionBackground";
import { useProducts } from "@/hooks/use-products";
import type { Currency } from "@/lib/database.types";
import { formatPrice, currencySymbols } from "@/lib/database.types";

const CATEGORIES = ["All", "Gold", "Platinum", "Diamond", "Exotic", "Marble", "Accessories"];
const STATIC_BRANDS = ["All", "Apple", "Samsung"];

// ─────────────────────────────────────────────
// Skeleton Card
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
    </div>
  </div>
);

const CollectionPage = () => {
  const [currency, setCurrency] = useState<Currency>("AED");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeModel, setActiveModel] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const { data: allProducts = [], isLoading } = useProducts();

  // Derive unique phone models for the currently selected brand
  const phoneModels = useMemo(() => {
    const source =
      activeBrand === "All"
        ? allProducts
        : allProducts.filter((p) => (p.brand ?? "Apple") === activeBrand);
    const set = new Set(
      source.map((p) => p.phone_model ?? p.subtitle).filter(Boolean) as string[]
    );
    return ["All", ...Array.from(set).sort()];
  }, [allProducts, activeBrand]);

  const handleBrandChange = (brand: string) => {
    setActiveBrand(brand);
    setActiveModel("All");
  };

  const filtered = allProducts.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchBrand = activeBrand === "All" || (p.brand ?? "Apple") === activeBrand;
    const matchModel =
      activeModel === "All" || (p.phone_model ?? p.subtitle) === activeModel;
    return matchCategory && matchBrand && matchModel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <div ref={heroRef} className="relative min-h-[50vh] flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <CollectionBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 pb-16 pt-32"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-16 bg-primary/50" />
            <span className="font-body text-[10px] tracking-[0.5em] uppercase text-primary">
              Full Collection
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-tight">
            The{" "}
            <motion.span
              className="text-gradient-gold inline-block"
              animate={{ backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Archive
            </motion.span>
          </h1>
          <p className="font-body text-muted-foreground mt-4 max-w-lg text-sm sm:text-base leading-relaxed">
            Every creation, every edition, every masterpiece — meticulously crafted,
            numbered, and ready to become your heirloom.
          </p>
        </motion.div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-[64px] sm:top-[80px] z-40 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-4">

          {/* ── Row 1: Category + Currency ── */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-border/30 overflow-x-auto no-scrollbar">
            {/* Category pills */}
            <div className="flex items-center gap-1 shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3.5 py-1.5 text-[9px] font-body font-bold tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="active-category"
                      className="absolute inset-0 bg-gradient-gold shadow-gold-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>

            {/* Currency toggle */}
            <div className="flex items-center shrink-0 border border-border/60 overflow-hidden">
              {(Object.keys(currencySymbols) as Currency[]).map((c, i) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-1.5 text-[9px] font-body font-bold tracking-widest uppercase transition-all duration-200 ${
                    i > 0 ? "border-l border-border/60" : ""
                  } ${
                    currency === c
                      ? "bg-gradient-gold text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── Row 2: Brand + Model ── */}
          <div className="flex items-center gap-0 py-2.5 overflow-x-auto no-scrollbar">

            {/* Brand group */}
            <div className="flex items-center gap-2 pr-5 border-r border-border/40 shrink-0">
              <span className="font-body text-[8px] tracking-[0.4em] uppercase text-primary/50 mr-1 hidden sm:block">
                Brand
              </span>
              {STATIC_BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={`px-3 py-1 text-[9px] font-body font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200 ${
                    activeBrand === brand
                      ? "text-primary border-b border-primary"
                      : "text-muted-foreground hover:text-foreground border-b border-transparent"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Model group */}
            <div className="flex items-center gap-2 pl-5 flex-wrap shrink-0">
              <span className="font-body text-[8px] tracking-[0.4em] uppercase text-primary/50 mr-1 hidden sm:block">
                Model
              </span>
              {phoneModels.map((model) => (
                <button
                  key={model}
                  onClick={() => setActiveModel(model)}
                  className={`px-3 py-1 text-[9px] font-body font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200 ${
                    activeModel === model
                      ? "text-primary border-b border-primary"
                      : "text-muted-foreground hover:text-foreground border-b border-transparent"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>

            {/* Active filter count / reset */}
            {(activeBrand !== "All" || activeModel !== "All" || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setActiveBrand("All");
                  setActiveModel("All");
                }}
                className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1 text-[8px] font-body tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors border border-border/50 hover:border-primary/40"
              >
                <SlidersHorizontal size={9} />
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="relative py-16 overflow-hidden">
        <CollectionBackground />
        <div className="container mx-auto px-4 relative z-10">
          {/* Count */}
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8">
            {isLoading ? "Loading..." : `${filtered.length} piece${filtered.length !== 1 ? "s" : ""}`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
                    className="group relative"
                  >
                    {/* Border glow */}
                    <div className="absolute -inset-px bg-gradient-to-br from-primary/30 via-transparent to-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]" />

                    <div className="relative bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-500">
                      <Link to={`/collection/${product.id}`} className="block">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-108"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            <span className="px-2 py-0.5 text-[8px] font-body font-bold tracking-[0.2em] uppercase bg-gradient-gold text-primary-foreground">
                              {product.edition}
                            </span>
                            {product.limited_qty != null && product.limited_qty <= 10 && (
                              <span className="flex items-center gap-0.5 text-[8px] font-body text-primary">
                                <Sparkles size={7} />{product.limited_qty}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="font-body text-[9px] tracking-[0.3em] uppercase text-primary/70 mb-1">
                            {product.subtitle}
                          </p>
                          <h3 className="font-display text-sm font-semibold text-foreground mb-2 leading-tight">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.materials.slice(0, 2).map((mat) => (
                              <span
                                key={mat}
                                className="px-1.5 py-0.5 text-[8px] font-body tracking-wide uppercase border border-border/50 text-muted-foreground"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-display text-base font-bold text-foreground">
                              {formatPrice(product.base_price_aed, currency)}
                            </p>
                            <span className="text-[9px] font-body tracking-widest uppercase text-primary">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="px-4 pb-4 flex items-center gap-2">
                        <a
                          href={`https://wa.me/971507505279?text=I'm interested in the ${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 text-[9px] font-body font-bold tracking-[0.2em] uppercase bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          Inquire
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-body text-muted-foreground tracking-wider">
                No pieces in this category yet.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-4 font-body text-xs tracking-widest uppercase text-primary hover:underline"
              >
                View All
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionPage;
