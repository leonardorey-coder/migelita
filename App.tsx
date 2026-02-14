import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Assets & Data ---
const IMAGES = {
  coupleHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg_mFgrvj5eSq2rzp2KLC4CwUS9hRTi1eAvg6jD6nMT8TIdr6d9ptznrQM1mhx6ObU_-EWT5pTlom6sGKdXRf6AsTv7c-0Hu0-z0ICx1RIMoDI0BXksokE1i0DaLkiptl_cFf8zg07LybixfsFxWo4RnBG8ortZMfo72YESzHKWl_owpROzGkWDC-1zLFLQOkZ_RkUA8mqX6oCuwXFvhKs5BrwrOJaFB6KnPtYSGgqPMPvRx1Lsj3_Od1KbgCjvc0eojRULI0JP68",
  detailVase: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ7JLcPV2Z6imx3HwvrlipXL9n2uehxOPCIvHbesQrJBhqvYURM6SJGdf-cdP1Q7vFc9ADW92RLW76Vjh6rcc9_d-Gbget_Ln7ItJC8TLLpuJ_Vhqrr1iFb05T3-Xxf4RsKGzSOA0mvMQG5dk2K5T1ctvdHTh9Bp4BCX55OJCHvvrbyYUu3YgKH4n0Bw7sr5yXtuCT52bK6D8JagJnyGDbmgcn80y5zPp7kDPodpiRRnr90_K2nqMQtpfPjboAcIMd66Ykfosm2Ns",
  moodM: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT_qw_v1UbosE_rNwjLhVQWJzBPNuF1TT4j8QDA9z0iuwE5FrWTqHw-9MlHjHqtO3NJsxmwx4aPNd2JE-OG9uvvQYL5sDfVohQvWxbIna19WOB1vb1Z0U4j3e0eAo7RUtw5wgKONVXaLi581Vxqw6dX9366yyQ3njmRix6h3WjhnXRqMmWfK72h1Nm2nqc-pN6iGPbDYm7hUuhvAmf0R73E5f1Kb1lqXUSrQ9LdfnP-Lcaq1Md039Z0IfX7wi1gE1id-MGA84m7Ew",
  moodO: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXs7p3PnU8cqTD2rRCR_UTEEeY3w3xo_njiFpkSLm0L8KTnTyLlkkAnLhsVPvhEPYmPPgpDiB11ZVQwmEUSC3fIs7odLPBFKifXKaIu9FrJfa4zwGNjjUHhTYf-Z-zfcKYY4RF_waroEpwWACZxQop2Orj41oo8ZzNe6vh_7j9m-vJeWyU3dXhRrxVWoBlvjx6dXmfSNdi01Yv0Kpx6dxKOIXjZAvPhb2DHAVDuBcH2ETrjR-WYmHr5doe5gdPqrBOmg56IpfwLCk",
  moodR: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwfs2rZDDrhzDA3zLr0rfk3gGu1FgGOrm0h5KavQzBP3lPxnP_lAs7WZXZwINlT_UAmUtwO9_n8ZWiTxAhDd6XGKfNejYqnRSrIs45EmcbCqOprJUYZP84JG3EjfKrNTX14VbCVmc6sPgkVzNKkeo5Y53BdFCoMaK11O7QMhObUUgD9m7N3-y-ijMddTPelurb3RWupwM1xfou7Ag5Bomnho_NKVPBnVCy7-ebtlKe6QB4Jmj2C5Is64r0UX-UNWA6Xhsk287-xuc",
  galleryHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjWZGe7rJeMJaSZsUfhLopbfkrfknG_qCKplIoBJJUCV-FiV8m8gpfjpT3Hfh1ijRKz5D_gEcYXjKxwz4Ij1ttgbuywhRq5ux00we5x0Hhjbk4Q4JAUfEys718v6HLvuUEodtvCXjVeNDMCwSzNu_RRGzmdogCyR813cn8NPQ-nqLuEv-HCexGHHBQMhYVG8WuFQR47fYaA3rlF8ipHKfDAKZxz7tYpTl_HdfVzecyoCosl4xHAg_lda-TkAeuG2V-kru2VkZCa3U",
  gallerySunset: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoyobMeEEQu9jvwO6AtHrOTD9wEkJYlsvTD7DoFEG3Umv4uTTbpgPbFKs_wkI9RWl2SaMyFOQ3GFcYBuGUpTR4_eQn_5lnauu6Q-nm8UUVpINksCauGmj_zXUmuUEWqgj2-cC1UY83kVFyyz3MrLierMVcnhzhdG117jT8ZvugJsVEhn_OyCb5L9LzTB9wdbg6PJfhoiS9BzDu10KaRwses4L5UGXktuR-FK1hWMENzOfzFkEhwigzNAeO1UyajvXbxdye-bL-S14",
  galleryFlower: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbaGpI8PHnjfVnQM2EcZaQkv2hyDrIG6ImeR26Dym3ZDqcU2dT91OnuuuwkE6-hbWe7FFBM3gM4V51mbf3aDFg5hzL-OLomV6F6-uYbV7FYcUdX9LS-drM1uVdGvUcQQWfhymf5qhMdrbum1UcC-qA3AK9503VZ6D_0blNLyjsg3pWmyeq5G9R6GgXcAQFXNCzF-k7NLlPkH7wZFBjLNa22sgR7bjl4tyZ92l7WVmZfOG2qECKdAffeReuu28JSYnzlgkjl-wOkwo",
  galleryHands: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgXTSh2rS6Ho3ZUCI21BbZRwJ57wBvHwDHeHlN1xAXBbfTK_tsgFMoMEaLNJDZdgfoj0eL6Pvc7Yyx9LpvgmO-ROUEVIQ6IjmG5lnn8KzcjTJoZel5-sqnlqUgXHcbOw93M5gM5nZGVSgp8ZpnFTRgLIExAvfm356BN4bZlYrHTtN6BWvIYRdTfd3cBM0Q6cY2TkzSyQrO1at7Y_Zl918WMIm0Qv2AowjP7S77CDv3SaSpi7z9mNP-1QnueSzqb2BQZSpf1nOnAx4",
  galleryCity: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6cto2ZfWptLVWepFk4QpDe7ovuQQop4vbZ7dknKmC7JXE6NB5JDrI8_0CFLFF5H-fqupZ_uQQxk6YA_U37f7EL0xtwPmlm1wfxs3VBBvLawCE8PD-m-tBoCypQUUMlE4Pyv4zRLKdeeE2XtojR-lZYwVxs5Fbh4RL-QlZJcrEbSKRW_uOnb5fiy6fUuXV7fx9pSm-mGI7pzDEACpxxe7wsiCgEO8pMt8YQt1U1XGbfbNdKR_yGcgfFduVCefcpxW2fArKSsPACI",
  galleryCoffee: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlVFuWQW-ZZTDFgm8ZNK3Sk0qsj3dtSpGTSxQnc08YLEPqnwNyWgMqj4Eta09Ti1Ms-YViOAMeIJiSRDufHVk5XLFveHkN2IEvmh9eg4tqrLCLZEgYu42bT6_2PqVFllDpiDNyzmnQt7kX-kwTrohrLLjkoSZXcqw7dYLPoFmsbGC8BVpfNmuAmWyAnF0EOGGk8gmwYbMKpPvrEZHkVlcGhrnZuSq5ItVaMhyUlZ_-lBs9Pqgafrnc9WMElVjCoV2DtmGkk_cZa68",
  galleryBeach: "https://lh3.googleusercontent.com/aida-public/AB6AXuCodzfHyrzZ8bJBBxixQC98qbINUF_jK1YbQt3cJdWSDvQyEoxhm9g4x0hJthnjQvgBu3O7eAzX-0zZ6-pQfUESBPVzlvK5eVTLvQUa-vw5XEqUU6RKiRN1MZbjelQ4reyXEa6sQIjX_t7ZpYREwwl-W3VrWZ5gCehENneViKMxJjwLR-ox6F1JhXbeNJmXCgUTPlxYYN_Mac8bjF3SqGtVyb7iEUZqMF4JI1eaaI9HUvu4L0FjCW1NQCaneBm-eQSqbI_zcrRzr8g",
};

// --- Parallax Hook ---
// Listens to the scroll container and returns a function that calculates
// the parallax offset for a given element ref and speed factor.
function useParallax() {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollTop(container.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const getParallaxStyle = useCallback((elementRef: React.RefObject<HTMLElement | null>, speed: number = 0.15) => {
    if (!elementRef.current) return {};
    const rect = elementRef.current.getBoundingClientRect();
    const containerEl = document.getElementById('main-scroll-container');
    if (!containerEl) return {};
    const containerRect = containerEl.getBoundingClientRect();
    const elementTopRelative = rect.top - containerRect.top;
    const progress = (containerRect.height - elementTopRelative) / (containerRect.height + rect.height);
    const offset = (progress - 0.5) * speed * containerRect.height;
    return { transform: `translateY(${offset}px)` };
  }, [scrollTop]);

  return { scrollTop, getParallaxStyle };
}

// --- Parallax Image Component ---
const ParallaxImage = ({
  src, alt, className, speed = 0.1, containerClassName = '',
  ...props
}: {
  src: string; alt: string; className?: string; speed?: number; containerClassName?: string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <img
        alt={alt}
        className={`parallax-img ${className || ''}`}
        style={getParallaxStyle(ref, speed)}
        src={src}
        {...props}
      />
    </div>
  );
};


// --- Component Parts ---

const Lightbox = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const newScale = Math.max(1, Math.min(4, scale - e.deltaY * 0.005));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overflow-hidden animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute top-4 right-4 z-[101]">
        <button onClick={onClose} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>
      <div
        className="relative transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing touch-none"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img src={src} alt="Lightbox" className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl" />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white/70 text-sm backdrop-blur-sm pointer-events-none">
        Scroll to zoom • Drag to pan
      </div>
    </div>
  );
};

const Header = () => (
  <>
    <div className="absolute top-6 left-6 z-50 px-3 py-1 bg-white border-2 border-ink shadow-brutalist-sm">
      <span className="font-body font-bold text-[10px] tracking-widest text-ink uppercase">Vol. 01</span>
    </div>
    <div className="absolute top-6 right-6 z-50">
      <button
        className="size-10 flex items-center justify-center bg-cream border-2 border-ink shadow-brutalist-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-neutral-100"
        aria-label="Menu"
      >
        <span className="material-symbols-outlined text-ink text-xl">menu</span>
      </button>
    </div>
  </>
);

const Hero = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <section className="relative h-[85vh] w-full bg-ink overflow-hidden border-b-4 border-ink">
      <div ref={imgRef} className="absolute inset-0 overflow-hidden">
        <img
          alt="Couple B&W"
          className="absolute inset-0 w-full h-[120%] object-cover opacity-80 grayscale contrast-125 parallax-img"
          style={getParallaxStyle(imgRef, 0.12)}
          src={IMAGES.coupleHero}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/90"></div>
      <div className="absolute bottom-12 left-6 right-6">
        <h1 className="font-display italic text-cream text-6xl leading-[0.9] tracking-tighter mix-blend-difference">
          Nuestra<br />Historia
        </h1>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-cream"></div>
          <span className="font-body text-cream text-xs tracking-[0.2em] uppercase">Scroll to begin</span>
        </div>
      </div>
    </section>
  );
};

const IntroGrid = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <section className="relative bg-cream">
      <div className="grid grid-cols-2">
        <div className="aspect-square bg-ink border-r-4 border-b-4 border-ink flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 grid grid-cols-4 opacity-20 pointer-events-none">
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
          </div>
          <span className="font-mono-pop text-[140px] leading-none text-white select-none relative z-10 group-hover:scale-110 transition-transform duration-500 cursor-default">
            A
          </span>
          <span className="absolute bottom-2 right-2 text-white font-mono-pop text-[10px]">001</span>
        </div>
        <div className="aspect-square bg-cream border-b-4 border-ink p-4 flex items-center justify-center">
          <div ref={imgRef} className="w-full h-full border-2 border-ink p-1 shadow-brutalist-sm rotate-2 bg-white hover:rotate-0 transition-transform duration-300 overflow-hidden">
            <img
              alt="Detail shot"
              className="w-full h-full object-cover grayscale contrast-110 parallax-img"
              style={getParallaxStyle(imgRef, 0.08)}
              src={IMAGES.detailVase}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const MoodBoard = () => {
  const moodMRef = useRef<HTMLDivElement>(null);
  const moodORef = useRef<HTMLDivElement>(null);
  const moodRRef = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <section className="bg-ink text-white">
      {/* Mood Block */}
      <div className="flex border-b border-white/20 min-h-[180px]">
        <div className="w-1/3 border-r border-white/20 p-4 flex flex-col justify-between">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Mood</span>
          <div ref={moodMRef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2">
            <img
              alt="Mood M"
              className="w-full h-[130%] object-cover opacity-80 parallax-img"
              style={getParallaxStyle(moodMRef, 0.1)}
              src={IMAGES.moodM}
            />
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-center relative overflow-hidden group">
          <span className="font-mono-pop text-[180px] leading-none text-white absolute -right-4 top-1/2 -translate-y-1/2 opacity-100 group-hover:-translate-x-4 transition-transform duration-500">M</span>
        </div>
      </div>

      {/* Origin Block */}
      <div className="flex border-b border-white/20 min-h-[180px] flex-row-reverse">
        <div className="w-1/3 border-l border-white/20 p-4 flex flex-col justify-between bg-ink">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Origin</span>
          <div ref={moodORef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2 rotate-[-2deg]">
            <img
              alt="Mood O"
              className="w-full h-[130%] object-cover grayscale parallax-img"
              style={getParallaxStyle(moodORef, 0.1)}
              src={IMAGES.moodO}
            />
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-center relative overflow-hidden group">
          <span className="font-mono-pop text-[180px] leading-none text-white absolute -left-8 top-1/2 -translate-y-1/2 group-hover:translate-x-4 transition-transform duration-500">O</span>
        </div>
      </div>

      {/* Rare Block */}
      <div className="flex border-b-4 border-ink min-h-[180px]">
        <div className="w-1/3 border-r border-white/20 p-4 flex flex-col justify-between">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Rare</span>
          <div ref={moodRRef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2">
            <img
              alt="Mood R"
              className="w-full h-[130%] object-cover opacity-80 parallax-img"
              style={getParallaxStyle(moodRRef, 0.1)}
              src={IMAGES.moodR}
            />
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-center relative overflow-hidden bg-pop-red group">
          <span className="font-mono-pop text-[180px] leading-none text-ink absolute -right-4 top-1/2 -translate-y-1/2 group-hover:-translate-x-4 transition-transform duration-500">R</span>
        </div>
      </div>
    </section>
  );
};

const Memories = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Parallax refs for individual photos
  const heroRef = useRef<HTMLDivElement>(null);
  const sunsetRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const beachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop;
        const currentScroll = container.scrollTop;
        const relativeScroll = currentScroll - sectionTop;
        setScrollOffset(relativeScroll);
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const openLightbox = (img: string) => setSelectedImage(img);

  return (
    <section ref={sectionRef} className="bg-[#fefaf0] relative font-handwriting text-gray-800" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }}>
      {selectedImage && <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />}

      <div className="w-full relative overflow-x-hidden flex flex-col pb-24">
        {/* Header */}
        <div className="relative pt-12 pb-16 px-6">
          <div className="absolute top-6 left-4 bg-sun -rotate-2 px-6 py-2 shadow-sm border border-black/5">
            <h1 className="font-title text-3xl tracking-tight text-[#2D3436] relative z-10 uppercase">
              GALLERY
            </h1>
          </div>
          <div className="flex justify-end items-center mt-12 relative z-10">
            <span className="bg-primary text-white px-4 py-1 text-sm -rotate-3 font-title shadow-sm">Digital Lookbook 24</span>
            <span className="text-primary ml-3 text-2xl animate-pulse">❤</span>
          </div>
          <div className="absolute top-0 right-10 w-20 h-8 scrapbook-tape rotate-12 opacity-50"></div>
        </div>

        {/* Main Content */}
        <div className="px-4 relative">
          <div ref={heroRef} className="relative z-20 mb-12">
            <div
              className="photo-frame rotate-1 scale-[1.02] relative cursor-zoom-in transition-transform hover:scale-[1.05]"
              onClick={() => openLightbox(IMAGES.galleryHero)}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 scrapbook-tape -rotate-2 z-30"></div>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  alt="Couple in romantic setting"
                  className="w-full h-[120%] object-cover parallax-img"
                  style={{ transform: `translateY(${scrollOffset * 0.06}px)` }}
                  src={IMAGES.galleryHero}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-4 right-4 text-white">
                  <h2 className="text-3xl leading-none mb-1">Nuestros Momentos</h2>
                  <p className="text-xs uppercase font-title tracking-wider opacity-90">The Valentine's Edition • Vol. 01</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-sun border-2 border-dashed border-primary/50 rounded-full w-14 h-14 flex items-center justify-center rotate-12 font-title text-xs text-primary shadow-md">
                LOVE
              </div>
            </div>
          </div>

          <div className="relative min-h-[600px] mb-12">
            {/* Parallax Item 1 */}
            <div
              ref={sunsetRef}
              className="absolute top-0 left-0 w-3/5 z-10"
              style={{ transform: `translateY(${scrollOffset * 0.05}px)` }}
            >
              <div
                className="-rotate-3 group cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.gallerySunset)}
              >
                <div className="photo-frame">
                  <div className="overflow-hidden">
                    <img
                      alt="Sunset view"
                      className="w-full aspect-[2/3] object-cover parallax-img"
                      style={{ transform: `translateY(${scrollOffset * 0.08}px)` }}
                      src={IMAGES.gallerySunset}
                    />
                  </div>
                  <p className="mt-2 text-lg text-gray-600">Golden hours with you...</p>
                </div>
                <div className="absolute top-0 left-4 w-12 h-6 bg-sky/40 rotate-12"></div>
              </div>
            </div>

            {/* Parallax Item 2 */}
            <div
              ref={flowerRef}
              className="absolute top-10 right-0 w-1/2 z-20"
              style={{ transform: `translateY(${scrollOffset * -0.05}px)` }}
            >
              <div
                className="rotate-6 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryFlower)}
              >
                <div className="photo-frame border-t-4 border-t-sun">
                  <div className="overflow-hidden">
                    <img
                      alt="Flower bouquet"
                      className="w-full aspect-square object-cover parallax-img"
                      style={{ transform: `translateY(${scrollOffset * -0.06}px)` }}
                      src={IMAGES.galleryFlower}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 right-4 bg-white border border-gray-200 px-3 py-1 text-sm shadow-sm font-title -rotate-12">
                  2024
                </div>
              </div>
            </div>

            {/* Parallax Item 3 */}
            <div
              ref={handsRef}
              className="absolute top-72 left-8 w-1/2 z-0"
              style={{ transform: `translateY(${scrollOffset * 0.02}px)` }}
            >
              <div
                className="rotate-1 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryHands)}
              >
                <div className="photo-frame bg-sky/10">
                  <div className="overflow-hidden">
                    <img
                      alt="Hands together"
                      className="w-full aspect-square object-cover parallax-img"
                      style={{ transform: `translateY(${scrollOffset * 0.04}px)` }}
                      src={IMAGES.galleryHands}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Parallax Item 4 */}
            <div
              ref={cityRef}
              className="absolute top-[420px] right-2 w-3/5 z-30"
              style={{ transform: `translateY(${scrollOffset * -0.08}px)` }}
            >
              <div
                className="-rotate-2 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryCity)}
              >
                <div className="photo-frame">
                  <div className="overflow-hidden">
                    <img
                      alt="City walk"
                      className="w-full aspect-[3/4] object-cover parallax-img"
                      style={{ transform: `translateY(${scrollOffset * -0.07}px)` }}
                      src={IMAGES.galleryCity}
                    />
                  </div>
                  <p className="mt-2 text-lg text-gray-600 text-right">Midnight memories.</p>
                </div>
                <div className="absolute -top-3 right-8 w-16 h-5 bg-primary/20 -rotate-12"></div>
              </div>
            </div>
          </div>

          {/* ===== ALWAYS YOU MARQUEE ===== */}
          <div className="my-16 -mx-4">
            <div className="bg-sun border-y-2 border-dashed border-primary/30 py-4 overflow-hidden whitespace-nowrap">
              <div className="marquee-track">
                {/* First copy */}
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                {/* Duplicate copy for seamless loop */}
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
                <span className="text-primary font-title text-xl mx-4">ALWAYS YOU</span>
                <span className="text-sky-400 text-xl mx-4">✿</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12 pb-12 relative">
            <div
              ref={coffeeRef}
              className="self-start w-3/4 photo-frame -rotate-3 z-10 cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(IMAGES.galleryCoffee)}
            >
              <div className="overflow-hidden">
                <img
                  alt="Coffee date"
                  className="w-full h-56 object-cover parallax-img"
                  style={{ transform: `translateY(${scrollOffset * 0.05}px)` }}
                  src={IMAGES.galleryCoffee}
                />
              </div>
              <div className="absolute -top-2 left-1/3 w-20 h-6 bg-sun opacity-60 rotate-2"></div>
            </div>
            <div
              ref={beachRef}
              className="self-end w-3/4 photo-frame rotate-2 -mt-16 z-20 cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(IMAGES.galleryBeach)}
            >
              <div className="overflow-hidden">
                <img
                  alt="Beach walk"
                  className="w-full h-56 object-cover parallax-img"
                  style={{ transform: `translateY(${scrollOffset * -0.05}px)` }}
                  src={IMAGES.galleryBeach}
                />
              </div>
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white text-xs font-title rotate-12 shadow-lg ring-4 ring-white">
                  XOXO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
      </div>
    </section>
  );
};

const LoveNote = () => (
  <section className="bg-cream border-t-4 border-ink py-20 px-8 text-center relative">
    <div className="absolute left-1/2 -top-6 -translate-x-1/2 bg-wine text-cream px-4 py-2 border-2 border-ink rotate-2 shadow-brutalist-sm">
      <span className="font-mono-pop text-xs">FOR YOU</span>
    </div>
    <div className="max-w-[80%] mx-auto">
      <p className="font-body text-ink/70 leading-relaxed mb-8 text-sm">
        En este mundo caótico, tú eres mi paz y mi revolución favorita. Gracias por cada sonrisa, cada momento y cada recuerdo.
      </p>
      <h2 className="font-display font-bold italic text-wine text-5xl md:text-6xl leading-[1.1]">
        Te Quiero<br />Mucho
      </h2>
      <div className="mt-8 flex justify-center">
        <span
          className="material-symbols-outlined text-wine text-4xl animate-pulse-slow"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </div>
    </div>
  </section>
);

const Surprise = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-pop-yellow border-t-4 border-b-4 border-ink py-16 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      ></div>
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-48 h-48 relative mb-6 group cursor-pointer focus:outline-none"
        >
          <div className={`absolute inset-0 bg-white border-4 border-ink shadow-brutalist flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-0 scale-95' : 'rotate-3 group-hover:rotate-1'}`}>
            <span className={`material-symbols-outlined text-6xl text-ink transition-all duration-300 ${isOpen ? 'scale-125 text-pop-red' : ''}`}>
              {isOpen ? 'favorite' : 'redeem'}
            </span>
          </div>
          <div className="absolute -top-4 -right-4 bg-pop-red text-white font-mono-pop text-xs px-2 py-1 border-2 border-ink -rotate-12 group-hover:-rotate-6 transition-transform">
            SURPRISE!
          </div>
        </button>
        <h3 className="font-mono-pop text-2xl text-ink text-center uppercase mb-2">
          {isOpen ? "For You!" : "Open Your Gift"}
        </h3>
        <p className="font-body text-sm text-ink/80 text-center max-w-[200px]">
          {isOpen ? "You make every day brighter." : "A little something for being amazing."}
        </p>
      </div>
    </section>
  );
}

const Ticket = () => (
  <section className="bg-ink py-12 px-4 flex justify-center">
    <div className="bg-cream w-full max-w-[340px] border-2 border-cream relative flex hover:translate-y-1 transition-transform cursor-pointer group">
      <div className="w-[30%] border-r-2 border-dashed border-ink bg-pop-red flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-4 h-4 bg-ink rounded-full -top-2 -right-2"></div>
        <div className="absolute w-4 h-4 bg-ink rounded-full -bottom-2 -right-2"></div>
        <span className="text-vertical font-mono-pop text-ink/20 text-4xl font-bold absolute left-2 select-none">TICKET</span>
        <span className="text-vertical font-body font-bold text-cream tracking-widest text-xs z-10 group-hover:text-ink transition-colors">VALID 2025</span>
      </div>
      <div className="w-[70%] p-6 flex flex-col items-center justify-center text-center relative">
        <div className="absolute w-4 h-4 bg-ink rounded-full -top-2 -left-2"></div>
        <div className="absolute w-4 h-4 bg-ink rounded-full -bottom-2 -left-2"></div>
        <h4 className="font-display italic text-2xl text-wine mb-2">Vale Por</h4>
        <p className="font-mono-pop text-xl text-ink uppercase leading-tight mb-4">
          Una Cena<br />Romántica
        </p>
        <div className="w-full h-px bg-ink/20 mb-2"></div>
        <p className="font-body text-[10px] uppercase tracking-widest text-ink/60">No Expiration Date</p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-cream py-10 flex flex-col items-center border-t-4 border-ink">
    <div className="font-mono-pop text-ink text-2xl tracking-tighter mb-2 hover:tracking-normal transition-all duration-300">14-02-25</div>
    <p className="font-display italic text-ink/50 text-sm">Happy Valentine's Day</p>
  </footer>
);

// --- Main App ---

export default function App() {
  return (
    <div className="flex justify-center min-h-screen bg-neutral-200">
      <div id="main-scroll-container" className="relative w-full max-w-[420px] bg-cream min-h-screen overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl no-scrollbar">
        <Header />
        <Hero />
        <IntroGrid />
        <MoodBoard />
        <Memories />
        <LoveNote />
        <Surprise />
        <Ticket />
        <Footer />
      </div>
    </div>
  );
}