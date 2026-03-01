import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Phone } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (
    e: React.MouseEvent,
    href: string
  ) => {
    if (!href.startsWith("/#")) return; // let React Router handle normal links
    e.preventDefault();
    const id = href.slice(2); // strip "/#"
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      // Navigate home first, then scroll after the page mounts
      navigate("/");
      setTimeout(() => scrollToSection(id), 120);
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {/* # add image before logo /favicon.png */}
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Royal Fones Logo" className="w-10 h-10 object-cover object-center" />

            <span className="font-display text-xl sm:text-2xl font-bold text-gradient-gold tracking-wider">
              ROYAL FONES
            </span>

            {/* <div className="text-center md:text-left">
            <span className="font-display text-lg font-bold text-gradient-gold tracking-wider">
            ROYAL FONES
            </span>
            <p className="font-body text-xs text-muted-foreground mt-1 tracking-wider">
              The Epitome of Luxury
            </p>
          </div> */}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = !link.href.startsWith("/#") && location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Social + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.instagram.com/royalfones"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/971507505279"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-body font-semibold tracking-widest uppercase bg-gradient-gold text-primary-foreground rounded-none hover:opacity-90 transition-opacity"
            >
              <Phone size={14} />
              Inquire
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-dark border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false); }}
                    className="font-display text-lg text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="line-gold mt-2" />
              <a
                href="https://wa.me/971507505279"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-body font-semibold tracking-widest uppercase bg-gradient-gold text-primary-foreground"
              >
                <Phone size={14} />
                WhatsApp Inquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
