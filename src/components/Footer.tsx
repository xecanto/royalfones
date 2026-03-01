const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/royalfones" },
  { label: "TikTok",    href: "https://www.tiktok.com/@royalfones" },
  { label: "Threads",   href: "https://www.threads.com/@royalfones" },
  { label: "Facebook",  href: "https://www.facebook.com/royallfones" },
  { label: "X",         href: "https://twitter.com/royalfones" },
];

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      {/* Top strip */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Brand */}
          <div>
            <span className="font-display text-xl font-bold text-gradient-gold tracking-wider block mb-2">
              ROYAL FONES
            </span>
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3">
              Still the LW Champion ✦
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-xs">
              Pakistan's first luxury phones store. Dealers in 24KT gold, platinum, rhodium,
              exotic leather, and diamond-set Apple devices. Stores in Islamabad &amp; Dubai.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Contact</p>
            <ul className="space-y-3">
              <li>
                <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-0.5">Dubai 🇦🇪</span>
                <a href="https://wa.me/971507505279" target="_blank" rel="noopener noreferrer"
                  className="font-body text-sm text-foreground hover:text-primary transition-colors">
                  +971 50 750 5279
                </a>
              </li>
              <li>
                <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-0.5">Islamabad 🇵🇰</span>
                <a href="https://wa.me/923150151831" target="_blank" rel="noopener noreferrer"
                  className="font-body text-sm text-foreground hover:text-primary transition-colors">
                  +92 315 0151831
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Follow Us</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-border font-body text-[9px] tracking-[0.2em] uppercase text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href="https://www.instagram.com/channel/AbYU6UMvxUlm8EV4/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-3 py-1.5 border border-primary/40 font-body text-[9px] tracking-[0.2em] uppercase text-primary hover:bg-primary/10 transition-all duration-300"
            >
              ✦ Join IG Broadcast Channel
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-center">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} Royal Fones. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
