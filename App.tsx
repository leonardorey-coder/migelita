import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';

// --- Assets (public/images = webp, public/videos = mov/mp4) ---
const IMAGES = {
  hero: "/images/0d036f77-c18c-4f4a-926b-edcf7b02cdfb.webp",
  coupleHero: "/images/0d036f77-c18c-4f4a-926b-edcf7b02cdfb.webp",
  detailVase: "/images/7f2d03e1-f71d-4a37-bb7f-21d6f208ad52.webp",
  moodM: "/images/0d036f77-c18c-4f4a-926b-edcf7b02cdfb.webp",
  moodO: "/images/IMG_0949.webp",
  moodR: "/images/IMG_0975.webp",
  galleryHero: "/images/coral.webp",
  gallerySunset: "/images/IMG_1250.webp",
  galleryFlower: "/images/IMG_0980.webp",
  galleryHands: "/images/IMG_1176.webp",
  galleryCity: "/images/IMG_1352.webp",
  galleryCoffee: "/images/IMG_8795.webp",
  galleryBeach: "/images/IMG_8860.webp",
};

const VIDEOS = {
  abrazoBeso: "/videos/4707741fc4f0405d8a8983778baa6210.mp4",
  momento: "/videos/ec8896647688464593de236fd51db88c.mp4",
  clip: "/videos/4707741fc4f0405d8a8983778baa6210.mp4",
  img0524: "/videos/IMG_0524.mp4",
};

const LOCAL_GALLERY = ["/images/IMG_9557.webp", "/images/IMG_9846.webp"];

const LIGHTBOX_DESCRIPTIONS: Record<string, string> = {
  [IMAGES.galleryHero]: 'Porque te amito demasiado mi amor, me metí dentro de tu mundo.',
  [IMAGES.gallerySunset]: 'Me encanta demasiado cada fotito juntos mi vida.',
  [IMAGES.galleryFlower]: 'A pesar de que el atardecer es increíblemente hermoso, no tendría razón de existir si no estuvieramos nosotros dos frente a él.',
  [IMAGES.galleryHands]: 'Amo demasiado esas fotitos que siempre tomas al verte contenta y relajada al estar conmigo y tu familia mi vida.',
  [IMAGES.galleryCity]: 'Me gusta que sale el Mc, el lugar donde nos empezamos a conocer bebis.',
  [IMAGES.galleryCoffee]: 'Me gusta estar contigo en el pueblo mi vida, pero qué flojera me da el viaje :(.',
  [IMAGES.galleryBeach]: 'Quiero repetir más cenas a tu lado mi cielito.',
  "/images/IMG_9557.webp": 'Me encanta esta fotito porque sales dándome besitos mi amor, ajjaj.',
  "/images/IMG_9846.webp": 'Eres la más hermosa mi niña.',
};
function getLightboxDescription(src: string): string {
  return LIGHTBOX_DESCRIPTIONS[src] ?? '…un instante guardado.';
}

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

const Lightbox = ({ src, description, onClose, noRotate = false }: { src: string; description?: string; onClose: () => void; noRotate?: boolean }) => {
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
          transform: `${noRotate ? '' : 'rotate(90deg) '}scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img src={src} alt="Vista ampliada" className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl" />
      </div>

      {description && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[85vw] pointer-events-none">
          <p className="text-white text-lg md:text-xl text-center max-w-md mx-auto px-6 py-4 font-display italic leading-relaxed bg-black/60 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

const Header = () => (
  <>
    <div className="absolute top-6 left-6 z-50 px-3 py-1 bg-white border-2 border-ink shadow-brutalist-sm">
      <span className="font-body font-bold text-[10px] tracking-widest text-ink uppercase">Vol. 01</span>
    </div>
  </>
);

const Hero = () => (
  <section className="relative min-h-[85vh] w-full bg-ink overflow-hidden border-b-4 border-ink shrink-0">
    <img
      alt="Couple B&W"
      className="absolute inset-0 w-full h-full object-cover object-center opacity-80 grayscale contrast-125"
      src={IMAGES.coupleHero}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/90" aria-hidden />
    <div className="absolute bottom-12 left-6 right-6">
      <h1 className="font-display italic text-cream text-6xl leading-[0.9] tracking-tighter mix-blend-difference">
        Nuestra<br />Historia
      </h1>
      <div className="mt-6 flex items-center gap-4">
        <div className="h-[1px] w-12 bg-cream" />
        <span className="font-body text-cream text-xs tracking-[0.2em] uppercase">Desliza para comenzar</span>
      </div>
    </div>
  </section>
);

const IntroGrid = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const letterARef = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <section className="relative bg-cream">
      <div className="grid grid-cols-2">
        <div ref={letterARef} className="aspect-square bg-ink border-r-4 border-b-4 border-ink flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 opacity-20 pointer-events-none">
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
          </div>
          <span
            className="font-mono-pop text-[140px] leading-none text-white select-none relative z-10 cursor-default"
            style={{
              transform: `scale(${1 + Math.min(Math.abs((getParallaxStyle(letterARef, 0.08).transform ? Number((getParallaxStyle(letterARef, 0.08).transform as string).match(/-?\d+(\.\d+)?/)?.[0] ?? 0) : 0)) / 120, 0.12)})`,
            }}
          >
            A
          </span>
          <span className="absolute bottom-2 right-2 text-white font-mono-pop text-[10px]">001</span>
        </div>
        <div className="aspect-square bg-cream border-b-4 border-ink p-4 flex items-center justify-center">
          <div ref={imgRef} className="w-full h-full border-2 border-ink p-1 shadow-brutalist-sm rotate-2 bg-white hover:rotate-0 transition-transform duration-300 overflow-hidden">
            <img
              alt="Detalle"
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
  const letterMRef = useRef<HTMLDivElement>(null);
  const letterORef = useRef<HTMLDivElement>(null);
  const letterRRef = useRef<HTMLDivElement>(null);
  const { getParallaxStyle } = useParallax();

  return (
    <section className="bg-ink text-white">
      {/* Mood Block */}
      <div className="flex border-b border-white/20 min-h-[180px]">
        <div className="w-1/3 border-r border-white/20 p-4 flex flex-col justify-between">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Estado</span>
          <div ref={moodMRef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2">
            <img
              alt="Mood M"
              className="w-full h-[130%] object-cover opacity-80 parallax-img"
              style={getParallaxStyle(moodMRef, 0.1)}
              src={IMAGES.moodM}
            />
          </div>
        </div>
        <div ref={letterMRef} className="w-2/3 flex items-center justify-center relative overflow-hidden">
          <span
            className="font-mono-pop text-[180px] leading-none text-white absolute -right-4 top-1/2 opacity-100"
            style={{
              transform: `translateY(-50%) translateX(${-Math.min(Math.abs((getParallaxStyle(letterMRef, 0.12).transform ? Number((getParallaxStyle(letterMRef, 0.12).transform as string).match(/-?\d+(\.\d+)?/)?.[0] ?? 0) : 0)), 16)}px)`,
            }}
          >
            M
          </span>
        </div>
      </div>

      {/* Origin Block */}
      <div className="flex border-b border-white/20 min-h-[180px] flex-row-reverse">
        <div className="w-1/3 border-l border-white/20 p-4 flex flex-col justify-between bg-ink">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Origen</span>
          <div ref={moodORef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2 rotate-[-2deg]">
            <img
              alt="Mood O"
              className="w-full h-[130%] object-cover grayscale parallax-img"
              style={getParallaxStyle(moodORef, 0.1)}
              src={IMAGES.moodO}
            />
          </div>
        </div>
        <div ref={letterORef} className="w-2/3 flex items-center justify-center relative overflow-hidden">
          <span
            className="font-mono-pop text-[180px] leading-none text-white absolute -left-8 top-1/2"
            style={{
              transform: `translateY(-50%) translateX(${Math.min(Math.abs((getParallaxStyle(letterORef, 0.12).transform ? Number((getParallaxStyle(letterORef, 0.12).transform as string).match(/-?\d+(\.\d+)?/)?.[0] ?? 0) : 0)), 16)}px)`,
            }}
          >
            O
          </span>
        </div>
      </div>

      {/* Rare Block */}
      <div className="flex border-b-4 border-ink min-h-[180px]">
        <div className="w-1/3 border-r border-white/20 p-4 flex flex-col justify-between">
          <span className="font-body text-[10px] tracking-widest uppercase text-white/50">Especial</span>
          <div ref={moodRRef} className="w-full aspect-[3/4] overflow-hidden border border-white/20 mt-2">
            <img
              alt="Mood R"
              className="w-full h-[130%] object-cover opacity-80 parallax-img"
              style={getParallaxStyle(moodRRef, 0.1)}
              src={IMAGES.moodR}
            />
          </div>
        </div>
        <div ref={letterRRef} className="w-2/3 flex items-center justify-center relative overflow-hidden bg-pop-red">
          <span
            className="font-mono-pop text-[180px] leading-none text-ink absolute -right-4 top-1/2"
            style={{
              transform: `translateY(-50%) translateX(${-Math.min(Math.abs((getParallaxStyle(letterRRef, 0.12).transform ? Number((getParallaxStyle(letterRRef, 0.12).transform as string).match(/-?\d+(\.\d+)?/)?.[0] ?? 0) : 0)), 16)}px)`,
            }}
          >
            R
          </span>
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
  const video0524Ref = useRef<HTMLVideoElement>(null);

  const onVideo0524TimeUpdate = useCallback(() => {
    const el = video0524Ref.current;
    if (el && el.currentTime >= 25) {
      el.currentTime = 0;
    }
  }, []);

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
      {selectedImage && <Lightbox src={selectedImage} description={getLightboxDescription(selectedImage)} onClose={() => setSelectedImage(null)} noRotate={selectedImage === IMAGES.galleryHero} />}

      <div className="w-full relative overflow-x-hidden flex flex-col pb-24">
        {/* Header */}
        <div className="relative pt-12 pb-16 px-6">
          <div className="absolute top-6 left-4 bg-sun -rotate-2 px-6 py-2 shadow-sm border border-black/5">
            <h1 className="font-title text-3xl tracking-tight text-[#2D3436] relative z-10 uppercase">
              GALERÍA
            </h1>
          </div>
          <div className="flex justify-end items-center mt-12 relative z-10">
            <span className="bg-primary text-white px-4 py-1 text-sm -rotate-3 font-title shadow-sm">Lookbook digital 24</span>
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
                  alt="Pareja en escena romántica"
                  className="w-full h-[120%] object-cover object-center parallax-img"
                  style={{ transform: `translateY(${scrollOffset * 0.02}px)` }}
                  src={IMAGES.galleryHero}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-4 right-4 text-white">
                  <h2 className="text-3xl leading-none mb-1">Nuestros Momentos</h2>
                  <p className="text-xs uppercase font-title tracking-wider opacity-90">Edición San Valentín • Vol. 01</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-sun border-2 border-dashed border-primary/50 rounded-full w-14 h-14 flex items-center justify-center rotate-12 font-title text-xs text-primary shadow-md">
                AMOR
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-12 px-2">
            <div className="photo-frame rotate-[-1deg] overflow-hidden max-w-sm mx-auto">
              <div className="aspect-[9/16] bg-ink relative">
                <video
                  src={VIDEOS.abrazoBeso}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay
                  aria-label="Video momento especial"
                />
                <div className="absolute bottom-2 left-2 right-2 text-white text-center">
                  <p className="font-body text-xs opacity-90">…un momento en movimiento</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-12 px-2">
            <div className="photo-frame rotate-[2deg] overflow-hidden max-w-sm mx-auto">
              <div className="aspect-[4/3] bg-ink relative">
                <video
                  src={VIDEOS.momento}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay
                  aria-label="Video momento"
                />
                <div className="absolute bottom-2 left-2 text-white/90 text-xs font-body">…un recuerdo en movimiento</div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[780px] mb-12">
            {/* Parallax Item 1 */}
            <div
              ref={sunsetRef}
              className="absolute top-0 left-2 w-3/5 z-10"
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
                      className="w-full aspect-[2/3] object-cover object-center parallax-img"
                      style={{ transform: `translateY(${scrollOffset * 0.02}px)` }}
                      src={IMAGES.gallerySunset}
                    />
                  </div>
                  <p className="mt-2 text-lg text-gray-600">Horas doradas contigo...</p>
                </div>
                <div className="absolute top-0 left-4 w-12 h-6 bg-sky/40 rotate-12"></div>
              </div>
            </div>

            {/* Parallax Item 2 */}
            <div
              ref={flowerRef}
              className="absolute top-[220px] right-2 w-1/2 z-20"
              style={{ transform: `translateY(${scrollOffset * -0.05}px)` }}
            >
              <div
                className="rotate-6 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryFlower)}
              >
                <div className="photo-frame border-t-4 border-t-sun">
                  <div className="overflow-hidden">
                    <img
                      alt="Ramo de flores"
                      className="w-full aspect-square object-cover object-[center_78%] parallax-img rotate-90"
                      style={{ transform: `translateY(${scrollOffset * -0.015}px) rotate(90deg)` }}
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
              className="absolute top-[520px] left-2 w-1/2 z-0"
              style={{ transform: `translateY(${scrollOffset * 0.02}px)` }}
            >
              <div
                className="rotate-1 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryHands)}
              >
                <div className="photo-frame bg-sky/10">
                  <div className="overflow-hidden">
                    <img
                      alt="Manos entrelazadas"
                      className="w-full aspect-square object-cover object-center parallax-img rotate-90"
                      style={{ transform: `translateY(${scrollOffset * 0.015}px) rotate(90deg)` }}
                      src={IMAGES.galleryHands}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Parallax Item 4 */}
            <div
              ref={cityRef}
              className="absolute top-[470px] right-2 w-3/5 z-30"
              style={{ transform: `translateY(${scrollOffset * -0.08}px)` }}
            >
              <div
                className="-rotate-2 cursor-zoom-in transition-transform hover:scale-[1.02]"
                onClick={() => openLightbox(IMAGES.galleryCity)}
              >
                <div className="photo-frame">
                  <div className="overflow-hidden">
                    <img
                      alt="Paseo en la ciudad"
                      className="w-full aspect-[3/4] object-cover object-center parallax-img"
                      style={{ transform: `translateY(${scrollOffset * -0.02}px)` }}
                      src={IMAGES.galleryCity}
                    />
                  </div>
                  <p className="mt-2 text-lg text-gray-600 text-right">Recuerdos de medianoche.</p>
                </div>
                <div className="absolute -top-3 right-8 w-16 h-5 bg-primary/20 -rotate-12"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            {LOCAL_GALLERY.map((src, i) => (
              <div
                key={i}
                className={`photo-frame cursor-zoom-in transition-transform hover:scale-[1.02] -rotate-1 ${i === 1 ? '-mt-16' : ''}`}
                onClick={() => openLightbox(src)}
              >
                <div className="overflow-hidden aspect-square">
                  <img src={src} alt="" className="w-full h-full object-cover object-center rotate-90" />
                </div>
              </div>
            ))}
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

          <div className="flex flex-col gap-20 pb-12 relative">
            <div
              ref={coffeeRef}
              className="self-start w-3/4 photo-frame -rotate-3 z-10 cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(IMAGES.galleryCoffee)}
            >
              <div className="overflow-hidden">
                <img
                  alt="Cita de café"
                  className="w-full h-56 object-cover object-center parallax-img rotate-90"
                  style={{ transform: `translateY(${scrollOffset * 0.02}px) rotate(90deg)` }}
                  src={IMAGES.galleryCoffee}
                />
              </div>
              <div className="absolute -top-2 left-1/3 w-20 h-6 bg-sun opacity-60 rotate-2"></div>
            </div>
            <div
              ref={beachRef}
              className="self-end w-3/4 photo-frame rotate-2 -mt-6 z-20 cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(IMAGES.galleryBeach)}
            >
              <div className="overflow-hidden">
                <img
                  alt="Paseo en la playa"
                  className="w-full h-56 object-cover object-center parallax-img rotate-90"
                  style={{ transform: `translateY(${scrollOffset * -0.02}px) rotate(90deg)` }}
                  src={IMAGES.galleryBeach}
                />
              </div>
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white text-xs font-title rotate-12 shadow-lg ring-4 ring-white">
                  XOXO
                </div>
              </div>
            </div>
            <div className="self-start w-full max-w-sm photo-frame -rotate-1 overflow-hidden z-10">
              <div className="aspect-video bg-ink relative">
                <video
                  ref={video0524Ref}
                  src={VIDEOS.img0524}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay
                  onTimeUpdate={onVideo0524TimeUpdate}
                  aria-label="Memoria en video"
                />
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
      <span className="font-mono-pop text-xs">PARA TI</span>
    </div>
    <div className="max-w-[80%] mx-auto">
      <p className="font-body text-ink/70 leading-relaxed mb-8 text-sm">
        En todo este universo y vida detestable, tú eres mi paz al final del día. Eres mi tacita de café, mi pancito dulce, mi rebanada de pizza, cada pelito de mis gatitos, cada línea de código y cada latido de mi corazón; eres la parte fundamental de mi existencia. Sin ti yo no sería posible.
      </p>
      <h2 className="font-display font-bold italic text-wine text-5xl md:text-6xl leading-[1.1]">
        Te Amo<br />Infinitamente
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

const Vows = () => (
  <section className="bg-cream border-t-4 border-ink py-12 px-8 relative">
    <header className="border-b border-ink/20 pb-4 mb-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-ink/50 mb-2 font-body font-medium">Correspondencia</p>
      <h2 className="font-body text-2xl font-light tracking-[0.15em] text-ink uppercase italic">
        Para el amor de mi vida
      </h2>
    </header>
    <article>
      <div className="font-body text-base leading-[1.8] text-ink/90">
        <p className="drop-cap mb-6 text-justify">
          Casi nunca me dedico a crear este tipo de cosas, de hecho, nunca lo hago, pero tú siempre sabes cómo cambiar a las personas para bien y lograr que ocurran los tan aclamados &quot;milagros&quot;.
        </p>
        <p className="mb-6 text-justify">
          Me queda claro que no existen, y que realmente lo que existe es un hecho mucho más hermoso que eso, y estoy hablando de ti. Tú siempre has tenido ese don envidiable de tener paz, de dárselo a los demás, de mejorarlos y siempre ver lo mejor que tiene cada persona. De provocarles los milagros de felicidad.
        </p>
        <p className="mb-6 text-justify">
          Muchas gracias de aplicarlo a mí y hacerme tener la mejor versión de mí, incluso si yo nunca tuve ni la mínima idea de cómo lograr eso.
        </p>
        <p className="mb-6 text-justify">
          Eres la mejor mujer que el mundo pudo haber tenido y por lo tanto soy el hombre más afortunado por tenerte a mi lado.
        </p>
        <p className="mb-6 text-justify">
          Vamos a luchar juntos por más metas y logros; vamos a obtener 12 san Valentines más juntos.
        </p>
        <p className="mb-8 text-justify">
          Te amo demasiado y con todo mi corazoncito cafetero te deseo lo mejor, mi princesita.
        </p>
      </div>
      <div className="mt-8 border-t border-ink/10 pt-6">
        <p className="text-ink/60 text-sm italic mb-1 font-body">Con todo mi corazón,</p>
        <span className="font-handwriting text-2xl text-ink/80">
          Tuyo para siempre
        </span>
      </div>
      <div className="mt-10 flex items-center justify-between text-[10px] tracking-widest text-ink/50 uppercase border-y border-ink/10 py-4 font-body">
        <span>14 Feb 2026</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-wine rounded-full"></span>
          Amor verdadero
        </span>
      </div>
    </article>
  </section>
);

const Surprise = ({ onOpen }: { onOpen: () => void }) => (
  <section className="relative overflow-hidden flex flex-col bg-white border-t-4 border-b-4 border-ink shrink-0">
    <div className="relative min-h-[60vh] bg-[#FFF000] flex flex-col items-center justify-start pt-[10vh] border-b-[5px] border-ink shrink-0">
      <h1 className="font-mono-pop text-[3.75rem] sm:text-[5rem] md:text-[8rem] text-ink gift-brutal-shadow leading-none select-none pointer-events-none opacity-90 mb-8 whitespace-nowrap">
        REGALO
      </h1>
      <div className="absolute bottom-0 w-full flex flex-col items-center translate-y-4">
        <div className="absolute top-[-40px] left-8 transform -rotate-12 z-40 bg-pink-500 border-4 border-ink px-4 py-2 font-mono-pop text-white text-lg gift-sticker-shadow animate-gift-float">
          BOOM!
        </div>
        <div className="absolute bottom-10 right-6 transform rotate-12 z-40 bg-[#0df2f2] border-4 border-ink px-4 py-2 font-mono-pop text-ink text-lg gift-sticker-shadow">
          LOVE
        </div>
        <div className="relative z-30 mb-[-10px]">
          <div className="w-40 h-40 bg-white border-[5px] border-ink gift-box-depth flex items-center justify-center relative">
            <div className="absolute w-full h-8 bg-[#FF2D55] border-y-[5px] border-ink"></div>
            <div className="absolute h-full w-8 bg-[#FF2D55] border-x-[5px] border-ink"></div>
            <div className="absolute -top-10 flex justify-center w-full">
              <div className="w-14 h-14 bg-[#FF2D55] border-[5px] border-ink rounded-full transform -rotate-45 translate-x-3"></div>
              <div className="w-14 h-14 bg-[#FF2D55] border-[5px] border-ink rounded-full transform rotate-45 -translate-x-3"></div>
            </div>
          </div>
        </div>
        <div className="w-56 h-14 bg-cream border-[5px] border-ink rounded-t-xl z-20"></div>
      </div>
    </div>
    <div className="min-h-[280px] bg-white flex flex-col items-center justify-start py-12 px-8 shrink-0">
      <div className="w-24 h-[1px] bg-[#D4AF37] mb-12"></div>
      <p className="font-display text-3xl text-ink text-center italic mb-12 leading-relaxed">
        Un detalle para ti
      </p>
      <div className="flex flex-col items-center gap-2 mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 font-body">Saludo digital exclusivo</span>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 font-body">Colección San Valentín 2025</span>
      </div>
      <div className="w-full px-4">
        <button
          type="button"
          onClick={onOpen}
          className="w-full bg-ink text-cream font-mono-pop font-bold text-xl py-5 rounded-lg uppercase tracking-widest border-2 border-ink gift-neon-shadow active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
        >
          Abrir
        </button>
      </div>
    </div>
  </section>
);

const TICKET_QR_SRC = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVzUJFBKdED-72FtrusZPunT7uKhUaIfPOICx7osf8Wxa8ShxClFVgTJgq78U_zlYLL9dJLgOZOelpYD7MmpoDiwnGhQEIVBbkbBXvdFjmEoIULbSJtH9mxGGHN91ZeRhiETRprfGr_340PLpBZpGXSlKz1hDpjHmrOSMkaaqANWHsN9Huzkwn2ApJ8qKCEF0_YaTFXLOnkkXAAQhTuI_EXImJqnuMTPmyIZo3cyFvifNw7M9I7xkmIubAOwERNFTowR5d0Szj83o";

const Ticket = forwardRef<HTMLElement>(function Ticket(_, ref) {
  return (
  <section ref={ref} className="bg-ink py-12 px-4 flex flex-col items-center border-t-4 border-ink relative shrink-0">
    <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
      <span className="absolute top-10 left-10 text-pop-red text-2xl font-mono-pop">+</span>
      <span className="absolute top-1/4 right-20 text-pop-red text-xl font-mono-pop">X</span>
      <span className="absolute bottom-1/4 left-1/3 text-pop-red text-lg font-mono-pop">+</span>
      <span className="absolute bottom-10 right-10 text-pop-red text-3xl font-mono-pop">X</span>
    </div>
    <div className="relative w-full max-w-[340px] z-10">
      <div className="absolute inset-0 bg-ink translate-x-2 translate-y-2 rounded-xl" aria-hidden></div>
      <div className="ticket-shape flex min-h-[420px] rounded-xl overflow-hidden relative">
        <div className="w-[30%] bg-pop-red flex flex-col items-center justify-center py-8 relative shrink-0">
          <div className="absolute top-4 font-mono-pop text-[10px] text-white/40 tracking-tighter">02 / 14</div>
          <h1 className="font-mono-pop text-white text-3xl ticket-vertical-text tracking-tighter leading-none">
            VALE POR
          </h1>
          <div className="absolute bottom-4 flex flex-col gap-1">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-2 h-2 bg-white/40 rounded-full"></span>
          </div>
        </div>
        <div className="w-[70%] bg-[#F5F5DC] p-6 flex flex-col relative min-w-0">
          <div className="flex justify-between items-start border-b border-[#4a0404]/20 pb-4 mb-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#4a0404] font-body">Ticket No. 8829-V</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#4a0404] font-body">Edición Amor</div>
          </div>
          <div className="flex-grow">
            <p className="text-[10px] uppercase tracking-widest text-pop-red font-bold mb-2 italic font-body">Invitación especial</p>
            <h2 className="font-display text-2xl text-[#4a0404] italic leading-tight mb-4">
              Una cena bajo las estrellas
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[#4a0404]/60 font-body">Lugar</span>
                <span className="text-sm font-semibold text-[#4a0404] border-b border-[#4a0404]/10 pb-1 font-body">Zoológico de Tizi y Cena en la Estación</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[#4a0404]/60 font-body">Fecha y hora</span>
                <span className="text-sm font-semibold text-[#4a0404] border-b border-[#4a0404]/10 pb-1 font-body">Feb 14, 2025 • 21:00</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-6 gap-2">
            <div className="flex-1 min-w-0 pr-2">
              <div className="font-mono-pop text-[8px] text-pop-red mb-1 tracking-widest">CONFIDENCIAL</div>
              <p className="text-[8px] leading-relaxed text-[#4a0404]/70 font-body">Este ticket es personal e intransferible. Válido para una experiencia inolvidable.</p>
            </div>
            <div className="relative shrink-0">
              <div className="w-16 h-16 bg-ink p-1 ticket-qr-shadow">
                <img alt="Código QR de canje" className="w-full h-full filter invert" src={TICKET_QR_SRC} />
              </div>
              <span className="absolute -top-2 -right-2 text-pop-red font-mono-pop text-[10px]">+</span>
            </div>
          </div>
          <span className="absolute top-1/2 right-2 text-[#4a0404]/10 font-mono-pop text-3xl select-none pointer-events-none">X</span>
        </div>
      </div>
    </div>
  </section>
  );
});

const ANNIVERSARY_DATE = new Date('2026-05-12T00:00:00');
const FRAME_COUNT = 192;
const FRAME_ASSETS = Array.from(
  { length: FRAME_COUNT },
  (_, idx) => `/frames/frame_${String(idx + 1).padStart(6, '0')}.webp`
);
const PRELOAD_ASSETS = Array.from(
  new Set([
    ...Object.values(IMAGES),
    ...Object.values(VIDEOS),
    ...LOCAL_GALLERY,
    ...FRAME_ASSETS,
    TICKET_QR_SRC,
  ])
);

const HEART_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 45C30 45 15 35 15 25C15 15 25 15 30 20C35 15 45 15 45 25C45 35 30 45 30 45Z' fill='none' stroke='black' stroke-width='4'/%3E%3C/svg%3E\")";
const PAPER_TEXTURE =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpzyyprxyFZGAegrL30GAw-7CUnGNEpdgOVDwWKI7vrnQhfZL-taJGKfzQSiYQBLdW54UcEr8dCMIsv0EvpxqSM8lSdqERgrrlk1pJ0pflxa_23F5X4e8RksNks3m5XeIAy-xXHDAIvBTvda6qiK72VFZbhvlboqXu9sMJNbX0alb0NMGGnBwgEhQs5IrMf2yPXjnbBpHbfgQ4zSKd4WYWB1dJX4O7BHcfyoQcExXrXE8bGSJhOzN3m8ABw1FG8MXc0dtbHivexI4')";

function isImageUrl(url: string): boolean {
  return /\.(webp|png|jpg|jpeg|gif|svg)(?:$|[?#])/i.test(url);
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|ogg)(?:$|[?#])/i.test(url);
}

async function preloadAsset(url: string): Promise<void> {
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await response.blob();
    return;
  } catch {
    if (isImageUrl(url)) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = url;
      });
      return;
    }

    if (isVideoUrl(url)) {
      await new Promise<void>((resolve) => {
        const video = document.createElement('video');
        const done = () => {
          video.onloadeddata = null;
          video.onerror = null;
          video.removeAttribute('src');
          video.load();
          resolve();
        };
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.onloadeddata = done;
        video.onerror = done;
        video.src = url;
        video.load();
      });
    }
  }
}

const LoadingSplash = ({ progress }: { progress: number }) => (
  <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#f8f5f7] select-none">
    <div className="absolute inset-0 flex w-full h-full z-0">
      <div className="w-1/2 h-full bg-[#FFDE17] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 scale-125" style={{ backgroundImage: HEART_PATTERN }} />
        <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
      </div>
      <div className="w-1/2 h-full bg-[#FFF9F0] relative">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: PAPER_TEXTURE }} />
        <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent" />
      </div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
      <div className="relative flex items-center justify-center">
        <div className="flex gap-24 text-[140px] leading-none font-mono-pop text-black">
          <span>L</span>
          <span>V</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-12">
          <span className="font-display italic text-7xl text-[#f90680]/90 mt-[-20px] ml-[-40px]">O</span>
          <span className="font-display italic text-7xl text-[#f90680]/90 mt-[30px] mr-[-40px]">E</span>
        </div>
      </div>
      <div className="mt-8 tracking-[0.35em] text-[10px] font-bold text-black uppercase bg-white/30 backdrop-blur-sm px-4 py-1 rounded border border-black/10">
        San Valentín 2026
      </div>
    </div>

    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80%] max-w-sm z-20">
      <div className="relative h-10 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded flex items-center overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#f90680] border-r-[3px] border-black transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="relative w-full flex justify-center items-center">
          <span className="text-xs font-bold tracking-widest uppercase mix-blend-difference text-white">
            Loading... {progress}%
          </span>
        </div>
      </div>
      <p className="mt-6 text-center text-[10px] font-bold text-black/60 uppercase tracking-tight">
        de leoncito para gelita
      </p>
    </div>
  </main>
);

function useCountdown(target: Date) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      if (now >= target) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const ms = target.getTime() - now.getTime();
      setDiff({
        days: Math.floor(ms / (24 * 60 * 60 * 1000)),
        hours: Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
        minutes: Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000)),
        seconds: Math.floor((ms % (60 * 1000)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return diff;
}

const Footer = () => {
  const { days, hours, minutes, seconds } = useCountdown(ANNIVERSARY_DATE);

  return (
    <footer className="bg-[#f5e6e8] py-12 px-8 pb-24 flex flex-col">
      <section className="flex flex-col items-center justify-center text-center space-y-8">
        <div className="space-y-4">
          <div className="w-12 h-[1px] bg-[#b87333] mx-auto mb-6"></div>
          <p className="font-display italic text-xl text-ink/80 tracking-widest">
            Desde 2023
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="font-body font-light text-4xl tracking-[0.2em] uppercase text-ink leading-tight">
            JUNTOS<br />POR<br />SIEMPRE
          </h2>
        </div>
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-[#b87333] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center py-10 px-6 bg-white/30 backdrop-blur-sm border-y border-white/30 my-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full footer-gold-border mb-2 bg-white/50">
            <span className="material-symbols-outlined text-[#b87333] text-2xl">calendar_today</span>
          </div>
          <div className="space-y-2">
            <span className="block font-body font-light text-5xl tracking-tight text-ink">
              14.02.25
            </span>
            <span className="block text-[#b87333] font-body font-medium uppercase tracking-[0.4em] text-[10px] mt-4">
              Día de San Valentín
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-3">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-[#b87333] font-medium">
            Tiempo hasta nuestro 3er aniversario
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-ink">
            <span className="font-mono-pop text-2xl tracking-tight">{days}d</span>
            <span className="font-mono-pop text-2xl tracking-tight">{hours}h</span>
            <span className="font-mono-pop text-2xl tracking-tight">{minutes}m</span>
            <span className="font-mono-pop text-2xl tracking-tight">{seconds}s</span>
          </div>
          <p className="text-ink/50 text-xs font-body">12 Mayo 2026</p>
        </div>
      </div>
      <p className="font-display italic text-ink/60 text-sm tracking-wide text-center mt-8">
        Att. El amor de tu vida
      </p>
    </footer>
  );
};

const SMOOTH_LERP = 0.09;

const ScrollFramesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const targetPhraseRef = useRef(0);
  const smoothPhraseRef = useRef(0);
  const [smoothPhraseProgress, setSmoothPhraseProgress] = useState(0);

  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    let ticking = false;

    const updateProgress = () => {
      if (!sectionRef.current) {
        ticking = false;
        return;
      }

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = container.clientHeight;
      const start = sectionTop;
      const end = sectionTop + sectionHeight - viewportHeight;
      const raw = (container.scrollTop - start) / Math.max(end - start, 1);
      const scrollProgress = Math.max(0, Math.min(1, raw));
      const contentProgress = Math.min(1, scrollProgress / 0.76);
      const targetPhrase = Math.max(0, Math.min(1, (contentProgress - 0.72) / 0.28));

      targetPhraseRef.current = targetPhrase;
      setProgress(contentProgress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const target = targetPhraseRef.current;
      const current = smoothPhraseRef.current;
      const next = current + (target - current) * SMOOTH_LERP;
      smoothPhraseRef.current = next;
      setSmoothPhraseProgress(next);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const frameNumber = Math.min(FRAME_COUNT, Math.max(1, Math.floor(progress * (FRAME_COUNT - 1)) + 1));
  const frameSrc = `/frames/frame_${String(frameNumber).padStart(6, '0')}.webp`;
  const darkness = Math.max(0, Math.min(0.88, (progress - 0.82) / 0.18));
  const phraseOpacity = smoothPhraseProgress;
  const phraseProgress = smoothPhraseProgress;

  return (
    <section ref={sectionRef} className="relative bg-ink border-t-4 border-ink">
      <div className="h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-ink">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={frameSrc}
              alt="Secuencia de recuerdos"
              className="absolute left-1/2 top-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/35 pointer-events-none" aria-hidden />
          <div className="absolute inset-0 bg-black transition-opacity duration-150 pointer-events-none" style={{ opacity: darkness }} aria-hidden />

          <div
            className="absolute left-6 right-6 text-center will-change-transform"
            style={{
              top: '50%',
              opacity: phraseOpacity,
              transform: `translateY(calc(-50% + ${(1 - phraseProgress) * 28}vh))`,
            }}
          >
            <p className="font-display italic text-3xl text-cream tracking-wide">
              Te elijo hoy, manana y siempre.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Scroll inertia ---
const INERTIA_FRICTION = 0.92;
const INERTIA_RELEASE_MS = 120;
const INERTIA_VELOCITY_SMOOTH = 0.75;
const INERTIA_MIN_VELOCITY = 0.4;

function useScrollInertia(containerRef: React.RefObject<HTMLDivElement | null>) {
  const velocityRef = useRef(0);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTouchYRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = () => el.scrollHeight - el.clientHeight;

    const runInertia = () => {
      let v = velocityRef.current;
      const step = () => {
        if (Math.abs(v) < INERTIA_MIN_VELOCITY) {
          rafRef.current = null;
          return;
        }
        const next = el.scrollTop + v;
        el.scrollTop = Math.max(0, Math.min(maxScroll(), next));
        v *= INERTIA_FRICTION;
        velocityRef.current = v;
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const scheduleInertia = () => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = setTimeout(() => {
        releaseTimerRef.current = null;
        runInertia();
      }, INERTIA_RELEASE_MS);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = el.scrollTop + e.deltaY;
      el.scrollTop = Math.max(0, Math.min(maxScroll(), next));
      velocityRef.current = INERTIA_VELOCITY_SMOOTH * velocityRef.current + (1 - INERTIA_VELOCITY_SMOOTH) * e.deltaY;
      scheduleInertia();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTouchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = lastTouchYRef.current - y;
      lastTouchYRef.current = y;
      const next = el.scrollTop + delta;
      el.scrollTop = Math.max(0, Math.min(maxScroll(), next));
      velocityRef.current = INERTIA_VELOCITY_SMOOTH * velocityRef.current + (1 - INERTIA_VELOCITY_SMOOTH) * delta;
    };

    const onTouchEnd = () => {
      scheduleInertia();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);
}

// --- Main App ---

export default function App() {
  const [showTicket, setShowTicket] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const ticketRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useScrollInertia(scrollContainerRef);

  useEffect(() => {
    let cancelled = false;

    const runPreload = async () => {
      const total = PRELOAD_ASSETS.length;
      if (!total) {
        setPreloadProgress(100);
        setIsPreloading(false);
        return;
      }

      let cursor = 0;
      let completed = 0;
      const concurrency = Math.min(8, total);

      const updateProgress = () => {
        if (cancelled) return;
        setPreloadProgress(Math.min(100, Math.round((completed / total) * 100)));
      };

      const worker = async () => {
        while (!cancelled) {
          const idx = cursor;
          cursor += 1;
          if (idx >= total) return;
          await preloadAsset(PRELOAD_ASSETS[idx]);
          completed += 1;
          updateProgress();
        }
      };

      await Promise.all(Array.from({ length: concurrency }, () => worker()));
      if (cancelled) return;
      setPreloadProgress(100);
      setTimeout(() => {
        if (!cancelled) setIsPreloading(false);
      }, 250);
    };

    runPreload();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenGift = useCallback(() => {
    setShowTicket(true);
    setTimeout(() => {
      ticketRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  if (isPreloading) {
    return <LoadingSplash progress={preloadProgress} />;
  }

  return (
    <div className="flex justify-center h-screen overflow-hidden bg-neutral-200">
      <div
        ref={scrollContainerRef}
        id="main-scroll-container"
        className="relative w-full max-w-[420px] bg-cream h-screen overflow-y-auto overscroll-y-contain overflow-x-hidden flex flex-col shadow-2xl no-scrollbar"
      >
        <Header />
        <Hero />
        <IntroGrid />
        <MoodBoard />
        <Memories />
        <Vows />
        <Surprise onOpen={handleOpenGift} />
        {showTicket && <Ticket ref={ticketRef} />}
        <ScrollFramesSection />
        <LoveNote />
        <Footer />
      </div>
    </div>
  );
}