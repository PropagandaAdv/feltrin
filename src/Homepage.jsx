import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  EyeOff,
  Factory,
  FileCheck2,
  FlaskConical,
  FoldVertical,
  Flame,
  Hammer,
  Layers,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  PencilRuler,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   CONFIG — solo dati verificati sul sito feltrin.it (vedi DATI_MANCANTI.md)
   ──────────────────────────────────────────────────────────────────────────── */
const CONFIG = {
  company: 'Feltrin Arredamenti',
  email: 'info@feltrin.it',
  phone: '0423 950142',
  phoneHref: 'tel:+390423950142',
  mobile: '335 5467238',
  mobileHref: 'tel:+393355467238',
  street: 'Via Asolana 168',
  city: '31010 Onè di Fonte (TV)',
  vat: '02324470265',
  hours: 'Lun–Ven · 8:00–12:00 e 13:00–17:00',
  // Da compilare quando disponibili: se vuoti, il link/endpoint non viene mostrato/usato.
  linkedinUrl: '',
  formEndpoint: '', // es. endpoint Formspree. Vuoto = si apre il client di posta (mailto).
  frames: { count: 300, path: '/assets/frames/f', digits: 4, ext: 'webp' },
};

const frameUrl = (i) =>
  `${CONFIG.frames.path}${String(i + 1).padStart(CONFIG.frames.digits, '0')}.${CONFIG.frames.ext}`;

/* Mappa progresso di scroll → posizione nella sequenza (0..1). Taratura per equalizzare il movimento. */
const TIME_MAP = [
  [0, 0],
  [0.13, 0.012], // cucina intera, ferma sotto l'H1
  [0.26, 0.3], // apertura in vista esplosa
  [0.46, 0.355], // esploso, lenta deriva
  [0.54, 0.547], // la camera entra nel dettaglio
  [0.72, 0.6], // macro su piega e saldatura, lenta deriva
  [0.82, 0.81], // pull-back: emerge il componente
  [1, 1], // il componente ruota lentamente
];

const FOCAL_X = 1; // il soggetto vive a destra: il crop resta sempre ancorato al lato destro
const ZOOM = 1.1; // leggero zoom: ritaglia solo il buio a sinistra e lascia più aria al testo

/* Ritmo dei capitoli in progresso di scroll (hero = 700vh) */
const BANDS = [
  { a: 0, b: 0.15 },
  { a: 0.28, b: 0.46 },
  { a: 0.54, b: 0.72 },
  { a: 0.82, b: 1 },
];

const CHAPTERS = [
  {
    eyebrow: 'Lavorazione del metallo · dal 1991',
    title: 'Dal disegno al componente, in *metallo*.',
    text: "Feltrin lavora il metallo per chi produce mobili e cucine: taglio laser, piegatura, saldatura e pulitura. Il vostro progetto resta vostro.",
    label: 'Il progetto',
    img: '/assets/img/hero-a.webp',
  },
  {
    eyebrow: '01 · Progettazione',
    title: 'Ogni parte, pensata *prima* di nascere.',
    text: 'Partiamo dal vostro disegno e lo scomponiamo in ante, piani e strutture. Test di fattibilità e prove iniziali per arrivare in produzione senza sorprese.',
    label: 'Progettazione',
    img: '/assets/img/hero-b.webp',
  },
  {
    eyebrow: '02 · Lavorazione',
    title: 'La qualità si vede nel *dettaglio*.',
    text: 'Pieghe nette, saldature pulite, finitura uniforme. Robot specializzati per saldatura e pulitura ripetono lo stesso risultato su ogni pezzo.',
    label: 'Lavorazione',
    img: '/assets/img/hero-c.webp',
  },
  {
    eyebrow: '03 · Il vostro componente',
    title: 'Il vostro progetto resta *vostro*.',
    text: 'Realizziamo il pezzo che fa la differenza nel vostro prodotto, nel massimo riserbo. Nessun nome, nessun logo: solo lavoro fatto bene.',
    label: 'Il componente',
    img: '/assets/img/hero-d.webp',
  },
];

const SERVICES = [
  {
    icon: Zap,
    title: 'Taglio laser tubo',
    img: '/assets/img/laser-tubo.webp',
    alt: 'Taglio laser su tubo in acciaio con scintille blu',
    text: 'Taglio laser su tubo, con tagli netti e ripetibili.',
    benefit: 'Il tubo arriva a valle già pronto per saldatura e assemblaggio.',
  },
  {
    icon: Layers,
    title: 'Taglio laser lamiera',
    img: '/assets/img/laser-lamiera.webp',
    alt: 'Lamiera in acciaio satinato con fori e asole tagliate al laser',
    text: 'Sagome e geometrie complesse su lamiera, con bordi puliti.',
    benefit: 'Libertà di disegno, senza una attrezzatura nuova per ogni forma.',
  },
  {
    icon: FoldVertical,
    title: 'Piegatura automatizzata',
    img: '/assets/img/piegatura.webp',
    alt: 'Pressa piegatrice che piega una lamiera in acciaio',
    text: 'Piegatura automatizzata per angoli e profili costanti.',
    benefit: 'Lo stesso risultato sul primo e sull’ultimo pezzo della serie.',
  },
  {
    icon: Flame,
    title: 'Saldatura robotizzata',
    img: '/assets/img/saldatura.webp',
    alt: 'Braccio robotico che salda una giunzione in acciaio',
    text: 'Robot specializzati per cordoni uniformi su tutta la produzione.',
    benefit: 'Qualità costante e tempi di consegna più rapidi.',
  },
  {
    icon: Sparkles,
    title: 'Pulitura robotizzata',
    img: '/assets/img/pulitura.webp',
    alt: 'Robot che satina un pannello in acciaio con un disco abrasivo',
    text: 'La pulitura è affidata a robot specializzati, passaggio dopo passaggio.',
    benefit: 'Finitura omogenea, da un lotto all’altro.',
  },
  {
    icon: Hammer,
    title: 'Pressatura, maschere e stampi',
    img: '/assets/img/stampi.webp',
    alt: 'Stampo di pressatura e maschera di saldatura con un componente piegato',
    text: 'Pressatura e realizzazione di maschere e stampi specializzati.',
    benefit: 'Efficienza e precisione quando si passa alla produzione in larga scala.',
  },
];

const STEPS = [
  {
    icon: PencilRuler,
    title: 'Progettazione',
    text: 'Entriamo nel progetto fin dalle prime fasi, accanto a chi lo ha disegnato.',
  },
  {
    icon: FlaskConical,
    title: 'Ingegnerizzazione',
    text: 'Test di fattibilità e prove iniziali per validare il pezzo prima di produrlo.',
  },
  {
    icon: ClipboardCheck,
    title: 'Collaudo e attrezzature',
    text: 'Superato il collaudo, realizziamo maschere e stampi specializzati.',
  },
  {
    icon: Factory,
    title: 'Produzione in serie',
    text: 'Eseguiamo gli ordini con lavorazioni precise e uniformi, ottimizzando i tempi di consegna.',
  },
];

const NAV = [
  { href: '#lavorazioni', label: 'Lavorazioni' },
  { href: '#per-chi-produce', label: 'Per chi produce' },
  { href: '#contatti', label: 'Contatti' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Utilità
   ──────────────────────────────────────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const mapProgress = (p) => {
  for (let i = 1; i < TIME_MAP.length; i += 1) {
    const [p1, f1] = TIME_MAP[i];
    if (p <= p1) {
      const [p0, f0] = TIME_MAP[i - 1];
      return f0 + ((p - p0) / (p1 - p0 || 1)) * (f1 - f0);
    }
  }
  return 1;
};

/* I 5 gate della skill (identici a CSS e JS) + connessione lenta */
const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
];
const isSlowDevice = () => {
  const c = navigator.connection;
  if (c && (c.saveData || ['slow-2g', '2g', '3g'].includes(c.effectiveType))) return true;
  return typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2;
};
const decideMode = () => {
  if (typeof window === 'undefined') return 'static';
  return GATES.some((q) => window.matchMedia(q).matches) || isSlowDevice() ? 'static' : 'scrub';
};
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useHeroMode() {
  const [mode, setMode] = useState(decideMode);
  useEffect(() => {
    const apply = () => setMode(decideMode());
    const mqls = GATES.map((q) => window.matchMedia(q)); // referenziati per non perdere i listener
    mqls.forEach((m) => m.addEventListener('change', apply));
    const conn = navigator.connection;
    if (conn && conn.addEventListener) conn.addEventListener('change', apply);
    return () => {
      mqls.forEach((m) => m.removeEventListener('change', apply));
      if (conn && conn.removeEventListener) conn.removeEventListener('change', apply);
    };
  }, []);
  return mode;
}

/* Reveal: un solo handler di scroll (niente IntersectionObserver da cui dipendere) */
const revealRegistry = new Set();
let revealBound = false;
let revealQueued = false;
const checkReveals = () => {
  revealQueued = false;
  const vh = window.innerHeight;
  revealRegistry.forEach((item) => {
    const r = item.el.getBoundingClientRect();
    if (r.top < vh * 0.9 && r.bottom > 0) {
      item.show();
      revealRegistry.delete(item);
    }
  });
};
const queueReveal = () => {
  if (revealQueued) return;
  revealQueued = true;
  requestAnimationFrame(checkReveals);
};
const bindReveal = () => {
  if (revealBound) return;
  revealBound = true;
  window.addEventListener('scroll', queueReveal, { passive: true });
  window.addEventListener('resize', queueReveal);
};

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(true);
      return undefined;
    }
    const item = { el: ref.current, show: () => setShown(true) };
    revealRegistry.add(item);
    bindReveal();
    queueReveal();
    return () => revealRegistry.delete(item);
  }, []);
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-700 ease-steel motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Atomi
   ──────────────────────────────────────────────────────────────────────────── */
const FOCUS_DARK = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';
const FOCUS_LIGHT = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

function Eyebrow({ children, tone = 'dark' }) {
  return (
    <p
      className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest sm:text-[0.8rem] ${
        tone === 'dark' ? 'text-accentSoft' : 'text-accent'
      }`}
    >
      <span aria-hidden="true" className={`h-px w-8 ${tone === 'dark' ? 'bg-accentSoft/60' : 'bg-accent/60'}`} />
      {children}
    </p>
  );
}

/* Gradiente di testo solo sulla parola tra asterischi (*parola*) */
function GradientText({ text, tone = 'dark' }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith('*') ? (
      <span
        key={i}
        className={`bg-gradient-to-r bg-clip-text text-transparent ${
          tone === 'dark'
            ? 'from-white to-[#3D7BFF] [text-shadow:none] [filter:drop-shadow(0_2px_8px_rgba(5,5,10,0.8))]'
            : 'from-ink to-accent'
        }`}
      >
        {p.replace(/\*/g, '')}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/* Parole che salgono in sequenza, guidate dalla variabile --k della banda (0..1) */
function RisingWords({ text }) {
  const tokens = text.split(/(\s+)/).filter((t) => t.trim().length > 0);
  const total = tokens.length;
  return tokens.map((raw, i) => {
    const grad = raw.includes('*');
    const word = raw.replace(/\*/g, '');
    return (
      <span key={i}>
        <span
          className={`inline-block will-change-transform ${
            grad
              ? 'bg-gradient-to-r from-white to-[#3D7BFF] bg-clip-text text-transparent [text-shadow:none] [filter:drop-shadow(0_2px_8px_rgba(5,5,10,0.8))]'
              : ''
          }`}
          style={{
            '--th': (i / total) * 0.55,
            opacity: 'clamp(0, calc((var(--k, 1) - var(--th, 0)) * 3), 1)',
            transform:
              'translateY(calc((1 - clamp(0, calc((var(--k, 1) - var(--th, 0)) * 3), 1)) * 26px))',
          }}
        >
          {word}
        </span>
        {i < total - 1 ? ' ' : ''}
      </span>
    );
  });
}

const BTN_BASE =
  'inline-flex min-h-[48px] items-center justify-center gap-3 rounded-none px-7 py-4 text-sm font-semibold uppercase tracking-widest transition duration-300 ease-steel motion-reduce:transition-none';

function PrimaryCta({ href = '#contatti', children, className = '', ...rest }) {
  return (
    <a
      href={href}
      className={`${BTN_BASE} bg-accent text-white shadow-[0_0_32px_-6px_rgba(0,82,255,0.65)] hover:bg-[#1A66FF] hover:shadow-[0_0_44px_-4px_rgba(0,82,255,0.8)] ${FOCUS_DARK} ${className}`}
      {...rest}
    >
      {children}
      <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

function SecondaryCta({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`${BTN_BASE} border border-white/25 bg-white/0 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/5 ${FOCUS_DARK} ${className}`}
    >
      {children}
    </a>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-500 motion-reduce:transition-none ${
        scrolled || open ? 'border-white/10 bg-ink/80' : 'border-transparent bg-ink/20'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-500 ease-steel motion-reduce:transition-none sm:px-8 lg:px-12 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <a href="#top" aria-label="Feltrin, torna all’inizio" className={FOCUS_DARK}>
          <img src="/assets/logo-feltrin.png" alt="Feltrin" width="107" height="32" className="h-7 w-auto sm:h-8" />
        </a>

        <nav aria-label="Principale" className="hidden items-center gap-10 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`text-sm font-semibold uppercase tracking-widest text-white/75 transition-colors hover:text-white ${FOCUS_DARK}`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contatti"
            className={`hidden min-h-[44px] items-center bg-accent px-5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_0_28px_-6px_rgba(0,82,255,0.7)] transition hover:bg-[#1A66FF] sm:inline-flex ${FOCUS_DARK}`}
          >
            Richiedi un incontro
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            className={`inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white lg:hidden ${FOCUS_DARK}`}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="border-t border-white/10 bg-ink/95 lg:hidden">
        <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`border-b border-white/10 py-4 text-base font-semibold uppercase tracking-widest text-white ${FOCUS_DARK}`}
            >
              {n.label}
            </a>
          ))}
          <PrimaryCta className="mt-5 w-full" onClick={() => setOpen(false)}>
            Richiedi un incontro
          </PrimaryCta>
        </nav>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Hero cinematico: canvas + sequenza di frame (scrub), con fallback statico
   ──────────────────────────────────────────────────────────────────────────── */
function ChapterCopy({ chapter, first = false, scrub = true }) {
  return (
    <div className="max-w-xl [text-shadow:0_1px_2px_rgba(5,5,10,0.95),0_3px_12px_rgba(5,5,10,0.78),0_10px_44px_rgba(5,5,10,0.8)]">
      <Eyebrow>{chapter.eyebrow}</Eyebrow>
      {first ? (
        <h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
          {scrub ? <RisingWords text={chapter.title} /> : <GradientText text={chapter.title} />}
        </h1>
      ) : (
        <h2 className="text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {scrub ? <RisingWords text={chapter.title} /> : <GradientText text={chapter.title} />}
        </h2>
      )}
      <p className="mt-6 max-w-[34ch] text-lg font-normal leading-relaxed text-white sm:max-w-[40ch] sm:text-xl">
        {chapter.text}
      </p>
    </div>
  );
}

function CinematicHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bandRefs = useRef([]);
  const [loaded, setLoaded] = useState(0);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    const N = CONFIG.frames.count;
    const imgs = new Array(N).fill(null);
    const poster = new Image();
    poster.src = '/assets/img/hero-a.webp';

    let cancelled = false;
    let cw = 0;
    let ch = 0;
    let target = 0;
    let shown = -1;
    let raf = null;
    let last = 0;
    let onScreen = true; // di default acceso: l'IntersectionObserver può solo spegnere
    let doneCount = 0;
    let lastPct = -1;
    let activeChapter = -1;
    const bandState = BANDS.map(() => ({ op: -1, k: -1 }));

    const heroProgress = () => {
      const r = section.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      return range <= 0 ? 0 : clamp(-r.top / range, 0, 1);
    };

    let shiftX = 0;
    const cover = (im, alpha) => {
      const iw = im.naturalWidth || 1;
      const ih = im.naturalHeight || 1;
      const s = Math.max(cw / iw, ch / ih) * ZOOM;
      const dw = iw * s;
      const dh = ih * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(im, (cw - dw) * FOCAL_X + shiftX, (ch - dh) * 0.5, dw, dh);
    };

    const nearest = (i, dir) => {
      for (let j = i; j >= 0 && j < N; j += dir) if (imgs[j]) return j;
      return -1;
    };

    const draw = (p) => {
      if (!cw || !ch) return;
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1E222A';
      ctx.fillRect(0, 0, cw, ch);
      shiftX = smoothstep(p, 0.82, 0.9) * 0.09 * cw; // nel capitolo finale il componente scivola a destra, lontano dal testo
      const f = mapProgress(p) * (N - 1);
      const i0 = Math.floor(f);
      const a = nearest(i0, -1);
      const b = nearest(Math.min(N - 1, i0 + 1), 1);
      if (a < 0 && b < 0) {
        if (poster.complete && poster.naturalWidth) cover(poster, 1);
        return;
      }
      const base = a >= 0 ? a : b;
      cover(imgs[base], 1);
      if (a >= 0 && b >= 0 && b !== base) {
        const t = clamp((f - base) / (b - base), 0, 1);
        if (t > 0.01) cover(imgs[b], t);
      }
      ctx.globalAlpha = 1;
    };

    const updateBands = (p) => {
      let best = 0;
      let bestOp = -1;
      BANDS.forEach((band, n) => {
        const el = bandRefs.current[n];
        if (!el) return;
        const { a, b } = band;
        const f = Math.min(0.02, (b - a) / 3);
        const inn = n === 0 ? 1 : smoothstep(p, a, a + f);
        const out = n === BANDS.length - 1 ? 1 : 1 - smoothstep(p, b - f, b);
        const op = inn * out;
        const k = n === 0 ? 1 : clamp((p - a) / Math.min(0.025, (b - a) * 0.35), 0, 1);
        const st = bandState[n];
        if (Math.abs(op - st.op) > 0.004 || Math.abs(k - st.k) > 0.008) {
          st.op = op;
          st.k = k;
          el.style.opacity = op.toFixed(3);
          el.style.setProperty('--k', k.toFixed(3));
          el.style.visibility = op < 0.01 ? 'hidden' : 'visible';
        }
        if (op > bestOp) {
          bestOp = op;
          best = n;
        }
      });
      if (best !== activeChapter) {
        activeChapter = best;
        setChapter(best);
      }
    };

    const tick = (now) => {
      const dt = Math.min(100, now - (last || now));
      last = now;
      const k = 0.14;
      shown = shown < 0 ? target : shown + (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (Math.abs(target - shown) < 0.0003) {
        shown = target;
        raf = null;
        last = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      draw(shown);
      updateBands(shown);
    };
    const kick = () => {
      if (raf === null && onScreen && !cancelled) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = heroProgress();
      kick();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.round(canvas.clientWidth * dpr);
      ch = Math.round(canvas.clientHeight * dpr);
      canvas.width = cw;
      canvas.height = ch;
      shown = -1;
      target = heroProgress();
      kick();
    };

    /* Preload progressivo: prima un fotogramma ogni 16, poi 4, 2, 1 */
    const order = [];
    const seen = new Set();
    [16, 4, 2, 1].forEach((s) => {
      for (let i = 0; i < N; i += s) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
      if (s === 16 && !seen.has(N - 1)) {
        seen.add(N - 1);
        order.push(N - 1);
      }
    });
    let cursor = 0;
    let active = 0;
    const markDone = () => {
      doneCount += 1;
      const pct = Math.floor((doneCount / N) * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        setLoaded(pct);
      }
    };
    const pump = () => {
      while (active < 6 && cursor < order.length && !cancelled) {
        const i = order[cursor];
        cursor += 1;
        active += 1;
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => {
          imgs[i] = im;
          active -= 1;
          markDone();
          if (doneCount < 40 || i % 4 === 0) kick();
          pump();
        };
        im.onerror = () => {
          active -= 1;
          markDone();
          pump();
        };
        im.src = frameUrl(i);
      }
    };

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) {
            target = heroProgress();
            kick();
          }
        },
        { rootMargin: '10% 0px' },
      );
      io.observe(section);
    }

    resize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    poster.onload = kick;
    pump();
    kick();

    return () => {
      cancelled = true;
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative h-[700vh] bg-ink" aria-label="Presentazione di Feltrin">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

        {/* scrim globale + scrim lato testo (legibilità sul fotogramma peggiore) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_60%_45%,rgba(30,34,42,0)_40%,rgba(30,34,42,0.7)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(30,34,42,0.95)_0%,rgba(30,34,42,0.88)_30%,rgba(30,34,42,0.6)_50%,rgba(30,34,42,0)_74%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
        />

        {CHAPTERS.map((c, n) => (
          <div
            key={c.label}
            ref={(el) => {
              bandRefs.current[n] = el;
            }}
            className="absolute inset-0 flex items-center"
            style={{ opacity: n === 0 ? 1 : 0, visibility: n === 0 ? 'visible' : 'hidden' }}
          >
            <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:px-12">
              <div className={n === 0 ? 'motion-safe:animate-rise' : ''}>
                <ChapterCopy chapter={c} first={n === 0} />
                {n === 0 && (
                  <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                    <PrimaryCta>Richiedi un incontro</PrimaryCta>
                    <SecondaryCta href="#lavorazioni">Scopri le lavorazioni</SecondaryCta>
                  </div>
                )}
                {n === CHAPTERS.length - 1 && (
                  <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                    <PrimaryCta>Richiedi un incontro</PrimaryCta>
                    <SecondaryCta href="#lavorazioni">Scopri le lavorazioni</SecondaryCta>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* indicatore dei capitoli */}
        <ol
          aria-hidden="true"
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex xl:right-10"
        >
          {CHAPTERS.map((c, n) => (
            <li key={c.label} className="flex items-center gap-3">
              <span
                className={`text-[0.7rem] font-semibold uppercase tracking-widest transition-opacity duration-500 ${
                  chapter === n ? 'text-white opacity-100' : 'opacity-0'
                }`}
              >
                {c.label}
              </span>
              <span
                className={`block h-px transition-[width,background-color] duration-500 ease-steel ${
                  chapter === n ? 'w-10 bg-white' : 'w-5 bg-white/35'
                }`}
              />
            </li>
          ))}
        </ol>

        {/* richiamo allo scroll */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-white/70 transition-opacity duration-500 ${
            chapter === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Scorri
          <ChevronDown size={20} strokeWidth={1.5} className="motion-safe:animate-pulseLine" />
        </div>

        {/* avanzamento del preload */}
        {loaded < 100 && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10">
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${loaded}%` }} />
          </div>
        )}
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <section id="top" className="relative bg-ink" aria-label="Presentazione di Feltrin">
      <div className="relative flex min-h-[100svh] items-end overflow-hidden sm:items-center">
        <img
          src="/assets/img/hero-a.webp"
          alt="Cucina in acciaio satinato in uno studio scuro, con luce blu sui bordi"
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[78%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(30,34,42,0.97)_0%,rgba(30,34,42,0.82)_46%,rgba(30,34,42,0.15)_100%)] sm:bg-[linear-gradient(90deg,rgba(30,34,42,0.94)_0%,rgba(30,34,42,0.7)_40%,rgba(30,34,42,0)_75%)]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:py-28 lg:px-12">
          <ChapterCopy chapter={CHAPTERS[0]} first scrub={false} />
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <PrimaryCta>Richiedi un incontro</PrimaryCta>
            <SecondaryCta href="#lavorazioni">Scopri le lavorazioni</SecondaryCta>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-3">
        {CHAPTERS.slice(1).map((c) => (
          <article key={c.label} className="bg-ink">
            <img src={c.img} alt="" loading="lazy" width="800" height="450" className="aspect-video w-full object-cover" />
            <div className="p-6 sm:p-8">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                <GradientText text={c.title} />
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-white/80">{c.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Lavorazioni
   ──────────────────────────────────────────────────────────────────────────── */
function Services() {
  return (
    <section id="lavorazioni" className="scroll-mt-16 bg-paper py-24 text-ink lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">Lavorazioni</Eyebrow>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <GradientText tone="light" text="Dal tubo e dalla lamiera al pezzo *finito*." />
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg font-light leading-relaxed text-ink/80 sm:text-xl">
            Un parco macchine completo e all’avanguardia, con robot specializzati per saldatura e pulitura. Sei
            lavorazioni per portare il vostro disegno fino al pezzo pronto.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.title} delay={(i % 3) * 90} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-ink text-white">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.alt}
                      loading="lazy"
                      width="1200"
                      height="800"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-steel group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,34,42,0)_45%,rgba(30,34,42,0.95)_100%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_32%)]"
                    />
                    <span className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center border border-white/20 bg-ink/60 backdrop-blur-md">
                      <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-base font-light leading-relaxed text-white/80">{s.text}</p>
                    <p className="mt-5 flex gap-3 border-t border-white/10 pt-5 text-[0.95rem] leading-relaxed text-white">
                      <Check size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-accentSoft" />
                      <span>
                        <span className="sr-only">Per voi: </span>
                        {s.benefit}
                      </span>
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Per chi produce: processo, numeri, riservatezza
   ──────────────────────────────────────────────────────────────────────────── */
function Trust() {
  const privacyPoints = [
    {
      icon: EyeOff,
      title: 'Nessun cliente citato',
      text: 'Non mostriamo nomi, loghi o progetti riconoscibili. Su questo sito non troverete referenze, ed è una scelta.',
    },
    {
      icon: FileCheck2,
      title: 'Collaborazioni sotto NDA',
      text: 'Lavoriamo in regime di riservatezza: disegni e idee restano dentro il vostro progetto.',
    },
    {
      icon: ShieldCheck,
      title: 'Attrezzature su misura',
      text: 'Maschere e stampi nascono per il vostro pezzo, non per un catalogo.',
    },
  ];

  return (
    <section
      id="per-chi-produce"
      className="relative scroll-mt-16 overflow-hidden bg-ink py-24 text-white lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 top-0 h-[60rem] w-[60rem] bg-[radial-gradient(closest-side,rgba(255,255,255,0.05),rgba(255,255,255,0))] motion-safe:animate-drift"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl">
          <Eyebrow>Per chi produce</Eyebrow>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <GradientText text="Pensato per chi *produce* mobili e cucine." />
          </h2>
          <p className="mt-6 max-w-[54ch] text-lg font-light leading-relaxed text-white/85 sm:text-xl">
            Se la vostra azienda cerca un partner per la lavorazione del metallo, vi affianchiamo fin dalle prime fasi
            del progetto e arriviamo fino all’ordine in serie.
          </p>
        </Reveal>

        {/* processo in 4 step */}
        <ol className="mt-16 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.title} delay={i * 90} className="bg-ink">
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <Icon size={28} strokeWidth={1.5} aria-hidden="true" className="text-white" />
                    <span className="text-sm font-semibold tracking-widest text-white/60" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-10 text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-base font-light leading-relaxed text-white/80">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        {/* numeri verificati */}
        <dl className="mt-px grid border border-t-0 border-white/10 sm:grid-cols-3">
          {[
            { n: '1991', l: 'Anno di fondazione: lavoriamo il metallo da allora' },
            { n: '6', l: 'Lavorazioni per portare il vostro disegno al pezzo pronto' },
            { n: '8–17', l: 'Lunedì–venerdì: ci trovate in azienda, con pausa 12–13' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="border-white/10 p-7 sm:border-l sm:p-8 first:sm:border-l-0">
              <dt className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
                {s.n}
              </dt>
              <dd className="mt-3 max-w-[30ch] text-base font-light leading-relaxed text-white/80">{s.l}</dd>
            </Reveal>
          ))}
        </dl>

        {/* riservatezza */}
        <Reveal className="mt-20">
          <div className="relative border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_38%)]"
            />
            <div className="relative grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <span className="flex h-12 w-12 items-center justify-center border border-white/20">
                  <Lock size={28} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-accentSoft">Riservatezza</p>
                <h3 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  <GradientText text="Il vostro progetto resta *vostro*." />
                </h3>
                <p className="mt-6 max-w-[40ch] text-lg font-light leading-relaxed text-white/85">
                  La fiducia si costruisce anche con ciò che non si mostra. Per noi la riservatezza fa parte del
                  servizio.
                </p>
              </div>
              <ul className="grid gap-8 sm:grid-cols-3 lg:gap-6">
                {privacyPoints.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.title} className="border-t border-white/15 pt-6">
                      <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                      <h4 className="mt-5 text-xl font-bold tracking-tight">{p.title}</h4>
                      <p className="mt-3 text-base font-light leading-relaxed text-white/80">{p.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16 max-w-3xl">
          <blockquote className="border-l border-accentSoft/70 pl-6 sm:pl-8">
            <p className="text-2xl font-light leading-snug tracking-tight text-white sm:text-3xl">
              La nostra migliore garanzia è la prova del tempo per un prodotto di alta qualità.
            </p>
            <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/70">
              {CONFIG.company}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Contatto
   ──────────────────────────────────────────────────────────────────────────── */
const EMPTY = { nome: '', azienda: '', ruolo: '', email: '', telefono: '', messaggio: '', consenso: false, website: '' };

const validate = (v) => {
  const e = {};
  if (v.nome.trim().length < 2) e.nome = 'Indicateci il vostro nome.';
  if (v.azienda.trim().length < 2) e.azienda = 'Indicateci il nome dell’azienda.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Inserite un indirizzo email valido.';
  if (v.telefono.trim() && !/^[+\d][\d\s().-]{5,}$/.test(v.telefono.trim()))
    e.telefono = 'Controllate il numero di telefono.';
  if (v.messaggio.trim().length < 10) e.messaggio = 'Raccontateci in poche righe il progetto (almeno 10 caratteri).';
  if (!v.consenso) e.consenso = 'Per inviare la richiesta serve il consenso al trattamento dei dati.';
  return e;
};

const mailtoFor = (v) => {
  const body = [
    `Nome: ${v.nome}`,
    `Azienda: ${v.azienda}`,
    v.ruolo && `Ruolo: ${v.ruolo}`,
    `Email: ${v.email}`,
    v.telefono && `Telefono: ${v.telefono}`,
    '',
    v.messaggio,
  ]
    .filter((r) => r !== '' && r !== false)
    .join('\n');
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent('Richiesta di incontro dal sito')}&body=${encodeURIComponent(body)}`;
};

const FIELD =
  'block w-full rounded-none border border-ink/25 bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/45 transition-colors focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-[#B3261E]';

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase tracking-widest text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-accent">
            {' '}
            *
          </span>
        ) : (
          <span className="ml-2 font-light normal-case tracking-normal text-ink/60">(facoltativo)</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-sm text-ink/70">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#B3261E]">
          <AlertCircle size={20} strokeWidth={1.5} aria-hidden="true" className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm({ onSubmit, onOpenPrivacy }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [viaMail, setViaMail] = useState(false);

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
  };
  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  };
  const props = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: set(name),
    onBlur: blur(name),
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-err` : undefined,
    className: FIELD,
  });

  const submit = async (ev) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ nome: 1, azienda: 1, email: 1, telefono: 1, messaggio: 1, consenso: 1 });
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    if (values.website) return; // honeypot
    setStatus('sending');
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else if (CONFIG.formEndpoint) {
        const res = await fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, consenso: 'sì' }),
        });
        if (!res.ok) throw new Error('bad status');
      } else {
        window.location.href = mailtoFor(values);
        setViaMail(true);
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="flex h-full flex-col justify-center border border-ink/10 bg-white p-8 sm:p-12">
        <span className="flex h-14 w-14 items-center justify-center bg-ink text-white">
          <Check size={28} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-8 text-3xl font-bold tracking-tight text-ink">Richiesta pronta.</h3>
        <p className="mt-4 max-w-[44ch] text-lg font-light leading-relaxed text-ink/80">
          {viaMail
            ? 'Abbiamo aperto la vostra app di posta con il messaggio già scritto: premete Invia per completare la richiesta. Vi ricontatteremo per fissare un incontro.'
            : 'Grazie, abbiamo ricevuto la vostra richiesta. Vi ricontatteremo per fissare un incontro.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setTouched({});
            setErrors({});
            setViaMail(false);
            setStatus('idle');
          }}
          className={`mt-8 self-start text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4 ${FOCUS_LIGHT}`}
        >
          Invia un’altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-busy={status === 'sending'}
      className="border border-ink/10 bg-white p-6 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="nome" label="Nome" required error={errors.nome}>
          <input {...props('nome')} type="text" autoComplete="name" placeholder="Nome e cognome" />
        </Field>
        <Field id="azienda" label="Azienda" required error={errors.azienda}>
          <input {...props('azienda')} type="text" autoComplete="organization" placeholder="Ragione sociale" />
        </Field>
        <Field id="ruolo" label="Ruolo" error={errors.ruolo}>
          <input {...props('ruolo')} type="text" autoComplete="organization-title" placeholder="Es. Responsabile acquisti" />
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          <input {...props('email')} type="email" inputMode="email" autoComplete="email" placeholder="nome@azienda.it" />
        </Field>
        <div className="sm:col-span-2">
          <Field id="telefono" label="Telefono" error={errors.telefono} hint="Se preferite essere richiamati.">
            <input {...props('telefono')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+39 ..." />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            id="messaggio"
            label="Messaggio"
            required
            error={errors.messaggio}
            hint="Non servono disegni: bastano il tipo di prodotto e le quantità indicative."
          >
            <textarea {...props('messaggio')} rows={5} placeholder="Raccontateci il progetto." />
          </Field>
        </div>

        {/* honeypot anti-spam, invisibile e non raggiungibile */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Non compilare</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="consenso" className="flex cursor-pointer items-start gap-4">
            <input
              id="consenso"
              name="consenso"
              type="checkbox"
              checked={values.consenso}
              onChange={set('consenso')}
              onBlur={blur('consenso')}
              aria-invalid={errors.consenso ? 'true' : 'false'}
              aria-describedby={errors.consenso ? 'consenso-err' : undefined}
              className="mt-1 h-5 w-5 shrink-0 rounded-none border-ink/40 text-accent focus:ring-accent"
            />
            <span className="text-base leading-relaxed text-ink/85">
              Ho letto l’
              <button
                type="button"
                onClick={onOpenPrivacy}
                className={`font-semibold text-accent underline underline-offset-4 ${FOCUS_LIGHT}`}
              >
                informativa sulla privacy
              </button>{' '}
              e acconsento al trattamento dei miei dati per essere ricontattato.
              <span aria-hidden="true" className="text-accent">
                {' '}
                *
              </span>
            </span>
          </label>
          {errors.consenso && (
            <p id="consenso-err" className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#B3261E]">
              <AlertCircle size={20} strokeWidth={1.5} aria-hidden="true" className="mt-px shrink-0" />
              {errors.consenso}
            </p>
          )}
        </div>
      </div>

      {status === 'error' && (
        <div role="alert" className="mt-8 flex gap-3 border border-[#B3261E]/40 bg-[#B3261E]/5 p-4 text-base text-ink">
          <AlertCircle size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-[#B3261E]" />
          <p>
            Non siamo riusciti a inviare la richiesta. Riprovate tra un momento oppure scriveteci a{' '}
            <a href={`mailto:${CONFIG.email}`} className={`font-semibold text-accent underline underline-offset-4 ${FOCUS_LIGHT}`}>
              {CONFIG.email}
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`${BTN_BASE} mt-8 w-full bg-accent text-white shadow-[0_0_32px_-6px_rgba(0,82,255,0.6)] hover:bg-[#1A66FF] disabled:opacity-70 sm:w-auto ${FOCUS_LIGHT}`}
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={20} strokeWidth={1.5} aria-hidden="true" className="motion-safe:animate-spin" />
            Invio in corso
          </>
        ) : (
          <>
            Richiedi un incontro
            <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

function Contact({ onSubmit, onOpenPrivacy }) {
  const rows = [
    { icon: Phone, label: 'Telefono', value: CONFIG.phone, href: CONFIG.phoneHref },
    { icon: Phone, label: 'Cellulare', value: CONFIG.mobile, href: CONFIG.mobileHref },
    { icon: Mail, label: 'Email', value: CONFIG.email, href: `mailto:${CONFIG.email}` },
    { icon: MapPin, label: 'Sede', value: `${CONFIG.street}, ${CONFIG.city}` },
    { icon: Clock, label: 'Orari', value: CONFIG.hours },
  ];
  return (
    <section id="contatti" className="scroll-mt-16 bg-paper py-24 text-ink lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12">
        <Reveal>
          <Eyebrow tone="light">Contatti</Eyebrow>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <GradientText tone="light" text="Parliamo del vostro prossimo *progetto*." />
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg font-light leading-relaxed text-ink/80 sm:text-xl">
            Raccontateci cosa producete e cosa vi serve. Fissiamo un incontro, senza impegno, nel pieno riserbo.
          </p>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {rows.map((r) => {
              const Icon = r.icon;
              const inner = (
                <>
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-widest text-ink/70">{r.label}</span>
                    <span className="mt-1 block text-lg">{r.value}</span>
                  </span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} className={`flex gap-4 py-4 transition-colors hover:text-accent ${FOCUS_LIGHT}`}>
                      {inner}
                    </a>
                  ) : (
                    <div className="flex gap-4 py-4">{inner}</div>
                  )}
                </li>
              );
            })}
            {CONFIG.linkedinUrl && (
              <li>
                <a
                  href={CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex gap-4 py-4 transition-colors hover:text-accent ${FOCUS_LIGHT}`}
                >
                  <Linkedin size={20} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-widest text-ink/70">LinkedIn</span>
                    <span className="mt-1 block text-lg">Seguiteci su LinkedIn</span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm onSubmit={onSubmit} onOpenPrivacy={onOpenPrivacy} />
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Privacy + Footer
   ──────────────────────────────────────────────────────────────────────────── */
function PrivacyDialog({ open, onClose, returnRef }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const ret = returnRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      ret?.focus?.();
    };
  }, [open, onClose, returnRef]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-md sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-ink p-6 text-white sm:p-10"
      >
        <div className="flex items-start justify-between gap-6">
          <h2 id="privacy-title" className="text-3xl font-bold tracking-tight">
            Informativa sulla privacy
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Chiudi l’informativa"
            className={`flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 ${FOCUS_DARK}`}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-base font-light leading-relaxed text-white/85">
          <p>
            <strong className="font-semibold text-white">Titolare del trattamento:</strong> {CONFIG.company}, {CONFIG.street},{' '}
            {CONFIG.city}, P. IVA {CONFIG.vat}. Contatto: {CONFIG.email}.
          </p>
          <p>
            <strong className="font-semibold text-white">Dati trattati:</strong> quelli che inserite nel modulo di contatto
            (nome, azienda, ruolo, email, telefono, messaggio).
          </p>
          <p>
            <strong className="font-semibold text-white">Finalità e base giuridica:</strong> rispondere alla vostra richiesta
            e fissare un incontro, su vostra richiesta e con il vostro consenso.
          </p>
          <p>
            <strong className="font-semibold text-white">Conservazione:</strong> per il tempo necessario a gestire la
            richiesta e gli eventuali rapporti che ne derivano.
          </p>
          <p>
            <strong className="font-semibold text-white">I vostri diritti:</strong> accesso, rettifica, cancellazione,
            limitazione e opposizione, scrivendo a {CONFIG.email}. Potete rivolgervi anche al Garante per la protezione dei
            dati personali.
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer({ onOpenPrivacy, privacyRef }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img src="/assets/logo-feltrin.png" alt="Feltrin" width="150" height="45" className="h-10 w-auto" />
            <p className="mt-6 max-w-[34ch] text-base font-light leading-relaxed text-white/75">
              Il metallo in tutte le sue forme. Lavorazione conto terzi per l’arredo, dal 1991.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Contatti</h2>
            <ul className="mt-5 space-y-3 text-base font-light text-white/85">
              <li>
                <a href={CONFIG.phoneHref} className={`hover:text-white ${FOCUS_DARK}`}>
                  {CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={CONFIG.mobileHref} className={`hover:text-white ${FOCUS_DARK}`}>
                  {CONFIG.mobile}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONFIG.email}`} className={`hover:text-white ${FOCUS_DARK}`}>
                  {CONFIG.email}
                </a>
              </li>
              <li>{CONFIG.street}</li>
              <li>{CONFIG.city}</li>
              <li>{CONFIG.hours}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Il sito</h2>
            <ul className="mt-5 space-y-3 text-base font-light text-white/85">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={`hover:text-white ${FOCUS_DARK}`}>
                    {n.label}
                  </a>
                </li>
              ))}
              {CONFIG.linkedinUrl && (
                <li>
                  <a
                    href={CONFIG.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 hover:text-white ${FOCUS_DARK}`}
                  >
                    <Linkedin size={20} strokeWidth={1.5} aria-hidden="true" /> LinkedIn
                  </a>
                </li>
              )}
              <li>
                <button ref={privacyRef} type="button" onClick={onOpenPrivacy} className={`hover:text-white ${FOCUS_DARK}`}>
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/70 sm:flex-row sm:justify-between">
          <p>
            © {year} {CONFIG.company} · P. IVA {CONFIG.vat}
          </p>
          <p>{CONFIG.street}, {CONFIG.city}</p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Pagina
   ──────────────────────────────────────────────────────────────────────────── */
export default function Homepage({ onSubmit }) {
  const mode = useHeroMode();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const privacyRef = useRef(null);
  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-white focus:px-4 focus:py-3 focus:text-ink"
      >
        Vai al contenuto
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {mode === 'scrub' ? <CinematicHero /> : <StaticHero />}
        <Services />
        <Trust />
        <Contact onSubmit={onSubmit} onOpenPrivacy={() => setPrivacyOpen(true)} />
      </main>
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} privacyRef={privacyRef} />
      <PrivacyDialog open={privacyOpen} onClose={closePrivacy} returnRef={privacyRef} />
    </div>
  );
}
