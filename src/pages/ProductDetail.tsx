import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageCircle, Share2, ChevronLeft, ChevronRight, Sparkles, Shield, Package, Globe, Images, Box } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Product3DViewer from "@/components/Product3DViewer";
import { useProduct, useProducts } from "@/hooks/use-products";
import type { Currency } from "@/lib/database.types";
import { formatPrice } from "@/lib/database.types";

const CURRENCIES: Currency[] = ["AED", "SAR", "PKR"];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id ?? "");
  const { data: allProducts = [] } = useProducts();
  const [currency, setCurrency] = useState<Currency>("AED");
  const [activeImg, setActiveImg] = useState(0);
  const [viewMode, setViewMode] = useState<"photos" | "3d">("photos");

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="aspect-square bg-card rounded-sm" />
            <div className="space-y-4 pt-8">
              <div className="h-3 bg-secondary w-1/4 rounded" />
              <div className="h-8 bg-secondary w-3/4 rounded" />
              <div className="h-4 bg-secondary w-1/2 rounded" />
              <div className="h-24 bg-secondary rounded" />
              <div className="h-12 bg-secondary w-40 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 text-center">
          <p className="font-display text-3xl text-foreground mb-6">Piece not found</p>
          <Link to="/collection" className="font-body text-xs tracking-widest uppercase text-primary hover:underline">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const gallery = [product.image_url, ...(product.gallery_urls ?? [])];
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const whatsappMsg = `https://wa.me/971507505279?text=I'm interested in the ${encodeURIComponent(product.name)} (${formatPrice(product.base_price_aed, currency)})`;

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 sm:pt-36 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 font-body text-[10px] tracking-[0.3em] uppercase">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <span className="text-border">/</span>
          <Link to="/collection" className="text-muted-foreground hover:text-primary transition-colors">Collection</Link>
          <span className="text-border">/</span>
          <span className="text-primary truncate max-w-[160px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* ── Left: Gallery ── */}
          <div>
            {/* View mode toggle */}
            <div className="flex mb-4 border border-border">
              <button
                onClick={() => setViewMode("photos")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] font-body font-bold tracking-[0.25em] uppercase transition-all duration-200 ${
                  viewMode === "photos"
                    ? "bg-gradient-gold text-primary-foreground shadow-gold-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Images size={11} />
                Photos
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] font-body font-bold tracking-[0.25em] uppercase border-l border-border transition-all duration-200 ${
                  viewMode === "3d"
                    ? "bg-gradient-gold text-primary-foreground shadow-gold-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Box size={11} />
                3D View
              </button>
            </div>

            {/* 3D Viewer */}
            {viewMode === "3d" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="border border-border rounded-sm overflow-hidden bg-card"
              >
                <Product3DViewer modelUrl={product.model_url} productName={product.name} phoneModel={product.phone_model} />
              </motion.div>
            )}

            {/* Main image + Thumbnails */}
            {viewMode === "photos" && (
            <>
            <div className="relative aspect-square overflow-hidden bg-card border border-border rounded-sm mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={gallery[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* Edition badge */}
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 text-[9px] font-body font-bold tracking-[0.25em] uppercase bg-gradient-gold text-primary-foreground shadow-gold-sm">
                  {product.edition}
                </span>
              </div>

              {/* Ultra-rare */}
              {product.limited_qty != null && product.limited_qty <= 10 && (
                <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 text-[9px] font-body tracking-widest uppercase border border-primary/60 text-primary backdrop-blur-sm bg-background/40">
                  <Sparkles size={9} />
                  {product.limited_qty} pieces only
                </div>
              )}

              {/* Prev / Next arrows for gallery */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/70 border border-border text-foreground hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/70 border border-border text-foreground hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square w-16 sm:w-20 overflow-hidden border transition-all duration-300 ${
                      i === activeImg ? "border-primary shadow-gold-sm" : "border-border opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            </>
            )}
          </div>

          {/* ── Right: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:pt-4"
          >
            {/* Category */}
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">
              {product.subtitle}
            </p>

            {/* Name */}
            <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4">
              {product.name}
            </h1>

            {/* Thin gold line */}
            <div className="h-px w-24 bg-gradient-to-r from-primary/60 to-transparent mb-6" />

            {/* Materials */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.materials.map((mat) => (
                <span
                  key={mat}
                  className="px-3 py-1 text-[9px] font-body tracking-[0.25em] uppercase border border-primary/30 text-primary bg-primary/[0.04]"
                >
                  {mat}
                </span>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Shield, text: "Certified Authentic" },
                { icon: Package, text: "Luxury Packaging" },
                { icon: Globe, text: "Worldwide Delivery" },
                { icon: Sparkles, text: "Handcrafted" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-muted-foreground">
                  <Icon size={13} className="text-primary flex-shrink-0" />
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase">{text}</span>
                </div>
              ))}
            </div>

            {/* Currency + Price */}
            <div className="p-5 bg-card border border-border rounded-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Starting Price
                </p>
                <div className="flex border border-border">
                  {CURRENCIES.map((c, i) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-3 py-1 text-[9px] font-body font-bold tracking-widest uppercase transition-all duration-200 ${
                        i > 0 ? "border-l border-border" : ""
                      } ${currency === c ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <p className="font-display text-4xl font-bold text-foreground mb-1">
                {formatPrice(product.base_price_aed, currency)}
              </p>
              {product.is_negotiable && (
                <p className="font-body text-[10px] tracking-widest uppercase text-primary mt-1">
                  ✦ Price is negotiable — contact us
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.a
                href={whatsappMsg}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(43 74% 49% / 0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 text-xs font-body font-bold tracking-[0.3em] uppercase bg-gradient-gold text-primary-foreground shadow-gold"
              >
                <MessageCircle size={15} />
                Inquire on WhatsApp
              </motion.a>

              <motion.button
                onClick={share}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-4 text-xs font-body font-bold tracking-[0.3em] uppercase border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Share2 size={14} />
                Share
              </motion.button>
            </div>

            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mt-4">
              Private viewings · Worldwide shipping · Bespoke commissions
            </p>
          </motion.div>
        </div>

        {/* ── Related Pieces ── */}
        {related.length > 0 && (
          <div className="mt-24 sm:mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-16 bg-primary/40" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary">
                Related Pieces
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/collection/${p.id}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-card border border-border mb-4 group-hover:border-primary/40 transition-all duration-500">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-108"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-body font-bold tracking-[0.2em] uppercase bg-gradient-gold text-primary-foreground">
                        {p.edition}
                      </span>
                    </div>
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-1">{p.subtitle}</p>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{p.name}</h3>
                    <p className="font-display text-base font-bold text-foreground">
                      {formatPrice(p.base_price_aed, currency)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Back to collection */}
        <div className="mt-16 text-center">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Full Collection
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
